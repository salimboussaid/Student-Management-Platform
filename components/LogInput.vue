<template>
  <div class="space-y-1">
    <!-- show label above the input when provided -->
    <p v-if="props.label" class="text-sm font-medium text-gray-700">{{ props.label }}</p>

    <!-- UInput replaces the plain <input>; bound to defineModel -->
    <UInput
      v-model="model"
      :placeholder="props.placeholder ?? 'Type something...'"
    />
  </div>
</template>

<script setup lang="ts">
// defineProps: optional placeholder text and an optional visible label
const props = defineProps<{
  placeholder?: string
  label?: string
}>()

// defineModel: creates a two-way v-model binding with the parent
// The parent writes a value in; changes here flow back to the parent.
const model = defineModel<string>({ default: '' })

// watch: every time the user types, log the new value
watch(model, (newValue) => {
  console.log('LogInput changed:', newValue)
})

// onMounted / onUnmounted: log lifecycle
onMounted(() => {
  console.log(`LogInput "${props.label ?? props.placeholder ?? ''}" mounted`)
})

onUnmounted(() => {
  console.log(`LogInput "${props.label ?? props.placeholder ?? ''}" unmounted`)
})
</script>
