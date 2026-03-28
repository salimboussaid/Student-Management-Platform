<template>
  <div class="flex items-center gap-2">
    <!-- Optional label displayed next to the toggle -->
    <span v-if="props.label" class="text-sm text-gray-600">{{ props.label }}</span>

    <!-- UToggle is the Nuxt UI switch component -->
    <UToggle v-model="model" />
  </div>
</template>

<script setup lang="ts">
// defineProps: an optional text label shown beside the switch
const props = defineProps<{
  label?: string
}>()

// defineModel: two-way boolean binding — parent uses v-model to read/write this value
const model = defineModel<boolean>({ default: false })
</script>
