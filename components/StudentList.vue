<template>
  <div class="space-y-4">

    <!-- Search bar: bound to defineModel so the parent can read the query -->
    <UInput
      v-model="search"
      placeholder="Search students by name or email…"
      icon="i-heroicons-magnifying-glass"
    />

    <!-- Add-student form inside a UCard -->
    <UCard>
      <template #header>
        <p class="font-semibold">Add a Student</p>
      </template>

      <div class="flex flex-wrap gap-3">
        <UInput v-model="newName"  placeholder="Full name"       class="flex-1 min-w-32" />
        <UInput v-model="newEmail" placeholder="Email"           class="flex-1 min-w-40" />
        <UInput v-model="newGrade" placeholder="Grade (A+, B…)"  class="w-28" />
        <UButton color="black" @click="addStudent">Add</UButton>
      </div>

      <!-- v-show: hint only shown when user tries to add with empty fields -->
      <p v-show="showHint" class="text-xs text-red-500 mt-2">
        Please fill in all three fields before adding.
      </p>
    </UCard>

    <!-- Student count line -->
    <p class="text-sm text-gray-500">
      {{ filteredStudents.length }} student{{ filteredStudents.length !== 1 ? 's' : '' }} shown
    </p>

    <!--
      v-for with :key — the reactive list.
      Each StudentCard can emit 'remove', which calls removeStudent().
    -->
    <StudentCard
      v-for="student in filteredStudents"
      :key="student.id"
      :name="student.name"
      :email="student.email"
      :grade="student.grade"
      @remove="removeStudent(student.id)"
    />

    <!-- v-show: empty-state message when no students match -->
    <div v-show="filteredStudents.length === 0" class="text-center py-10 text-gray-400">
      No students found.
    </div>

  </div>
</template>

<script setup lang="ts">
interface Student {
  id: number
  name: string
  email: string
  grade: string
}

// defineProps: accept an initial list of students from the parent page
const props = defineProps<{
  initialStudents?: { name: string; email: string; grade: string }[]
}>()

// defineModel: two-way search query — parent can bind v-model:search
const search = defineModel<string>('search', { default: '' })

// ── State ──────────────────────────────────────────────────────────────────
const students  = ref<Student[]>([])
const newName   = ref('')
const newEmail  = ref('')
const newGrade  = ref('')
const showHint  = ref(false)
let   nextId    = 1

// ── Derived ────────────────────────────────────────────────────────────────
// Filter the list whenever the search query or students array changes
const filteredStudents = computed(() =>
  students.value.filter(s =>
    s.name.toLowerCase().includes(search.value.toLowerCase()) ||
    s.email.toLowerCase().includes(search.value.toLowerCase())
  )
)

// ── watch ──────────────────────────────────────────────────────────────────
// React to any change in the students array (add or remove)
watch(students, (list) => {
  console.log('StudentList updated — total students:', list.length)
}, { deep: true })

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(() => {
  // Load the initial students passed from the parent
  if (props.initialStudents?.length) {
    students.value = props.initialStudents.map((s, i) => ({ ...s, id: i + 1 }))
    nextId = students.value.length + 1
  }
  console.log('StudentList mounted with', students.value.length, 'student(s)')
})

onUnmounted(() => {
  console.log('StudentList unmounted')
})

// ── Methods ────────────────────────────────────────────────────────────────
function addStudent() {
  if (!newName.value.trim() || !newEmail.value.trim() || !newGrade.value.trim()) {
    showHint.value = true
    setTimeout(() => { showHint.value = false }, 2500)
    return
  }

  students.value.push({
    id: nextId++,
    name: newName.value.trim(),
    email: newEmail.value.trim(),
    grade: newGrade.value.trim(),
  })

  // Clear the input fields after adding
  newName.value  = ''
  newEmail.value = ''
  newGrade.value = ''
}

function removeStudent(id: number) {
  students.value = students.value.filter(s => s.id !== id)
}
</script>
