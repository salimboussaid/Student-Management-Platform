<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Point-Rating System</h1>
      <p class="text-gray-600 mt-1">Track your grades and academic performance</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Average Grade</h3>
        </template>
        <div class="text-3xl font-bold text-blue-600">{{ averageGrade }}%</div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Total Subjects</h3>
        </template>
        <div class="text-3xl font-bold text-purple-600">{{ studentGrades.length }}</div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Excellent Grades</h3>
        </template>
        <div class="text-3xl font-bold text-green-600">{{ excellentCount }}</div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-sm font-semibold text-gray-700">Failed Subjects</h3>
        </template>
        <div class="text-3xl font-bold text-red-600">{{ failedCount }}</div>
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
            :options="semesterOptions"
            placeholder="Select semester"
          />
        </UFormGroup>

        <UFormGroup label="Achievement">
          <USelect
            v-model="selectedAchievement"
            :options="['All', 'Excellent', 'Good', 'Pass', 'Test', 'Failed']"
            placeholder="Filter by achievement"
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

    <!-- Add Grade (Admin/Teacher only) -->
    <UCard v-if="profileStore.isAdmin || profileStore.isTeacher">
      <template #header>
        <h2 class="text-lg font-semibold">Add Grade</h2>
      </template>

      <form @submit.prevent="addGrade" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UFormGroup label="Student">
          <USelect
            v-model="newGrade.studentUuid"
            :options="studentOptions"
            placeholder="Select student"
          />
        </UFormGroup>

        <UFormGroup label="Discipline">
          <USelect
            v-model="newGrade.disciplineId"
            :options="disciplineOptions"
            placeholder="Select discipline"
          />
        </UFormGroup>

        <UFormGroup label="Total Points">
          <UInput
            v-model.number="newGrade.totalPoints"
            type="number"
            min="0"
            placeholder="Points earned"
            required
          />
        </UFormGroup>

        <UFormGroup label="Max Points">
          <UInput
            v-model.number="newGrade.maxPoints"
            type="number"
            min="1"
            placeholder="Maximum points"
            required
          />
        </UFormGroup>

        <UFormGroup label="Semester">
          <UInput
            v-model.number="newGrade.semester"
            type="number"
            min="1"
            placeholder="Semester"
            required
          />
        </UFormGroup>

        <div class="md:col-span-3">
          <UButton type="submit" color="green" block>
            Add Grade
          </UButton>
        </div>
      </form>
    </UCard>

    <!-- Grades Table -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Your Grades</h2>
          <span class="text-sm text-gray-500">{{ filteredGrades.length }} entries</span>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table v-if="filteredGrades.length > 0" class="w-full text-sm">
          <thead class="border-b border-gray-200">
            <tr class="text-left">
              <th class="pb-3 font-semibold text-gray-700">Discipline</th>
              <th class="pb-3 font-semibold text-gray-700">Code</th>
              <th class="pb-3 font-semibold text-gray-700">Points</th>
              <th class="pb-3 font-semibold text-gray-700">Percentage</th>
              <th class="pb-3 font-semibold text-gray-700">Achievement</th>
              <th class="pb-3 font-semibold text-gray-700">Semester</th>
              <th class="pb-3 font-semibold text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="grade in filteredGrades"
              :key="grade.id"
              class="border-b border-gray-100 hover:bg-gray-50"
            >
              <td class="py-3 font-medium text-gray-900">{{ grade.discipline }}</td>
              <td class="py-3 text-gray-600 text-xs font-mono">{{ getDisciplineCode(grade.disciplineId) }}</td>
              <td class="py-3 text-gray-900 font-medium">
                {{ grade.totalPoints }}/{{ grade.maxPoints }}
              </td>
              <td class="py-3">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all"
                    :style="{ width: getPercentage(grade) + '%', backgroundColor: getPercentageColor(grade) }"
                  />
                </div>
                <span class="text-xs font-medium text-gray-600">{{ getPercentage(grade) }}%</span>
              </td>
              <td class="py-3">
                <UBadge :color="getAchievementColor(grade.achievement)" variant="soft">
                  {{ grade.achievement }}
                </UBadge>
              </td>
              <td class="py-3 text-gray-600">Semester {{ grade.semester }}</td>
              <td class="py-3 text-gray-600 text-sm">{{ formatDate(grade.date) }}</td>
            </tr>
          </tbody>
        </table>

        <div v-else class="text-center py-12">
          <p class="text-gray-500">No grades found</p>
        </div>
      </div>
    </UCard>

    <!-- Grade Distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Grade Distribution</h2>
        </template>

        <div class="space-y-3">
          <div v-for="achievement in ['Excellent', 'Good', 'Pass', 'Test', 'Failed']" :key="achievement">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium text-gray-700">{{ achievement }}</span>
              <span class="text-sm font-medium text-gray-900">{{ getAchievementCount(achievement) }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="h-2 rounded-full"
                :style="{
                  width: getAchievementPercentage(achievement) + '%',
                  backgroundColor: getAchievementColor(achievement)
                }"
              />
            </div>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Statistics</h2>
        </template>

        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Highest Grade:</span>
            <span class="font-medium text-gray-900">{{ highestPercentage }}%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Lowest Grade:</span>
            <span class="font-medium text-gray-900">{{ lowestPercentage }}%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Average Grade:</span>
            <span class="font-medium text-gray-900">{{ averageGrade }}%</span>
          </div>
          <div class="flex justify-between border-t pt-2 mt-2">
            <span class="text-gray-600">Subjects Passed:</span>
            <span class="font-medium text-green-600">{{ passedCount }}/{{ studentGrades.length }}</span>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGradesStore } from '~/stores/grades'
import { useProfileStore } from '~/stores/profile'
import { useUsersStore } from '~/stores/users'
import { computed, ref } from 'vue'

const gradesStore = useGradesStore()
const profileStore = useProfileStore()
const usersStore = useUsersStore()

const selectedSemester = ref('All')
const selectedAchievement = ref('All')

const studentGrades = computed(() => {
  const uuid = profileStore.profile?.uuid
  if (!uuid) return []
  return gradesStore.getStudentGrades(uuid)
})

const filteredGrades = computed(() => {
  return studentGrades.value.filter(grade => {
    if (selectedSemester.value !== 'All' && grade.semester !== parseInt(selectedSemester.value)) {
      return false
    }
    if (selectedAchievement.value !== 'All' && grade.achievement !== selectedAchievement.value) {
      return false
    }
    return true
  })
})

const semesterOptions = computed(() => {
  const semesters = new Set(gradesStore.grades.map(g => g.semester.toString()))
  const sorted = Array.from(semesters).sort()
  return ['All', ...sorted]
})

const studentOptions = computed(() => {
  return usersStore.users
    .filter(u => u.role === 'Student')
    .map(u => ({ label: u.name, value: u.uuid }))
})

const disciplineOptions = computed(() => {
  return gradesStore.disciplines.map(d => ({
    label: `${d.code} - ${d.name}`,
    value: d.id
  }))
})

const newGrade = ref({
  studentUuid: profileStore.profile?.uuid || '',
  disciplineId: '',
  totalPoints: 0,
  maxPoints: 100,
  semester: 1
})

const averageGrade = computed(() => {
  if (studentGrades.value.length === 0) return 0
  const total = studentGrades.value.reduce((sum, g) => sum + getPercentage(g), 0)
  return Math.round(total / studentGrades.value.length)
})

const excellentCount = computed(() =>
  studentGrades.value.filter(g => g.achievement === 'Excellent').length
)

const failedCount = computed(() =>
  studentGrades.value.filter(g => g.achievement === 'Failed').length
)

const passedCount = computed(() =>
  studentGrades.value.filter(g => g.achievement !== 'Failed').length
)

const highestPercentage = computed(() => {
  if (studentGrades.value.length === 0) return 0
  return Math.max(...studentGrades.value.map(g => getPercentage(g)))
})

const lowestPercentage = computed(() => {
  if (studentGrades.value.length === 0) return 0
  return Math.min(...studentGrades.value.map(g => getPercentage(g)))
})

function getPercentage(grade: any): number {
  return Math.round((grade.totalPoints / grade.maxPoints) * 100)
}

function getPercentageColor(grade: any): string {
  const pct = getPercentage(grade)
  if (pct >= 90) return '#10b981'
  if (pct >= 80) return '#3b82f6'
  if (pct >= 70) return '#f59e0b'
  if (pct >= 50) return '#ef4444'
  return '#7f1d1d'
}

function getAchievementColor(achievement: string): any {
  switch (achievement) {
    case 'Excellent':
      return 'green'
    case 'Good':
      return 'blue'
    case 'Pass':
      return 'amber'
    case 'Test':
      return 'orange'
    case 'Failed':
      return 'red'
    default:
      return 'gray'
  }
}

function getDisciplineCode(disciplineId: string): string {
  const disc = gradesStore.disciplines.find(d => d.id === disciplineId)
  return disc?.code || '-'
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString()
}

function getAchievementCount(achievement: string): number {
  return filteredGrades.value.filter(g => g.achievement === achievement).length
}

function getAchievementPercentage(achievement: string): number {
  if (filteredGrades.value.length === 0) return 0
  const count = getAchievementCount(achievement)
  return (count / filteredGrades.value.length) * 100
}

function resetFilters() {
  selectedSemester.value = 'All'
  selectedAchievement.value = 'All'
}

function addGrade() {
  gradesStore.addGrade({
    studentUuid: newGrade.value.studentUuid,
    disciplineId: newGrade.value.disciplineId,
    discipline: gradesStore.disciplines.find(d => d.id === newGrade.value.disciplineId)?.name || '',
    totalPoints: newGrade.value.totalPoints,
    maxPoints: newGrade.value.maxPoints,
    semester: newGrade.value.semester,
    date: new Date().toISOString()
  })

  newGrade.value = {
    studentUuid: profileStore.profile?.uuid || '',
    disciplineId: '',
    totalPoints: 0,
    maxPoints: 100,
    semester: 1
  }
}
</script>
