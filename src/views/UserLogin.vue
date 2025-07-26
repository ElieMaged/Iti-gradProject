<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, provider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { ensureUserRole, fetchUserRole } from '../utils/userRole';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const handleLogin = async () => {
  error.value = '';
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    // Enforce persistent admin role for elie1400674@gmail.com
    await ensureUserRole(userCredential.user);
    await fetchUserRole(userCredential.user);
    router.push('/');
  } catch (err) {
    error.value = err.message;
  }
};

const handleGoogleSignIn = async () => {
  error.value = '';
  try {
    const result = await signInWithPopup(auth, provider);
    if (result && result.user) {
      // Enforce persistent admin role for elie1400674@gmail.com
      await ensureUserRole(result.user);
      await fetchUserRole(result.user);
      router.push('/');
    } else {
      error.value = 'Google sign-in failed. No user returned.';
      console.error('Google sign-in failed. No user returned.', result);
    }
  } catch (err) {
    error.value = err.message;
    console.error('Google sign-in error:', err);
  }
};
</script>

<template>

<body>
    
<div class="container pt-5  flex flex-col lg:flex-row">
<form class="flex flex-col justify-center align-items-center ml-10 mr-10 p-20 px-40" @submit.prevent="handleLogin">
    <img class="w-40" src="../assets/logo-secondary.png" alt="">
    <h1 class="title signup 3xl mb-5">Welcome Back!</h1>
    <p class="title">Don’t have an account yet? <a href="/usersignup" class="brand">Sign Up Now</a></p>

  <div class="mb-3">
    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 "></label>
    <input v-model="email" type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-120 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email" required />
  </div>
<div class="relative mb-5">
    <input
      type="password"
      v-model="password"
      placeholder="Enter your password"
      class="w-120 px-4 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 text-gray-400 absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  </div>
      <!-- Remeber me -->
<div class="flex flex-col md:flex-row  mb-5 ">

<div class="flex flex-row h-5">
      <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 " required />
    </div>
    <label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
    <div class="md:ml-30"><a href="#">Forgot Password?</a></div>
</div>
<!-- Login button -->
  <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-20 md:px-36 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex flex-row gap-x-3 mb-3">Login</button>
  <p v-if="error" class="text-red-500 mb-2">{{ error }}</p>
<p>OR</p>
  <button type="button" @click="handleGoogleSignIn" class=" hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-20 py-2.5 text-center bg-white text-black dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex flex-row gap-x-3 mb-3"> <img class="w-5 h-5" src="../assets/Icons/google.png" alt="">Sign in with Google
  </button>



</form>
<div>
<img class="md:mt-20 standing" src="../assets/login/standing.png" alt="">

</div>
</div>
</body>

</template>

<style scoped>
body {
    background-color: #d3cfe2;
}
.dark body {
  background-color: var(--primary-bg);
}

 form {
    background-color: white;
    border-radius: 2rem;
 }
 .dark form {
  background-color: var(--secondary-bg);
 }

 input {
    background-color: #EAEAEA;
    border-radius: 2rem;
 }
 .dark input {
  background-color: var(--secondary-bg);
 }

 .signup {
    color: #625397;
 }
 .dark .signup {
  color: var(--primary-color);
 }  
 button {
    background-color: #625397;
    border-radius: 2rem;
    border: black solid .1rem;
 }
 .dark button {
  background-color: var(--primary-color);
  color: var(--primary-text);
 }
 .standing {
    width: 100%;
 }

 .brand {
    color: #625397;
 }
 .dark .brand {
  color: var(--primary-color);
 }
 .google {
    background-color: white;
  }
</style>