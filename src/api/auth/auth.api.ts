import apiClient from '@/api/http'
import type { UserCredentials, LoginResponse } from './auth.types'

export async function login(credentials: UserCredentials): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
  return response.data
}