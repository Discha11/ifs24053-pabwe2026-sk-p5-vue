import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import UsersPage from './UsersPage.vue'
import { useUsersStore } from '../states/usersStore'

describe('UsersPage.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders users list when data is available', async () => {
    const store = useUsersStore()
    store.users = [
      { id: 1, name: 'Alice', email: 'alice@delcom.org', photo: 'https://example.com/alice.jpg' },
      { id: 2, name: 'Bob', email: 'bob@delcom.org', photo: null },
      { id: 3, name: '', email: 'unknown@delcom.org', photo: null }
    ]
    store.loading = false

    const wrapper = mount(UsersPage)

    expect(wrapper.text()).toContain('Direktori Pengguna')
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('Bob')
    expect(wrapper.text()).toContain('U')
    expect(wrapper.text()).toContain('alice@delcom.org')
  })

  it('renders loading and error state properly', async () => {
    const store = useUsersStore()
    store.loading = true
    store.errorMessage = 'Gagal memuat'

    const wrapper = mount(UsersPage)

    expect(wrapper.text()).toContain('Gagal memuat')
    expect(wrapper.text()).toContain('Memuat daftar pengguna...')
  })

  it('renders empty state when users array is empty', async () => {
    const store = useUsersStore()
    store.users = []
    store.loading = false

    const wrapper = mount(UsersPage)

    expect(wrapper.text()).toContain('Belum ada data pengguna.')
  })
})
