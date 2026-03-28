import { ref } from 'vue'
import { defineStore } from 'pinia'

export type ActivityAction = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'project_assigned' | 'grade_added' | 'status_change'

export interface ActivityLog {
  id: string
  action: ActivityAction
  entityType: string
  entityName: string
  userId: string
  userName: string
  timestamp: string
  details?: string
}

export const useActivityLogStore = defineStore(
  'activityLog',
  () => {
    const logs = ref<ActivityLog[]>([])

    function addLog(payload: Omit<ActivityLog, 'id' | 'timestamp'>) {
      logs.value.unshift({
        id: crypto.randomUUID(),
        ...payload,
        timestamp: new Date().toISOString()
      })

      // Keep only last 500 logs
      if (logs.value.length > 500) {
        logs.value = logs.value.slice(0, 500)
      }
    }

    function getLogsByUserId(userId: string) {
      return logs.value.filter(log => log.userId === userId)
    }

    function getLogsByEntityType(entityType: string) {
      return logs.value.filter(log => log.entityType === entityType)
    }

    function clearLogs() {
      logs.value = []
    }

    return {
      logs,
      addLog,
      getLogsByUserId,
      getLogsByEntityType,
      clearLogs
    }
  },
  { persist: true }
)
