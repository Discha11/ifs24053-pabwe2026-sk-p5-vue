import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SidebarComponent from './SidebarComponent.vue'

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ path: '/', query: {} })),
  RouterLink: {
    template: '<a :href="to"><slot /></a>',
    props: ['to']
  }
}))

describe('SidebarComponent.vue', () => {
  it('renders navigation links properly', () => {
    const wrapper = mount(SidebarComponent, {
      props: { isOpen: false }
    })

    expect(wrapper.text()).toContain('Dashboard Lelang')
    expect(wrapper.text()).toContain('Daftar Pengguna')
    expect(wrapper.text()).toContain('Profil Saya')
  })

  it('handles drawer open state and close emission', async () => {
    const wrapper = mount(SidebarComponent, {
      props: { isOpen: true }
    })

    const backdrop = wrapper.find('.fixed.inset-0')
    expect(backdrop.exists()).toBe(true)
    await backdrop.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()

    const closeBtn = wrapper.find('button[aria-label="Close Sidebar"]')
    await closeBtn.trigger('click')
    expect(wrapper.emitted('close').length).toBe(2)
  })

  it('emits close when router links are clicked', async () => {
    const wrapper = mount(SidebarComponent, {
      props: { isOpen: true }
    })

    const links = wrapper.findAll('a')
    for (const link of links) {
      await link.trigger('click')
    }
    expect(wrapper.emitted('close').length).toBe(links.length)
  })
})
