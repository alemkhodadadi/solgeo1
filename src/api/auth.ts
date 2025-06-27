import apiClient from '@/api'
import type { UserCredentials, LoginResponse } from '@/interfaces/auth'

export async function login(credentials: UserCredentials): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
  return response.data
}