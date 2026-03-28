import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface StudentTask {
  id: string
  studentUuid: string
  projectUuid: string
  title: string
  description: string
  dueDate: string
  completed: boolean
  priority: 'Low' | 'Medium' | 'High'
  createdAt: string
  completedAt?: string
}

export interface StudentProject {
  id: string
  studentUuid: string
  title: string
  description: string
  discipline: string
  teacher: string
  startDate: string
  endDate: string
  progress: number // 0-100
  status: 'Not Started' | 'In Progress' | 'Completed'
  documentUrl?: string
  submittedAt?: string
}

export const useStudentProjectsStore = defineStore(
  'studentProjects',
  () => {
    const projects = ref<StudentProject[]>([])
    const tasks = ref<StudentTask[]>([])

    function getStudentProjects(studentUuid: string) {
      return projects.value.filter(p => p.studentUuid === studentUuid)
    }

    function getStudentTasks(studentUuid: string) {
      return tasks.value.filter(t => t.studentUuid === studentUuid)
    }

    function getProjectTasks(projectUuid: string) {
      return tasks.value.filter(t => t.projectUuid === projectUuid)
    }

    const getProjectProgress = (projectUuid: string): number => {
      const projectTasks = getProjectTasks(projectUuid)
      if (projectTasks.length === 0) return 0
      const completedCount = projectTasks.filter(t => t.completed).length
      return Math.round((completedCount / projectTasks.length) * 100)
    }

    function createProject(payload: Omit<StudentProject, 'id' | 'progress' | 'status'>) {
      const newProject: StudentProject = {
        id: crypto.randomUUID(),
        ...payload,
        progress: 0,
        status: 'Not Started'
      }
      projects.value.push(newProject)
      return newProject
    }

    function updateProject(id: string, payload: Partial<Omit<StudentProject, 'id'>>) {
      const index = projects.value.findIndex(p => p.id === id)
      if (index === -1) return

      projects.value[index] = {
        ...projects.value[index],
        ...payload
      }
    }

    function deleteProject(id: string) {
      const index = projects.value.findIndex(p => p.id === id)
      if (index === -1) return

      projects.value.splice(index, 1)
      // Also delete all tasks for this project
      tasks.value = tasks.value.filter(t => t.projectUuid !== id)
    }

    function createTask(payload: Omit<StudentTask, 'id' | 'createdAt' | 'completed'>) {
      const newTask: StudentTask = {
        id: crypto.randomUUID(),
        ...payload,
        createdAt: new Date().toISOString(),
        completed: false
      }
      tasks.value.push(newTask)
      return newTask
    }

    function updateTask(id: string, payload: Partial<Omit<StudentTask, 'id' | 'createdAt'>>) {
      const index = tasks.value.findIndex(t => t.id === id)
      if (index === -1) return

      tasks.value[index] = {
        ...tasks.value[index],
        ...payload
      }

      // Update project progress when task is completed
      if (payload.completed !== undefined) {
        const task = tasks.value[index]
        const project = projects.value.find(p => p.id === task.projectUuid)
        if (project) {
          project.progress = getProjectProgress(task.projectUuid)
          if (project.progress === 100) {
            project.status = 'Completed'
          } else if (project.progress > 0) {
            project.status = 'In Progress'
          }
        }
      }
    }

    function deleteTask(id: string) {
      const index = tasks.value.findIndex(t => t.id === id)
      if (index === -1) return

      const projectUuid = tasks.value[index].projectUuid
      tasks.value.splice(index, 1)

      // Update project progress
      const project = projects.value.find(p => p.id === projectUuid)
      if (project) {
        project.progress = getProjectProgress(projectUuid)
      }
    }

    function toggleTaskCompletion(id: string) {
      const task = tasks.value.find(t => t.id === id)
      if (task) {
        task.completed = !task.completed
        if (task.completed) {
          task.completedAt = new Date().toISOString()
        } else {
          task.completedAt = undefined
        }
        updateTask(id, { completed: task.completed, completedAt: task.completedAt })
      }
    }

    function getCompletedTaskCount(studentUuid: string): number {
      return getStudentTasks(studentUuid).filter(t => t.completed).length
    }

    function getPendingTaskCount(studentUuid: string): number {
      return getStudentTasks(studentUuid).filter(t => !t.completed).length
    }

    function getOverdueTaskCount(studentUuid: string): number {
      const now = new Date()
      return getStudentTasks(studentUuid).filter(
        t => !t.completed && new Date(t.dueDate) < now
      ).length
    }

    return {
      projects,
      tasks,
      getStudentProjects,
      getStudentTasks,
      getProjectTasks,
      getProjectProgress,
      createProject,
      updateProject,
      deleteProject,
      createTask,
      updateTask,
      deleteTask,
      toggleTaskCompletion,
      getCompletedTaskCount,
      getPendingTaskCount,
      getOverdueTaskCount
    }
  },
  { persist: true }
)
