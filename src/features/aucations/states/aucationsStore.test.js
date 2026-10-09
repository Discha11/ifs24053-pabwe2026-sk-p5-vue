import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAucationsStore } from './aucationsStore'
import { aucationApi } from '../api/aucationApi'

vi.mock('../api/aucationApi', () => ({
  aucationApi: {
    getAll: vi.fn(),
    getDetail: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateCover: vi.fn(),
    delete: vi.fn(),
    deleteAll: vi.fn(),
    addBid: vi.fn(),
    deleteBid: vi.fn()
  }
}))

describe('aucationsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('fetches aucations successfully and handles error', async () => {
    vi.mocked(aucationApi.getAll).mockResolvedValueOnce({
      status: 'success',
      data: { aucations: [{ id: 1, title: 'Item 1' }] }
    })

    const store = useAucationsStore()
    await store.fetchAucations()

    expect(store.aucations).toHaveLength(1)
    expect(store.aucations[0].title).toBe('Item 1')

    vi.mocked(aucationApi.getAll).mockResolvedValueOnce({ status: 'fail', message: 'Fail' })
    await store.fetchAucations()
    expect(store.errorMessage).toBe('Fail')

    vi.mocked(aucationApi.getAll).mockRejectedValueOnce(new Error('Network error'))
    await store.fetchAucations()
    expect(store.errorMessage).toBe('Network error')
  })

  it('fetches detail successfully and handles error', async () => {
    vi.mocked(aucationApi.getDetail).mockResolvedValueOnce({
      status: 'success',
      data: { aucation: { id: 1, title: 'Item 1' } }
    })

    const store = useAucationsStore()
    await store.fetchAucationDetail(1)

    expect(store.aucation?.title).toBe('Item 1')
    expect(store.currentAucation?.title).toBe('Item 1')

    vi.mocked(aucationApi.getDetail).mockResolvedValueOnce({ status: 'fail', message: 'Fail' })
    await store.fetchAucationDetail(1)
    expect(store.errorMessage).toBe('Fail')

    vi.mocked(aucationApi.getDetail).mockRejectedValueOnce(new Error('Err'))
    await store.fetchAucationDetail(1)
    expect(store.errorMessage).toBe('Err')
  })

  it('creates aucation successfully and handles failure', async () => {
    vi.mocked(aucationApi.create).mockResolvedValueOnce({ status: 'success', message: 'Created' })
    vi.mocked(aucationApi.getAll).mockResolvedValueOnce({ status: 'success', data: { aucations: [] } })

    const store = useAucationsStore()
    const result = await store.createAucation({ title: 'Item' })

    expect(result).toBe(true)
    expect(store.isAucationAdded).toBe(true)

    vi.mocked(aucationApi.create).mockResolvedValueOnce({ status: 'fail', message: 'Fail' })
    const failRes = await store.createAucation({ title: 'Item' })
    expect(failRes).toBe(false)

    vi.mocked(aucationApi.create).mockRejectedValueOnce(new Error('Err'))
    const errRes = await store.createAucation({ title: 'Item' })
    expect(errRes).toBe(false)
  })

  it('updates aucation successfully and handles failure', async () => {
    vi.mocked(aucationApi.update).mockResolvedValueOnce({ status: 'success', message: 'Updated' })
    vi.mocked(aucationApi.getDetail).mockResolvedValueOnce({ status: 'success', data: { aucation: {} } })

    const store = useAucationsStore()
    const result = await store.updateAucation(1, { title: 'Updated' })

    expect(result).toBe(true)
    expect(store.isAucationChanged).toBe(true)

    vi.mocked(aucationApi.update).mockResolvedValueOnce({ status: 'fail', message: 'Fail' })
    const failRes = await store.updateAucation(1, {})
    expect(failRes).toBe(false)

    vi.mocked(aucationApi.update).mockRejectedValueOnce(new Error('Err'))
    const errRes = await store.updateAucation(1, {})
    expect(errRes).toBe(false)
  })

  it('changes cover successfully and handles failure', async () => {
    vi.mocked(aucationApi.updateCover).mockResolvedValueOnce({ status: 'success', message: 'Cover updated' })
    vi.mocked(aucationApi.getDetail).mockResolvedValueOnce({ status: 'success', data: { aucation: {} } })

    const store = useAucationsStore()
    const file = new File([''], 'test.png')
    const result = await store.changeCover(1, file)

    expect(result).toBe(true)
    expect(store.isAucationChangedCover).toBe(true)

    vi.mocked(aucationApi.updateCover).mockResolvedValueOnce({ status: 'fail', message: 'Fail' })
    const failRes = await store.changeCover(1, file)
    expect(failRes).toBe(false)

    vi.mocked(aucationApi.updateCover).mockRejectedValueOnce(new Error('Err'))
    const errRes = await store.changeCover(1, file)
    expect(errRes).toBe(false)
  })

  it('removes aucation successfully and handles failure', async () => {
    vi.mocked(aucationApi.delete).mockResolvedValueOnce({ status: 'success', message: 'Deleted' })
    vi.mocked(aucationApi.getAll).mockResolvedValueOnce({ status: 'success', data: { aucations: [] } })

    const store = useAucationsStore()
    const result = await store.removeAucation(1)

    expect(result).toBe(true)
    expect(store.isAucationDeleted).toBe(true)

    vi.mocked(aucationApi.delete).mockResolvedValueOnce({ status: 'fail', message: 'Fail' })
    const failRes = await store.removeAucation(1)
    expect(failRes).toBe(false)

    vi.mocked(aucationApi.delete).mockRejectedValueOnce(new Error('Err'))
    const errRes = await store.removeAucation(1)
    expect(errRes).toBe(false)
  })

  it('removes all aucations successfully and handles failure', async () => {
    vi.mocked(aucationApi.deleteAll).mockResolvedValueOnce({ status: 'success', message: 'All Deleted' })
    vi.mocked(aucationApi.getAll).mockResolvedValueOnce({ status: 'success', data: { aucations: [] } })

    const store = useAucationsStore()
    const result = await store.removeAllAucations()

    expect(result).toBe(true)
    expect(store.isAucationDeletedAll).toBe(true)

    vi.mocked(aucationApi.deleteAll).mockResolvedValueOnce({ status: 'fail', message: 'Fail' })
    const failRes = await store.removeAllAucations()
    expect(failRes).toBe(false)

    vi.mocked(aucationApi.deleteAll).mockRejectedValueOnce(new Error('Err'))
    const errRes = await store.removeAllAucations()
    expect(errRes).toBe(false)
  })

  it('places bid successfully and handles failure', async () => {
    vi.mocked(aucationApi.addBid).mockResolvedValueOnce({ status: 'success', message: 'Bid added' })
    vi.mocked(aucationApi.getDetail).mockResolvedValueOnce({ status: 'success', data: { aucation: {} } })

    const store = useAucationsStore()
    const result = await store.placeBid(1, 100000)

    expect(result).toBe(true)
    expect(store.isBidAdded).toBe(true)

    vi.mocked(aucationApi.addBid).mockResolvedValueOnce({ status: 'fail', message: 'Fail' })
    const failRes = await store.placeBid(1, 1000)
    expect(failRes).toBe(false)

    vi.mocked(aucationApi.addBid).mockRejectedValueOnce(new Error('Err'))
    const errRes = await store.placeBid(1, 1000)
    expect(errRes).toBe(false)
  })

  it('cancels bid successfully and handles failure', async () => {
    vi.mocked(aucationApi.deleteBid).mockResolvedValueOnce({ status: 'success', message: 'Bid cancelled' })
    vi.mocked(aucationApi.getDetail).mockResolvedValueOnce({ status: 'success', data: { aucation: {} } })

    const store = useAucationsStore()
    const result = await store.cancelBid(1)

    expect(result).toBe(true)
    expect(store.isBidDeleted).toBe(true)

    vi.mocked(aucationApi.deleteBid).mockResolvedValueOnce({ status: 'fail', message: 'Fail' })
    const failRes = await store.cancelBid(1)
    expect(failRes).toBe(false)

    vi.mocked(aucationApi.deleteBid).mockRejectedValueOnce(new Error('Err'))
    const errRes = await store.cancelBid(1)
    expect(errRes).toBe(false)
  })

  it('tests computed setters, aliases, and fallback messages', async () => {
    const store = useAucationsStore()
    store.currentAucation = { id: 99 }
    expect(store.aucation?.id).toBe(99)

    store.loading = true
    expect(store.isAucation).toBe(true)

    // Call alias
    vi.mocked(aucationApi.addBid).mockResolvedValueOnce({ status: 'fail' })
    await store.addBid(1, 100)
    expect(store.errorMessage).toBe('Gagal mengajukan tawaran.')

    vi.mocked(aucationApi.deleteBid).mockResolvedValueOnce({ status: 'fail' })
    await store.deleteBid(1)
    expect(store.errorMessage).toBe('Gagal membatalkan tawaran.')

    vi.mocked(aucationApi.create).mockResolvedValueOnce({ status: 'fail' })
    await store.createAucation({})
    expect(store.errorMessage).toBe('Gagal membuat lelang.')

    vi.mocked(aucationApi.update).mockResolvedValueOnce({ status: 'fail' })
    await store.updateAucation(1, {})
    expect(store.errorMessage).toBe('Gagal memperbarui lelang.')

    vi.mocked(aucationApi.updateCover).mockResolvedValueOnce({ status: 'fail' })
    await store.changeCover(1, null)
    expect(store.errorMessage).toBe('Gagal memperbarui cover.')

    vi.mocked(aucationApi.delete).mockResolvedValueOnce({ status: 'fail' })
    await store.removeAucation(1)
    expect(store.errorMessage).toBe('Gagal menghapus lelang.')

    vi.mocked(aucationApi.deleteAll).mockResolvedValueOnce({ status: 'fail' })
    await store.removeAllAucations()
    expect(store.errorMessage).toBe('Gagal menghapus semua lelang.')

    // Exceptions without message
    vi.mocked(aucationApi.getAll).mockRejectedValueOnce({})
    await store.fetchAucations()
    expect(store.errorMessage).toBe('Terjadi kesalahan sistem.')

    vi.mocked(aucationApi.getDetail).mockRejectedValueOnce({})
    await store.fetchAucationDetail(1)
    expect(store.errorMessage).toBe('Terjadi kesalahan sistem.')

    vi.mocked(aucationApi.create).mockRejectedValueOnce({})
    await store.createAucation({})
    expect(store.errorMessage).toBe('Terjadi kesalahan sistem.')

    vi.mocked(aucationApi.update).mockRejectedValueOnce({})
    await store.updateAucation(1, {})
    expect(store.errorMessage).toBe('Terjadi kesalahan sistem.')

    vi.mocked(aucationApi.updateCover).mockRejectedValueOnce({})
    await store.changeCover(1, null)
    expect(store.errorMessage).toBe('Terjadi kesalahan sistem.')

    vi.mocked(aucationApi.delete).mockRejectedValueOnce({})
    await store.removeAucation(1)
    expect(store.errorMessage).toBe('Terjadi kesalahan sistem.')

    vi.mocked(aucationApi.deleteAll).mockRejectedValueOnce({})
    await store.removeAllAucations()
    expect(store.errorMessage).toBe('Terjadi kesalahan sistem.')

    vi.mocked(aucationApi.addBid).mockRejectedValueOnce({})
    await store.placeBid(1, 100)
    expect(store.errorMessage).toBe('Terjadi kesalahan sistem.')

    vi.mocked(aucationApi.deleteBid).mockRejectedValueOnce({})
    await store.cancelBid(1)
    expect(store.errorMessage).toBe('Terjadi kesalahan sistem.')
  })

  it('handles success responses without message to cover fallback success messages', async () => {
    const store = useAucationsStore()

    vi.mocked(aucationApi.create).mockResolvedValueOnce({ status: 'success' })
    vi.mocked(aucationApi.getAll).mockResolvedValueOnce({ status: 'success', data: {} })
    await store.createAucation({})
    expect(store.successMessage).toBe('Lelang berhasil dibuat.')

    vi.mocked(aucationApi.update).mockResolvedValueOnce({ status: 'success' })
    vi.mocked(aucationApi.getDetail).mockResolvedValueOnce({ status: 'success', data: {} })
    await store.updateAucation(1, {})
    expect(store.successMessage).toBe('Lelang berhasil diperbarui.')

    vi.mocked(aucationApi.updateCover).mockResolvedValueOnce({ status: 'success' })
    await store.changeCover(1, null)
    expect(store.successMessage).toBe('Cover berhasil diperbarui.')

    vi.mocked(aucationApi.delete).mockResolvedValueOnce({ status: 'success' })
    await store.removeAucation(1)
    expect(store.successMessage).toBe('Lelang berhasil dihapus.')

    vi.mocked(aucationApi.deleteAll).mockResolvedValueOnce({ status: 'success' })
    await store.removeAllAucations()
    expect(store.successMessage).toBe('Semua lelang berhasil dihapus.')

    vi.mocked(aucationApi.addBid).mockResolvedValueOnce({ status: 'success' })
    await store.placeBid(1, 100)
    expect(store.successMessage).toBe('Tawaran lelang berhasil diajukan.')

    vi.mocked(aucationApi.deleteBid).mockResolvedValueOnce({ status: 'success' })
    await store.cancelBid(1)
    expect(store.successMessage).toBe('Tawaran lelang berhasil dibatalkan.')
  })

  it('handles fail responses without message to cover fallback error messages for fetchAucations and fetchAucationDetail', async () => {
    const store = useAucationsStore()

    vi.mocked(aucationApi.getAll).mockResolvedValueOnce({ status: 'fail' })
    await store.fetchAucations()
    expect(store.errorMessage).toBe('Gagal memuat data lelang.')

    vi.mocked(aucationApi.getDetail).mockResolvedValueOnce({ status: 'fail' })
    await store.fetchAucationDetail(1)
    expect(store.errorMessage).toBe('Gagal memuat detail lelang.')
  })
})
