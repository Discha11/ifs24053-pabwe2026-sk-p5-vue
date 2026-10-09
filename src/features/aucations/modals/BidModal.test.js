import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BidModal from './BidModal.vue'
import { aucationApi } from '../api/aucationApi'

vi.mock('../api/aucationApi', () => ({
  aucationApi: {
    addBid: vi.fn()
  }
}))

describe('BidModal.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders modal correctly', () => {
    const wrapper = mount(BidModal, {
      props: { auctionId: 1 }
    })
    expect(wrapper.text()).toContain('Ajukan Penawaran (Bid)')
  })

  it('validates empty or invalid bid amount on submit', async () => {
    const wrapper = mount(BidModal, {
      props: { auctionId: 1 }
    })

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    expect(wrapper.text()).toContain('Masukkan nominal penawaran yang valid.')

    await wrapper.find('input[type="number"]').setValue(-100)
    await form.trigger('submit.prevent')
    expect(wrapper.text()).toContain('Masukkan nominal penawaran yang valid.')
  })

  it('handles successful bid submission', async () => {
    vi.mocked(aucationApi.addBid).mockResolvedValueOnce({
      status: 'success',
      message: 'Berhasil'
    })

    const wrapper = mount(BidModal, {
      props: { auctionId: 1 }
    })

    await wrapper.find('input[type="number"]').setValue(150000)
    await wrapper.find('form').trigger('submit.prevent')

    expect(aucationApi.addBid).toHaveBeenCalledWith(1, 150000)
    expect(wrapper.text()).toContain('Berhasil')

    vi.advanceTimersByTime(1000)

    expect(wrapper.emitted('success')).toBeTruthy()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('handles success without custom message', async () => {
    vi.mocked(aucationApi.addBid).mockResolvedValueOnce({
      status: 'success'
    })

    const wrapper = mount(BidModal, {
      props: { auctionId: 1 }
    })

    await wrapper.find('input[type="number"]').setValue(200000)
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Berhasil memberikan tawaran.')
  })

  it('handles failure status response', async () => {
    vi.mocked(aucationApi.addBid).mockResolvedValueOnce({
      status: 'fail',
      message: 'Tawaran harus lebih tinggi'
    })

    const wrapper = mount(BidModal, {
      props: { auctionId: 1 }
    })

    await wrapper.find('input[type="number"]').setValue(10000)
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Tawaran harus lebih tinggi')
  })

  it('handles failure status response without custom message', async () => {
    vi.mocked(aucationApi.addBid).mockResolvedValueOnce({
      status: 'fail'
    })

    const wrapper = mount(BidModal, {
      props: { auctionId: 1 }
    })

    await wrapper.find('input[type="number"]').setValue(10000)
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Gagal memberikan tawaran.')
  })

  it('handles API error with and without message', async () => {
    vi.mocked(aucationApi.addBid).mockRejectedValueOnce(new Error('Network error'))

    const wrapper = mount(BidModal, {
      props: { auctionId: 1 }
    })

    await wrapper.find('input[type="number"]').setValue(50000)
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Network error')

    vi.mocked(aucationApi.addBid).mockRejectedValueOnce({})
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Terjadi kesalahan sistem.')
  })

  it('emits close event when close and cancel buttons are clicked', async () => {
    const wrapper = mount(BidModal, {
      props: { auctionId: 1 }
    })

    const closeBtn = wrapper.find('button.text-gray-400')
    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()

    const cancelBtn = wrapper.findAll('button').find(b => b.text() === 'Batal')
    await cancelBtn.trigger('click')
    expect(wrapper.emitted('close').length).toBe(2)
  })
})
