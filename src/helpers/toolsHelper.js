import Swal from 'sweetalert2'

export const showSuccessDialog = (message, title = 'Berhasil') => {
  return Swal.fire({
    icon: 'success',
    title,
    text: message,
    confirmButtonColor: '#3b82f6'
  })
}

export const showErrorDialog = (message, title = 'Terjadi Kesalahan') => {
  return Swal.fire({
    icon: 'error',
    title,
    text: message,
    confirmButtonColor: '#ef4444'
  })
}

export const showWarningDialog = (message, title = 'Peringatan') => {
  return Swal.fire({
    icon: 'warning',
    title,
    text: message,
    confirmButtonColor: '#f59e0b'
  })
}

export const showConfirmDialog = async (message, title = 'Apakah Anda yakin?') => {
  const result = await Swal.fire({
    icon: 'question',
    title,
    text: message,
    showCancelButton: true,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal'
  })
  return result.isConfirmed
}

export const formatRupiah = (amount) => {
  const num = Number(amount)
  if (isNaN(num)) return 'Rp 0'
  return `Rp ${num.toLocaleString('id-ID')}`
}

export const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date)
  } catch {
    return dateString
  }
}

export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const toolsHelper = {
  showSuccessDialog,
  showErrorDialog,
  showWarningDialog,
  showConfirmDialog,
  formatRupiah,
  formatDate,
  formatCurrency: formatRupiah,
  formatDateTime: formatDate,
  truncateText
}