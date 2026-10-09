import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'

export function createMockPinia(initialState = {}) {
  const pinia = createPinia()
  setActivePinia(pinia)
  if (initialState && Object.keys(initialState).length > 0) {
    pinia.state.value = { ...pinia.state.value, ...initialState }
  }
  return pinia
}

export function renderWithProviders(component, options = {}) {
  const pinia = options.pinia || createMockPinia(options.initialState)
  const router = options.router || createRouter({
    history: createMemoryHistory(),
    routes: options.routes || [
      { path: '/', component: { template: '<div>Home</div>' } },
      { path: '/auth/login', component: { template: '<div>Login</div>' } }
    ]
  })

  const wrapper = mount(component, {
    ...options,
    global: {
      plugins: [pinia, router],
      stubs: {
        RouterLink: true,
        RouterView: true,
        ...(options.global?.stubs || {})
      },
      mocks: {
        ...(options.global?.mocks || {})
      },
      ...(options.global || {})
    }
  })

  return {
    wrapper,
    router,
    pinia
  }
}