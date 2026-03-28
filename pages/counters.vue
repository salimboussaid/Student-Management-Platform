<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-2">Counter Buttons</h1>
    <p class="text-center text-gray-600 mb-6">
      Click to increment. Each button tracks its own count independently.
    </p>

    <!-- AppToggle (defineModel) lets the user switch on/off labels -->
    <div class="flex justify-center mb-8">
      <AppToggle v-model="showLabels" label="Show labels" />
    </div>

    <!-- v-for with :key — renders 10 independent counter buttons -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      <CounterButton
        v-for="i in 10"
        :key="i"
        :label="showLabels ? `Counter ${i}` : undefined"
        @change="(val) => console.log(`Counter ${i} →`, val)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Controls whether the button labels are visible (bound to AppToggle via v-model)
const showLabels = ref(false)
</script>
