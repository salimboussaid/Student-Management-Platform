<template>
  <div class="space-y-6">
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-3xl font-bold text-black">Projects</h1>
        <p class="text-gray-500">CRUD page for the project store.</p>
      </div>
      <UButton to="/dashboard" color="gray" variant="soft">Back to Dashboard</UButton>
    </div>

    <UCard>
      <template #header>
        <p class="font-semibold">Create Project</p>
      </template>

      <form class="grid grid-cols-1 md:grid-cols-4 gap-3" @submit.prevent="onCreate">
        <UInput v-model="form.title" placeholder="Title" required />
        <USelect v-model="form.status" :options="statusOptions" />
        <UInput v-model.number="form.progress" type="number" min="0" max="100" placeholder="Progress" required />
        <UButton type="submit" color="black" block>Create</UButton>
      </form>
    </UCard>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <UCard v-for="project in projectStore.projects" :key="project.uuid">
        <template #header>
          <div class="flex items-center justify-between gap-2">
            <UInput v-model="project.title" @update:model-value="onUpdate(project)" />
            <UButton color="red" variant="soft" @click="projectStore.deleteProject(project.uuid)">Delete</UButton>
          </div>
        </template>

        <div class="space-y-2">
          <USelect v-model="project.status" :options="statusOptions" @update:model-value="onUpdate(project)" />
          <UInput v-model.number="project.progress" type="number" min="0" max="100" @update:model-value="onUpdate(project)" />
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-black transition-all" :style="{ width: `${project.progress}%` }"></div>
          </div>
          <p class="text-xs text-gray-500">{{ project.progress }}% complete</p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useProfileStore } from '~/stores/profile'
import { type ProjectItem, useProjectStore } from '~/stores/project'

const profileStore = useProfileStore()
const projectStore = useProjectStore()

if (!profileStore.isAuthorized) {
  navigateTo('/login')
}

const form = ref({
  title: '',
  status: 'planned' as 'planned' | 'active' | 'done',
  progress: 0
})

const statusOptions = [
  { label: 'Planned', value: 'planned' },
  { label: 'Active', value: 'active' },
  { label: 'Done', value: 'done' }
]

function onCreate() {
  projectStore.createProject(form.value)
  form.value = {
    title: '',
    status: 'planned',
    progress: 0
  }
}

function onUpdate(project: ProjectItem) {
  projectStore.updateProject(project)
}
</script>
