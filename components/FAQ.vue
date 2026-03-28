<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

interface FAQItem {
  question: string
  answer: string
}

const faqs = ref<FAQItem[]>([
  {
    question: 'What is the purpose of this website?',
    answer: 'This is a student management platform designed to help track and manage student information, grades, and activities efficiently.'
  },
  {
    question: 'How do I contact support?',
    answer: 'You can reach us at salimboussaid@mail.ru or through our social media channels on GitHub, LinkedIn, and Telegram.'
  },
  {
    question: 'How do I navigate the platform?',
    answer: 'Navigate through the dashboard to explore all available features and tools. Use the navigation menu at the top to quickly find what you need.'
  },
  {
    question: 'Can I customize my dashboard?',
    answer: 'Yes! This is a digital platform with customizable features. Contact support for assistance with customization options.'
  },
  {
    question: 'Is the platform accessible globally?',
    answer: 'As a web-based platform, our services are accessible globally with an internet connection.'
  },
  {
    question: 'How can I track my progress?',
    answer: 'You can track your progress and activities through the dashboard section after logging in.'
  }
])

const openIndex = ref<number | null>(null)

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-black mb-4">Frequently Asked Questions</h1>
      <p class="text-gray-700">
        We are here to help you with any questions you may have. If you don't find what you need, please contact us at
        <a href="mailto:salimboussaid@mail.ru" class="text-black underline font-medium hover:opacity-70">salimboussaid@mail.ru</a>
      </p>
    </div>

    <div class="space-y-4">
      <div
        v-for="(faq, index) in faqs"
        :key="index"
        class="border-2 border-black rounded-lg overflow-hidden bg-white"
      >
        <button
          @click="toggle(index)"
          class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <span class="font-medium text-black">{{ faq.question }}</span>
          <ChevronDown
            :class="[
              'h-5 w-5 text-black transition-transform duration-200',
              openIndex === index ? 'rotate-180' : ''
            ]"
          />
        </button>
        <div
          v-show="openIndex === index"
          class="px-6 py-4 border-t-2 border-black bg-gray-50"
        >
          <p class="text-gray-700">{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
