import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/auth'
import LoginForm from '@/components/LoginForm.vue'
import Shortener from '@/components/Shortener.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm,
    meta: { requiresGuest: true }
  },
  {
    path: '/shortener',
    name: 'Shortener',
    component: Shortener,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth()
  const auth = isAuthenticated()

  if (to.meta.requiresAuth && !auth) {
    next('/login')
  } else if (to.meta.requiresGuest && auth) {
    next('/shortener')
  } else {
    next()
  }
})

export default router 