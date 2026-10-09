import { describe, it, expect, vi, beforeEach } from 'vitest'
import { userApi } from './userApi'
import { apiHelper } from '../../../helpers/apiHelper'

vi.mock('../../../helpers/apiHelper', () => ({
  apiHelper: {
    get: vi.fn(),
    put: vi.fn(),
    postMultipart: vi.fn()
  }
}))

describe('userApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches list of users via getUsers', async () => {
    const mockRes = { status: 'success', data: { users: [{ id: 1, name: 'User 1' }] } }
    vi.mocked(apiHelper.get).mockResolvedValue(mockRes)

    const result = await userApi.getUsers()
    expect(result).toEqual(mockRes)
    expect(apiHelper.get).toHaveBeenCalledWith('/users')
  })

  it('fetches active user profile via getProfile', async () => {
    const mockRes = { status: 'success', data: { user: { id: 1, name: 'Active User' } } }
    vi.mocked(apiHelper.get).mockResolvedValue(mockRes)

    const result = await userApi.getProfile()
    expect(result).toEqual(mockRes)
    expect(apiHelper.get).toHaveBeenCalledWith('/users/me')
  })

  it('updates profile via updateProfile', async () => {
    const mockRes = { status: 'success', message: 'Profile updated' }
    vi.mocked(apiHelper.put).mockResolvedValue(mockRes)

    const payload = { name: 'New Name' }
    const result = await userApi.updateProfile(payload)
    expect(result).toEqual(mockRes)
    expect(apiHelper.put).toHaveBeenCalledWith('/users/me', payload)
  })

  it('updates avatar via updatePhoto', async () => {
    const mockRes = { status: 'success', message: 'Photo updated' }
    vi.mocked(apiHelper.postMultipart).mockResolvedValue(mockRes)

    const file = new File(['content'], 'avatar.png', { type: 'image/png' })
    const result = await userApi.updatePhoto(file)
    expect(result).toEqual(mockRes)
    expect(apiHelper.postMultipart).toHaveBeenCalledWith('/users/me/photo', expect.any(FormData))
  })

  it('updates password via updatePassword', async () => {
    const mockRes = { status: 'success', message: 'Password updated' }
    vi.mocked(apiHelper.put).mockResolvedValue(mockRes)

    const payload = { old_password: 'old', password: 'new' }
    const result = await userApi.updatePassword(payload)
    expect(result).toEqual(mockRes)
    expect(apiHelper.put).toHaveBeenCalledWith('/users/me/password', payload)
  })
})
