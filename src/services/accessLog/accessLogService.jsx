import getAuthHeaders, {API_BASE_URL} from "../api"

const apiRequest = async (url, options = {}) => {
  const config = {
    headers: getAuthHeaders(),
    ...options
  }

  try {
    const res = await fetch(API_BASE_URL + url, config)
    const data = await res.json()

    if (!res.ok) throw data
    return data
  } catch (error) {
    console.error('Fetch Error:', error)
    throw error
  }
}

const accessLogService = {
  getLogs: () => apiRequest('/access-logs', { method: 'GET' }),

  getLogsByUserId: (userId) =>
    apiRequest(`/access-logs/${userId}`, { method: 'GET' }),

  createLog: (logData) =>
    apiRequest('/access-log', {
      method: 'POST',
      body: JSON.stringify(logData)
    })
}

export default accessLogService