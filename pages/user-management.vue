<template>
  <div v-if="profileStore.isAdmin" class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
      <p class="text-gray-600 mt-1">Create and manage system users and their roles</p>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Total Users</h3>
        </template>
        <div class="text-3xl font-bold text-blue-600">{{ usersStore.totalUsers }}</div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Students</h3>
        </template>
        <div class="text-3xl font-bold text-green-600">{{ usersStore.totalStudents }}</div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Teachers</h3>
        </template>
        <div class="text-3xl font-bold text-blue-600">{{ usersStore.totalTeachers }}</div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Admin</h3>
        </template>
        <div class="text-3xl font-bold text-purple-600">{{ usersStore.totalAdmins }}</div>
      </UCard>
    </div>

    <!-- Create User -->
    <UCard>
      <template #header>
        <h2 class="text-lg font-semibold">Create New User</h2>
      </template>

      <form @submit.prevent="createNewUser" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UFormGroup label="Full Name">
          <UInput
            v-model="createUserForm.name"
            placeholder="User full name"
            required
          />
        </UFormGroup>

        <UFormGroup label="Email">
          <UInput
            v-model="createUserForm.email"
            type="email"
            placeholder="user@example.com"
            required
          />
        </UFormGroup>

        <UFormGroup label="Password">
          <UInput
            v-model="createUserForm.password"
            type="password"
            placeholder="Set password"
            required
          />
        </UFormGroup>

        <UFormGroup label="Role">
          <USelect
            v-model="createUserForm.role"
            :options="['Student', 'Teacher', 'Admin']"
            placeholder="Select role"
          />
        </UFormGroup>

        <div class="md:col-span-3">
          <UButton type="submit" color="green" block>
            Create User
          </UButton>
        </div>
      </form>

      <template v-if="createUserMessage" #footer>
        <div :class="['text-sm', createUserError ? 'text-red-600' : 'text-green-600']">
          {{ createUserMessage }}
        </div>
      </template>
    </UCard>

    <!-- Users Table -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">All Users</h2>
          <span class="text-sm text-gray-500">{{ usersStore.users.length }} total</span>
        </div>
      </template>

      <div class="space-y-4">
        <!-- Role Filter -->
        <div>
          <UFormGroup label="Filter by Role">
            <USelect
              v-model="selectedRole"
              :options="['All', 'Student', 'Teacher', 'Admin']"
              placeholder="Filter by role"
            />
          </UFormGroup>
        </div>

        <!-- Users List -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b border-gray-200">
              <tr class="text-left">
                <th class="pb-3 font-semibold text-gray-700">Name</th>
                <th class="pb-3 font-semibold text-gray-700">Email</th>
                <th class="pb-3 font-semibold text-gray-700">Role</th>
                <th class="pb-3 font-semibold text-gray-700">Created</th>
                <th class="pb-3 font-semibold text-gray-700">Status</th>
                <th class="pb-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in filteredUsers"
                :key="user.uuid"
                class="border-b border-gray-100 hover:bg-gray-50"
              >
                <td class="py-3 font-medium text-gray-900">{{ user.name }}</td>
                <td class="py-3 text-gray-600">{{ user.email }}</td>
                <td class="py-3">
                  <UBadge :color="getRoleColor(user.role)" variant="soft">
                    {{ user.role }}
                  </UBadge>
                </td>
                <td class="py-3 text-gray-600 text-xs">{{ formatDate(user.createdAt) }}</td>
                <td class="py-3">
                  <UBadge :color="user.active ? 'green' : 'red'" variant="soft">
                    {{ user.active ? 'Active' : 'Inactive' }}
                  </UBadge>
                </td>
                <td class="py-3 flex gap-2">
                  <UButton
                    @click="toggleUserStatus(user.uuid)"
                    :color="user.active ? 'red' : 'green'"
                    variant="soft"
                    size="sm"
                  >
                    {{ user.active ? 'Deactivate' : 'Activate' }}
                  </UButton>
                  <UButton
                    @click="deleteUser(user.uuid)"
                    color="red"
                    variant="soft"
                    size="sm"
                    icon="i-heroicons-trash"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </UCard>
  </div>

  <div v-else class="text-center py-12">
    <p class="text-gray-500 text-lg">Access denied. Only administrators can view this page.</p>
  </div>
</template>

<script setup lang="ts">
import { useUsersStore } from '~/stores/users'
import { useProfileStore } from '~/stores/profile'
import { computed, ref } from 'vue'

const usersStore = useUsersStore()
const profileStore = useProfileStore()

const selectedRole = ref('All')
const createUserMessage = ref('')
const createUserError = ref(false)

const createUserForm = ref({
  name: '',
  email: '',
  password: '',
  role: 'Student' as 'Student' | 'Teacher' | 'Admin'
})

const filteredUsers = computed(() => {
  if (selectedRole.value === 'All') {
    return usersStore.users
  }
  return usersStore.users.filter(u => u.role === selectedRole.value)
})

function getRoleColor(role: string): any {
  switch (role) {
    case 'Admin':
      return 'purple'
    case 'Teacher':
      return 'blue'
    case 'Student':
      return 'green'
    default:
      return 'gray'
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString()
}

function createNewUser() {
  createUserMessage.value = ''
  createUserError.value = false

  // Validation
  if (!createUserForm.value.name || !createUserForm.value.email || !createUserForm.value.password) {
    createUserMessage.value = 'All fields are required'
    createUserError.value = true
    return
  }

  // Check if email exists
  if (usersStore.findUserByEmail(createUserForm.value.email)) {
    createUserMessage.value = 'Email already exists'
    createUserError.value = true
    return
  }

  // Create user
  try {
    usersStore.createUser({
      name: createUserForm.value.name,
      email: createUserForm.value.email,
      password: createUserForm.value.password,
      role: createUserForm.value.role,
      avatarUrl: ''
    })

    createUserMessage.value = `User "${createUserForm.value.name}" created successfully!`
    createUserForm.value = {
      name: '',
      email: '',
      password: '',
      role: 'Student'
    }

    setTimeout(() => {
      createUserMessage.value = ''
    }, 3000)
  } catch (err) {
    createUserMessage.value = 'Error creating user'
    createUserError.value = true
  }
}

function toggleUserStatus(uuid: string) {
  usersStore.toggleUserActive(uuid)
}

function deleteUser(uuid: string) {
  // Don't allow deleting the current logged-in user
  if (uuid === profileStore.profile?.uuid) {
    alert('You cannot delete your own account')
    return
  }

  if (confirm('Are you sure you want to delete this user?')) {
    usersStore.deleteUser(uuid)
  }
}
</script>
