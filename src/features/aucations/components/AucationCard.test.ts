import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AucationCard from './AucationCard.vue'

describe('AucationCard.vue', () => {
    const mockItem = {
        id: 1,
        title: 'Barang Lelang Test',
        description: 'Deskripsi barang lelang test',
        start_bid: 50000,
        closed_at: '2026-12-31 23:59:59',
        cover: 'http://example.com/image.png',
        author: { name: 'Discha' }
    }

    it('renders auction card details correctly', () => {
        const wrapper = mount(AucationCard, {
            props: { item: mockItem }
        })

        expect(wrapper.text()).toContain('Barang Lelang Test')
        expect(wrapper.text()).toContain('Deskripsi barang lelang test')
        expect(wrapper.text()).toContain('Discha')
    })

    it('emits delete event when delete button is clicked', async () => {
        const wrapper = mount(AucationCard, {
            props: { item: mockItem }
        })

        const deleteButton = wrapper.findAll('button').find(b => b.text() === 'Hapus')
        await deleteButton?.trigger('click')

        expect(wrapper.emitted('delete')).toBeTruthy()
        expect(wrapper.emitted('delete')?.[0]).toEqual([1])
    })

    it('emits detail event when detail button is clicked', async () => {
        const wrapper = mount(AucationCard, {
            props: { item: mockItem }
        })

        const detailButton = wrapper.findAll('button').find(b => b.text() === 'Detail')
        await detailButton?.trigger('click')

        expect(wrapper.emitted('detail')).toBeTruthy()
        expect(wrapper.emitted('detail')?.[0]).toEqual([1])
    })
})