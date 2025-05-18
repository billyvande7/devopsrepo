<template>
  <div class="container">
    <div class="login-card card p-4 shadow">
      <h2 class="text-center mb-4">Admin Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <input 
            type="text" 
            id="username" 
            v-model="username"
            class="form-control" 
            placeholder="Username" 
            required
          >
        </div>
        <div class="mb-3">
          <input 
            type="password" 
            id="password" 
            v-model="password"
            class="form-control" 
            placeholder="Password" 
            required
          >
        </div>
        <button 
          type="submit" 
          class="btn btn-primary w-100"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
        <div v-if="error" class="alert alert-danger mt-3">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/auth'

export default {
  name: 'LoginForm',
  setup() {
    const router = useRouter()
    const { login } = useAuth()
    
    const username = ref('')
    const password = ref('')
    const error = ref('')
    const isLoading = ref(false)

    const handleLogin = async () => {
      try {
        error.value = ''
        isLoading.value = true
        await login(username.value, password.value)
        router.push('/shortener')
      } catch (err) {
        console.error('Login form error:', err)
        error.value = err.message || 'Login failed. Please try again.'
      } finally {
        isLoading.value = false
      }
    }

    return {
      username,
      password,
      error,
      isLoading,
      handleLogin
    }
  }
}
</script>

<style scoped>
body { 
  height: 100vh;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
}
.login-card {
  width: 100%;
  max-width: 400px;
  margin: 40px auto;
}
</style> 