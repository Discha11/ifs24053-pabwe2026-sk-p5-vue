import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUsersStore } from './usersStore'
import { userApi } from '../api/userApi'

vi.mock('../api/userApi', () => ({
  userApi: {
    getUsers: vi.fn(),
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    updatePhoto: vi.fn(),
    updatePassword: vi.fn()
  }
}))

describe('usersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('fetches users successfully', async () => {
    vi.mocked(userApi.getUsers).mockResolvedValue({
      status: 'success',
      data: { users: [{ id: 1, name: 'User 1' }] }
    })

    const store = useUsersStore()
    await store.fetchUsers()

    expect(store.users).toHaveLength(1)
    expect(store.users[0].name).toBe('User 1')
  })

  it('handles fetch users failure and error', async () => {
    vi.mocked(userApi.getUsers).mockResolvedValueOnce({ status: 'fail', message: 'Fail' })
    const store = useUsersStore()
    await store.fetchUsers()
    expect(store.errorMessage).toBe('Fail')

    vi.mocked(userApi.getUsers).mockRejectedValueOnce(new Error('Network error'))
    await store.fetchUsers()
    expect(store.errorMessage).toBe('Network error')
  })

  it('fetches profile successfully', async () => {
    vi.mocked(userApi.getProfile).mockResolvedValue({
      status: 'success',
      data: { user: { id: 1, name: 'Admin' } }
    })

    const store = useUsersStore()
    await store.fetchProfile()

    expect(store.profile?.name).toBe('Admin')
  })

  it('handles fetch profile failure and error', async () => {
    vi.mocked(userApi.getProfile).mockResolvedValueOnce({ status: 'fail', message: 'Fail' })
    const store = useUsersStore()
    await store.fetchProfile()
    expect(store.errorMessage).toBe('Fail')

    vi.mocked(userApi.getProfile).mockRejectedValueOnce(new Error('Error'))
    await store.fetchProfile()
    expect(store.errorMessage).toBe('Error')
  })

  it('changes profile successfully', async () => {
    vi.mocked(userApi.updateProfile).mockResolvedValue({ status: 'success', message: 'Updated' })
    vi.mocked(userApi.getProfile).mockResolvedValue({ status: 'success', data: { user: { id: 1, name: 'New' } } })

    const store = useUsersStore()
    const result = await store.changeProfile({ name: 'New' })

    expect(result).toBe(true)
    expect(store.successMessage).toBe('Updated')
  })

  it('handles change profile failure and error', async () => {
    vi.mocked(userApi.updateProfile).mockResolvedValueOnce({ status: 'fail', message: 'Fail' })
    const store = useUsersStore()
    const result = await store.changeProfile({ name: 'New' })
    expect(result).toBe(false)

    vi.mocked(userApi.updateProfile).mockRejectedValueOnce(new Error('Fail Error'))
    const errorResult = await store.changeProfile({ name: 'New' })
    expect(errorResult).toBe(false)
  })

  it('changes photo successfully', async () => {
    vi.mocked(userApi.updatePhoto).mockResolvedValue({ status: 'success', message: 'Photo Updated' })
    vi.mocked(userApi.getProfile).mockResolvedValue({ status: 'success', data: { user: { id: 1 } } })

    const store = useUsersStore()
    const file = new File([''], 'test.png')
    const result = await store.changePhoto(file)

    expect(result).toBe(true)
    expect(store.successMessage).toBe('Photo Updated')
  })

  it('handles change photo failure and error', async () => {
    vi.mocked(userApi.updatePhoto).mockResolvedValueOnce({ status: 'fail', message: 'Fail' })
    const store = useUsersStore()
    const file = new File([''], 'test.png')
    const res1 = await store.changePhoto(file)
    expect(res1).toBe(false)

    vi.mocked(userApi.updatePhoto).mockRejectedValueOnce(new Error('Photo Error'))
    const res2 = await store.changePhoto(file)
    expect(res2).toBe(false)
  })

  it('changes password successfully', async () => {
    vi.mocked(userApi.updatePassword).mockResolvedValue({ status: 'success', message: 'Password Updated' })

    const store = useUsersStore()
    const result = await store.changePassword({ old_password: '1', password: '2' })

    expect(result).toBe(true)
    expect(store.successMessage).toBe('Password Updated')
  })

  it('handles change password failure and error', async () => {
    vi.mocked(userApi.updatePassword).mockResolvedValueOnce({ status: 'fail', message: 'Fail' })
    const store = useUsersStore()
    const res1 = await store.changePassword({ old_password: '1', password: '2' })
    expect(res1).toBe(false)

    vi.mocked(userApi.updatePassword).mockRejectedValueOnce(new Error('Pass Error'))
    const res2 = await store.changePassword({ old_password: '1', password: '2' })
    expect(res2).toBe(false)
  })

  it('handles fallback messages and empty response data', async () => {
    const store = useUsersStore()

    vi.mocked(userApi.getUsers).mockResolvedValueOnce({ status: 'success', data: {} })
    await store.fetchUsers()
    expect(store.users).toEqual([])

    vi.mocked(userApi.getUsers).mockResolvedValueOnce({ status: 'fail' })
    await store.fetchUsers()
    expect(store.errorMessage).toBe('Gagal memuat daftar pengguna.')

    vi.mocked(userApi.getUsers).mockRejectedValueOnce({})
    await store.fetchUsers()
    expect(store.errorMessage).toBe('Terjadi kesalahan sistem.')

    vi.mocked(userApi.getProfile).mockResolvedValueOnce({ status: 'success', data: {} })
    await store.fetchProfile()
    expect(store.profile).toBeNull()

    vi.mocked(userApi.getProfile).mockResolvedValueOnce({ status: 'fail' })
    await store.fetchProfile()
    expect(store.errorMessage).toBe('Gagal memuat profil.')

    vi.mocked(userApi.getProfile).mockRejectedValueOnce({})
    await store.fetchProfile()
    expect(store.errorMessage).toBe('Terjadi kesalahan sistem.')

    vi.mocked(userApi.updateProfile).mockResolvedValueOnce({ status: 'fail' })
    await store.changeProfile({})
    expect(store.errorMessage).toBe('Gagal memperbarui profil.')

    vi.mocked(userApi.updateProfile).mockRejectedValueOnce({})
    await store.changeProfile({})
    expect(store.errorMessage).toBe('Terjadi kesalahan sistem.')

    vi.mocked(userApi.updatePhoto).mockResolvedValueOnce({ status: 'fail' })
    await store.changePhoto(new File([''], 'a.png'))
    expect(store.errorMessage).toBe('Gagal memperbarui foto avatar.')

    vi.mocked(userApi.updatePhoto).mockRejectedValueOnce({})
    await store.changePhoto(new File([''], 'a.png'))
    expect(store.errorMessage).toBe('Terjadi kesalahan sistem.')

    vi.mocked(userApi.updatePassword).mockResolvedValueOnce({ status: 'fail' })
    await store.changePassword({ old_password: '1', password: '2' })
    expect(store.errorMessage).toBe('Gagal memperbarui kata sandi.')

    vi.mocked(userApi.updatePassword).mockRejectedValueOnce({})
    await store.changePassword({ old_password: '1', password: '2' })
    expect(store.errorMessage).toBe('Terjadi kesalahan sistem.')
  })

  it('handles success responses without message to cover fallback success messages', async () => {
    const store = useUsersStore()

    vi.mocked(userApi.updateProfile).mockResolvedValueOnce({ status: 'success' })
    vi.mocked(userApi.getProfile).mockResolvedValueOnce({ status: 'success', data: { user: {} } })
    await store.changeProfile({ name: 'New' })
    expect(store.successMessage).toBe('Profil berhasil diperbarui.')

    vi.mocked(userApi.updatePhoto).mockResolvedValueOnce({ status: 'success' })
    vi.mocked(userApi.getProfile).mockResolvedValueOnce({ status: 'success', data: { user: {} } })
    await store.changePhoto(new File([''], 'a.png'))
    expect(store.successMessage).toBe('Foto avatar berhasil diperbarui.')

    vi.mocked(userApi.updatePassword).mockResolvedValueOnce({ status: 'success' })
    await store.changePassword({ old_password: '1', password: '2' })
    expect(store.successMessage).toBe('Kata sandi berhasil diperbarui.')
  })
})
