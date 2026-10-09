import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ChangeCoverModal from './ChangeCoverModal.vue'
import { aucationApi } from '../api/aucationApi'

vi.mock('../api/aucationApi', () => ({
  aucationApi: {
    updateCover: vi.fn()
  }
}))

describe('ChangeCoverModal.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-preview-url')
  })

  it('renders correctly', () => {
    const wrapper = mount(ChangeCoverModal, {
      props: { auctionId: 1 }
    })
    expect(wrapper.text()).toContain('Ganti Cover Lelang')
  })

  it('shows error message if no file is selected on submit', async () => {
    const wrapper = mount(ChangeCoverModal, {
      props: { auctionId: 1 }
    })
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Silakan pilih file gambar terlebih dahulu.')
  })

  it('handles input file change without selected file', async () => {
    const wrapper = mount(ChangeCoverModal, {
      props: { auctionId: 1 }
    })
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [] })
    await input.trigger('change')
    expect(wrapper.find('img[alt="Live Preview"]').exists()).toBe(false)
  })

  it('handles successful cover update and live preview', async () => {
    vi.mocked(aucationApi.updateCover).mockResolvedValue({ status: 'success' })

    const wrapper = mount(ChangeCoverModal, {
      props: { auctionId: 1 }
    })

    const file = new File(['dummy'], 'cover.png', { type: 'image/png' })
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      value: [file]
    })
    await input.trigger('change')
    expect(wrapper.find('img[alt="Live Preview"]').exists()).toBe(true)

    await wrapper.find('form').trigger('submit.prevent')
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Berhasil mengubah cover')
    })
    expect(wrapper.emitted('success')).toBeTruthy()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('handles failed status response with and without message', async () => {
    vi.mocked(aucationApi.updateCover).mockResolvedValueOnce({ status: 'fail', message: 'Format salah' })

    const wrapper = mount(ChangeCoverModal, {
      props: { auctionId: 1 }
    })

    const file = new File(['dummy'], 'cover.png', { type: 'image/png' })
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [file] })

    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Format salah')

    vi.mocked(aucationApi.updateCover).mockResolvedValueOnce({ status: 'fail' })
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Gagal mengubah cover')
  })

  it('handles API exception with and without error message', async () => {
    vi.mocked(aucationApi.updateCover).mockRejectedValueOnce(new Error('Network error'))

    const wrapper = mount(ChangeCoverModal, {
      props: { auctionId: 1 }
    })

    const file = new File(['dummy'], 'cover.png', { type: 'image/png' })
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [file] })

    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Network error')

    vi.mocked(aucationApi.updateCover).mockRejectedValueOnce({})
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Terjadi kesalahan sistem.')
  })

  it('emits close event on close and cancel buttons', async () => {
    const wrapper = mount(ChangeCoverModal, {
      props: { auctionId: 1 }
    })

    const closeBtn = wrapper.find('button[aria-label="Close"]')
    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()

    const cancelBtn = wrapper.findAll('button').find(b => b.text() === 'Batal')
    await cancelBtn.trigger('click')
    expect(wrapper.emitted('close').length).toBe(2)
  })
})
