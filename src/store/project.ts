import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi } from '@/api/auth/auth.api'
import type { Project } from '@/api/projects/projects.types'
import { fetchProjects, fetchSingleProject } from '@/api/projects/projects.api'
import { delay } from '@/utils/commonMethods'


export const useProjectStore = defineStore('project', () => {

    // State
    const projects = ref(<Project[]>([]))
    const currentProject = ref<Project | null>(null)
    const loadingProjects = ref(false)
    const selectedProjectId = ref('')
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

    async function getCurrentProject(id: string){
        selectedProjectId.value = id
        try {
            await delay(2000)
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
            selectedProjectId.value = ''
        }
    }

    function unsetCurrentProject(){
        currentProject.value = null
    }

    return {
        projects,
        currentProject,
        getProjects,
        getCurrentProject,
        selectedProjectId, 
        loadingProjects,
        unsetCurrentProject
    }
}, {
  persist: true 
})
