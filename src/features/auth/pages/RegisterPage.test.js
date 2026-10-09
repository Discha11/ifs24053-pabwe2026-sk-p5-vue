import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import RegisterPage from './RegisterPage.vue'
import { useAuthStore } from '../states/authStore'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush })
}))

const customStubs = {
  'router-link': {
    template: '<a><slot /></a>',
    props: ['to']
  }
}

describe('RegisterPage.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('renders register page correctly and displays messages and loading state', async () => {
    const store = useAuthStore()
    store.errorMessage = 'Email sudah terdaftar'
    store.successMessage = 'Registrasi berhasil'
    store.loading = true

    const wrapper = mount(RegisterPage, {
      global: { stubs: customStubs }
    })
    expect(wrapper.text()).toContain('Daftar Akun Baru')
    expect(wrapper.text()).toContain('Email sudah terdaftar')
    expect(wrapper.text()).toContain('Registrasi berhasil')
    expect(wrapper.text()).toContain('Masuk di sini')
    expect(wrapper.find('button[type="submit"]').text()).toBe('Memproses...')
  })

  it('shows alert if fields are empty on submit', async () => {
    const wrapper = mount(RegisterPage, {
      global: { stubs: customStubs }
    })
    await wrapper.find('form').trigger('submit.prevent')
    expect(window.alert).toHaveBeenCalledWith('Semua field wajib diisi!')
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('handles successful registration and redirects to /auth/login', async () => {
    const store = useAuthStore()
    store.register = vi.fn().mockResolvedValue(true)

    const wrapper = mount(RegisterPage, {
      global: { stubs: customStubs }
    })

    await wrapper.find('input[type="text"]').setValue('Discha')
    await wrapper.find('input[type="email"]').setValue('discha@delcom.org')
    await wrapper.find('input[type="password"]').setValue('secret123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(store.register).toHaveBeenCalledWith({
      name: 'Discha',
      email: 'discha@delcom.org',
      password: 'secret123'
    })
    expect(mockPush).toHaveBeenCalledWith('/auth/login')
  })

  it('handles failed registration without redirecting', async () => {
    const store = useAuthStore()
    store.register = vi.fn().mockResolvedValue(false)

    const wrapper = mount(RegisterPage, {
      global: { stubs: customStubs }
    })

    await wrapper.find('input[type="text"]').setValue('Discha')
    await wrapper.find('input[type="email"]').setValue('discha@delcom.org')
    await wrapper.find('input[type="password"]').setValue('secret123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(store.register).toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })
})