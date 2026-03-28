<template>
  <div class="max-w-2xl mx-auto space-y-6">

    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold">Input Loggers</h1>
      <p class="text-gray-600 mt-2">
        Type in any field — open the browser console to see live logging.
      </p>
    </div>

    <!--
      v-for with :key — renders one LogInput per field in the array.
      Each LogInput uses defineModel, so field.value is kept in sync.
    -->
    <LogInput
      v-for="field in fields"
      :key="field.id"
      v-model="field.value"
      :placeholder="field.placeholder"
      :label="field.label"
    />

    <!--
      v-show: this preview card only appears once the user has typed
      something in at least one field.
    -->
    <UCard v-show="hasAnyValue">
      <template #header>
        <p class="font-semibold text-sm">Current values</p>
      </template>

      <div class="space-y-1">
        <p v-for="field in fields" :key="field.id" class="text-sm text-gray-600">
          <span class="font-medium text-black">{{ field.label }}:</span>
          {{ field.value || '—' }}
        </p>
      </div>
    </UCard>

  </div>
</template>

<script setup lang="ts">
// reactive() lets Vue track changes inside the array items (including field.value)
const fields = reactive([
  { id: 1, label: 'Name',    placeholder: 'Enter your name…',    value: '' },
  { id: 2, label: 'Email',   placeholder: 'Enter your email…',   value: '' },
  { id: 3, label: 'Phone',   placeholder: 'Enter your phone…',   value: '' },
  { id: 4, label: 'Address', placeholder: 'Enter your address…', value: '' },
  { id: 5, label: 'City',    placeholder: 'Enter your city…',    value: '' },
  { id: 6, label: 'Country', placeholder: 'Enter your country…', value: '' },
])

// true as soon as at least one field has been filled in
const hasAnyValue = computed(() => fields.some(f => f.value.length > 0))
</script>
