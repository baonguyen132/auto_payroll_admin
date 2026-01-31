// Application Constants
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'BLOCKCHAIN Admin'

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData'
}

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ADMIN: '/admin',
  EMPLOYEE_MANAGEMENT: '/admin/employee-management',
  CARDS: '/admin/cards',
  USERS: '/admin/users',
  HISTORY_ACCESS: '/admin/history-access',
  ETH_WALLET_HISTORY: '/admin/eth-wallet-history',
  SHOP: '/admin/shop'
}

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
}

// Date Format Options
export const DATE_FORMAT_OPTIONS = {
  vi: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
}

// Status Labels
export const STATUS_LABELS = {
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Không hoạt động'
}

// Status Colors
export const STATUS_COLORS = {
  ACTIVE: {
    bg: 'bg-green-100',
    text: 'text-green-800'
  },
  INACTIVE: {
    bg: 'bg-red-100',
    text: 'text-red-800'
  }
}

