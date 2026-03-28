import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface ProjectItem {
  uuid: string
  title: string
  status: 'planned' | 'active' | 'done'
  progress: number
}

export const useProjectStore = defineStore(
  'project',
  () => {
    const projects = ref<ProjectItem[]>([])

    function createProject(payload: Omit<ProjectItem, 'uuid'> & { uuid?: string }) {
      projects.value.push({
        uuid: payload.uuid ?? crypto.randomUUID(),
        title: payload.title,
        status: payload.status,
        progress: payload.progress
      })
    }

    function updateProject(updatedProject: ProjectItem) {
      const index = projects.value.findIndex((project) => project.uuid === updatedProject.uuid)
      if (index === -1) {
        return
      }

      projects.value[index] = updatedProject
    }

    function deleteProject(uuid: string) {
      const index = projects.value.findIndex((project) => project.uuid === uuid)
      if (index === -1) {
        return
      }

      projects.value.splice(index, 1)
    }

    return {
      projects,
      createProject,
      updateProject,
      deleteProject
    }
  },
  {
    persist: true
  }
)
