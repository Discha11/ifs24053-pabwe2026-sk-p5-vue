import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'

describe('App.vue', () => {
  it('renders root component successfully', () => {
    const wrapper = mount(App, {
      global: {
        stubs: ['router-view', 'router-link']
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})