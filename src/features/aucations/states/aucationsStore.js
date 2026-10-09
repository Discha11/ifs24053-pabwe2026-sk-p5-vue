import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { aucationApi } from '../api/aucationApi'

export const useAucationsStore = defineStore('aucations', () => {
  // State koleksi dan lelang aktif
  const aucations = ref([])
  const aucation = ref(null)
  const isAucation = ref(false)

  // Backward compatibility alias
  const currentAucation = computed({
    get: () => aucation.value,
    set: (val) => { aucation.value = val }
  })
  const loading = computed({
    get: () => isAucation.value,
    set: (val) => { isAucation.value = val }
  })

  // State pelacakan mutasi aksi sesuai spesifikasi modul praktikum
  const isAucationAdd = ref(false)
  const isAucationAdded = ref(false)

  const isAucationChange = ref(false)
  const isAucationChanged = ref(false)

  const isAucationChangeCover = ref(false)
  const isAucationChangedCover = ref(false)

  const isAucationDelete = ref(false)
  const isAucationDeleted = ref(false)

  const isBidAdd = ref(false)
  const isBidAdded = ref(false)

  const isBidDelete = ref(false)
  const isBidDeleted = ref(false)

  const isAucationDeleteAll = ref(false)
  const isAucationDeletedAll = ref(false)

  const errorMessage = ref('')
  const successMessage = ref('')

  // 1. Mengambil daftar lelang
  const fetchAucations = async (params = {}) => {
    isAucation.value = true
    errorMessage.value = ''
    try {
      const result = await aucationApi.getAll(params)
      if (result.status === 'success') {
        aucations.value = result.data.aucations || []
      } else {
        errorMessage.value = result.message || 'Gagal memuat data lelang.'
      }
    } catch (error) {
      errorMessage.value = error.message || 'Terjadi kesalahan sistem.'
    } finally {
      isAucation.value = false
    }
  }

  // 2. Mengambil detail lengkap lelang
  const fetchAucationDetail = async (id) => {
    isAucation.value = true
    errorMessage.value = ''
    try {
      const result = await aucationApi.getDetail(id)
      if (result.status === 'success') {
        aucation.value = result.data.aucation || null
      } else {
        errorMessage.value = result.message || 'Gagal memuat detail lelang.'
      }
    } catch (error) {
      errorMessage.value = error.message || 'Terjadi kesalahan sistem.'
    } finally {
      isAucation.value = false
    }
  }

  // 3. Menambahkan lelang baru
  const createAucation = async (payload) => {
    isAucationAdd.value = true
    isAucationAdded.value = false
    errorMessage.value = ''
    try {
      const result = await aucationApi.create(payload)
      if (result.status === 'success') {
        isAucationAdded.value = true
        successMessage.value = result.message || 'Lelang berhasil dibuat.'
        await fetchAucations()
        return true
      } else {
        errorMessage.value = result.message || 'Gagal membuat lelang.'
        return false
      }
    } catch (error) {
      errorMessage.value = error.message || 'Terjadi kesalahan sistem.'
      return false
    } finally {
      isAucationAdd.value = false
    }
  }

  // 4. Memperbarui lelang
  const updateAucation = async (id, payload) => {
    isAucationChange.value = true
    isAucationChanged.value = false
    errorMessage.value = ''
    try {
      const result = await aucationApi.update(id, payload)
      if (result.status === 'success') {
        isAucationChanged.value = true
        successMessage.value = result.message || 'Lelang berhasil diperbarui.'
        await fetchAucationDetail(id)
        return true
      } else {
        errorMessage.value = result.message || 'Gagal memperbarui lelang.'
        return false
      }
    } catch (error) {
      errorMessage.value = error.message || 'Terjadi kesalahan sistem.'
      return false
    } finally {
      isAucationChange.value = false
    }
  }

  // 5. Mengubah foto cover lelang
  const changeCover = async (id, file) => {
    isAucationChangeCover.value = true
    isAucationChangedCover.value = false
    errorMessage.value = ''
    try {
      const result = await aucationApi.updateCover(id, file)
      if (result.status === 'success') {
        isAucationChangedCover.value = true
        successMessage.value = result.message || 'Cover berhasil diperbarui.'
        await fetchAucationDetail(id)
        return true
      } else {
        errorMessage.value = result.message || 'Gagal memperbarui cover.'
        return false
      }
    } catch (error) {
      errorMessage.value = error.message || 'Terjadi kesalahan sistem.'
      return false
    } finally {
      isAucationChangeCover.value = false
    }
  }

  // 6. Menghapus lelang
  const removeAucation = async (id) => {
    isAucationDelete.value = true
    isAucationDeleted.value = false
    errorMessage.value = ''
    try {
      const result = await aucationApi.delete(id)
      if (result.status === 'success') {
        isAucationDeleted.value = true
        successMessage.value = result.message || 'Lelang berhasil dihapus.'
        await fetchAucations()
        return true
      } else {
        errorMessage.value = result.message || 'Gagal menghapus lelang.'
        return false
      }
    } catch (error) {
      errorMessage.value = error.message || 'Terjadi kesalahan sistem.'
      return false
    } finally {
      isAucationDelete.value = false
    }
  }

  // 7. Menghapus semua lelang
  const removeAllAucations = async () => {
    isAucationDeleteAll.value = true
    isAucationDeletedAll.value = false
    errorMessage.value = ''
    try {
      const result = await aucationApi.deleteAll()
      if (result.status === 'success') {
        isAucationDeletedAll.value = true
        successMessage.value = result.message || 'Semua lelang berhasil dihapus.'
        await fetchAucations()
        return true
      } else {
        errorMessage.value = result.message || 'Gagal menghapus semua lelang.'
        return false
      }
    } catch (error) {
      errorMessage.value = error.message || 'Terjadi kesalahan sistem.'
      return false
    } finally {
      isAucationDeleteAll.value = false
    }
  }

  // 8. Menambah tawaran bid
  const placeBid = async (id, bidAmount) => {
    isBidAdd.value = true
    isBidAdded.value = false
    errorMessage.value = ''
    try {
      const result = await aucationApi.addBid(id, bidAmount)
      if (result.status === 'success') {
        isBidAdded.value = true
        successMessage.value = result.message || 'Tawaran lelang berhasil diajukan.'
        await fetchAucationDetail(id)
        return true
      } else {
        errorMessage.value = result.message || 'Gagal mengajukan tawaran.'
        return false
      }
    } catch (error) {
      errorMessage.value = error.message || 'Terjadi kesalahan sistem.'
      return false
    } finally {
      isBidAdd.value = false
    }
  }

  // 9. Membatalkan tawaran bid
  const cancelBid = async (id) => {
    isBidDelete.value = true
    isBidDeleted.value = false
    errorMessage.value = ''
    try {
      const result = await aucationApi.deleteBid(id)
      if (result.status === 'success') {
        isBidDeleted.value = true
        successMessage.value = result.message || 'Tawaran lelang berhasil dibatalkan.'
        await fetchAucationDetail(id)
        return true
      } else {
        errorMessage.value = result.message || 'Gagal membatalkan tawaran.'
        return false
      }
    } catch (error) {
      errorMessage.value = error.message || 'Terjadi kesalahan sistem.'
      return false
    } finally {
      isBidDelete.value = false
    }
  }

  return {
    aucations,
    aucation,
    currentAucation,
    isAucation,
    loading,
    isAucationAdd,
    isAucationAdded,
    isAucationChange,
    isAucationChanged,
    isAucationChangeCover,
    isAucationChangedCover,
    isAucationDelete,
    isAucationDeleted,
    isBidAdd,
    isBidAdded,
    isBidDelete,
    isBidDeleted,
    isAucationDeleteAll,
    isAucationDeletedAll,
    errorMessage,
    successMessage,
    fetchAucations,
    fetchAucationDetail,
    createAucation,
    updateAucation,
    changeCover,
    removeAucation,
    removeAllAucations,
    placeBid,
    cancelBid,
    // Alias untuk kompatibilitas
    addBid: placeBid,
    deleteBid: cancelBid
  }
})
