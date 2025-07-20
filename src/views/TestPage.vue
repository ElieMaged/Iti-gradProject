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
</style> 