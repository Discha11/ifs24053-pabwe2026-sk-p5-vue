import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import NavbarComponent from './NavbarComponent.vue'
import { useAuthStore } from '../../auth/states/authStore'
import * as toolsHelper from '../../../helpers/toolsHelper'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush })
}))

vi.mock('../../../helpers/toolsHelper', () => ({
  showConfirmDialog: vi.fn()
}))

describe('NavbarComponent.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders brand and user identity correctly', () => {
    const authStore = useAuthStore()
    authStore.user = { name: 'Budi Santoso', email: 'budi@delcom.org', photo: 'https://example.com/budi.jpg' }

    const wrapper = mount(NavbarComponent)

    expect(wrapper.text()).toContain('Delcom Auction')
    expect(wrapper.text()).toContain('Budi Santoso')
    expect(wrapper.text()).toContain('budi@delcom.org')
  })

  it('renders avatar fallback when photo is null', () => {
    const authStore = useAuthStore()
    authStore.user = { name: 'Andi', email: 'andi@delcom.org', photo: null }

    const wrapper = mount(NavbarComponent)

    expect(wrapper.text()).toContain('A')

    authStore.user = { name: '', email: '', photo: null }
    const wrapperEmpty = mount(NavbarComponent)
    expect(wrapperEmpty.text()).toContain('U')
    expect(wrapperEmpty.text()).toContain('Pengguna')
  })

  it('handles logout confirmation', async () => {
    const authStore = useAuthStore()
    authStore.logout = vi.fn()
    vi.mocked(toolsHelper.showConfirmDialog).mockResolvedValue(true)

    const wrapper = mount(NavbarComponent)
    const logoutBtn = wrapper.find('button.text-red-700')
    await logoutBtn.trigger('click')

    expect(toolsHelper.showConfirmDialog).toHaveBeenCalled()
    expect(authStore.logout).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/auth/login')
  })

  it('does not logout if confirmation is cancelled', async () => {
    const authStore = useAuthStore()
    authStore.logout = vi.fn()
    vi.mocked(toolsHelper.showConfirmDialog).mockResolvedValue(false)

    const wrapper = mount(NavbarComponent)
    const logoutBtn = wrapper.find('button.text-red-700')
    await logoutBtn.trigger('click')

    expect(authStore.logout).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('emits toggleSidebar event on hamburger click', async () => {
    const wrapper = mount(NavbarComponent)
    const toggleBtn = wrapper.find('button[aria-label="Toggle Sidebar"]')
    await toggleBtn.trigger('click')

    expect(wrapper.emitted('toggleSidebar')).toBeTruthy()
  })
})
