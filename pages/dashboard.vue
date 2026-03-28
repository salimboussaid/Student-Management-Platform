<template>
  <div class="space-y-6">
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-3xl font-bold text-black">Dashboard</h1>
        <p class="text-gray-500">Welcome back, {{ profileStore.profile?.name }}. You are controlling all student and project data.</p>
      </div>
      <UButton to="/projects" color="black" icon="i-heroicons-arrow-right-circle">Manage Projects</UButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <UCard>
        <p class="text-sm text-gray-500">Students</p>
        <p class="text-3xl font-bold mt-1">{{ studentStore.students.length }}</p>
      </UCard>
      <UCard>
        <p class="text-sm text-gray-500">Active Students</p>
        <p class="text-3xl font-bold mt-1">{{ activeStudents }}</p>
      </UCard>
      <UCard>
        <p class="text-sm text-gray-500">Projects</p>
        <p class="text-3xl font-bold mt-1">{{ projectStore.projects.length }}</p>
      </UCard>
      <UCard>
        <p class="text-sm text-gray-500">Active Projects</p>
        <p class="text-3xl font-bold mt-1">{{ activeProjects }}</p>
      </UCard>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <p class="font-semibold">Quick Add Student</p>
        </div>
      </template>

      <form class="grid grid-cols-1 md:grid-cols-4 gap-3" @submit.prevent="createStudent">
        <UInput v-model="studentForm.name" placeholder="Student name" required />
        <UInput v-model="studentForm.email" type="email" placeholder="Email" required />
        <UInput v-model="studentForm.grade" placeholder="Grade (A, B+, ...)" required />
        <UCheckbox v-model="studentForm.active" label="Active" />
        <UButton type="submit" color="black" block>Add Student</UButton>
      </form>
    </UCard>

    <UCard>
      <template #header>
        <p class="font-semibold">Quick Add Project</p>
      </template>

      <form class="grid grid-cols-1 md:grid-cols-4 gap-3" @submit.prevent="createProject">
        <UInput v-model="projectForm.title" placeholder="Project title" required />
        <USelect v-model="projectForm.status" :options="statusOptions" />
        <UInput v-model.number="projectForm.progress" type="number" min="0" max="100" placeholder="Progress %" required />
        <UButton type="submit" color="black" block>Add Project</UButton>
      </form>
    </UCard>

    <UCard>
      <template #header>
        <p class="font-semibold">Students Control Panel (Admin)</p>
      </template>

      <div class="space-y-2">
        <div
          v-for="student in studentStore.students"
          :key="student.uuid"
          class="grid grid-cols-1 md:grid-cols-6 gap-2 border border-gray-200 rounded-lg p-3"
        >
          <UInput v-model="student.name" @update:model-value="onUpdateStudent(student)" />
          <UInput v-model="student.email" @update:model-value="onUpdateStudent(student)" />
          <UInput v-model="student.grade" @update:model-value="onUpdateStudent(student)" />
          <UCheckbox
            :model-value="student.active"
            label="Active"
            @update:model-value="(value) => toggleStudentActive(student.uuid, value)"
          />
          <UBadge :color="student.active ? 'green' : 'gray'" variant="soft" class="justify-center">
            {{ student.active ? 'Active' : 'Inactive' }}
          </UBadge>
          <UButton color="red" variant="soft" @click="studentStore.deleteStudent(student.uuid)">Delete</UButton>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <p class="font-semibold">Latest Student History</p>
      </template>
      <div v-if="studentStore.history.length === 0" class="text-sm text-gray-500">
        No activity yet.
      </div>
      <div v-else class="space-y-2 max-h-64 overflow-y-auto">
        <div
          v-for="item in studentStore.history.slice(0, 10)"
          :key="item.id"
          class="border border-gray-200 rounded-lg p-3"
        >
          <p class="text-sm"><strong>{{ item.action }}</strong> - {{ item.studentName }}</p>
          <p class="text-xs text-gray-500">{{ formatDate(item.at) }} by {{ item.by }}</p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useProfileStore } from '~/stores/profile'
import { useProjectStore } from '~/stores/project'
import { useStudentStore } from '~/stores/student'

const profileStore = useProfileStore()
const studentStore = useStudentStore()
const projectStore = useProjectStore()

if (!profileStore.isAuthorized) {
  navigateTo('/login')
}

if (studentStore.students.length === 0) {
  studentStore.$patch({
    students: [
      { uuid: crypto.randomUUID(), name: 'Ahmed Hassan', email: 'ahmed.hassan@example.com', grade: 'A', active: true },
      { uuid: crypto.randomUUID(), name: 'Fatima Zahra', email: 'fatima.z@example.com', grade: 'A-', active: true },
      { uuid: crypto.randomUUID(), name: 'Karim Benzema', email: 'karim.b@example.com', grade: 'B+', active: false }
    ]
  })
}

if (projectStore.projects.length === 0) {
  projectStore.$patch({
    projects: [
      { uuid: crypto.randomUUID(), title: 'Nuxt Migration', status: 'active', progress: 65 },
      { uuid: crypto.randomUUID(), title: 'Exam Analytics', status: 'planned', progress: 15 },
      { uuid: crypto.randomUUID(), title: 'UI Polish', status: 'done', progress: 100 }
    ]
  })
}

const stopProjectSubscription = projectStore.$subscribe((mutation, state) => {
  console.log('Project store update:', mutation.type, state.projects)
})

onBeforeUnmount(() => {
  stopProjectSubscription()
})

const activeProjects = computed(
  () => projectStore.projects.filter((project) => project.status === 'active').length
)

const activeStudents = computed(
  () => studentStore.students.filter((student) => student.active).length
)

const studentForm = ref({
  name: '',
  email: '',
  grade: 'B',
  active: true
})

const projectForm = ref({
  title: '',
  status: 'planned' as 'planned' | 'active' | 'done',
  progress: 0
})

const statusOptions = [
  { label: 'Planned', value: 'planned' },
  { label: 'Active', value: 'active' },
  { label: 'Done', value: 'done' }
]

function createStudent() {
  studentStore.createStudent(studentForm.value)
  studentForm.value = { name: '', email: '', grade: 'B', active: true }
}

function createProject() {
  projectStore.createProject(projectForm.value)
  projectForm.value = { title: '', status: 'planned', progress: 0 }
}

function onUpdateStudent(student: { uuid: string; name: string; email: string; grade: string; active: boolean }) {
  studentStore.updateStudent(student)
}

function toggleStudentActive(uuid: string, value: boolean | undefined) {
  studentStore.setStudentActive(uuid, Boolean(value))
}

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}
</script>
