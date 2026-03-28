<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-4">
        <UCard>
          <template #header>
            <p class="font-semibold">User Information</p>
          </template>

          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <UAvatar
                v-if="profileStore.profile?.avatarUrl"
                :src="profileStore.profile.avatarUrl"
                :alt="profileStore.profile?.name"
                size="xl"
              />
              <div
                v-else
                class="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold"
              >
                {{ initials }}
              </div>
              <div>
                <p class="text-sm text-gray-500">Administrator profile</p>
                <UBadge color="green" variant="soft">{{ profileStore.profile?.role }}</UBadge>
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              class="text-sm"
              @change="onAvatarUpload"
            >

            <p><span class="text-gray-500">Name:</span> <strong>{{ profileStore.profile?.name }}</strong></p>
            <p><span class="text-gray-500">Email:</span> <strong>{{ profileStore.profile?.email }}</strong></p>
            <p><span class="text-gray-500">UUID:</span> <strong>{{ profileStore.profile?.uuid }}</strong></p>
          </div>
        </UCard>
      </div>

      <div class="lg:col-span-8 space-y-6">
        <div>
          <h1 class="text-3xl font-bold text-black">Profile</h1>
          <p class="text-gray-500">Salim is admin and can control all student/project operations.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UCard>
            <p class="text-sm text-gray-500">Students in store</p>
            <p class="text-2xl font-bold mt-1">{{ studentStore.students.length }}</p>
          </UCard>
          <UCard>
            <p class="text-sm text-gray-500">Active students</p>
            <p class="text-2xl font-bold mt-1">{{ activeStudentsCount }}</p>
          </UCard>
          <UCard>
            <p class="text-sm text-gray-500">Projects in store</p>
            <p class="text-2xl font-bold mt-1">{{ projectStore.projects.length }}</p>
          </UCard>
        </div>

        <UCard>
          <template #header>
            <p class="font-semibold">Student History (Admin)</p>
          </template>

          <div v-if="studentStore.history.length === 0" class="text-sm text-gray-500">
            No student actions yet.
          </div>
          <div v-else class="space-y-2 max-h-72 overflow-y-auto">
            <div
              v-for="item in studentStore.history.slice(0, 20)"
              :key="item.id"
              class="border border-gray-200 rounded-lg p-3"
            >
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm">
                  <strong class="uppercase">{{ item.action }}</strong> - {{ item.studentName }}
                </p>
                <p class="text-xs text-gray-500">{{ formatDate(item.at) }}</p>
              </div>
              <p class="text-xs text-gray-500 mt-1">By: {{ item.by }}</p>
            </div>
          </div>
        </UCard>

        <div class="flex flex-wrap gap-3">
          <UButton to="/dashboard" color="black" icon="i-heroicons-chart-bar-square">Go to Dashboard</UButton>
          <UButton to="/settings" color="gray" variant="soft" icon="i-heroicons-cog-6-tooth">Open Settings</UButton>
          <UButton to="/projects" color="gray" variant="outline" icon="i-heroicons-rectangle-group">Open Projects</UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProfileStore } from '~/stores/profile'
import { useProjectStore } from '~/stores/project'
import { useStudentStore } from '~/stores/student'

const profileStore = useProfileStore()
const studentStore = useStudentStore()
const projectStore = useProjectStore()

if (!profileStore.isAuthorized) {
  navigateTo('/login')
}

const initials = computed(() => {
  const source = profileStore.profile?.name ?? 'SU'
  return source
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
})

const activeStudentsCount = computed(
  () => studentStore.students.filter((student) => student.active).length
)

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

function onAvatarUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file || !profileStore.profile) {
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    profileStore.$patch({
      profile: {
        ...profileStore.profile,
        avatarUrl: String(reader.result)
      }
    })
  }
  reader.readAsDataURL(file)
}
</script>
