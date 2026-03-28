import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export type UserRole = 'Admin' | 'Teacher' | 'Student'

export interface User {
  uuid: string
  name: string
  email: string
  password: string
  role: UserRole
  avatarUrl?: string
  createdAt: string
  active: boolean
}

export const useUsersStore = defineStore(
  'users',
  () => {
    const users = ref<User[]>([
      {
        uuid: crypto.randomUUID(),
        name: 'Salim Boussaid',
        email: 'salimboussaid@mail.ru',
        password: 'salim123',
        role: 'Admin',
        avatarUrl: '',
        createdAt: new Date().toISOString(),
        active: true
      },
      {
        uuid: crypto.randomUUID(),
        name: 'Ali Student',
        email: 'ali@mail.ru',
        password: 'student123',
        role: 'Student',
        avatarUrl: '',
        createdAt: new Date().toISOString(),
        active: true
      },
      {
        uuid: crypto.randomUUID(),
        name: 'John Teacher',
        email: 'john@mail.ru',
        password: 'teacher123',
        role: 'Teacher',
        avatarUrl: '',
        createdAt: new Date().toISOString(),
        active: true
      }
    ])

    const totalUsers = computed(() => users.value.length)
    const totalStudents = computed(() => users.value.filter(u => u.role === 'Student').length)
    const totalTeachers = computed(() => users.value.filter(u => u.role === 'Teacher').length)
    const totalAdmins = computed(() => users.value.filter(u => u.role === 'Admin').length)

    function findUserByEmail(email: string) {
      return users.value.find(u => u.email === email)
    }

    function findUserByUuid(uuid: string) {
      return users.value.find(u => u.uuid === uuid)
    }

    function createUser(payload: Omit<User, 'uuid' | 'createdAt' | 'active'>) {
      const newUser: User = {
        uuid: crypto.randomUUID(),
        ...payload,
        createdAt: new Date().toISOString(),
        active: true
      }
      users.value.push(newUser)
      return newUser
    }

    function updateUser(uuid: string, payload: Partial<Omit<User, 'uuid' | 'createdAt'>>) {
      const index = users.value.findIndex(u => u.uuid === uuid)
      if (index === -1) return

      users.value[index] = {
        ...users.value[index],
        ...payload
      }
    }

    function deleteUser(uuid: string) {
      const index = users.value.findIndex(u => u.uuid === uuid)
      if (index === -1) return

      users.value.splice(index, 1)
    }

    function toggleUserActive(uuid: string) {
      const user = findUserByUuid(uuid)
      if (user) {
        user.active = !user.active
      }
    }

    return {
      users,
      totalUsers,
      totalStudents,
      totalTeachers,
      totalAdmins,
      findUserByEmail,
      findUserByUuid,
      createUser,
      updateUser,
      deleteUser,
      toggleUserActive
    }
  },
  { persist: true }
)
