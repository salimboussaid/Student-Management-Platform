import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useActivityLogStore } from './activityLog'
import { useEducationPlanStore } from './educationPlan'

export interface Profile {
  uuid: string
  name: string
  email: string
  role: string
  avatarUrl?: string
}

export const useProfileStore = defineStore(
  'profile',
  () => {
    const profile = ref<Profile | null>(null)

    const isAuthorized = computed(() => profile.value !== null)
    const isAdmin = computed(() => profile.value?.role === 'Admin')
    const isTeacher = computed(() => profile.value?.role === 'Teacher')
    const isStudent = computed(() => profile.value?.role === 'Student')

    function createProfile(payload: Omit<Profile, 'uuid'> & { uuid?: string }) {
      profile.value = {
        uuid: payload.uuid ?? crypto.randomUUID(),
        name: payload.name,
        email: payload.email,
        role: payload.role,
        avatarUrl: payload.avatarUrl
      }

      // Log login activity
      const activityLogStore = useActivityLogStore()
      activityLogStore.addLog({
        action: 'login',
        entityType: 'User',
        entityName: payload.name,
        userId: profile.value.uuid,
        userName: payload.name,
        details: `User ${payload.name} logged in as ${payload.role}`
      })

      // Initialize education plan for student
      if (payload.role === 'Student') {
        const educationPlanStore = useEducationPlanStore()
        educationPlanStore.getOrCreatePlan(profile.value.uuid)
      }
    }

    function updateProfile(payload: Partial<Omit<Profile, 'uuid'>>) {
      if (!profile.value) {
        return
      }

      const oldData = { ...profile.value }
      profile.value = {
        ...profile.value,
        ...payload
      }

      // Log profile update
      const activityLogStore = useActivityLogStore()
      activityLogStore.addLog({
        action: 'update',
        entityType: 'Profile',
        entityName: profile.value.name,
        userId: profile.value.uuid,
        userName: profile.value.name,
        details: `Profile updated`
      })
    }

    function logout() {
      if (!profile.value) return

      // Log logout activity
      const activityLogStore = useActivityLogStore()
      activityLogStore.addLog({
        action: 'logout',
        entityType: 'User',
        entityName: profile.value.name,
        userId: profile.value.uuid,
        userName: profile.value.name,
        details: `User ${profile.value.name} logged out`
      })

      profile.value = null
    }

    function deleteProfile() {
      profile.value = null
    }

    return {
      profile,
      isAuthorized,
      isAdmin,
      isTeacher,
      isStudent,
      createProfile,
      updateProfile,
      logout,
      deleteProfile
    }
  },
  {
    persist: true
  }
)
