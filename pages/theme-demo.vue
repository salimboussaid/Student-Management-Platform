<template>
  <section class="space-y-6">
    <header class="theme-block rounded-xl p-6 border">
      <p class="text-xs uppercase tracking-wider theme-muted">New update for presentation</p>
      <h1 class="text-3xl font-bold mt-2 theme-title">Dark / Light Theme Demonstration</h1>
      <p class="mt-3 theme-muted">
        This page shows the new theme system added today. Use the toggle button in the top navigation.
      </p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <article class="theme-block rounded-xl p-5 border">
        <h2 class="font-semibold text-lg theme-title">What Was Added</h2>
        <ul class="mt-3 space-y-2 text-sm theme-muted list-disc pl-5">
          <li>Global dark and light mode support using shared CSS variables.</li>
          <li>Theme toggle button in top navigation and sidebar.</li>
          <li>Login page redesigned to remove blue background and match black/white style.</li>
          <li>Persistent theme mode saved in localStorage.</li>
        </ul>
      </article>

      <article class="theme-block rounded-xl p-5 border">
        <h2 class="font-semibold text-lg theme-title">User Demonstration</h2>
        <ol class="mt-3 space-y-2 text-sm theme-muted list-decimal pl-5">
          <li>Open this page and switch theme with the header button.</li>
          <li>Show that the background, card colors, text, and login page change together.</li>
          <li>Refresh the browser and show that selected theme remains saved.</li>
          <li>Open login page to show the new neutral black/white visual style.</li>
        </ol>
      </article>
    </div>

    <article class="theme-block rounded-xl p-5 border">
      <h2 class="font-semibold text-lg theme-title">Code Demonstration</h2>
      <ul class="mt-3 space-y-2 text-sm theme-muted list-disc pl-5">
        <li>Theme core: assets/css/main.css (light and dark CSS variables).</li>
        <li>Theme toggle logic: layouts/default.vue.</li>
        <li>Login redesign: pages/login.vue.</li>
        <li>Demo page itself: pages/theme-demo.vue.</li>
      </ul>
      <p class="mt-4 text-sm theme-muted">
        Important: this update is frontend only. No server code and no stores were changed for this feature.
      </p>
      <p class="mt-1 text-sm theme-muted">
        No commit is required from this page; it is only for explanation/demo.
      </p>
    </article>

    <div class="theme-block rounded-xl p-5 border flex flex-wrap gap-3 items-center justify-between">
      <p class="theme-muted text-sm">Quick links for the demo:</p>
      <div class="flex gap-2 flex-wrap">
        <UButton to="/login" color="black" size="sm">Open Login Page</UButton>
        <UButton to="/" variant="outline" color="gray" size="sm">Back Home</UButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.theme-block {
  background: var(--card-bg);
  border-color: var(--border-color);
}

.theme-title {
  color: var(--text-primary);
}

.theme-muted {
  color: var(--text-muted);
}
</style>
