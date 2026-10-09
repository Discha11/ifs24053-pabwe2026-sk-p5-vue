import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AucationLayout from './AucationLayout.vue'

describe('AucationLayout.vue', () => {
  it('renders navbar, sidebar, and router-view correctly', async () => {
    const wrapper = mount(AucationLayout, {
      global: {
        stubs: {
          NavbarComponent: {
            template: '<header><button @click="$emit(\'toggleSidebar\')">Toggle</button></header>'
          },
          SidebarComponent: {
            props: ['isOpen'],
            template: '<aside><button @click="$emit(\'close\')">Close</button></aside>'
          },
          RouterView: true
        }
      }
    })

    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('aside').exists()).toBe(true)

    // Test toggle sidebar
    const toggleBtn = wrapper.find('header button')
    await toggleBtn.trigger('click')

    // Test close sidebar
    const closeBtn = wrapper.find('aside button')
    await closeBtn.trigger('click')
  })
})
