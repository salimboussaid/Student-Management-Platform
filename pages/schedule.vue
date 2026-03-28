<template>
  <div class="schedule-page space-y-6">
    <div>
      <h1 class="text-3xl font-bold section-title">Class Schedule</h1>
      <p class="section-subtitle mt-1">
        Weekly view + date range view (01/03/2026 to 15/04/2026), with search for student, subject, and project.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UCard class="schedule-panel">
        <template #header>
          <h3 class="text-sm font-semibold section-subtitle">Classes This Week</h3>
        </template>
        <div class="text-3xl font-bold section-title">{{ weekClassCount }}</div>
      </UCard>

      <UCard class="schedule-panel">
        <template #header>
          <h3 class="text-sm font-semibold section-subtitle">Classes In Range</h3>
        </template>
        <div class="text-3xl font-bold section-title">{{ rangeClassCount }}</div>
      </UCard>

      <UCard class="schedule-panel">
        <template #header>
          <h3 class="text-sm font-semibold section-subtitle">Current Semester</h3>
        </template>
        <div class="text-3xl font-bold section-title">{{ currentSemester }}</div>
      </UCard>
    </div>

    <UCard class="schedule-panel">
      <template #header>
        <h2 class="text-lg font-semibold section-title">Range Generator + Search</h2>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
        <UFormGroup label="Search (student / subject / project)">
          <UInput
            v-model="searchQuery"
            placeholder="Type name, subject, project..."
            icon="i-heroicons-magnifying-glass"
          />
        </UFormGroup>

        <UFormGroup label="Show">
          <USelect
            v-model="statusFilter"
            :options="statusOptions"
            placeholder="Select status"
          />
        </UFormGroup>

        <UFormGroup label="Range Start">
          <UInput v-model="rangeStart" type="date" />
        </UFormGroup>

        <UFormGroup label="Range End">
          <UInput v-model="rangeEnd" type="date" />
        </UFormGroup>

        <UButton color="black" icon="i-heroicons-sparkles" @click="generateRandomRangeSchedule">
          Generate 3-4/day
        </UButton>
      </div>

      <p class="section-subtitle text-sm mt-3">
        This creates a realistic student schedule in {{ formatUiDate(rangeStart) }} - {{ formatUiDate(rangeEnd) }}.
      </p>
      <p v-if="generatorMessage" class="text-sm mt-1 section-title">{{ generatorMessage }}</p>
    </UCard>

    <UCard v-if="searchQuery && matchingProjects.length > 0" class="schedule-panel">
      <template #header>
        <h2 class="text-lg font-semibold section-title">Matching Projects</h2>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div v-for="project in matchingProjects" :key="project.uuid" class="item-card p-3 rounded-lg">
          <p class="font-semibold section-title">{{ project.title }}</p>
          <p class="text-sm section-subtitle mt-1">Status: {{ project.status }}</p>
          <p class="text-sm section-subtitle">Progress: {{ project.progress }}%</p>
        </div>
      </div>
    </UCard>

    <!-- Add Class (Only for Admin/Teacher) -->
    <UCard v-if="profileStore.isAdmin || profileStore.isTeacher" class="schedule-panel">
      <template #header>
        <h2 class="text-lg font-semibold section-title">Add New Class</h2>
      </template>

      <form @submit.prevent="addNewClass" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UFormGroup label="Student">
          <USelect
            v-model="newClass.studentUuid"
            :options="studentOptions"
            placeholder="Select student"
          />
        </UFormGroup>

        <UFormGroup label="Subject">
          <UInput
            v-model="newClass.subject"
            placeholder="Subject name"
            required
          />
        </UFormGroup>

        <UFormGroup label="Type">
          <USelect
            v-model="newClass.type"
            :options="['Lecture', 'Laboratory', 'Practical', 'Seminar', 'Online']"
            placeholder="Select type"
          />
        </UFormGroup>

        <UFormGroup label="Teacher">
          <UInput
            v-model="newClass.teacher"
            placeholder="Teacher name"
            required
          />
        </UFormGroup>

        <UFormGroup label="Room">
          <UInput
            v-model="newClass.room"
            placeholder="Room number"
            required
          />
        </UFormGroup>

        <UFormGroup label="Day of Week">
          <USelect
            v-model="newClass.dayOfWeek"
            :options="weekDays"
            placeholder="Select day"
          />
        </UFormGroup>

        <UFormGroup label="Class Date">
          <UInput
            v-model="newClass.classDate"
            type="date"
            required
          />
        </UFormGroup>

        <UFormGroup label="Start Time">
          <UInput
            v-model="newClass.startTime"
            type="time"
            required
          />
        </UFormGroup>

        <UFormGroup label="End Time">
          <UInput
            v-model="newClass.endTime"
            type="time"
            required
          />
        </UFormGroup>

        <UFormGroup label="Semester">
          <UInput
            v-model.number="newClass.semester"
            type="number"
            min="1"
            placeholder="Semester"
            required
          />
        </UFormGroup>

        <div class="md:col-span-3">
          <UButton type="submit" color="green" block>
            Add Class
          </UButton>
        </div>
      </form>
    </UCard>

    <!-- Schedule by Day -->
    <div class="space-y-4">
      <h2 class="text-xl font-bold section-title">Weekly Schedule</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UCard
          v-for="(classes, dayIdx) in scheduleByDay"
          :key="dayIdx"
          v-show="classes.length > 0"
          class="schedule-panel"
        >
          <template #header>
            <h3 class="text-lg font-semibold section-title">{{ weekDayNames[dayIdx] }}</h3>
          </template>

          <div class="space-y-3">
            <div
              v-for="cls in classes"
              :key="cls.id"
              class="item-card p-3 rounded-lg hover:shadow-md transition"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h4 class="font-semibold section-title">{{ cls.subject }}</h4>
                  <p class="text-sm section-subtitle mt-1">
                    <span class="font-medium">{{ cls.startTime }} - {{ cls.endTime }}</span>
                  </p>
                  <p class="text-sm section-subtitle mt-1">
                    <span class="tag px-2 py-0.5 rounded text-xs font-medium">
                      {{ cls.type }}
                    </span>
                  </p>
                  <p class="text-sm section-subtitle mt-2">Date: {{ formatUiDate(cls.classDate) }}</p>
                  <p class="text-sm section-subtitle">Teacher: {{ cls.teacher }}</p>
                  <p class="text-sm section-subtitle">Room: {{ cls.room }}</p>
                </div>
                <UButton
                  v-if="profileStore.isAdmin"
                  @click="deleteScheduleClass(cls.id)"
                  color="red"
                  variant="soft"
                  size="sm"
                  icon="i-heroicons-trash"
                />
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <div v-if="displayedSchedule.length === 0" class="text-center py-12">
        <p class="section-subtitle">No classes found for this filter/search</p>
      </div>
    </div>

    <!-- Full Schedule Table -->
    <UCard class="schedule-panel">
      <template #header>
        <h2 class="text-lg font-semibold section-title">All Classes (Old + New)</h2>
      </template>

      <div class="overflow-x-auto">
        <table v-if="displayedSchedule.length > 0" class="w-full text-sm">
          <thead class="border-b border-gray-200">
            <tr class="text-left">
              <th class="pb-3 font-semibold section-subtitle">Date</th>
              <th class="pb-3 font-semibold section-subtitle">Day</th>
              <th class="pb-3 font-semibold section-subtitle">Time</th>
              <th class="pb-3 font-semibold section-subtitle">Subject</th>
              <th class="pb-3 font-semibold section-subtitle">Type</th>
              <th class="pb-3 font-semibold section-subtitle">Teacher</th>
              <th class="pb-3 font-semibold section-subtitle">Room</th>
              <th class="pb-3 font-semibold section-subtitle">Status</th>
              <th v-if="profileStore.isAdmin" class="pb-3 font-semibold section-subtitle">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="cls in displayedSchedule"
              :key="cls.id"
              class="border-b border-gray-100 hover:bg-gray-50"
            >
              <td class="py-3 section-subtitle">{{ formatUiDate(cls.classDate) }}</td>
              <td class="py-3 font-medium section-title">{{ weekDayNames[cls.dayOfWeek] }}</td>
              <td class="py-3 section-subtitle">{{ cls.startTime }} - {{ cls.endTime }}</td>
              <td class="py-3 font-medium section-title">{{ cls.subject }}</td>
              <td class="py-3">
                <UBadge variant="soft" color="blue">{{ cls.type }}</UBadge>
              </td>
              <td class="py-3 section-subtitle">{{ cls.teacher }}</td>
              <td class="py-3 section-subtitle">{{ cls.room }}</td>
              <td class="py-3">
                <UBadge :color="isClassPast(cls) ? 'gray' : 'green'" variant="soft">
                  {{ isClassPast(cls) ? 'Old' : 'Upcoming' }}
                </UBadge>
              </td>
              <td v-if="profileStore.isAdmin" class="py-3">
                <UButton
                  @click="deleteScheduleClass(cls.id)"
                  color="red"
                  variant="soft"
                  size="sm"
                  icon="i-heroicons-trash"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else class="text-center py-12">
          <p class="section-subtitle">No classes scheduled</p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useScheduleStore } from '~/stores/schedule'
import { useProfileStore } from '~/stores/profile'
import { useUsersStore } from '~/stores/users'
import { useProjectStore } from '~/stores/project'
import { computed, ref } from 'vue'

const scheduleStore = useScheduleStore()
const profileStore = useProfileStore()
const usersStore = useUsersStore()
const projectStore = useProjectStore()

const currentSemester = ref(1)
const rangeStart = ref('2026-03-01')
const rangeEnd = ref('2026-04-15')
const generatorMessage = ref('')
const searchQuery = ref('')
const statusFilter = ref<'all' | 'upcoming' | 'old'>('all')

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Old', value: 'old' }
]

const weekDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const weekDays = weekDayNames.map((name, idx) => ({ label: name, value: idx }))

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10)
}

function toStoreDay(dateIso: string) {
  const date = new Date(dateIso)
  return (date.getDay() + 6) % 7
}

function formatUiDate(dateIso?: string) {
  if (!dateIso) return '-'
  return new Date(dateIso).toLocaleDateString('en-GB')
}

const newClass = ref({
  studentUuid: profileStore.profile?.uuid || '',
  subject: '',
  type: 'Lecture' as 'Lecture' | 'Laboratory' | 'Practical' | 'Seminar' | 'Online',
  teacher: '',
  room: '',
  dayOfWeek: toStoreDay(todayIsoDate()),
  classDate: todayIsoDate(),
  startTime: '09:00',
  endTime: '10:30',
  semester: currentSemester.value
})

const studentOptions = computed(() => {
  return usersStore.users
    .filter(u => u.role === 'Student')
    .map(u => ({ label: u.name, value: u.uuid }))
})

const studentSchedule = computed(() => {
  const uuid = profileStore.profile?.uuid
  if (!uuid) return []
  return scheduleStore.getStudentSchedule(uuid)
})

const rangeSchedule = computed(() => {
  const start = new Date(rangeStart.value)
  const end = new Date(rangeEnd.value)

  return studentSchedule.value.filter((cls) => {
    if (!cls.classDate) return true
    const classDate = new Date(cls.classDate)
    return classDate >= start && classDate <= end
  })
})

const rangeClassCount = computed(() => rangeSchedule.value.length)

function isClassPast(cls: { classDate?: string }) {
  if (!cls.classDate) return false
  const classDate = new Date(cls.classDate)
  const today = new Date()
  classDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  return classDate < today
}

const displayedSchedule = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return rangeSchedule.value.filter((cls) => {
    const studentName = usersStore.findUserByUuid(cls.studentUuid)?.name ?? ''

    const matchesQuery =
      !query ||
      cls.subject.toLowerCase().includes(query) ||
      cls.teacher.toLowerCase().includes(query) ||
      cls.room.toLowerCase().includes(query) ||
      studentName.toLowerCase().includes(query)

    const old = isClassPast(cls)
    const matchesStatus =
      statusFilter.value === 'all' ||
      (statusFilter.value === 'old' && old) ||
      (statusFilter.value === 'upcoming' && !old)

    return matchesQuery && matchesStatus
  })
})

const matchingProjects = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return []

  return projectStore.projects.filter((project) => {
    return (
      project.title.toLowerCase().includes(query) ||
      project.status.toLowerCase().includes(query)
    )
  })
})

const scheduleByDay = computed(() => {
  const byDay: any[] = Array(7).fill(null).map(() => [])
  const now = new Date()
  const start = new Date(now)
  start.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  displayedSchedule.value
    .filter((cls) => {
      if (!cls.classDate) return true
      const date = new Date(cls.classDate)
      return date >= start && date <= end
    })
    .forEach(cls => {
    byDay[cls.dayOfWeek].push(cls)
    })

  return byDay
})

const weekClassCount = computed(() => {
  return scheduleByDay.value.reduce((sum, dayClasses) => sum + dayClasses.length, 0)
})

function generateRandomRangeSchedule() {
  const uuid = newClass.value.studentUuid || profileStore.profile?.uuid
  if (!uuid) {
    generatorMessage.value = 'Please choose a student first.'
    return
  }

  const created = scheduleStore.createRandomScheduleForRange(
    uuid,
    rangeStart.value,
    rangeEnd.value,
    currentSemester.value
  )

  generatorMessage.value = `${created} classes generated for ${formatUiDate(rangeStart.value)} - ${formatUiDate(rangeEnd.value)}.`
}

function addNewClass() {
  const classDate = newClass.value.classDate
  const dayOfWeek = classDate ? toStoreDay(classDate) : newClass.value.dayOfWeek

  scheduleStore.addScheduleClass({
    studentUuid: newClass.value.studentUuid,
    subject: newClass.value.subject,
    type: newClass.value.type,
    teacher: newClass.value.teacher,
    room: newClass.value.room,
    dayOfWeek,
    startTime: newClass.value.startTime,
    endTime: newClass.value.endTime,
    semester: newClass.value.semester,
    classDate
  })

  // Reset form
  newClass.value = {
    studentUuid: profileStore.profile?.uuid || '',
    subject: '',
    type: 'Lecture',
    teacher: '',
    room: '',
    dayOfWeek: toStoreDay(todayIsoDate()),
    classDate: todayIsoDate(),
    startTime: '09:00',
    endTime: '10:30',
    semester: currentSemester.value
  }
}

function deleteScheduleClass(id: string) {
  if (confirm('Are you sure you want to delete this class?')) {
    scheduleStore.deleteScheduleClass(id)
  }
}
</script>

<style scoped>
.section-title {
  color: var(--text-primary);
}

.section-subtitle {
  color: var(--text-muted);
}

.schedule-panel {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
}

.item-card {
  border: 1px solid var(--border-color);
  background: color-mix(in srgb, var(--card-bg) 90%, transparent);
}

.tag {
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  background: var(--bg-elevated);
}

.schedule-page :deep(.text-gray-900),
.schedule-page :deep(.text-gray-700),
.schedule-page :deep(.text-gray-600),
.schedule-page :deep(.text-gray-500) {
  color: var(--text-muted) !important;
}

.schedule-page :deep(.border-gray-200),
.schedule-page :deep(.border-gray-100) {
  border-color: var(--border-color) !important;
}

.schedule-page :deep(.hover\:bg-gray-50:hover) {
  background: color-mix(in srgb, var(--bg-elevated) 70%, transparent) !important;
}
</style>
