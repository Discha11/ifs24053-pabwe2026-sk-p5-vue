import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import DetailAucationPage from './DetailAucationPage.vue'
import { useAucationsStore } from '../states/aucationsStore'

let mockRouteParams = { id: '1' }
vi.mock('vue-router', () => ({
  useRoute: () => ({ params: mockRouteParams })
}))

vi.mock('../states/aucationsStore', () => ({
  useAucationsStore: vi.fn()
}))

describe('DetailAucationPage.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.stubGlobal('alert', vi.fn())
  })

  it('renders loading state when loading and currentAucation is null', () => {
    vi.mocked(useAucationsStore).mockReturnValue({
      loading: true,
      currentAucation: null,
      fetchAucationDetail: vi.fn(),
      placeBid: vi.fn(),
      errorMessage: '',
      successMessage: ''
    })

    const wrapper = mount(DetailAucationPage)
    expect(wrapper.text()).toContain('Memuat detail lelang...')
  })

  it('renders auction detail and handles valid bid submission', async () => {
    const fetchAucationDetailMock = vi.fn()
    const placeBidMock = vi.fn().mockResolvedValue(true)

    vi.mocked(useAucationsStore).mockReturnValue({
      loading: false,
      currentAucation: {
        id: 1,
        title: 'Detail Barang',
        description: 'Deskripsi detail',
        start_bid: 15000,
        closed_at: '2026-12-31 23:59:59',
        cover: null,
        author: null,
        bids: [
          { id: 10, bid: 20000, created_at: '2026-10-09' }
        ]
      },
      errorMessage: 'Sample error',
      successMessage: 'Sample success',
      fetchAucationDetail: fetchAucationDetailMock,
      placeBid: placeBidMock
    })

    const wrapper = mount(DetailAucationPage)
    expect(wrapper.text()).toContain('Detail Barang')
    expect(wrapper.text()).toContain('Deskripsi detail')
    expect(wrapper.text()).toContain('Anonim')
    expect(wrapper.text()).toContain('Sample error')
    expect(wrapper.text()).toContain('Sample success')
    expect(wrapper.text()).toMatch(/Rp 20[.,]000/)

    // Submit valid bid
    const input = wrapper.find('input[type="number"]')
    await input.setValue(25000)
    const bidButton = wrapper.findAll('button').find(b => b.text() === 'Kirim Bid')
    await bidButton.trigger('click')

    expect(placeBidMock).toHaveBeenCalledWith('1', 25000)
  })

  it('handles invalid bid validation with alert', async () => {
    const placeBidMock = vi.fn()

    vi.mocked(useAucationsStore).mockReturnValue({
      loading: false,
      currentAucation: {
        id: 1,
        title: 'Barang',
        description: 'Desc',
        start_bid: 5000,
        closed_at: '2026-12-31',
        cover: 'http://example.com/cover.jpg',
        author: { name: 'Admin' },
        bids: []
      },
      errorMessage: '',
      successMessage: '',
      fetchAucationDetail: vi.fn(),
      placeBid: placeBidMock
    })

    const wrapper = mount(DetailAucationPage)
    expect(wrapper.text()).toContain('Belum ada tawaran yang diajukan untuk lelang ini.')

    const bidButton = wrapper.findAll('button').find(b => b.text() === 'Kirim Bid')
    await bidButton.trigger('click')

    expect(alert).toHaveBeenCalledWith('Masukkan nominal penawaran yang valid.')
    expect(placeBidMock).not.toHaveBeenCalled()
  })

  it('handles failed placeBid submission and bids without created_at', async () => {
    const placeBidMock = vi.fn().mockResolvedValue(false)
    const fetchAucationDetailMock = vi.fn()

    vi.mocked(useAucationsStore).mockReturnValue({
      loading: false,
      currentAucation: {
        id: 1,
        title: 'Barang',
        description: 'Desc',
        start_bid: 5000,
        closed_at: '2026-12-31',
        bids: [
          { id: 11, bid: null, created_at: null }
        ]
      },
      errorMessage: '',
      successMessage: '',
      fetchAucationDetail: fetchAucationDetailMock,
      placeBid: placeBidMock
    })

    const wrapper = mount(DetailAucationPage)
    const input = wrapper.find('input[type="number"]')
    await input.setValue(10000)

    const bidButton = wrapper.findAll('button').find(b => b.text() === 'Kirim Bid')
    await bidButton.trigger('click')

    expect(placeBidMock).toHaveBeenCalledWith('1', 10000)
    // When placeBid returns false, loadDetail is not called again
    expect(fetchAucationDetailMock).toHaveBeenCalledTimes(1) // only initial onMounted
  })

  it('does not fetch detail when auctionId is empty', () => {
    mockRouteParams = { id: '' }
    const fetchAucationDetailMock = vi.fn()
    vi.mocked(useAucationsStore).mockReturnValue({
      loading: false,
      currentAucation: null,
      fetchAucationDetail: fetchAucationDetailMock,
      placeBid: vi.fn(),
      errorMessage: '',
      successMessage: ''
    })
    mount(DetailAucationPage)
    expect(fetchAucationDetailMock).not.toHaveBeenCalled()
    mockRouteParams = { id: '1' }
  })
})
