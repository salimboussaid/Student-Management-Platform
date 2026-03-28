<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Welcome, {{ profileStore.profile?.name }}!</h1>
        <p class="text-gray-600 mt-1">Here's an overview of your academic progress</p>
      </div>
      <div v-if="profileStore.profile?.avatarUrl" class="w-16 h-16">
        <img :src="profileStore.profile.avatarUrl" alt="Profile" class="w-16 h-16 rounded-full object-cover" />
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Active Projects</h3>
        </template>
        <div class="text-3xl font-bold text-blue-600">{{ activeProjectsCount }}</div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Pending Tasks</h3>
        </template>
        <div class="text-3xl font-bold text-orange-600">{{ pendingTaskCount }}</div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Class This Week</h3>
        </template>
        <div class="text-3xl font-bold text-purple-600">{{ weekClassCount }}</div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Average Grade</h3>
        </template>
        <div class="text-3xl font-bold text-green-600">{{ averageGrade }}%</div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Overdue Tasks</h3>
        </template>
        <div :class="['text-3xl font-bold', overdueCount > 0 ? 'text-red-600' : 'text-green-600']">
          {{ overdueCount }}
        </div>
      </UCard>
    </div>

    <!-- Quick Action Buttons -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
      <UButton to="/student-projects" color="blue" block>
        📋 My Projects
      </UButton>
      <UButton to="/schedule" color="purple" block>
        📅 My Schedule
      </UButton>
      <UButton to="/grades" color="green" block>
        📊 My Grades
      </UButton>
      <UButton to="/education-plan" color="indigo" block>
        📚 Education Plan
      </UButton>
    </div>

    <!-- Recent Projects -->
    <div v-if="recentProjects.length > 0" class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">Recent Projects</h2>
        <NuxtLink to="/student-projects" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All →
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UCard v-for="project in recentProjects.slice(0, 2)" :key="project.id">
          <template #header>
            <div class="flex items-start justify-between">
              <h3 class="font-semibold text-gray-900">{{ project.title }}</h3>
              <UBadge :color="getStatusColor(project.status)" variant="soft">
                {{ project.status }}
              </UBadge>
            </div>
          </template>

          <div class="space-y-3">
            <p class="text-sm text-gray-600">{{ project.discipline }}</p>

            <div>
              <p class="text-xs font-medium text-gray-700 mb-1">Progress</p>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full bg-blue-600"
                  :style="{ width: project.progress + '%' }"
                />
              </div>
              <p class="text-xs text-gray-600 mt-1">{{ project.progress }}% complete</p>
            </div>

            <p class="text-xs text-gray-500">Due: {{ formatDate(project.endDate) }}</p>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Upcoming Classes -->
    <div v-if="upcomingClasses.length > 0" class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">Upcoming Classes</h2>
        <NuxtLink to="/schedule" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View Schedule →
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UCard v-for="cls in upcomingClasses.slice(0, 2)" :key="cls.id">
          <div class="flex items-start justify-between">
            <div>
              <h4 class="font-semibold text-gray-900">{{ cls.subject }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ cls.startTime }} - {{ cls.endTime }}</p>
              <p class="text-xs text-gray-500 mt-2">Room: {{ cls.room }}</p>
              <p class="text-xs text-gray-500">Teacher: {{ cls.teacher }}</p>
            </div>
            <UBadge color="blue" variant="soft">{{ cls.type }}</UBadge>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Pending Tasks -->
    <div v-if="pendingTasks.length > 0" class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">Pending Tasks</h2>
        <NuxtLink to="/student-projects" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All →
        </NuxtLink>
      </div>

      <div class="space-y-2">
        <div
          v-for="task in pendingTasks.slice(0, 5)"
          :key="task.id"
          class="p-3 border border-gray-200 rounded-lg flex items-start gap-3 hover:bg-gray-50"
        >
          <UCheckbox
            :model-value="task.completed"
            @update:model-value="toggleTask(task.id)"
            size="lg"
          />
          <div class="flex-1">
            <h4 class="font-medium text-gray-900">{{ task.title }}</h4>
            <p class="text-sm text-gray-600 mt-0.5">Due: {{ formatDate(task.dueDate) }}</p>
          </div>
          <UBadge :color="getPriorityColor(task.priority)" variant="soft" size="sm">
            {{ task.priority }}
          </UBadge>
        </div>
      </div>
    </div>

    <!-- Recent Grades -->
    <div v-if="recentGrades.length > 0" class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">Recent Grades</h2>
        <NuxtLink to="/grades" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All →
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <UCard v-for="grade in recentGrades.slice(0, 3)" :key="grade.id">
          <template #header>
            <h4 class="font-semibold text-gray-900">{{ grade.discipline }}</h4>
          </template>

          <div class="space-y-2">
            <div class="flex items-baseline justify-between">
              <span class="text-sm text-gray-600">Points</span>
              <span class="text-lg font-bold">{{ grade.totalPoints }}/{{ grade.maxPoints }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="h-2 rounded-full"
                :style="{
                  width: getPercentage(grade) + '%',
                  backgroundColor: getPercentageColor(grade)
                }"
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-600">{{ getPercentage(grade) }}%</span>
              <UBadge :color="getAchievementColor(grade.achievement)" variant="soft" size="sm">
                {{ grade.achievement }}
              </UBadge>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="recentProjects.length === 0 && pendingTasks.length === 0 && recentGrades.length === 0"
      class="text-center py-12 text-gray-500">
      <p>No data available yet. Start by exploring the menu options above!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'
import { useStudentProjectsStore } from '~/stores/studentProjects'
import { useScheduleStore } from '~/stores/schedule'
import { useGradesStore } from '~/stores/grades'
import { computed, ref } from 'vue'

const profileStore = useProfileStore()
const projectsStore = useStudentProjectsStore()
const scheduleStore = useScheduleStore()
const gradesStore = useGradesStore()

const studentUuid = computed(() => profileStore.profile?.uuid || '')

const recentProjects = computed(() => {
  if (!studentUuid.value) return []
  return projectsStore.getStudentProjects(studentUuid.value).sort((a, b) =>
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )
})

const activeProjectsCount = computed(() =>
  recentProjects.value.filter(p => p.status !== 'Completed').length
)

const allTasks = computed(() => {
  if (!studentUuid.value) return []
  return projectsStore.getStudentTasks(studentUuid.value)
})

const pendingTasks = computed(() =>
  allTasks.value.filter(t => !t.completed)
)

const pendingTaskCount = computed(() => pendingTasks.value.length)

const overdueCount = computed(() => {
  const now = new Date()
  return pendingTasks.value.filter(t => new Date(t.dueDate) < now).length
})

const upcomingClasses = computed(() => {
  if (!studentUuid.value) return []
  return scheduleStore.getStudentSchedule(studentUuid.value)
})

const weekClassCount = computed(() => {
  const now = new Date()
  const currentDayOfWeek = now.getDay()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - currentDayOfWeek + 1)

  return upcomingClasses.value.filter(cls => {
    const clsDate = new Date(weekStart)
    clsDate.setDate(weekStart.getDate() + cls.dayOfWeek)
    return clsDate >= weekStart && clsDate <= new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
  }).length
})

const recentGrades = computed(() => {
  if (!studentUuid.value) return []
  return gradesStore.getStudentGrades(studentUuid.value)
})

const averageGrade = computed(() => {
  if (recentGrades.value.length === 0) return 0
  const total = recentGrades.value.reduce((sum, g) => sum + getPercentage(g), 0)
  return Math.round(total / recentGrades.value.length)
})

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
      return 'amber'
    case 'Low':
      return 'green'
    default:
      return 'gray'
  }
}

function getAchievementColor(achievement: string): any {
  switch (achievement) {
    case 'Excellent':
      return 'green'
    case 'Good':
      return 'blue'
    case 'Pass':
      return 'amber'
    case 'Test':
      return 'orange'
    case 'Failed':
      return 'red'
    default:
      return 'gray'
  }
}

function getPercentage(grade: any): number {
  return Math.round((grade.totalPoints / grade.maxPoints) * 100)
}

function getPercentageColor(grade: any): string {
  const pct = getPercentage(grade)
  if (pct >= 90) return '#10b981'
  if (pct >= 80) return '#3b82f6'
  if (pct >= 70) return '#f59e0b'
  if (pct >= 50) return '#ef4444'
  return '#7f1d1d'
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString()
}

function toggleTask(taskId: string) {
  projectsStore.toggleTaskCompletion(taskId)
}
</script>
