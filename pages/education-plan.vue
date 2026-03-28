<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Education Plan</h1>
      <p class="text-gray-600 mt-1">Your semester curriculum and course requirements</p>
    </div>

    <div v-if="educationPlan" class="space-y-6">
      <!-- Program Info -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Program Information</h2>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p class="text-sm text-gray-600">Program Code</p>
            <p class="text-lg font-bold text-gray-900">{{ educationPlan.programCode }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Program Name</p>
            <p class="text-lg font-bold text-gray-900">{{ educationPlan.programName }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Education Year</p>
            <p class="text-lg font-bold text-gray-900">{{ educationPlan.educationYear }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Group</p>
            <p class="text-lg font-bold text-gray-900">{{ educationPlan.group }}</p>
          </div>
        </div>
      </UCard>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UCard>
          <template #header>
            <h3 class="text-sm font-semibold text-gray-700">Total Subjects</h3>
          </template>
          <div class="text-3xl font-bold text-blue-600">{{ educationPlan.clauses.length }}</div>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-sm font-semibold text-gray-700">Total Credits</h3>
          </template>
          <div class="text-3xl font-bold text-purple-600">{{ totalCredits }}</div>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-sm font-semibold text-gray-700">Exam Subjects</h3>
          </template>
          <div class="text-3xl font-bold text-orange-600">{{ examCount }}</div>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-sm font-semibold text-gray-700">Pass Subjects</h3>
          </template>
          <div class="text-3xl font-bold text-green-600">{{ passCount }}</div>
        </UCard>
      </div>

      <!-- Filters -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Filters</h2>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UFormGroup label="Semester">
            <USelect
              v-model="selectedSemester"
              :options="['All', ...availableSemesters]"
              placeholder="Select semester"
            />
          </UFormGroup>

          <UFormGroup label="Reporting Type">
            <USelect
              v-model="selectedReporting"
              :options="['All', 'Exam', 'Pass']"
              placeholder="Filter by reporting"
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

      <!-- Clauses by Semester -->
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-gray-900">Curriculum By Semester</h2>

        <div
          v-for="semester in getUniqueSemesters"
          :key="semester"
          class="space-y-4"
        >
          <div v-if="getClausesBySemester(semester).length > 0">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Semester {{ semester }}</h3>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <UCard
                v-for="clause in getClausesBySemester(semester)"
                :key="clause.id"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">{{ clause.name }}</h4>
                    <p class="text-sm text-gray-500 mt-1">{{ clause.code }}</p>

                    <div class="flex gap-2 mt-3">
                      <UBadge color="blue" variant="soft">
                        {{ clause.creditPoints }} credits
                      </UBadge>
                      <UBadge
                        :color="clause.reporting === 'Exam' ? 'orange' : 'green'"
                        variant="soft"
                      >
                        {{ clause.reporting }}
                      </UBadge>
                    </div>
                  </div>

                  <UButton
                    v-if="profileStore.isAdmin"
                    @click="removeClause(clause.id)"
                    color="red"
                    variant="soft"
                    size="sm"
                    icon="i-heroicons-trash"
                  />
                </div>
              </UCard>
            </div>

            <div class="mt-4 p-4 bg-gray-50 rounded-lg">
              <p class="text-sm">
                <span class="font-semibold text-gray-900">
                  Total Credits for Semester {{ semester }}:
                </span>
                <span class="text-gray-600 ml-2">
                  {{ getTotalCreditsBySemester(semester) }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Full Table View -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">All Required Disciplines</h2>
        </template>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b border-gray-200">
              <tr class="text-left">
                <th class="pb-3 font-semibold text-gray-700">Code</th>
                <th class="pb-3 font-semibold text-gray-700">Discipline Name</th>
                <th class="pb-3 font-semibold text-gray-700">Credits</th>
                <th class="pb-3 font-semibold text-gray-700">Reporting</th>
                <th class="pb-3 font-semibold text-gray-700">Semesters</th>
                <th v-if="profileStore.isAdmin" class="pb-3 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="clause in filteredClauses"
                :key="clause.id"
                class="border-b border-gray-100 hover:bg-gray-50"
              >
                <td class="py-3 font-mono text-xs text-gray-600">{{ clause.code }}</td>
                <td class="py-3 font-medium text-gray-900">{{ clause.name }}</td>
                <td class="py-3 text-gray-600">{{ clause.creditPoints }}</td>
                <td class="py-3">
                  <UBadge
                    :color="clause.reporting === 'Exam' ? 'orange' : 'green'"
                    variant="soft"
                  >
                    {{ clause.reporting }}
                  </UBadge>
                </td>
                <td class="py-3 text-gray-600">{{ clause.semesters.join(', ') }}</td>
                <td v-if="profileStore.isAdmin" class="py-3">
                  <UButton
                    @click="removeClause(clause.id)"
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
      </UCard>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-gray-500">Education plan not available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEducationPlanStore } from '~/stores/educationPlan'
import { useProfileStore } from '~/stores/profile'
import { computed, ref } from 'vue'

const educationPlanStore = useEducationPlanStore()
const profileStore = useProfileStore()

const selectedSemester = ref('All')
const selectedReporting = ref('All')

const educationPlan = computed(() => {
  const uuid = profileStore.profile?.uuid
  if (!uuid) return null
  return educationPlanStore.getStudentEducationPlan(uuid)
})

const totalCredits = computed(() => {
  if (!educationPlan.value) return 0
  return educationPlan.value.clauses.reduce((sum, c) => sum + c.creditPoints, 0)
})

const examCount = computed(() => {
  if (!educationPlan.value) return 0
  return educationPlan.value.clauses.filter(c => c.reporting === 'Exam').length
})

const passCount = computed(() => {
  if (!educationPlan.value) return 0
  return educationPlan.value.clauses.filter(c => c.reporting === 'Pass').length
})

const availableSemesters = computed(() => {
  if (!educationPlan.value) return []
  const semesters = new Set<number>()
  educationPlan.value.clauses.forEach(c => {
    c.semesters.forEach(s => semesters.add(s))
  })
  return Array.from(semesters).sort((a, b) => a - b).map(s => s.toString())
})

const getUniqueSemesters = computed(() => {
  if (!educationPlan.value) return []
  const semesters = new Set<number>()
  educationPlan.value.clauses.forEach(c => {
    c.semesters.forEach(s => semesters.add(s))
  })
  return Array.from(semesters).sort((a, b) => a - b)
})

const filteredClauses = computed(() => {
  if (!educationPlan.value) return []

  return educationPlan.value.clauses.filter(clause => {
    if (selectedSemester.value !== 'All') {
      const sem = parseInt(selectedSemester.value)
      if (!clause.semesters.includes(sem)) return false
    }
    if (selectedReporting.value !== 'All' && clause.reporting !== selectedReporting.value) {
      return false
    }
    return true
  })
})

function getClausesBySemester(semester: number) {
  if (!educationPlan.value) return []
  return educationPlan.value.clauses.filter(c => c.semesters.includes(semester))
}

function getTotalCreditsBySemester(semester: number): number {
  return getClausesBySemester(semester).reduce((sum, c) => sum + c.creditPoints, 0)
}

function resetFilters() {
  selectedSemester.value = 'All'
  selectedReporting.value = 'All'
}

function removeClause(clauseId: string) {
  if (!educationPlan.value) return
  if (confirm('Are you sure you want to remove this discipline?')) {
    educationPlanStore.removeClauseFromPlan(educationPlan.value.studentUuid, clauseId)
  }
}
</script>
