<template>
  <div class="space-y-24">

    <!-- ══════════════════════════════════
         HERO
    ══════════════════════════════════ -->
    <section class="text-center pt-12 pb-4 anim-fade-up">

      <!-- Top badge -->
      <div class="flex justify-center mb-6">
        <UBadge color="primary" variant="soft" size="lg">
          ✦ Student Management Platform
        </UBadge>
      </div>

      <!-- Gradient headline -->
      <h1 class="hero-title">
        Welcome to<br>BoussaidMS
      </h1>

      <p class="text-xl text-gray-500 max-w-xl mx-auto mb-10">
        A modern platform to track grades, manage students, and analyse
        academic performance — all in one place.
      </p>

      <!-- CTA buttons -->
      <div class="flex justify-center gap-4 flex-wrap mb-10">
        <UButton to="/login" color="black" size="xl" icon="i-heroicons-rocket-launch">
          Get Started
        </UButton>
        <UButton to="/faq" color="gray" variant="outline" size="xl" icon="i-heroicons-book-open">
          Learn More
        </UButton>
      </div>

      <!-- ── UAvatarGroup (below the two buttons) ── -->
      <div class="flex flex-col items-center gap-3">
        <UAvatarGroup>
          <UAvatar
            src="https://github.com/benjamincanac.png"
            alt="Benjamin Canac"
            loading="lazy"
            :chip="{ inset: true, color: 'success' }"
          />
          <UAvatar
            src="https://github.com/romhml.png"
            alt="Romain Hamel"
            loading="lazy"
            :chip="{ inset: true, color: 'warning' }"
          />
          <UAvatar
            src="https://github.com/noook.png"
            alt="Neil Richter"
            loading="lazy"
            :chip="{ inset: true, color: 'error' }"
          />
        </UAvatarGroup>
        <p class="text-sm text-gray-400">
          Trusted by <strong class="text-black">1,200+</strong> students worldwide
        </p>
      </div>

    </section>

    <!-- ══════════════════════════════════
         STATS BAR
    ══════════════════════════════════ -->
    <section class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="stat-card anim-fade-up"
      >
        <p class="text-4xl font-black text-black">{{ stat.value }}</p>
        <p class="text-gray-400 text-sm mt-1">{{ stat.label }}</p>
      </div>
    </section>

    <!-- ══════════════════════════════════
         ABOUT THE PROJECT
    ══════════════════════════════════ -->
    <section class="about-section rounded-3xl p-10 md:p-14 relative overflow-hidden">

      <!-- Decorative blobs -->
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>

      <div class="grid md:grid-cols-2 gap-12 items-center relative z-10">

        <!-- Left: text -->
        <div class="anim-fade-up">
          <UBadge color="primary" variant="soft" class="mb-4">About the Project</UBadge>
          <h2 class="text-4xl font-bold text-black mb-5 leading-tight">
            A smarter way to<br>manage students
          </h2>
          <p class="text-gray-600 mb-6 leading-relaxed">
            BoussaidMS is built as a modern Nuxt 3 + Nuxt UI educational project.
            It demonstrates real-world Vue patterns: reactive state, composables,
            form handling, and component-driven architecture.
          </p>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="tech in techs"
              :key="tech"
              color="gray"
              variant="soft"
              size="lg"
            >
              {{ tech }}
            </UBadge>
          </div>
        </div>

        <!-- Right: animated UI mockup cards -->
        <div class="space-y-3">
          <div
            v-for="(mock, i) in mocks"
            :key="mock.grade"
            class="mockup-card anim-slide-in"
            :style="{ animationDelay: i * 80 + 'ms' }"
          >
            <div class="flex items-center gap-3">
              <!-- Grade circle -->
              <div
                class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                :class="mock.circleClass"
              >
                {{ mock.grade }}
              </div>
              <!-- Skeleton bars (simulate name + email) -->
              <div class="flex-1">
                <div class="h-3 bg-gray-200 rounded mb-1.5" :style="{ width: mock.w1 }"></div>
                <div class="h-2 bg-gray-100 rounded" :style="{ width: mock.w2 }"></div>
              </div>
              <!-- Status badge -->
              <UBadge :color="getBadgeColor(mock.grade)" variant="soft" size="xs">
                {{ mock.status }}
              </UBadge>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════════
         HOW IT WORKS
    ══════════════════════════════════ -->
    <section>
      <h2 class="text-3xl font-bold text-center mb-2">How it works</h2>
      <p class="text-gray-400 text-center mb-12">Three simple steps to get you started</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="step in steps"
          :key="step.number"
          class="step-card"
        >
          <div class="step-number">{{ step.number }}</div>
          <h3 class="text-lg font-bold text-black mt-5 mb-2">{{ step.title }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed">{{ step.description }}</p>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════
         PLATFORM FEATURES
    ══════════════════════════════════ -->
    <section>
      <h2 class="text-3xl font-bold text-center mb-8">Platform Features</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="feature-card-hover"
        >
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <span class="text-2xl">{{ feature.icon }}</span>
                <p class="font-semibold">{{ feature.title }}</p>
              </div>
            </template>
            <p class="text-gray-500 text-sm">{{ feature.description }}</p>
          </UCard>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════
         STUDENT DIRECTORY
    ══════════════════════════════════ -->
    <section>
      <h2 class="text-3xl font-bold text-center mb-4">Student Directory</h2>

      <!-- v-if / v-else: logged-in users see the full directory -->
      <div v-if="isLoggedIn">
        <StudentList
          :initial-students="initialStudents"
          v-model:search="studentSearch"
        />
      </div>
      <div v-else class="text-center py-12">
        <p class="text-gray-400 mb-4">Please log in to manage the student directory.</p>
        <UButton to="/login" color="black" icon="i-heroicons-lock-closed">Login to Access</UButton>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

const profileStore = useProfileStore()
const isLoggedIn = computed(() => profileStore.isAuthorized)
const studentSearch = ref('')

const stats = [
  { value: '1,200+', label: 'Students enrolled' },
  { value: '98%',    label: 'Satisfaction rate' },
  { value: '50+',    label: 'Active courses'    },
]

const techs = ['Nuxt 3', 'Vue 3', 'Nuxt UI', 'TypeScript', 'Tailwind CSS']

// Animated mockup cards in the About section
const mocks = [
  { grade: 'A+', circleClass: 'bg-green-100 text-green-700',   w1: '8rem', w2: '5rem',   status: 'Active'  },
  { grade: 'B+', circleClass: 'bg-yellow-100 text-yellow-700', w1: '7rem', w2: '4.5rem', status: 'Pending' },
  { grade: 'A',  circleClass: 'bg-blue-100 text-blue-700',     w1: '9rem', w2: '6rem',   status: 'Review'  },
  { grade: 'A-', circleClass: 'bg-purple-100 text-purple-700', w1: '6rem', w2: '3.5rem', status: 'Done'    },
]

// Returns a proper BadgeColor based on the grade letter
function getBadgeColor(grade: string): 'green' | 'yellow' | 'blue' | 'primary' {
  if (['A+', 'A'].includes(grade))  return 'green'
  if (['B+', 'B'].includes(grade))  return 'yellow'
  if (['A-'].includes(grade))       return 'blue'
  return 'primary'
}

const steps = [
  {
    number: '01',
    title: 'Create your account',
    description: 'Sign in with your credentials to access the full platform and student management tools.',
  },
  {
    number: '02',
    title: 'Add your students',
    description: 'Use the directory to add, search, and organise your student roster in seconds.',
  },
  {
    number: '03',
    title: 'Track & analyse',
    description: 'Monitor grades, filter by performance, and get a clear overview of your class.',
  },
]

const features = [
  { icon: '📈', title: 'Track Progress',  description: 'Monitor student performance and activities in real-time.'    },
  { icon: '👥', title: 'Manage Students', description: 'Efficiently organise and manage student information.'          },
  { icon: '📊', title: 'Analytics',       description: 'Generate insights from comprehensive data analysis.'           },
]

const initialStudents = [
  { name: 'Mohamed Salim Boussaid', email: 'salimboussaid@mail.ru',    grade: 'A+' },
  { name: 'Ahmed Hassan',           email: 'ahmed.hassan@example.com', grade: 'A'  },
  { name: 'Fatima Zahra',           email: 'fatima.z@example.com',     grade: 'A-' },
  { name: 'Karim Benzema',          email: 'karim.b@example.com',      grade: 'B+' },
  { name: 'Leila Mansour',          email: 'leila.m@example.com',      grade: 'C'  },
]
</script>

<style scoped>
/* ── Entrance animations ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0);    }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(28px); }
  to   { opacity: 1; transform: translateX(0);    }
}

.anim-fade-up  { animation: fadeUp  0.7s ease both; }
.anim-slide-in { animation: slideIn 0.6s ease both; }

/* ── Hero headline gradient ── */
.hero-title {
  font-size: 4rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.25rem;
  background: linear-gradient(135deg, #000 0%, #555 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Stat cards ── */
.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.07);
}

/* ── About section ── */
.about-section {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border: 1px solid #e5e7eb;
}

/* Decorative blurred blobs */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.12;
  pointer-events: none;
}
.blob-1 { width: 320px; height: 320px; background: #6366f1; top: -80px;   right: -60px;  }
.blob-2 { width: 220px; height: 220px; background: #06b6d4; bottom: -60px; left: 25%;    }

/* ── Mockup cards ── */
.mockup-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.875rem;
  padding: 1rem 1.25rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.mockup-card:hover {
  transform: translateX(6px);
  box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.06);
}

/* ── Step cards ── */
.step-card {
  text-align: center;
  padding: 2.5rem 2rem;
  border: 1px solid #e5e7eb;
  border-radius: 1.5rem;
  background: white;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.step-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

/* Outlined number (3D-sketch style) */
.step-number {
  font-size: 3.5rem;
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 2px #000;
  line-height: 1;
}

/* ── Feature card hover ── */
.feature-card-hover {
  transition: transform 0.25s ease;
}
.feature-card-hover:hover {
  transform: translateY(-6px);
}
</style>
