import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi } from '@/api/auth/auth.api'
import type { Project } from '@/api/projects/projects.types'
import { fetchProjects, fetchSingleProject } from '@/api/projects/projects.api'

export const useProjectStore = defineStore('project', () => {

    // State
    const projects = ref(<Project[]>([]))
    const currentProject = ref<Project | null>(null)
    const loadingProjects = ref(false)
    const loadingProject = ref(false)
    const error = ref<string | null>(null)

    // Actions
    async function getProjects() {
        loadingProjects.value = true
        try {
            const response = await fetchProjects()
            projects.value = response.data
        } catch (err) {
            if (err instanceof Error) {
                error.value = err.message
            } else {
                error.value = String(err)
            }
            throw err // re-throw if needed
        } finally {
            loadingProjects.value = false
        }
    }

    async function getSingleProject(id: string){
        loadingProject.value = true
        try {
            const response = await fetchSingleProject(id)
            currentProject.value = response.data
        } catch (err) {
            if (err instanceof Error) {
                error.value = err.message
            } else {
                error.value = String(err)
            }
            throw err // re-throw if needed
        } finally {
            loadingProject.value = false
        }
    }

    return {
        projects,
        currentProject,
        getProjects,
        getSingleProject,
        loadingProject, 
        loadingProjects
    }
})
