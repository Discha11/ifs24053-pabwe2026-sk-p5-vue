import { describe, it, expect, vi, beforeEach } from 'vitest'
import Swal from 'sweetalert2'
import {
  toolsHelper,
  showSuccessDialog,
  showErrorDialog,
  showWarningDialog,
  showConfirmDialog,
  formatRupiah,
  formatDate,
  truncateText
} from './toolsHelper'

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn()
  }
}))

describe('toolsHelper', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('formats rupiah correctly', () => {
    expect(formatRupiah(50000)).toBe('Rp 50.000')
    expect(formatRupiah('100000')).toBe('Rp 100.000')
    expect(formatRupiah('invalid')).toBe('Rp 0')
    expect(toolsHelper.formatCurrency(50000)).toBe('Rp 50.000')
  })

  it('formats date correctly', () => {
    expect(formatDate('')).toBe('-')
    expect(formatDate('invalid-date')).toBe('invalid-date')

    const dateStr = '2026-12-31T23:59:59'
    const result = formatDate(dateStr)
    expect(result).toContain('2026')
    expect(toolsHelper.formatDateTime(dateStr)).toContain('2026')

    vi.spyOn(Intl, 'DateTimeFormat').mockImplementationOnce(function () {
      throw new Error('Intl error')
    })
    expect(formatDate('2026-01-01')).toBe('2026-01-01')
  })

  it('truncates text correctly', () => {
    expect(truncateText('Halo dunia', 4)).toBe('Halo...')
    expect(truncateText('Pendek', 10)).toBe('Pendek')
    expect(truncateText('', 5)).toBe('')
  })

  it('triggers showSuccessDialog, showErrorDialog, and showWarningDialog', () => {
    showSuccessDialog('Operasi berhasil')
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'success', text: 'Operasi berhasil' }))

    showErrorDialog('Terjadi galat')
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'error', text: 'Terjadi galat' }))

    showWarningDialog('Peringatan')
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'warning', text: 'Peringatan' }))
  })

  it('triggers showConfirmDialog correctly', async () => {
    vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: true })
    const confirmed = await showConfirmDialog('Yakin?')
    expect(confirmed).toBe(true)

    vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: false })
    const cancelled = await showConfirmDialog('Yakin?')
    expect(cancelled).toBe(false)
  })
})