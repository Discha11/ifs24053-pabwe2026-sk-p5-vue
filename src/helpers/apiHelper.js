export const getAccessToken = () => {
  return localStorage.getItem('token') || ''
}

export const putAccessToken = (token) => {
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

const getBaseUrl = () => {
  return DELCOM_BASEURL
}

const getHeaders = (isMultipart = false) => {
  const token = getAccessToken()
  const headers = {
    Accept: 'application/json'
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json'
  }
  return headers
}

const buildUrl = (endpoint, params = {}) => {
  const baseUrl = `${getBaseUrl()}${endpoint}`
  if (!params || Object.keys(params).length === 0) {
    return baseUrl
  }
  const queryParams = new URLSearchParams()
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null) {
      queryParams.append(key, String(val))
    }
  }
  const queryString = queryParams.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

export const apiHelper = {
  async get(endpoint, params = {}) {
    const url = buildUrl(endpoint, params)
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(false)
    })
    return await response.json()
  },

  async post(endpoint, bodyData) {
    const response = await fetch(`${getBaseUrl()}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(bodyData)
    })
    return await response.json()
  },

  async postMultipart(endpoint, formData) {
    const response = await fetch(`${getBaseUrl()}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    })
    return await response.json()
  },

  async put(endpoint, bodyData) {
    const response = await fetch(`${getBaseUrl()}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(false),
      body: JSON.stringify(bodyData)
    })
    return await response.json()
  },

  async delete(endpoint) {
    const response = await fetch(`${getBaseUrl()}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(false)
    })
    return await response.json()
  }
}