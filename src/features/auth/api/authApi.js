const getBaseUrl = () => {
  return DELCOM_BASEURL
}

export const authApi = {
  async login(payload) {
    const response = await fetch(`${getBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    return await response.json()
  },

  async register(payload) {
    const response = await fetch(`${getBaseUrl()}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    return await response.json()
  },

  async getMe() {
    const token = localStorage.getItem('token') || ''
    const response = await fetch(`${getBaseUrl()}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    return await response.json()
  }
}