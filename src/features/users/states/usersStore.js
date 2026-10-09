import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userApi } from '../api/userApi'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(false)
  const isUsers = ref(false)
  const isProfileUpdate = ref(false)
  const isPasswordUpdate = ref(false)
  const isPhotoUpdate = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

  const fetchUsers = async () => {
    loading.value = true
    isUsers.value = true
    errorMessage.value = ''
    try {
      const result = await userApi.getUsers()
      if (result.status === 'success') {
        users.value = result.data.users || []
      } else {
        errorMessage.value = result.message || 'Gagal memuat daftar pengguna.'
      }
    } catch (error) {
      errorMessage.value = error.message || 'Terjadi kesalahan sistem.'
    } finally {
      loading.value = false
      isUsers.value = false
    }
  }

  const fetchProfile = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
      const result = await userApi.getProfile()
      if (result.status === 'success') {
        profile.value = result.data.user || null
        user.value = profile.value
      } else {
        errorMessage.value = result.message || 'Gagal memuat profil.'
      }
    } catch (error) {
      errorMessage.value = error.message || 'Terjadi kesalahan sistem.'
    } finally {
      loading.value = false
    }
  }

  const changeProfile = async (payload) => {
    loading.value = true
    isProfileUpdate.value = true
    errorMessage.value = ''
    try {
      const result = await userApi.updateProfile(payload)
      if (result.status === 'success') {
        successMessage.value = result.message || 'Profil berhasil diperbarui.'
        await fetchProfile()
        return true
      } else {
        errorMessage.value = result.message || 'Gagal memperbarui profil.'
        return false
      }
    } catch (error) {
      errorMessage.value = error.message || 'Terjadi kesalahan sistem.'
      return false
    } finally {
      loading.value = false
      isProfileUpdate.value = false
    }
  }

  const changePhoto = async (file) => {
    loading.value = true
    isPhotoUpdate.value = true
    errorMessage.value = ''
    try {
      const result = await userApi.updatePhoto(file)
      if (result.status === 'success') {
        successMessage.value = result.message || 'Foto avatar berhasil diperbarui.'
        await fetchProfile()
        return true
      } else {
        errorMessage.value = result.message || 'Gagal memperbarui foto avatar.'
        return false
      }
    } catch (error) {
      errorMessage.value = error.message || 'Terjadi kesalahan sistem.'
      return false
    } finally {
      loading.value = false
      isPhotoUpdate.value = false
    }
  }

  const changePassword = async (payload) => {
    loading.value = true
    isPasswordUpdate.value = true
    errorMessage.value = ''
    try {
      const result = await userApi.updatePassword(payload)
      if (result.status === 'success') {
        successMessage.value = result.message || 'Kata sandi berhasil diperbarui.'
        return true
      } else {
        errorMessage.value = result.message || 'Gagal memperbarui kata sandi.'
        return false
      }
    } catch (error) {
      errorMessage.value = error.message || 'Terjadi kesalahan sistem.'
      return false
    } finally {
      loading.value = false
      isPasswordUpdate.value = false
    }
  }

  return {
    users,
    user,
    profile,
    loading,
    isUsers,
    isProfileUpdate,
    isPasswordUpdate,
    isPhotoUpdate,
    errorMessage,
    successMessage,
    fetchUsers,
    fetchProfile,
    changeProfile,
    changePhoto,
    changePassword
  }
})
