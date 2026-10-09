import { apiHelper } from '../../../helpers/apiHelper'

export const aucationApi = {
  async getAll(params = {}) {
    return await apiHelper.get('/aucations', params)
  },

  async getDetail(id) {
    return await apiHelper.get(`/aucations/${id}`)
  },

  async create(payload) {
    return await apiHelper.post('/aucations', payload)
  },

  async update(id, payload) {
    return await apiHelper.put(`/aucations/${id}`, payload)
  },

  async updateCover(id, file) {
    const formData = new FormData()
    formData.append('cover', file)
    return await apiHelper.postMultipart(`/aucations/${id}/cover`, formData)
  },

  async delete(id) {
    return await apiHelper.delete(`/aucations/${id}`)
  },

  async deleteAll() {
    return await apiHelper.delete('/aucations')
  },

  async addBid(id, bidAmount) {
    return await apiHelper.post(`/aucations/${id}/bids`, { bid: bidAmount })
  },

  async deleteBid(id) {
    return await apiHelper.delete(`/aucations/${id}/bids`)
  }
}
