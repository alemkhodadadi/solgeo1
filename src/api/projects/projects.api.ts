// src/api/projects/projects.api.ts
import  apiClient  from '@/api/http'
import type { Project } from './projects.types'

export const fetchProjects = () => apiClient.get<Project[]>('/projects')

export const fetchSingleProject = (id: string) => apiClient.get<Project>(`/projects/${id}`)

export const getProjectById = (id: string) =>
  apiClient.get<Project>(`/projects/${id}`)

export const createProject = (payload: Project) =>
  apiClient.post<Project>('/projects', payload)
