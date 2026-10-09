import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import AddModal from './AddModal.vue'
import { useAucationsStore } from '../states/aucationsStore'

describe('AddModal.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.stubGlobal('alert', vi.fn())
  })

  it('validates empty fields and alerts user', async () => {
    const wrapper = mount(AddModal, {
      global: {
        stubs: {
          MarkdownEditor: {
            template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
            props: ['modelValue']
          }
        }
      }
    })

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(window.alert).toHaveBeenCalledWith('Semua field wajib diisi!')
  })

  it('submits valid data successfully and emits events', async () => {
    const store = useAucationsStore()
    store.createAucation = vi.fn().mockResolvedValue(true)

    const wrapper = mount(AddModal, {
      global: {
        stubs: {
          MarkdownEditor: {
            template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
            props: ['modelValue']
          }
        }
      }
    })

    await wrapper.find('input[type="text"]').setValue('Laptop Gaming')
    const textarea = wrapper.find('textarea')
    await textarea.setValue('Kondisi sangat mulus')
    await wrapper.find('input[type="number"]').setValue('5000000')
    const inputs = wrapper.findAll('input[type="text"]')
    await inputs[1].setValue('2026-12-31 23:59:59')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(store.createAucation).toHaveBeenCalledWith({
      title: 'Laptop Gaming',
      description: 'Kondisi sangat mulus',
      start_bid: 5000000,
      closed_at: '2026-12-31 23:59:59'
    })
    expect(wrapper.emitted('success')).toBeTruthy()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('handles submission failure and displays error message', async () => {
    const store = useAucationsStore()
    store.errorMessage = 'Gagal menyimpan lelang'
    store.isAucationAdd = true
    store.createAucation = vi.fn().mockResolvedValue(false)

    const wrapper = mount(AddModal, {
      global: {
        stubs: {
          MarkdownEditor: {
            template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
            props: ['modelValue']
          }
        }
      }
    })

    expect(wrapper.find('button[type="submit"]').text()).toBe('Menyimpan...')
    store.isAucationAdd = false
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button[type="submit"]').text()).toBe('Simpan Lelang')

    await wrapper.find('input[type="text"]').setValue('Barang')
    await wrapper.find('textarea').setValue('Deskripsi lelang')
    await wrapper.find('input[type="number"]').setValue('1000')
    const inputs = wrapper.findAll('input[type="text"]')
    await inputs[1].setValue('2026-12-31')

    await wrapper.find('form').trigger('submit.prevent')
    expect(store.createAucation).toHaveBeenCalled()
    expect(wrapper.emitted('success')).toBeFalsy()
  })

  it('emits close on cancel button and header close button click', async () => {
    const wrapper = mount(AddModal, {
      global: {
        stubs: { MarkdownEditor: true }
      }
    })

    const headerClose = wrapper.find('button[aria-label="Close"]')
    await headerClose.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()

    const cancelBtn = wrapper.find('button[type="button"]')
    await cancelBtn.trigger('click')
    expect(wrapper.emitted('close').length).toBe(2)
  })
})
