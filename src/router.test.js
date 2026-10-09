import { describe, it, expect, vi, beforeEach } from 'vitest'
import router from './router'
import * as apiHelper from './helpers/apiHelper'

describe('router.js navigation guard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('redirects to /auth/login if unauthenticated and route requires auth', async () => {
    vi.spyOn(apiHelper, 'getAccessToken').mockReturnValue(null)

    await router.push('/aucations')
    expect(router.currentRoute.value.path).toBe('/auth/login')
  })

  it('redirects to /aucations if authenticated and navigating to /auth/login', async () => {
    vi.spyOn(apiHelper, 'getAccessToken').mockReturnValue('valid-token')

    await router.push('/users')
    await router.push('/auth/login')
    expect(router.currentRoute.value.path).toBe('/aucations')
  })

  it('redirects to /aucations if authenticated and navigating to /auth/register', async () => {
    vi.spyOn(apiHelper, 'getAccessToken').mockReturnValue('valid-token')

    await router.push('/auth/register')
    expect(router.currentRoute.value.path).toBe('/aucations')
  })

  it('allows navigation to protected route if authenticated', async () => {
    vi.spyOn(apiHelper, 'getAccessToken').mockReturnValue('valid-token')

    await router.push('/users')
    expect(router.currentRoute.value.path).toBe('/users')

    await router.push('/profile')
    expect(router.currentRoute.value.path).toBe('/profile')
  })

  it('navigates to NotFound for unknown routes', async () => {
    vi.spyOn(apiHelper, 'getAccessToken').mockReturnValue('valid-token')

    await router.push('/unknown-page-route')
    expect(router.currentRoute.value.name).toBe('NotFound')
  })
})
