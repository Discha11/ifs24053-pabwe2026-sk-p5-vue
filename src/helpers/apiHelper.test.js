import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiHelper, getAccessToken, putAccessToken } from './apiHelper'

describe('apiHelper', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('manages token using getAccessToken and putAccessToken', () => {
    expect(getAccessToken()).toBe('')
    putAccessToken('test-token')
    expect(getAccessToken()).toBe('test-token')
    expect(localStorage.getItem('token')).toBe('test-token')
    putAccessToken('')
    expect(getAccessToken()).toBe('')
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('should perform GET request successfully without params', async () => {
    const mockResponse = { status: 'success', data: [] }
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockResponse
    })

    const result = await apiHelper.get('/test')
    expect(result).toEqual(mockResponse)
    expect(global.fetch).toHaveBeenCalledWith('https://open-api.delcom.org/api/v1/test', expect.any(Object))
  })

  it('should handle params with null and undefined values and empty query', async () => {
    const mockResponse = { status: 'success', data: [] }
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockResponse
    })

    await apiHelper.get('/test', { emptyVal: undefined, nullVal: null })
    expect(global.fetch).toHaveBeenCalledWith('https://open-api.delcom.org/api/v1/test', expect.any(Object))
  })

  it('should perform GET request successfully with params and token', async () => {
    putAccessToken('bearer-123')
    const mockResponse = { status: 'success', data: [] }
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockResponse
    })

    const result = await apiHelper.get('/test', { is_me: 1, is_closed: 0 })
    expect(result).toEqual(mockResponse)
    expect(global.fetch).toHaveBeenCalledWith(
      'https://open-api.delcom.org/api/v1/test?is_me=1&is_closed=0',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer bearer-123'
        })
      })
    )
  })

  it('should perform POST request successfully', async () => {
    const mockResponse = { status: 'success', message: 'Created' }
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockResponse
    })

    const result = await apiHelper.post('/test', { name: 'Data' })
    expect(result).toEqual(mockResponse)
  })

  it('should perform postMultipart request successfully', async () => {
    const mockResponse = { status: 'success', message: 'Uploaded' }
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockResponse
    })

    const formData = new FormData()
    formData.append('file', 'test')
    const result = await apiHelper.postMultipart('/test/upload', formData)
    expect(result).toEqual(mockResponse)
  })

  it('should perform PUT request successfully', async () => {
    const mockResponse = { status: 'success', message: 'Updated' }
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockResponse
    })

    const result = await apiHelper.put('/test/1', { name: 'Update' })
    expect(result).toEqual(mockResponse)
  })

  it('should perform DELETE request successfully', async () => {
    const mockResponse = { status: 'success', message: 'Deleted' }
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockResponse
    })

    const result = await apiHelper.delete('/test/1')
    expect(result).toEqual(mockResponse)
  })
})