import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ChangeModal from './ChangeModal.vue'
import { useAucationsStore } from '../states/aucationsStore'

const customStubs = {
  MarkdownEditor: {
    template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
    props: ['modelValue']
  }
}

describe('ChangeModal.vue', () => {
  const mockAuction = {
    id: 1,
    title: 'Monitor 4K',
    description: 'Bekas pemakaian',
    start_bid: 2000000,
    closed_at: '2026-12-31 23:59:59'
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders auction data and handles form submission', async () => {
    const store = useAucationsStore()
    store.updateAucation = vi.fn().mockResolvedValue(true)

    const wrapper = mount(ChangeModal, {
      props: { auction: mockAuction },
      global: { stubs: customStubs }
    })

    expect(wrapper.find('input[type="text"]').element.value).toBe('Monitor 4K')

    await wrapper.find('input[type="text"]').setValue('Monitor 4K Gaming')
    await wrapper.find('textarea').setValue('Deskripsi Baru')
    await wrapper.find('input[type="number"]').setValue('2500000')
    const inputs = wrapper.findAll('input[type="text"]')
    await inputs[1].setValue('2027-01-01 00:00:00')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(store.updateAucation).toHaveBeenCalledWith(1, {
      title: 'Monitor 4K Gaming',
      description: 'Deskripsi Baru',
      start_bid: 2500000,
      closed_at: '2027-01-01 00:00:00'
    })
    expect(wrapper.emitted('success')).toBeTruthy()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('validates empty field on submit', async () => {
    const wrapper = mount(ChangeModal, {
      props: { auction: { ...mockAuction, title: '' } },
      global: { stubs: customStubs }
    })

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(wrapper.text()).toContain('Semua field wajib diisi!')
  })

  it('handles update failure with and without store error message and loading button', async () => {
    const store = useAucationsStore()
    store.updateAucation = vi.fn().mockResolvedValue(false)
    store.errorMessage = 'Gagal update'
    store.isAucationChange = true

    const wrapper = mount(ChangeModal, {
      props: { auction: mockAuction },
      global: { stubs: customStubs }
    })

    expect(wrapper.find('button[type="submit"]').text()).toBe('Menyimpan...')

    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Gagal update')

    store.errorMessage = ''
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Gagal memperbarui lelang.')
  })

  it('emits close when header close button or cancel button is clicked', async () => {
    const wrapper = mount(ChangeModal, {
      props: { auction: mockAuction },
      global: { stubs: customStubs }
    })

    const closeBtn = wrapper.find('button[aria-label="Close"]')
    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()

    const cancelBtn = wrapper.findAll('button').find(b => b.text() === 'Batal')
    await cancelBtn.trigger('click')
    expect(wrapper.emitted('close').length).toBe(2)
  })

  it('initializes with empty values when auction props are empty', () => {
    const wrapper = mount(ChangeModal, {
      props: { auction: { id: 2 } },
      global: { stubs: customStubs }
    })
    expect(wrapper.find('input[type="text"]').element.value).toBe('')
  })
})
