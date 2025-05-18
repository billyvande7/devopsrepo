<template>
  <div class="shortener-container card p-4 shadow">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>URL Shortener</h2>
      <button @click="handleLogout" class="btn btn-sm btn-outline-danger">Logout</button>
    </div>
    
    <form @submit.prevent="handleShorten">
      <div class="mb-3">
        <input 
          type="url" 
          v-model="longUrl"
          class="form-control" 
          placeholder="Enter long URL" 
          required
        >
      </div>
      <div class="mb-3">
        <input 
          type="text" 
          v-model="customKey"
          class="form-control" 
          placeholder="Custom key (optional)"
        >
      </div>
      <button class="btn btn-primary w-100" type="submit">Shorten URL</button>
    </form>
    
    <div v-if="shortenedUrl" class="mt-4">
      <div class="card bg-light">
        <div class="card-body">
          <h6 class="card-subtitle mb-2 text-muted">Shortened URL:</h6>
          <div class="d-flex align-items-center">
            <a :href="shortenedUrl" target="_blank" class="me-2 text-break flex-grow-1">{{ shortenedUrl }}</a>
            <button @click="copyUrl" class="btn btn-sm btn-outline-secondary">
              {{ copyButtonText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/auth'
import { config } from '@/config/env'

export default {
  name: 'Shortener',
  setup() {
    const router = useRouter()
    const { logout, authenticatedFetch } = useAuth()
    
    const longUrl = ref('')
    const customKey = ref('')
    const shortenedUrl = ref('')
    const copyButtonText = ref('Copy')

    const handleLogout = () => {
      logout()
      router.push('/login')
    }

    const handleShorten = async () => {
      try {
        const response = await authenticatedFetch(config.endpoints.shorten, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: longUrl.value,
            customKey: customKey.value || undefined
          })
        })

        if (response.ok) {
          const data = await response.json()
          shortenedUrl.value = data.shortenedUrl || data.shortUrl || data.url
          // Clear inputs after successful shortening
          longUrl.value = ''
          customKey.value = ''
        } else {
          const error = await response.json().catch(() => ({ message: 'Error shortening URL' }))
          console.error('Shorten error:', error)
          alert(error.message || 'Error shortening URL')
        }
      } catch (error) {
        console.error('Shortening error:', error)
        alert('Error shortening URL. Please try again.')
      }
    }

    const copyUrl = async () => {
      try {
        await navigator.clipboard.writeText(shortenedUrl.value)
        copyButtonText.value = 'Copied!'
        setTimeout(() => {
          copyButtonText.value = 'Copy'
        }, 2000)
      } catch (error) {
        console.error('Copy error:', error)
        alert('Failed to copy URL')
      }
    }

    return {
      longUrl,
      customKey,
      shortenedUrl,
      copyButtonText,
      handleLogout,
      handleShorten,
      copyUrl
    }
  }
}
</script>

<style scoped>
.shortener-container {
  max-width: 600px;
  margin: 40px auto;
}

.card-body {
  word-break: break-all;
}
</style> 