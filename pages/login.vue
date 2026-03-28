<template>
  <div class="login-page flex items-center justify-center min-h-screen px-4 py-10">
    <UCard class="login-card w-full max-w-md shadow-xl">
      <template #header>
        <div class="text-center">
          <h1 class="text-3xl font-bold login-title">BoussaidMS</h1>
          <p class="login-subtitle text-sm mt-2">Student & Project Management System</p>
        </div>
      </template>

      <!-- Login Form -->
      <form v-if="!showCreateUser" @submit.prevent="handleLogin" class="space-y-4">
        <UFormGroup label="Email">
          <UInput
            v-model="loginEmail"
            type="email"
            placeholder="Enter your email"
            required
            icon="i-heroicons-envelope"
          />
        </UFormGroup>

        <UFormGroup label="Password">
          <UInput
            v-model="loginPassword"
            type="password"
            placeholder="Enter your password"
            required
            icon="i-heroicons-key"
          />
        </UFormGroup>

        <p v-if="loginError" class="text-red-500 text-sm font-medium">{{ loginError }}</p>

        <div class="flex gap-2">
          <UButton type="submit" color="black" block :loading="loading">
            Login
          </UButton>
        </div>

        <div class="text-center pt-2 border-t login-divider">
          <button
            type="button"
            @click="showCreateUser = true"
            class="text-sm login-link font-medium"
          >
            Create New Account
          </button>
        </div>
      </form>

      <!-- Create User Form -->
      <form v-else @submit.prevent="handleCreateUser" class="space-y-4">
        <UFormGroup label="Full Name">
          <UInput
            v-model="newUserName"
            type="text"
            placeholder="Enter full name"
            required
            icon="i-heroicons-user"
          />
        </UFormGroup>

        <UFormGroup label="Email">
          <UInput
            v-model="newUserEmail"
            type="email"
            placeholder="Enter email"
            required
            icon="i-heroicons-envelope"
          />
        </UFormGroup>

        <UFormGroup label="Password">
          <UInput
            v-model="newUserPassword"
            type="password"
            placeholder="Create password"
            required
            icon="i-heroicons-key"
          />
        </UFormGroup>

        <UFormGroup label="Role">
          <USelect
            v-model="newUserRole"
            :options="['Student', 'Teacher', 'Admin']"
            placeholder="Select role"
          />
        </UFormGroup>

        <p v-if="createError" class="text-red-500 text-sm font-medium">{{ createError }}</p>

        <div class="flex gap-2">
          <UButton type="submit" color="green" block :loading="loading">
            Create Account
          </UButton>
          <UButton
            type="button"
            color="gray"
            variant="soft"
            block
            @click="showCreateUser = false; createError = ''"
          >
            Back
          </UButton>
        </div>
      </form>


    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'
import { useUsersStore } from '~/stores/users'

const profileStore = useProfileStore()
const usersStore = useUsersStore()

if (profileStore.isAuthorized) {
  navigateTo('/profile')
}

// Login form state
const loginEmail = ref('')
const loginPassword = ref('')
const loginError = ref('')

// Create user form state
const showCreateUser = ref(false)
const newUserName = ref('')
const newUserEmail = ref('')
const newUserPassword = ref('')
const newUserRole = ref('Student')
const createError = ref('')

const loading = ref(false)

const handleLogin = async () => {
  loginError.value = ''
  loading.value = true

  await new Promise(resolve => setTimeout(resolve, 800))

  // Find user in users store
  const user = usersStore.findUserByEmail(loginEmail.value)

  if (user && user.password === loginPassword.value && user.active) {
    profileStore.createProfile({
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl
    })

    navigateTo(user.role === 'Student' ? '/student-dashboard' : '/dashboard')
  } else {
    if (!user) {
      loginError.value = 'User not found'
    } else if (!user.active) {
      loginError.value = 'Your account has been deactivated'
    } else {
      loginError.value = 'Invalid password'
    }
  }

  loading.value = false
}

const handleCreateUser = async () => {
  createError.value = ''

  if (!newUserName.value || !newUserEmail.value || !newUserPassword.value) {
    createError.value = 'All fields are required'
    return
  }

  // Check if email already exists
  if (usersStore.findUserByEmail(newUserEmail.value)) {
    createError.value = 'Email already exists'
    return
  }

  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))

  try {
    usersStore.createUser({
      name: newUserName.value,
      email: newUserEmail.value,
      password: newUserPassword.value,
      role: newUserRole.value as any,
      avatarUrl: ''
    })

    // Auto-login after creation
    profileStore.createProfile({
      name: newUserName.value,
      email: newUserEmail.value,
      role: newUserRole.value,
      avatarUrl: ''
    })

    navigateTo(newUserRole.value === 'Student' ? '/student-dashboard' : '/dashboard')
  } catch (err) {
    createError.value = 'Error creating account'
  }

  loading.value = false
}
</script>

<style scoped>
.login-page {
  background:
    radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--text-primary) 8%, transparent) 0%, transparent 35%),
    linear-gradient(140deg, var(--bg-color) 0%, var(--bg-elevated) 100%);
}

.login-card {
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  backdrop-filter: blur(10px);
}

.login-title {
  color: var(--text-primary);
}

.login-subtitle {
  color: var(--text-muted);
}

.login-divider {
  border-color: var(--border-color);
}

.login-link {
  color: var(--text-primary);
}

.login-link:hover {
  opacity: 0.72;
}

.demo-account {
  background: color-mix(in srgb, var(--card-bg) 86%, transparent);
  border-color: var(--border-color);
}

.demo-code {
  background: var(--bg-elevated);
  color: var(--text-primary);
  border-radius: 4px;
}
</style>
