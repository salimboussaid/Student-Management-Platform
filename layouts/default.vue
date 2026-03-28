<template>
  <div class="relative" :class="themeClass">

    <!-- Grid Background (always visible on every page) -->
    <div class="fixed inset-0 -z-10 app-surface">
      <div class="absolute inset-0 grid-background"></div>
      <div class="absolute inset-0 grid-fade"></div>
    </div>

    <!-- ════════════════════════════════════════════════════════════════════════════ -->
        <!-- GUEST layout: top header + footer -->
   
    <div v-if="!isLoggedIn" class="min-h-screen flex flex-col">

      <header class="guest-header sticky top-0 z-50">
        <UContainer>
          <div class="flex items-center justify-between h-16">
            <NuxtLink to="/" class="font-bold text-xl brand-text">BoussaidMS</NuxtLink>
            <nav class="flex items-center gap-1 flex-wrap">
              <UButton to="/" variant="ghost" color="gray" size="sm">Home</UButton>
              <UButton to="/counters" variant="ghost" color="gray" size="sm">Counters</UButton>
              <UButton to="/inputs" variant="ghost" color="gray" size="sm">Inputs</UButton>
              <UButton to="/forms" variant="ghost" color="gray" size="sm">Forms</UButton>
              <UButton to="/faq" variant="ghost" color="gray" size="sm">FAQ</UButton>
              <UButton to="/theme-demo" variant="ghost" color="gray" size="sm">Theme Demo</UButton>
              <UButton
                variant="ghost"
                color="gray"
                size="sm"
                :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
                @click="toggleTheme"
              >
                {{ isDark ? 'Light' : 'Dark' }}
              </UButton>
              <UButton to="/login" color="black" size="sm">Login</UButton>
            </nav>
          </div>
        </UContainer>
      </header>

      <main class="flex-1">
        <UContainer class="py-8">
          <slot />
        </UContainer>
      </main>

      <footer class="guest-footer py-10">
        <UContainer>
          <div class="flex flex-wrap gap-10 justify-between">
            <div>
              <p class="font-bold text-lg brand-text">BoussaidMS</p>
              <p class="muted-text text-sm mt-1">Student management platform</p>
            </div>
            <div>
              <p class="font-semibold brand-text mb-2">Contact</p>
              <a href="mailto:salimboussaid@mail.ru" class="muted-text text-sm hover:text-current">
                salimboussaid@mail.ru
              </a>
            </div>
            <div>
              <p class="font-semibold brand-text mb-2">Social</p>
              <div class="flex flex-col gap-1">
                <a href="https://github.com/salimboussaid" target="_blank" class="muted-text text-sm hover:text-current">GitHub</a>
                <a href="https://www.linkedin.com/in/mohamed-salim-boussaid-1ba90a228/" target="_blank" class="muted-text text-sm hover:text-current">LinkedIn</a>
                <a href="https://t.me/salimbsd" target="_blank" class="muted-text text-sm hover:text-current">Telegram</a>
              </div>
            </div>
          </div>
          <UDivider class="my-6" />
          <p class="text-center text-sm muted-text">© 2026 Mohamed Salim Boussaid. All rights reserved.</p>
        </UContainer>
      </footer>

    </div>

    <!-- ════════════════════════════════════════════════════════════════════════════ -->
        <!--  LOGGED-IN layout: sidebar + content-->
    
    <div v-else class="flex min-h-screen">

      <!-- ── Sidebar ── -->
      <aside class="sidebar" :class="{ 'sidebar-dark': isDark }">

        <!-- Logo -->
        <div class="sidebar-logo">
          <NuxtLink to="/" class="font-bold text-xl brand-text">BoussaidMS</NuxtLink>
          <p class="text-xs muted-text mt-1">Student Platform</p>
          <UButton
            size="xs"
            variant="outline"
            color="gray"
            class="mt-3"
            :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            @click="toggleTheme"
          >
            {{ isDark ? 'Light mode' : 'Dark mode' }}
          </UButton>
        </div>

        <!-- Navigation links -->
        <nav class="flex-1 p-3 overflow-y-auto space-y-4">

          <!-- MAIN section -->
          <div>
            <p class="sidebar-section-label">Main</p>
            <div class="space-y-0.5">
              <UButton
                v-if="profileStore.isAdmin"
                to="/dashboard"
                variant="ghost"
                color="gray"
                block
                class="sidebar-link"
                icon="i-heroicons-chart-bar-square"
              >
                Admin Dashboard
              </UButton>
              <UButton
                v-else-if="profileStore.isStudent"
                to="/student-dashboard"
                variant="ghost"
                color="gray"
                block
                class="sidebar-link"
                icon="i-heroicons-chart-bar-square"
              >
                My Dashboard
              </UButton>
              <UButton
                to="/profile"
                variant="ghost"
                color="gray"
                block
                class="sidebar-link"
                icon="i-heroicons-user-circle"
              >
                Profile
              </UButton>
            </div>
          </div>

          <!-- ACADEMIC section (For Students and Teachers) -->
          <div v-if="profileStore.isStudent || profileStore.isTeacher">
            <p class="sidebar-section-label">Academic</p>
            <div class="space-y-0.5">
              <UButton
                to="/schedule"
                variant="ghost"
                color="gray"
                block
                class="sidebar-link"
                icon="i-heroicons-calendar"
              >
                Schedule
              </UButton>
              <UButton
                to="/grades"
                variant="ghost"
                color="gray"
                block
                class="sidebar-link"
                icon="i-heroicons-chart-pie"
              >
                Grades
              </UButton>
              <UButton
                to="/education-plan"
                variant="ghost"
                color="gray"
                block
                class="sidebar-link"
                icon="i-heroicons-academic-cap"
              >
                Education Plan
              </UButton>
            </div>
          </div>

          <!-- PROJECTS section -->
          <div v-if="profileStore.isStudent">
            <p class="sidebar-section-label">Projects & Tasks</p>
            <div class="space-y-0.5">
              <UButton
                to="/student-projects"
                variant="ghost"
                color="gray"
                block
                class="sidebar-link"
                icon="i-heroicons-rectangle-group"
              >
                My Projects
              </UButton>
            </div>
          </div>

          <!-- MANAGEMENT section (Admin only) -->
          <div v-if="profileStore.isAdmin">
            <p class="sidebar-section-label">Management</p>
            <div class="space-y-0.5">
              <UButton
                to="/projects"
                variant="ghost"
                color="gray"
                block
                class="sidebar-link"
                icon="i-heroicons-rectangle-group"
              >
                All Projects
              </UButton>
              <UButton
                to="/user-management"
                variant="ghost"
                color="gray"
                block
                class="sidebar-link"
                icon="i-heroicons-users"
              >
                User Management
              </UButton>
            </div>
          </div>

          <!-- MONITORING section (Admin only) -->
          <div v-if="profileStore.isAdmin">
            <p class="sidebar-section-label">Monitoring</p>
            <div class="space-y-0.5">
              <UButton
                to="/activity-log"
                variant="ghost"
                color="gray"
                block
                class="sidebar-link"
                icon="i-heroicons-clock"
              >
                Activity Log
              </UButton>
            </div>
          </div>

          <!-- ACCOUNT section -->
          <div>
            <p class="sidebar-section-label">Account</p>
            <div class="space-y-0.5">
              <UButton
                to="/settings"
                variant="ghost"
                color="gray"
                block
                class="sidebar-link"
                icon="i-heroicons-cog-6-tooth"
              >
                Settings
              </UButton>
            </div>
          </div>

        </nav>

        <!-- User info + Logout at the very bottom -->
        <div class="p-4 border-t border-gray-100 space-y-3" :class="{ 'border-gray-800': isDark }">
          <div class="flex items-center gap-3 px-2 py-2">
            <UAvatar
              v-if="userAvatar"
              :src="userAvatar"
              :alt="userName"
              size="sm"
            />
            <div
              v-else
              class="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0"
            >
              {{ userInitials }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold brand-text truncate">{{ userName }}</p>
              <p class="text-xs muted-text truncate">{{ userEmail }}</p>
            </div>
          </div>
          <UButton
            color="red"
            variant="soft"
            block
            icon="i-heroicons-arrow-right-on-rectangle"
            @click="logout"
          >
            Logout
          </UButton>
        </div>

      </aside>

      <!-- ── Page content (offset by sidebar width) ── -->
      <main class="flex-1 ml-64 min-h-screen">
        <div class="p-8">
          <slot />
        </div>
      </main>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useProfileStore } from '~/stores/profile'

const profileStore = useProfileStore()
const themeMode = useState<'light' | 'dark'>('theme-mode', () => 'light')

const isLoggedIn = computed(() => profileStore.isAuthorized)
const isDark = computed(() => themeMode.value === 'dark')
const themeClass = computed(() => (isDark.value ? 'theme-dark' : 'theme-light'))

const userName = computed(() => profileStore.profile?.name ?? 'Guest User')
const userEmail = computed(() => profileStore.profile?.email ?? 'guest@example.com')
const userAvatar = computed(() => profileStore.profile?.avatarUrl ?? '')
const userInitials = computed(() => {
  const source = profileStore.profile?.name ?? 'Guest User'
  return source
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
})

const applyTheme = (mode: 'light' | 'dark') => {
  if (!import.meta.client) {
    return
  }

  document.documentElement.classList.toggle('dark', mode === 'dark')
  localStorage.setItem('theme-mode', mode)
}

const toggleTheme = () => {
  themeMode.value = isDark.value ? 'light' : 'dark'
}

onMounted(() => {
  if (!import.meta.client) {
    return
  }

  const saved = localStorage.getItem('theme-mode')
  if (saved === 'light' || saved === 'dark') {
    themeMode.value = saved
  }

  applyTheme(themeMode.value)
})

watch(themeMode, (mode) => {
  applyTheme(mode)
})

const logout = () => {
  profileStore.logout()
  navigateTo('/login')
}
</script>

<style scoped>
/* ── Sidebar ── */
.sidebar {
  width: 16rem; /* 64 in Tailwind = 256px */
  background: var(--card-bg);
  backdrop-filter: blur(8px);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 40;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.04);
}

.sidebar-logo {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

/* Sidebar section labels */
.sidebar-section-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 0 0.75rem;
  margin-bottom: 0.25rem;
}

/* Sidebar links: left-aligned text */
.sidebar-link {
  justify-content: flex-start !important;
  text-align: left;
  font-size: 0.875rem;
}

.app-surface {
  background: var(--bg-color);
}

.guest-header,
.guest-footer {
  border-color: var(--border-color);
  background: color-mix(in srgb, var(--card-bg) 90%, transparent);
  backdrop-filter: blur(8px);
}

.brand-text {
  color: var(--text-primary);
}

.muted-text {
  color: var(--text-muted);
}

.sidebar-dark {
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25);
}

/* Grid background classes come from main.css */
</style>
