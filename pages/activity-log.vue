<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Activity Log</h1>
      <p class="text-gray-600 mt-1">Monitor all system activities and user actions</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Total Logs</h3>
        </template>
        <div class="text-3xl font-bold text-blue-600">{{ activityLogStore.logs.length }}</div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Logins Today</h3>
        </template>
        <div class="text-3xl font-bold text-green-600">{{ todayLoginCount }}</div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Modifications Today</h3>
        </template>
        <div class="text-3xl font-bold text-amber-600">{{ todayModificationCount }}</div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Active Users</h3>
        </template>
        <div class="text-3xl font-bold text-purple-600">{{ usersStore.totalUsers }}</div>
      </UCard>
    </div>

    <!-- Filters -->
    <UCard>
      <template #header>
        <h2 class="text-lg font-semibold">Filters</h2>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UFormGroup label="Entity Type">
          <USelect
            v-model="selectedEntityType"
            :options="['All', ...entityTypes]"
            placeholder="Filter by entity type"
          />
        </UFormGroup>

        <UFormGroup label="Action">
          <USelect
            v-model="selectedAction"
            :options="['All', 'create', 'update', 'delete', 'login', 'logout', 'status_change']"
            placeholder="Filter by action"
          />
        </UFormGroup>

        <UFormGroup label="User">
          <USelect
            v-model="selectedUserId"
            :options="userOptions"
            placeholder="Filter by user"
          />
        </UFormGroup>

        <div class="flex items-end">
          <UButton
            @click="resetFilters"
            color="gray"
            variant="soft"
            block
          >
            Reset Filters
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Logs Table -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Activity Timeline</h2>
          <span class="text-sm text-gray-500">{{ filteredLogs.length }} entries</span>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table v-if="filteredLogs.length > 0" class="w-full text-sm">
          <thead class="border-b border-gray-200">
            <tr class="text-left">
              <th class="pb-3 font-semibold text-gray-700">Timestamp</th>
              <th class="pb-3 font-semibold text-gray-700">User</th>
              <th class="pb-3 font-semibold text-gray-700">Action</th>
              <th class="pb-3 font-semibold text-gray-700">Entity</th>
              <th class="pb-3 font-semibold text-gray-700">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="log in filteredLogs"
              :key="log.id"
              class="border-b border-gray-100 hover:bg-gray-50"
            >
              <td class="py-3">
                <div class="text-xs font-medium text-gray-700">
                  {{ formatDate(log.timestamp) }}
                </div>
                <div class="text-xs text-gray-500">{{ formatTime(log.timestamp) }}</div>
              </td>
              <td class="py-3">
                <UBadge variant="soft" color="blue">
                  {{ log.userName }}
                </UBadge>
              </td>
              <td class="py-3">
                <UBadge
                  :color="getActionColor(log.action)"
                  variant="soft"
                >
                  {{ formatAction(log.action) }}
                </UBadge>
              </td>
              <td class="py-3">
                <div class="text-sm font-medium text-gray-900">{{ log.entityName }}</div>
                <div class="text-xs text-gray-500">{{ log.entityType }}</div>
              </td>
              <td class="py-3">
                <div class="text-sm text-gray-600">{{ log.details || '-' }}</div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else class="text-center py-12">
          <p class="text-gray-500">No activity logs found with selected filters</p>
        </div>
      </div>

      <!-- Pagination controls -->
      <template v-if="filteredLogs.length > 0" #footer>
        <div class="flex items-center justify-between text-sm text-gray-500">
          <p>Showing {{ Math.min(displayLimit, filteredLogs.length) }} of {{ filteredLogs.length }} entries</p>
          <UButton
            v-if="filteredLogs.length > displayLimit"
            @click="displayLimit += 50"
            color="gray"
            size="sm"
            variant="soft"
          >
            Load More
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useActivityLogStore } from '~/stores/activityLog'
import { useUsersStore } from '~/stores/users'
import { computed, ref } from 'vue'

const activityLogStore = useActivityLogStore()
const usersStore = useUsersStore()

const selectedEntityType = ref('All')
const selectedAction = ref('All')
const selectedUserId = ref('All')
const displayLimit = ref(100)

const entityTypes = computed(() => {
  const types = new Set(activityLogStore.logs.map(log => log.entityType))
  return Array.from(types).sort()
})

const userOptions = computed(() => {
  return ['All', ...usersStore.users.map(u => u.uuid)]
})

const filteredLogs = computed(() => {
  return activityLogStore.logs
    .filter(log => {
      if (selectedEntityType.value !== 'All' && log.entityType !== selectedEntityType.value) {
        return false
      }
      if (selectedAction.value !== 'All' && log.action !== selectedAction.value) {
        return false
      }
      if (selectedUserId.value !== 'All' && log.userId !== selectedUserId.value) {
        return false
      }
      return true
    })
    .slice(0, displayLimit.value)
})

const todayLoginCount = computed(() => {
  const today = new Date().toDateString()
  return activityLogStore.logs.filter(
    log => log.action === 'login' && new Date(log.timestamp).toDateString() === today
  ).length
})

const todayModificationCount = computed(() => {
  const today = new Date().toDateString()
  return activityLogStore.logs.filter(
    log =>
      (log.action === 'create' || log.action === 'update' || log.action === 'delete') &&
      new Date(log.timestamp).toDateString() === today
  ).length
})

function resetFilters() {
  selectedEntityType.value = 'All'
  selectedAction.value = 'All'
  selectedUserId.value = 'All'
  displayLimit.value = 100
}

function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatAction(action: string): string {
  return action
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getActionColor(action: string): any {
  switch (action) {
    case 'create':
      return 'green'
    case 'update':
      return 'blue'
    case 'delete':
      return 'red'
    case 'login':
      return 'green'
    case 'logout':
      return 'gray'
    default:
      return 'gray'
  }
}
</script>
