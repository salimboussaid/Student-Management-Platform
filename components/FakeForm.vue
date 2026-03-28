<template>
  <!-- UCard gives the form a clean bordered container -->
  <UCard class="w-full max-w-sm">
    <template #header>
      <p class="font-semibold text-base">Contact Form</p>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- UFormGroup wraps a label + input together -->
      <UFormGroup label="Name">
        <UInput v-model="name" placeholder="Enter your name" />
      </UFormGroup>

      <UFormGroup label="Email">
        <UInput v-model="email" type="email" placeholder="Enter your email" />
      </UFormGroup>

      <!-- UButton replaces the plain submit button -->
      <UButton type="submit" color="black" block>Submit</UButton>
    </form>

    <!-- v-show: the result panel appears only after a successful submit -->
    <div v-show="submitted" class="mt-4 p-3 rounded bg-gray-50 border border-gray-200 text-sm">
      <p class="font-medium mb-1">Submitted!</p>
      <p class="text-gray-600">Name: {{ submittedName }}</p>
      <p class="text-gray-600">Email: {{ submittedEmail }}</p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
// defineEmits: tell the parent page what was submitted
const emit = defineEmits<{
  submitted: [name: string, email: string]
}>()

const name = ref('')
const email = ref('')
const submitted = ref(false)
const submittedName = ref('')
const submittedEmail = ref('')

function handleSubmit() {
  submittedName.value = name.value
  submittedEmail.value = email.value
  submitted.value = true

  emit('submitted', name.value, email.value)

  // Hide the result after 3 seconds
  setTimeout(() => {
    submitted.value = false
  }, 3000)
}
</script>
