import { ref } from 'vue'
import { config } from '@/config/env'

const token = ref(null)
const expiresAt = ref(null)

export function useAuth() {
  const getStoredAuth = () => {
    const stored = localStorage.getItem('authToken')
    if (!stored) return null

    try {
      const { token: storedToken, expiresAt: storedExpiry } = JSON.parse(stored)
      if (new Date().getTime() > storedExpiry) {
        localStorage.removeItem('authToken')
        return null
      }
      return { token: storedToken, expiresAt: storedExpiry }
    } catch {
      localStorage.removeItem('authToken')
      return null
    }
  }

  const saveToken = (newToken) => {
    const expirationTime = new Date().getTime() + (30 * 60 * 1000) // 30 minutes
    token.value = newToken
    expiresAt.value = expirationTime
    
    localStorage.setItem('authToken', JSON.stringify({
      token: newToken,
      expiresAt: expirationTime
    }))
  }

  const login = async (username, password) => {
    try {
      console.log('Attempting login with:', { username, endpoint: config.endpoints.login });
      
      const response = await fetch(config.endpoints.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({ username, password })
      });

      console.log('Login response status:', response.status);
      
      const data = await response.json().catch(e => {
        console.error('Error parsing response:', e);
        return null;
      });
      
      console.log('Login response data:', data);

      if (!response.ok) {
        throw new Error(data?.message || `Login failed with status ${response.status}`);
      }

      if (!data || !data.token) {
        throw new Error('No token received in response');
      }

      saveToken(data.token);
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      throw error;
    }
  }

  const logout = () => {
    token.value = null
    expiresAt.value = null
    localStorage.removeItem('authToken')
  }

  const isAuthenticated = () => {
    const auth = getStoredAuth()
    return !!auth?.token
  }

  const authenticatedFetch = async (url, options = {}) => {
    const auth = getStoredAuth()
    if (!auth?.token) {
      logout()
      throw new Error('Not authenticated')
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${auth.token}`,
          'Accept': 'application/json',
        },
        credentials: 'include',
        mode: 'cors'
      })

      if (response.status === 401) {
        logout()
        throw new Error('Session expired')
      }

      return response
    } catch (error) {
      console.error('API call error:', error)
      throw error
    }
  }

  // Initialize from storage
  const stored = getStoredAuth()
  if (stored) {
    token.value = stored.token
    expiresAt.value = stored.expiresAt
  }

  return {
    token,
    expiresAt,
    login,
    logout,
    isAuthenticated,
    authenticatedFetch
  }
} 