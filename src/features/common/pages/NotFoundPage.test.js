import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NotFoundPage from './NotFoundPage.vue'

describe('NotFoundPage.vue', () => {
  it('renders 404 message and return link correctly', () => {
    const wrapper = mount(NotFoundPage, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    expect(wrapper.text()).toContain('404')
    expect(wrapper.text()).toContain('Halaman Tidak Ditemukan')
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('/')
  })
})
