import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import AucationsPage from './AucationsPage.vue'
import { useAucationsStore } from '../states/aucationsStore'

vi.mock('../states/aucationsStore', () => ({
  useAucationsStore: vi.fn()
}))

const defaultStubs = {
  AddModal: {
    template: '<div data-testid="mock-add-modal"><button @click="$emit(\'close\')" class="mock-close">Close</button><button @click="$emit(\'success\')" class="mock-success">Success</button></div>',
    emits: ['close', 'success']
  }
}

describe('AucationsPage.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.stubGlobal('confirm', vi.fn())
  })

  it('renders loading and empty state correctly', () => {
    vi.mocked(useAucationsStore).mockReturnValue({
      aucations: [],
      loading: true,
      errorMessage: 'Error message',
      successMessage: 'Success message',
      fetchAucations: vi.fn(),
      removeAucation: vi.fn()
    })

    const wrapper = mount(AucationsPage, {
      global: { stubs: defaultStubs }
    })
    expect(wrapper.text()).toContain('Memuat data lelang...')
    expect(wrapper.text()).toContain('Error message')
    expect(wrapper.text()).toContain('Success message')
  })

  it('renders auction list and handles delete confirmed and cancelled', async () => {
    const fetchAucationsMock = vi.fn()
    const removeAucationMock = vi.fn().mockResolvedValue(true)

    vi.mocked(useAucationsStore).mockReturnValue({
      aucations: [
        {
          id: 1,
          title: 'Laptop Gaming',
          description: 'Spesifikasi tinggi',
          start_bid: 10000000,
          closed_at: '2026-12-31',
          cover: 'http://example.com/laptop.jpg',
          author: { name: 'Admin' }
        },
        {
          id: 2,
          title: 'Mouse Wireless',
          description: 'Kondisi baik',
          start_bid: 50000,
          closed_at: '2026-12-31',
          cover: null,
          author: null
        }
      ],
      loading: false,
      errorMessage: '',
      successMessage: '',
      fetchAucations: fetchAucationsMock,
      removeAucation: removeAucationMock
    })

    const wrapper = mount(AucationsPage, {
      global: { stubs: defaultStubs }
    })

    expect(wrapper.text()).toContain('Laptop Gaming')
    expect(wrapper.text()).toContain('Mouse Wireless')
    expect(wrapper.text()).toContain('Anonim')

    // Filter change
    const selects = wrapper.findAll('select')
    await selects[0].setValue(1)
    expect(fetchAucationsMock).toHaveBeenCalledWith(expect.objectContaining({ is_me: 1 }))

    await selects[1].setValue(0)
    expect(fetchAucationsMock).toHaveBeenCalledWith(expect.objectContaining({ is_closed: 0 }))

    // Cancel delete
    vi.mocked(confirm).mockReturnValueOnce(false)
    const deleteButtons = wrapper.findAll('.btn-delete')
    await deleteButtons[0].trigger('click')
    expect(removeAucationMock).not.toHaveBeenCalled()

    // Confirm delete
    vi.mocked(confirm).mockReturnValueOnce(true)
    await deleteButtons[0].trigger('click')
    expect(removeAucationMock).toHaveBeenCalledWith(1)
  })

  it('handles opening, closing, and submitting AddModal', async () => {
    const fetchAucationsMock = vi.fn()

    vi.mocked(useAucationsStore).mockReturnValue({
      aucations: [],
      loading: false,
      errorMessage: '',
      successMessage: '',
      fetchAucations: fetchAucationsMock,
      removeAucation: vi.fn()
    })

    const wrapper = mount(AucationsPage, {
      global: { stubs: defaultStubs }
    })

    // Initially modal is closed
    expect(wrapper.find('[data-testid="mock-add-modal"]').exists()).toBe(false)

    // Open modal
    await wrapper.find('[data-testid="btn-add-aucation"]').trigger('click')
    expect(wrapper.find('[data-testid="mock-add-modal"]').exists()).toBe(true)

    // Close modal via close event
    await wrapper.find('.mock-close').trigger('click')
    expect(wrapper.find('[data-testid="mock-add-modal"]').exists()).toBe(false)

    // Open again and trigger success event
    await wrapper.find('[data-testid="btn-add-aucation"]').trigger('click')
    await wrapper.find('.mock-success').trigger('click')
    expect(fetchAucationsMock).toHaveBeenCalled()
  })

  it('renders empty state when auctions list is empty and not loading', () => {
    vi.mocked(useAucationsStore).mockReturnValue({
      aucations: [],
      loading: false,
      errorMessage: '',
      successMessage: '',
      fetchAucations: vi.fn(),
      removeAucation: vi.fn()
    })

    const wrapper = mount(AucationsPage, {
      global: { stubs: defaultStubs }
    })
    expect(wrapper.text()).toContain('Belum ada data lelang yang tersedia.')
  })
})

