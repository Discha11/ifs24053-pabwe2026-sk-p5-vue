import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authApi } from './authApi'

describe('authApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('should login successfully', async () => {
    const mockResponse = { status: 'success', data: { token: 'mock-token' } }
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockResponse
    })

    const payload = { email: 'test@delcom.org', password: 'password123' }
    const result = await authApi.login(payload)
    expect(result).toEqual(mockResponse)
  })

  it('should register successfully', async () => {
    const mockResponse = { status: 'success', message: 'Registered' }
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockResponse
    })

    const payload = { name: 'Discha', email: 'discha@delcom.org', password: 'password123' }
    const result = await authApi.register(payload)
    expect(result).toEqual(mockResponse)
  })

  it('should fetch current user profile (getMe) successfully', async () => {
    const mockResponse = { status: 'success', data: { user: { id: 1, name: 'Discha' } } }
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockResponse
    })

    localStorage.setItem('token', 'mock-token')
    const result = await authApi.getMe()
    expect(result).toEqual(mockResponse)

    // Without token
    localStorage.clear()
    const resultNoToken = await authApi.getMe()
    expect(resultNoToken).toEqual(mockResponse)
  })
})