import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from './authStore'
import { authApi } from '../api/authApi'

vi.mock('../api/authApi', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    getMe: vi.fn()
  }
}))

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should login successfully and save token', async () => {
    const mockData = { status: 'success', data: { token: 'token-123' } }
    vi.mocked(authApi.login).mockResolvedValue(mockData)

    const store = useAuthStore()
    const success = await store.login({ email: 'test@delcom.org', password: 'password123' })

    expect(success).toBe(true)
    expect(store.token).toBe('token-123')
    expect(localStorage.getItem('token')).toBe('token-123')
  })

  it('should handle login failure', async () => {
    const mockData = { status: 'fail', message: 'Invalid credentials' }
    vi.mocked(authApi.login).mockResolvedValue(mockData)

    const store = useAuthStore()
    const success = await store.login({ email: 'test@delcom.org', password: 'wrong' })

    expect(success).toBe(false)
    expect(store.errorMessage).toBe('Invalid credentials')
  })

  it('should handle login exception', async () => {
    vi.mocked(authApi.login).mockRejectedValue(new Error('Network error'))

    const store = useAuthStore()
    const success = await store.login({ email: 'test@delcom.org', password: 'password123' })

    expect(success).toBe(false)
    expect(store.errorMessage).toBe('Network error')
  })

  it('should register successfully', async () => {
    const mockData = { status: 'success', message: 'Registered' }
    vi.mocked(authApi.register).mockResolvedValue(mockData)

    const store = useAuthStore()
    const success = await store.register({ name: 'Discha', email: 'discha@delcom.org', password: 'password123' })

    expect(success).toBe(true)
    expect(store.successMessage).toBe('Registrasi berhasil. Silakan masuk.')
  })

  it('should handle register failure', async () => {
    const mockData = { status: 'fail', message: 'Email already exists' }
    vi.mocked(authApi.register).mockResolvedValue(mockData)

    const store = useAuthStore()
    const success = await store.register({ name: 'Discha', email: 'discha@delcom.org', password: 'password123' })

    expect(success).toBe(false)
    expect(store.errorMessage).toBe('Email already exists')
  })

  it('should handle register exception', async () => {
    vi.mocked(authApi.register).mockRejectedValue(new Error('Server error'))

    const store = useAuthStore()
    const success = await store.register({ name: 'Discha', email: 'discha@delcom.org', password: 'password123' })

    expect(success).toBe(false)
    expect(store.errorMessage).toBe('Server error')
  })

  it('should fetch current user profile successfully', async () => {
    const mockData = { status: 'success', data: { user: { id: 1, name: 'Discha' } } }
    vi.mocked(authApi.getMe).mockResolvedValue(mockData)

    const store = useAuthStore()
    await store.fetchMe()

    expect(store.user?.name).toBe('Discha')
  })

  it('should handle fetchMe failure', async () => {
    const mockData = { status: 'fail', message: 'Unauthorized' }
    vi.mocked(authApi.getMe).mockResolvedValue(mockData)

    const store = useAuthStore()
    await store.fetchMe()

    expect(store.errorMessage).toBe('Unauthorized')
  })

  it('should handle fetchMe exception', async () => {
    vi.mocked(authApi.getMe).mockRejectedValue(new Error('Error'))

    const store = useAuthStore()
    await store.fetchMe()

    expect(store.errorMessage).toBe('Error')
  })

  it('should logout correctly', () => {
    const store = useAuthStore()
    store.token = 'token-123'
    store.user = { id: 1 }
    localStorage.setItem('token', 'token-123')

    store.logout()

    expect(store.token).toBe('')
    expect(store.user).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('handles fallback error messages and empty data objects', async () => {
    const store = useAuthStore()

    vi.mocked(authApi.login).mockResolvedValueOnce({ status: 'fail' })
    await store.login({ email: 'a@b.com', password: '123' })
    expect(store.errorMessage).toBe('Gagal masuk.')

    vi.mocked(authApi.login).mockRejectedValueOnce({})
    await store.login({ email: 'a@b.com', password: '123' })
    expect(store.errorMessage).toBe('Terjadi kesalahan sistem.')

    vi.mocked(authApi.register).mockResolvedValueOnce({ status: 'fail' })
    await store.register({ name: 'A', email: 'a@b.com', password: '123' })
    expect(store.errorMessage).toBe('Gagal mendaftar.')

    vi.mocked(authApi.register).mockRejectedValueOnce({})
    await store.register({ name: 'A', email: 'a@b.com', password: '123' })
    expect(store.errorMessage).toBe('Terjadi kesalahan sistem.')

    vi.mocked(authApi.getMe).mockResolvedValueOnce({ status: 'fail' })
    await store.fetchMe()
    expect(store.errorMessage).toBe('Gagal memuat profil.')

    vi.mocked(authApi.getMe).mockResolvedValueOnce({ status: 'success', data: {} })
    await store.fetchMe()
    expect(store.user).toBeNull()

    vi.mocked(authApi.getMe).mockRejectedValueOnce({})
    await store.fetchMe()
    expect(store.errorMessage).toBe('Terjadi kesalahan sistem.')
  })
})