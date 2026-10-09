import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import LoginPage from './LoginPage.vue'
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

describe('LoginPage.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('renders login page correctly and displays error message and loading', async () => {
    const store = useAuthStore()
    store.errorMessage = 'Akun tidak ditemukan'
    store.loading = true

    const wrapper = mount(LoginPage, {
      global: { stubs: customStubs }
    })
    expect(wrapper.text()).toContain('Masuk ke Akun')
    expect(wrapper.text()).toContain('Akun tidak ditemukan')
    expect(wrapper.text()).toContain('Daftar di sini')
    expect(wrapper.find('button[type="submit"]').text()).toBe('Memproses...')
  })

  it('shows alert if fields are empty on submit', async () => {
    const wrapper = mount(LoginPage, {
      global: { stubs: customStubs }
    })
    await wrapper.find('form').trigger('submit.prevent')
    expect(window.alert).toHaveBeenCalledWith('Email dan password wajib diisi!')
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('handles successful login and redirects to /aucations', async () => {
    const store = useAuthStore()
    store.login = vi.fn().mockResolvedValue(true)

    const wrapper = mount(LoginPage, {
      global: { stubs: customStubs }
    })

    await wrapper.find('input[type="email"]').setValue('user@delcom.org')
    await wrapper.find('input[type="password"]').setValue('secret123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(store.login).toHaveBeenCalledWith({
      email: 'user@delcom.org',
      password: 'secret123'
    })
    expect(mockPush).toHaveBeenCalledWith('/aucations')
  })

  it('handles failed login without redirecting', async () => {
    const store = useAuthStore()
    store.login = vi.fn().mockResolvedValue(false)

    const wrapper = mount(LoginPage, {
      global: { stubs: customStubs }
    })

    await wrapper.find('input[type="email"]').setValue('user@delcom.org')
    await wrapper.find('input[type="password"]').setValue('wrong')
    await wrapper.find('form').trigger('submit.prevent')

    expect(store.login).toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })
})