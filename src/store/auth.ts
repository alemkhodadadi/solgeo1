import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthenticatedUser, UserCredentials } from '@/interfaces/auth'
import { login as loginApi } from '@/api/auth/auth.api'

export const useAuthStore = defineStore('auth', () => {

  // State
  const user = ref<AuthenticatedUser | null>(null)
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const isAuthenticated = computed(() => !!accessToken.value)
  const login_loading = ref(false)

  // Actions
  async function login(credentials: UserCredentials) {
    login_loading.value = true
    try {
      const response = await loginApi(credentials)
      accessToken.value = response.token
      localStorage.setItem('accessToken', response.token)
    } catch (error) {
      throw error // Let component handle errors
    } finally {
      setTimeout(() => {
        login_loading.value = false
      }, 2000) // Simulate network delay;
    }
  }

  function logout() {
    user.value = null
    accessToken.value = null
    localStorage.removeItem('accessToken')
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    login,
    login_loading,
    logout,
  }
}, {
  persist: true 
})
