export const config = {
  // Use empty base URL to make requests relative to current domain
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  endpoints: {
    login: '/api/login',
    shorten: '/api/shorten'
  }
} 