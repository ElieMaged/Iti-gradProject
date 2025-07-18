<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')

function handleLogin() {
  // Replace with real login logic
  console.log('Logging in with:', email.value, password.value)
  alert(`Logged in as ${email.value}`)
}
</script>



<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card shadow-sm p-4" style="width: 100%; max-width: 400px;">
      <h3 class="card-title text-center mb-4">Login</h3>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-control"
            required
            placeholder="Enter your email"
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-control"
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" class="btn btn-primary w-100">Login</button>
      </form>
    </div>
  </div>
</template>

