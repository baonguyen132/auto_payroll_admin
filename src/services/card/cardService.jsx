import getAuthHeaders, {API_BASE_URL} from '../api'

// Hàm gọi fetch chung
const apiRequest = async (url, options = {}) => {
  const config = {
    headers: getAuthHeaders(),
    ...options
  }

  console.log(API_BASE_URL + url);
  console.log();
  try {
    const res = await fetch(API_BASE_URL + url, config)
    const data = await res.json()
    if (!res.ok) {
      console.error('API Error:', data)
      throw data
    }

    return data
  } catch (error) {
    console.error('Fetch Error:', error)
    throw error
  }
}

const cardService = {
  getCards: () => apiRequest('/cards', { method: 'GET' }),

  getCardsByUserId: (userId) =>
    apiRequest(`/cards/${userId}`, { method: 'GET' }),

  getCardsByUser: (userId) =>
    apiRequest(`/cards/user_id?user_id=${userId}`, { method: 'GET' }),

  createCard: (cardData) =>
    apiRequest('/cards', {
      method: 'POST',
      body: JSON.stringify(cardData)
    }),

  updateCard: (cardId, cardData) =>
    apiRequest('/cards', {
      method: 'PATCH',
      body: JSON.stringify({ id: cardId, ...cardData })
    }),

  deleteCard: (cardId) =>
    apiRequest('/cards', {
      method: 'DELETE',
      body: JSON.stringify({ id: cardId })
    }),

  assignCardToUser: (cardId, userId) =>
    apiRequest('/cards', {
      method: 'PATCH',
      body: JSON.stringify({ id: cardId, user_id: userId })
    }),

  activateCard: (cardId) =>
    apiRequest('/cards', {
      method: 'PATCH',
      body: JSON.stringify({ id: cardId, is_active: true })
    }),

  deactivateCard: (cardId) =>
    apiRequest('/cards', {
      method: 'PATCH',
      body: JSON.stringify({ id: cardId, is_active: false })
    })
}

export default cardService
