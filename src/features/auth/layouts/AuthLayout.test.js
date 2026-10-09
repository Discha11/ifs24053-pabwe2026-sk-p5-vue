import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuthLayout from './AuthLayout.vue'

describe('AuthLayout.vue', () => {
  it('renders auth layout elements correctly', () => {
    const wrapper = mount(AuthLayout, {
      global: {
        stubs: ['router-view']
      }
    })

    expect(wrapper.text()).toContain('Delcom Portal')
    expect(wrapper.text()).toContain('Silakan masuk atau daftar untuk melanjutkan')
  })
})