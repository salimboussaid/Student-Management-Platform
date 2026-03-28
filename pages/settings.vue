<template>
  <div class="space-y-6 max-w-3xl">
    <div>
      <h1 class="text-3xl font-bold text-black">Settings</h1>
      <p class="text-gray-500">Update your profile and maintain store data.</p>
    </div>

    <UCard>
      <template #header>
        <p class="font-semibold">Profile Settings</p>
      </template>

      <form class="space-y-3" @submit.prevent="saveProfile">
        <UInput v-model="profileForm.name" placeholder="Name" required />
        <UInput v-model="profileForm.email" type="email" placeholder="Email" required />
        <UInput v-model="profileForm.role" placeholder="Role" required />
        <div class="flex gap-3 flex-wrap">
          <UButton type="submit" color="black">Save with $patch</UButton>
          <UButton type="button" color="red" variant="soft" @click="logout">Logout</UButton>
        </div>
      </form>
    </UCard>

    <UCard>
      <template #header>
        <p class="font-semibold">Maintenance</p>
      </template>

      <div class="space-y-4">
        <p class="text-sm text-gray-500">Clear data from student/project stores.</p>
        <div class="flex gap-3 flex-wrap">
          <UButton color="orange" variant="soft" @click="clearStudents">Clear Students</UButton>
          <UButton color="orange" variant="soft" @click="clearProjects">Clear Projects</UButton>
          <UButton color="red" variant="outline" @click="clearAll">Clear All</UButton>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <p class="font-semibold">Subscription Log</p>
      </template>
      <p class="text-sm text-gray-500">Last mutation: {{ lastMutation }}</p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useProfileStore } from '~/stores/profile'
import { useProjectStore } from '~/stores/project'
import { useStudentStore } from '~/stores/student'

const profileStore = useProfileStore()
const studentStore = useStudentStore()
const projectStore = useProjectStore()

if (!profileStore.isAuthorized) {
  navigateTo('/login')
}

const profileForm = ref({
  name: profileStore.profile?.name ?? '',
  email: profileStore.profile?.email ?? '',
  role: profileStore.profile?.role ?? 'User'
})

watch(
  () => profileStore.profile,
  (profile) => {
    if (!profile) {
      return
    }

    profileForm.value = {
      name: profile.name,
      email: profile.email,
      role: profile.role
    }
  },
  { deep: true }
)

const lastMutation = ref('No updates yet')

const stopProfileSubscription = profileStore.$subscribe((mutation) => {
  lastMutation.value = `${mutation.storeId} -> ${mutation.type} @ ${new Date().toLocaleTimeString()}`
})

onBeforeUnmount(() => {
  stopProfileSubscription()
})

function saveProfile() {
  if (!profileStore.profile) {
    return
  }

  profileStore.$patch({
    profile: {
      ...profileStore.profile,
      ...profileForm.value
    }
  })
}

function clearStudents() {
  studentStore.$patch({ students: [] })
}

function clearProjects() {
  projectStore.$patch({ projects: [] })
}

function clearAll() {
  studentStore.$patch({ students: [] })
  projectStore.$patch({ projects: [] })
}

function logout() {
  profileStore.deleteProfile()
  navigateTo('/login')
}
</script>
