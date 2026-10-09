import { apiHelper } from '../../../helpers/apiHelper'

export const userApi = {
  async getUsers() {
    return await apiHelper.get('/users')
  },

  async getProfile() {
    return await apiHelper.get('/users/me')
  },

  async updateProfile(payload) {
    return await apiHelper.put('/users/me', payload)
  },

  async updatePhoto(file) {
    const formData = new FormData()
    formData.append('photo', file)
    return await apiHelper.postMultipart('/users/me/photo', formData)
  },

  async updatePassword(payload) {
    return await apiHelper.put('/users/me/password', payload)
  }
}
