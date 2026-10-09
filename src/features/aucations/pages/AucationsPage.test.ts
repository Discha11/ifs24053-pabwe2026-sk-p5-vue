import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import AucationsPage from './AucationsPage.vue'
import { useAucationsStore } from '../states/aucationsStore'

vi.mock('../states/aucationsStore', () => ({
    useAucationsStore: vi.fn()
}))

describe('AucationsPage.vue', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    it('renders loading or empty state correctly', () => {
        vi.mocked(useAucationsStore).mockReturnValue({
            aucations: [],
            loading: false,
            errorMessage: '',
            successMessage: '',
            fetchAucations: vi.fn(),
            removeAucation: vi.fn()
        } as any)

        const wrapper = mount(AucationsPage)
        expect(wrapper.text()).toContain('Daftar Pelelangan Barang')
        expect(wrapper.text()).toContain('Belum ada data lelang yang tersedia.')
    })
})