<template>
  <div class="page-container">
    <h1 class="page-title">Forms Demo</h1>
    <p class="page-description">
      Fill out and submit the forms below. Each form will display the submitted data 
      and log it to the console.
    </p>

    <div class="forms-grid">
      <FakeForm v-for="i in 4" :key="i" />
    </div>

  
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #000;
  margin-bottom: 1rem;
  text-align: center;
}

.page-description {
  text-align: center;
  color: #666;
  font-size: 1.125rem;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.forms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.info-section {
  background-color: #fff;
  border: 2px solid #000;
  border-radius: 0.5rem;
  padding: 2rem;
  margin-top: 3rem;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 1rem;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  color: #444;
  padding: 0.5rem 0;
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .forms-grid {
    grid-template-columns: 1fr;
  }
}
</style>
