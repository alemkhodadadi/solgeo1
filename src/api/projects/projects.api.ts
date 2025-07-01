// src/api/projects/projects.api.ts
import  apiClient  from '@/api/http'
import type { Project } from './projects.types'

export const getProjects = () => apiClient.get<Project[]>('/projects')

export const getProjectById = (id: string) =>
  apiClient.get<Project>(`/projects/${id}`)

export const createProject = (payload: Project) =>
  apiClient.post<Project>('/projects', payload)
