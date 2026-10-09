import { describe, it, expect, vi, beforeEach } from 'vitest'
import { aucationApi } from './aucationApi'
import { apiHelper } from '../../../helpers/apiHelper'

vi.mock('../../../helpers/apiHelper', () => ({
  apiHelper: {
    get: vi.fn(),
    post: vi.fn(),
    postMultipart: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('aucationApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls getAll with params', async () => {
    const mockRes = { status: 'success', data: { aucations: [] } }
    vi.mocked(apiHelper.get).mockResolvedValue(mockRes)

    const params = { is_me: 1 }
    const result = await aucationApi.getAll(params)
    expect(result).toEqual(mockRes)
    expect(apiHelper.get).toHaveBeenCalledWith('/aucations', params)
  })

  it('calls getDetail with id', async () => {
    const mockRes = { status: 'success', data: { aucation: { id: 1 } } }
    vi.mocked(apiHelper.get).mockResolvedValue(mockRes)

    const result = await aucationApi.getDetail(1)
    expect(result).toEqual(mockRes)
    expect(apiHelper.get).toHaveBeenCalledWith('/aucations/1')
  })

  it('calls create with payload', async () => {
    const mockRes = { status: 'success', message: 'Created' }
    vi.mocked(apiHelper.post).mockResolvedValue(mockRes)

    const payload = { title: 'Item', start_bid: 1000 }
    const result = await aucationApi.create(payload)
    expect(result).toEqual(mockRes)
    expect(apiHelper.post).toHaveBeenCalledWith('/aucations', payload)
  })

  it('calls update with id and payload', async () => {
    const mockRes = { status: 'success', message: 'Updated' }
    vi.mocked(apiHelper.put).mockResolvedValue(mockRes)

    const payload = { title: 'Item Updated' }
    const result = await aucationApi.update(1, payload)
    expect(result).toEqual(mockRes)
    expect(apiHelper.put).toHaveBeenCalledWith('/aucations/1', payload)
  })

  it('calls updateCover with id and file', async () => {
    const mockRes = { status: 'success', message: 'Cover Updated' }
    vi.mocked(apiHelper.postMultipart).mockResolvedValue(mockRes)

    const file = new File([''], 'cover.png', { type: 'image/png' })
    const result = await aucationApi.updateCover(1, file)
    expect(result).toEqual(mockRes)
    expect(apiHelper.postMultipart).toHaveBeenCalledWith('/aucations/1/cover', expect.any(FormData))
  })

  it('calls delete with id', async () => {
    const mockRes = { status: 'success', message: 'Deleted' }
    vi.mocked(apiHelper.delete).mockResolvedValue(mockRes)

    const result = await aucationApi.delete(1)
    expect(result).toEqual(mockRes)
    expect(apiHelper.delete).toHaveBeenCalledWith('/aucations/1')
  })

  it('calls deleteAll', async () => {
    const mockRes = { status: 'success', message: 'All Deleted' }
    vi.mocked(apiHelper.delete).mockResolvedValue(mockRes)

    const result = await aucationApi.deleteAll()
    expect(result).toEqual(mockRes)
    expect(apiHelper.delete).toHaveBeenCalledWith('/aucations')
  })

  it('calls addBid with id and bidAmount', async () => {
    const mockRes = { status: 'success', message: 'Bid Placed' }
    vi.mocked(apiHelper.post).mockResolvedValue(mockRes)

    const result = await aucationApi.addBid(1, 50000)
    expect(result).toEqual(mockRes)
    expect(apiHelper.post).toHaveBeenCalledWith('/aucations/1/bids', { bid: 50000 })
  })

  it('calls deleteBid with id', async () => {
    const mockRes = { status: 'success', message: 'Bid Cancelled' }
    vi.mocked(apiHelper.delete).mockResolvedValue(mockRes)

    const result = await aucationApi.deleteBid(1)
    expect(result).toEqual(mockRes)
    expect(apiHelper.delete).toHaveBeenCalledWith('/aucations/1/bids')
  })
})
