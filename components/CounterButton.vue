<template>
  <!-- UButton replaces the plain <button> -->
  <UButton color="black" size="xl" @click="increment" class="w-full justify-center">
    {{ props.label ? props.label + ': ' : '' }}{{ count }}
  </UButton>
</template>

<script setup lang="ts">
// defineProps: parent can pass an optional label to identify this counter
const props = defineProps<{
  label?: string
}>()

// defineEmits: notify parent every time the count changes
const emit = defineEmits<{
  change: [value: number]
}>()

const count = ref(0)

function increment() {
  count.value++
}

// watch: whenever count changes, emit the new value to the parent
watch(count, (newCount) => {
  emit('change', newCount)
})

// onMounted / onUnmounted: log the component's lifecycle (good for debugging)
onMounted(() => {
  console.log(`CounterButton "${props.label ?? 'unnamed'}" mounted`)
})

onUnmounted(() => {
  console.log(`CounterButton "${props.label ?? 'unnamed'}" unmounted`)
})
</script>
