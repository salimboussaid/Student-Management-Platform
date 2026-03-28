<template>
  <!-- UCard wraps the student info in a clean bordered card -->
  <UCard>
    <div class="flex items-center gap-4">

      <!-- Avatar circle: initials of the student's name -->
      <div class="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
        {{ initials }}
      </div>

      <!-- Student details -->
      <div class="flex-1 min-w-0">
        <p class="font-semibold text-black truncate">{{ name }}</p>
        <p class="text-sm text-gray-500 truncate">{{ email }}</p>

        <!--
          v-if / v-else-if / v-else:
          Show a different badge color depending on the grade level.
        -->
        <UBadge v-if="isTopGrade" color="green" variant="soft" size="xs" class="mt-1">
          {{ grade }}
        </UBadge>
        <UBadge v-else-if="isMidGrade" color="yellow" variant="soft" size="xs" class="mt-1">
          {{ grade }}
        </UBadge>
        <UBadge v-else color="red" variant="soft" size="xs" class="mt-1">
          {{ grade }}
        </UBadge>
      </div>

      <!-- Remove button: emits 'remove' so the parent list can delete this student -->
      <UButton
        icon="i-heroicons-x-mark"
        size="xs"
        color="black"
        variant="ghost"
        aria-label="Remove student"
        @click="emit('remove')"
      />

    </div>
  </UCard>
</template>

<script setup lang="ts">
// defineProps: the data this card needs to display
const props = defineProps<{
  name: string
  email: string
  grade: string
}>()

// defineEmits: 'remove' tells the parent list to delete this student
const emit = defineEmits<{
  remove: []
}>()

// Compute initials from the full name (e.g. "Ahmed Hassan" → "AH")
const initials = computed(() =>
  props.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
)

// Helpers used by v-if / v-else-if / v-else above
const isTopGrade = computed(() => ['A+', 'A', 'A-'].includes(props.grade))
const isMidGrade = computed(() => ['B+', 'B', 'B-'].includes(props.grade))
</script>
