import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '../api/authApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')
  const loading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

  // State mutasi otentikasi sesuai modul praktikum
  const isAuthLogin = ref(false)
  const isAuthRegister = ref(false)
  const isAuthLogout = ref(false)

  const login = async (payload) => {
    loading.value = true
    isAuthLogin.value = true
    errorMessage.value = ''
    try {
      const result = await authApi.login(payload)
      if (result.status === 'success') {
        token.value = result.data.token
        localStorage.setItem('token', token.value)
        successMessage.value = 'Berhasil masuk.'
        return true
      } else {
        errorMessage.value = result.message || 'Gagal masuk.'
        return false
      }
    } catch (error) {
      errorMessage.value = error.message || 'Terjadi kesalahan sistem.'
      return false
    } finally {
      loading.value = false
      isAuthLogin.value = false
    }
  }

  const register = async (payload) => {
    loading.value = true
    isAuthRegister.value = true
    errorMessage.value = ''
    try {
      const result = await authApi.register(payload)
      if (result.status === 'success') {
        successMessage.value = 'Registrasi berhasil. Silakan masuk.'
        return true
      } else {
        errorMessage.value = result.message || 'Gagal mendaftar.'
        return false
      }
    } catch (error) {
      errorMessage.value = error.message || 'Terjadi kesalahan sistem.'
      return false
    } finally {
      loading.value = false
      isAuthRegister.value = false
    }
  }

  const fetchMe = async () => {
    loading.value = true
    try {
      const result = await authApi.getMe()
      if (result.status === 'success') {
        user.value = result.data.user || null
      } else {
        errorMessage.value = result.message || 'Gagal memuat profil.'
      }
    } catch (error) {
      errorMessage.value = error.message || 'Terjadi kesalahan sistem.'
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    isAuthLogout.value = true
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    isAuthLogout.value = false
  }

  return {
    user,
    token,
    loading,
    errorMessage,
    successMessage,
    isAuthLogin,
    isAuthRegister,
    isAuthLogout,
    login,
    register,
    fetchMe,
    logout
  }
})