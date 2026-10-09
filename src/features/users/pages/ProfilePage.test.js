import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ProfilePage from './ProfilePage.vue'
import { useUsersStore } from '../states/usersStore'
import * as toolsHelper from '../../../helpers/toolsHelper'

vi.mock('../../../helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn()
}))

describe('ProfilePage.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders profile data and handles form submission success and failure', async () => {
    const store = useUsersStore()
    store.profile = { id: 1, name: 'John Doe', email: 'john@delcom.org', photo: 'https://example.com/photo.jpg' }
    store.fetchProfile = vi.fn().mockResolvedValue()
    store.changeProfile = vi.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(false)

    const wrapper = mount(ProfilePage)
    await flushPromises()
    expect(wrapper.text()).toContain('Pengaturan Profil')

    const inputName = wrapper.find('input[type="text"]')
    await inputName.setValue('John Updated')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(store.changeProfile).toHaveBeenCalledWith({ name: 'John Updated' })
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalled()

    // Test failure branch
    await form.trigger('submit.prevent')
    expect(toolsHelper.showErrorDialog).toHaveBeenCalled()
  })

  it('renders fallback when profile is null or has empty name, and displays messages', async () => {
    const store = useUsersStore()
    store.profile = null
    store.errorMessage = 'Pesan galat profil'
    store.successMessage = 'Pesan sukses profil'
    store.fetchProfile = vi.fn().mockResolvedValue()

    const wrapper = mount(ProfilePage)
    await flushPromises()
    expect(wrapper.text()).toContain('Pesan galat profil')
    expect(wrapper.text()).toContain('Pesan sukses profil')
    expect(wrapper.text()).toContain('U')

    store.profile = { name: '', photo: null }
    const wrapperEmptyName = mount(ProfilePage)
    await flushPromises()
    expect(wrapperEmptyName.text()).toContain('U')
  })

  it('handles update photo success and failure and null selection', async () => {
    const store = useUsersStore()
    store.profile = { id: 1, name: 'John', photo: null }
    store.fetchProfile = vi.fn()
    store.changePhoto = vi.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(false)

    const wrapper = mount(ProfilePage)

    // Upload with no file selected
    const uploadBtn = wrapper.find('button[type="button"]')
    await uploadBtn.trigger('click')
    expect(store.changePhoto).not.toHaveBeenCalled()

    // Trigger file change with empty files
    const fileInput = wrapper.find('input[type="file"]')
    Object.defineProperty(fileInput.element, 'files', {
      value: [],
      writable: true,
      configurable: true
    })
    await fileInput.trigger('change')

    // Trigger with file
    const file = new File([''], 'test.png', { type: 'image/png' })
    fileInput.element.files = [file]
    await fileInput.trigger('change')

    await uploadBtn.trigger('click')
    expect(store.changePhoto).toHaveBeenCalledWith(file)
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalled()

    // Trigger photo change failure
    fileInput.element.files = [file]
    await fileInput.trigger('change')
    await uploadBtn.trigger('click')
    expect(toolsHelper.showErrorDialog).toHaveBeenCalled()
  })

  it('handles change password successfully and failure', async () => {
    const store = useUsersStore()
    store.profile = { id: 1, name: 'John' }
    store.fetchProfile = vi.fn()
    store.changePassword = vi.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(false)

    const wrapper = mount(ProfilePage)

    const passwordInputs = wrapper.findAll('input[type="password"]')
    await passwordInputs[0].setValue('oldpass')
    await passwordInputs[1].setValue('newpass')

    const passwordForms = wrapper.findAll('form')
    await passwordForms[1].trigger('submit.prevent')

    expect(store.changePassword).toHaveBeenCalledWith({ old_password: 'oldpass', password: 'newpass' })
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalled()

    // Test failure branch
    await passwordForms[1].trigger('submit.prevent')
    expect(toolsHelper.showErrorDialog).toHaveBeenCalled()
  })
})
