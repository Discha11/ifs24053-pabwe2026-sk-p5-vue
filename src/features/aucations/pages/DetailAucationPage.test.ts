import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import DetailAucationPage from './DetailAucationPage.vue'
import { useAucationsStore } from '../states/aucationsStore'

vi.mock('vue-router', () => ({
    useRoute: () => ({ params: { id: '1' } })
}))

vi.mock('../states/aucationsStore', () => ({
    useAucationsStore: vi.fn()
}))

describe('DetailAucationPage.vue', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    it('renders auction detail correctly', () => {
        vi.mocked(useAucationsStore).mockReturnValue({
            loading: false,
            currentAucation: {
                id: 1,
                title: 'Detail Barang',
                description: 'Deskripsi detail',
                start_bid: 15000,
                closed_at: '2026-12-31 23:59:59',
                bids: []
            },
            fetchAucationDetail: vi.fn()
        } as any)

        const wrapper = mount(DetailAucationPage)
        expect(wrapper.text()).toContain('Detail Barang')
        expect(wrapper.text()).toContain('Deskripsi detail')
    })
})