<template>
  <div class="test-page">
    <h1>Test Page</h1>
    <p>If you can see this, routing is working!</p>
    <router-link to="/">Go Home</router-link>
  </div>
</template>

<script>
export default {
  name: 'TestPage'
}
</script>

<style scoped>
.test-page {
  padding: 2rem;
  text-align: center;
}
.dark .test-page {
  background-color: var(--primary-bg);
}
.dark .test-page p {
  color: var(--primary-text);
}
.dark .test-page a {
  color: var(--primary-text);
}
</style> 