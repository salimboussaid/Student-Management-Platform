<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">My Projects & Tasks</h1>
      <p class="text-gray-600 mt-1">Manage your projects, tasks, and deadlines</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Active Projects</h3>
        </template>
        <div class="text-3xl font-bold text-blue-600">{{ activeProjects.length }}</div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Completed Projects</h3>
        </template>
        <div class="text-3xl font-bold text-green-600">{{ completedProjects.length }}</div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Pending Tasks</h3>
        </template>
        <div class="text-3xl font-bold text-orange-600">{{ pendingTaskCount }}</div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Completed Tasks</h3>
        </template>
        <div class="text-3xl font-bold text-green-600">{{ completedTaskCount }}</div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Overdue Tasks</h3>
        </template>
        <div class="text-3xl font-bold text-red-600">{{ overdueTaskCount }}</div>
      </UCard>
    </div>

    <!-- Add Project -->
    <UCard>
      <template #header>
        <h2 class="text-lg font-semibold">Create New Project</h2>
      </template>

      <form @submit.prevent="addProject" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UFormGroup label="Project Title">
          <UInput
            v-model="newProject.title"
            placeholder="Project name"
            required
          />
        </UFormGroup>

        <UFormGroup label="Discipline">
          <UInput
            v-model="newProject.discipline"
            placeholder="Related discipline"
            required
          />
        </UFormGroup>

        <UFormGroup label="Teacher">
          <UInput
            v-model="newProject.teacher"
            placeholder="Supervising teacher"
            required
          />
        </UFormGroup>

        <UFormGroup label="Start Date" class="md:col-span-2">
          <UInput
            v-model="newProject.startDate"
            type="date"
            required
          />
        </UFormGroup>

        <UFormGroup label="End Date">
          <UInput
            v-model="newProject.endDate"
            type="date"
            required
          />
        </UFormGroup>

        <UFormGroup label="Description" class="md:col-span-3">
          <UTextarea
            v-model="newProject.description"
            placeholder="Project description"
          />
        </UFormGroup>

        <div class="md:col-span-3">
          <UButton type="submit" color="green" block>
            Create Project
          </UButton>
        </div>
      </form>
    </UCard>

    <!-- Projects List -->
    <div v-if="studentProjects.length > 0" class="space-y-4">
      <h2 class="text-xl font-bold text-gray-900">Your Projects</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UCard
          v-for="project in studentProjects"
          :key="project.id"
          class="hover:shadow-lg transition"
        >
          <template #header>
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ project.title }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ project.discipline }}</p>
              </div>
              <div>
                <UBadge
                  :color="getStatusColor(project.status)"
                  variant="soft"
                >
                  {{ project.status }}
                </UBadge>
              </div>
            </div>
          </template>

          <div class="space-y-3">
            <p class="text-sm text-gray-600">{{ project.description }}</p>

            <div>
              <p class="text-xs font-medium text-gray-700 mb-1">Progress</p>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full bg-blue-600 transition-all"
                  :style="{ width: project.progress + '%' }"
                />
              </div>
              <p class="text-xs text-gray-600 mt-1">{{ project.progress }}% complete</p>
            </div>

            <div class="flex justify-between text-xs text-gray-600">
              <span>Teacher: {{ project.teacher }}</span>
              <span>Due: {{ formatDate(project.endDate) }}</span>
            </div>

            <div class="flex gap-2">
              <UButton
                @click="showProjectTasks(project.id)"
                size="sm"
                color="blue"
                variant="soft"
                block
              >
                View Tasks ({{ getProjectTasksCount(project.id) }})
              </UButton>
              <UButton
                @click="deleteProject(project.id)"
                size="sm"
                color="red"
                variant="soft"
                icon="i-heroicons-trash"
              />
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Selected Project Tasks -->
    <div v-if="selectedProjectId" class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">
          Tasks for: {{ getSelectedProject?.title }}
        </h2>
        <UButton
          @click="selectedProjectId = null"
          color="gray"
          variant="soft"
          size="sm"
        >
          Close
        </UButton>
      </div>

      <!-- Add Task -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Add New Task</h3>
        </template>

        <form @submit.prevent="addTask" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UFormGroup label="Task Title" class="md:col-span-2">
            <UInput
              v-model="newTask.title"
              placeholder="Task description"
              required
            />
          </UFormGroup>

          <UFormGroup label="Priority">
            <USelect
              v-model="newTask.priority"
              :options="['Low', 'Medium', 'High']"
              placeholder="Select priority"
            />
          </UFormGroup>

          <UFormGroup label="Due Date" class="md:col-span-2">
            <UInput
              v-model="newTask.dueDate"
              type="date"
              required
            />
          </UFormGroup>

          <UFormGroup label="Description">
            <UTextarea
              v-model="newTask.description"
              placeholder="Task details"
            />
          </UFormGroup>

          <div class="md:col-span-3">
            <UButton type="submit" color="green" block>
              Add Task
            </UButton>
          </div>
        </form>
      </UCard>

      <!-- Tasks List -->
      <div class="space-y-3">
        <div
          v-for="task in getSelectedProjectTasks"
          :key="task.id"
          class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <UCheckbox
                  :model-value="task.completed"
                  @update:model-value="toggleTaskCompletion(task.id)"
                  size="lg"
                />
                <div>
                  <h4 :class="['font-semibold', task.completed && 'line-through text-gray-400']">
                    {{ task.title }}
                  </h4>
                  <p v-if="task.description" class="text-sm text-gray-600 mt-1">
                    {{ task.description }}
                  </p>
                </div>
              </div>

              <div class="flex gap-2 mt-2">
                <UBadge
                  :color="getPriorityColor(task.priority)"
                  variant="soft"
                  size="sm"
                >
                  {{ task.priority }}
                </UBadge>
                <UBadge
                  :color="isDueToday(task.dueDate) ? 'red' : 'gray'"
                  variant="soft"
                  size="sm"
                >
                  Due: {{ formatDate(task.dueDate) }}
                </UBadge>
              </div>
            </div>

            <UButton
              @click="deleteTask(task.id)"
              color="red"
              variant="soft"
              size="sm"
              icon="i-heroicons-trash"
            />
          </div>
        </div>

        <div v-if="getSelectedProjectTasks.length === 0" class="text-center py-8">
          <p class="text-gray-500">No tasks yet. Create one to get started!</p>
        </div>
      </div>
    </div>

    <div v-else-if="studentProjects.length === 0" class="text-center py-12">
      <p class="text-gray-500">No projects yet. Create one to get started!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStudentProjectsStore } from '~/stores/studentProjects'
import { useProfileStore } from '~/stores/profile'
import { computed, ref } from 'vue'

const projectsStore = useStudentProjectsStore()
const profileStore = useProfileStore()

const selectedProjectId = ref<string | null>(null)
const today = new Date()

// New project form
const newProject = ref({
  title: '',
  description: '',
  discipline: '',
  teacher: '',
  startDate: today.toISOString().split('T')[0],
  endDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  documentUrl: ''
})

// New task form
const newTask = ref({
  title: '',
  description: '',
  dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  priority: 'Medium' as 'Low' | 'Medium' | 'High'
})

const studentProjects = computed(() => {
  const uuid = profileStore.profile?.uuid
  if (!uuid) return []
  return projectsStore.getStudentProjects(uuid)
})

const activeProjects = computed(() =>
  studentProjects.value.filter(p => p.status !== 'Completed')
)

const completedProjects = computed(() =>
  studentProjects.value.filter(p => p.status === 'Completed')
)

const pendingTaskCount = computed(() => {
  const uuid = profileStore.profile?.uuid
  if (!uuid) return 0
  return projectsStore.getPendingTaskCount(uuid)
})

const completedTaskCount = computed(() => {
  const uuid = profileStore.profile?.uuid
  if (!uuid) return 0
  return projectsStore.getCompletedTaskCount(uuid)
})

const overdueTaskCount = computed(() => {
  const uuid = profileStore.profile?.uuid
  if (!uuid) return 0
  return projectsStore.getOverdueTaskCount(uuid)
})

const getSelectedProject = computed(() => {
  if (!selectedProjectId.value) return null
  return studentProjects.value.find(p => p.id === selectedProjectId.value)
})

const getSelectedProjectTasks = computed(() => {
  if (!selectedProjectId.value) return []
  return projectsStore.getProjectTasks(selectedProjectId.value)
})

function getProjectTasksCount(projectId: string): number {
  return projectsStore.getProjectTasks(projectId).length
}

function getStatusColor(status: string): any {
  switch (status) {
    case 'Completed':
      return 'green'
    case 'In Progress':
      return 'blue'
    default:
      return 'gray'
  }
}

function getPriorityColor(priority: string): any {
  switch (priority) {
    case 'High':
      return 'red'
    case 'Medium':
      return 'orange'
    case 'Low':
      return 'green'
    default:
      return 'gray'
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString()
}

function isDueToday(dueDate: string): boolean {
  const due = new Date(dueDate)
  return due < today
}

function showProjectTasks(projectId: string) {
  selectedProjectId.value = projectId
}

function addProject() {
  const uuid = profileStore.profile?.uuid
  if (!uuid) return

  projectsStore.createProject({
    studentUuid: uuid,
    title: newProject.value.title,
    description: newProject.value.description,
    discipline: newProject.value.discipline,
    teacher: newProject.value.teacher,
    startDate: newProject.value.startDate,
    endDate: newProject.value.endDate,
    documentUrl: newProject.value.documentUrl
  })

  newProject.value = {
    title: '',
    description: '',
    discipline: '',
    teacher: '',
    startDate: today.toISOString().split('T')[0],
    endDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    documentUrl: ''
  }
}

function deleteProject(projectId: string) {
  if (confirm('Are you sure? This will delete all associated tasks.')) {
    projectsStore.deleteProject(projectId)
    if (selectedProjectId.value === projectId) {
      selectedProjectId.value = null
    }
  }
}

function addTask() {
  if (!selectedProjectId.value) return

  const uuid = profileStore.profile?.uuid
  if (!uuid) return

  projectsStore.createTask({
    studentUuid: uuid,
    projectUuid: selectedProjectId.value,
    title: newTask.value.title,
    description: newTask.value.description,
    dueDate: newTask.value.dueDate,
    priority: newTask.value.priority
  })

  newTask.value = {
    title: '',
    description: '',
    dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'Medium'
  }
}

function deleteTask(taskId: string) {
  if (confirm('Delete this task?')) {
    projectsStore.deleteTask(taskId)
  }
}

function toggleTaskCompletion(taskId: string) {
  projectsStore.toggleTaskCompletion(taskId)
}
</script>
