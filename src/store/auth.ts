import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthenticatedUser, UserCredentials } from '@/interfaces/auth'
import { login as loginApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthenticatedUser | null>(null)
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))

  const isAuthenticated = computed(() => !!accessToken.value)

  async function login(credentials: UserCredentials) {
    try {
      const response = await loginApi(credentials)
      console.log('Login successful:', response)
    //   user.value = response
      accessToken.value = response.token

      localStorage.setItem('accessToken', response.token)
    } catch (error) {
      throw error // Let component handle errors
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
    logout,
  }
}, {
  persist: true 
})
