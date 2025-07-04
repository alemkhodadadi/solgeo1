// src/api/projects/projects.api.ts
import  apiClient  from '@/api/http'
import type { IProject } from '@/interfaces/app'

export const fetchProjects = () => apiClient.get<IProject[]>('/projects')

export const fetchSingleProject = (id: string) => apiClient.get<IProject>(`/projects/${id}`)

export const getProjectById = (id: string) =>
  apiClient.get<IProject>(`/projects/${id}`)

export const createProject = (payload: IProject) =>
  apiClient.post<IProject>('/projects', payload)
