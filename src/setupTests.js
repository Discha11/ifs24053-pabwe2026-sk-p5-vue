import { beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

// Membersihkan localStorage dan mock secara global sebelum setiap pengujian
beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})