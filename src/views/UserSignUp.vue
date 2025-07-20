<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const email = ref('');
const password = ref('');
const confirmPass = ref('');
const error = ref('');
const router = useRouter();

const handleRegister = async () => {
  error.value = '';
  if (password.value !== confirmPass.value) {
    error.value = "Passwords do not match.";
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    router.push('/'); // Redirect to home page after registration
  } catch (err) {
    error.value = err.message;
  }
};
</script>

<template>

<body>
    
<div class="container pt-5 ">
<form class="flex flex-col justify-center align-items-center ml-10 mr-10" @submit.prevent="handleRegister">
    <img class="w-40" src="../assets/logo-secondary.png" alt="">
    <h1 class="title signup 3xl">Sign Up</h1>
    <p class="title">Create An Account</p>
    <!-- first name -->
  <div class="mb-3">
    <label for="firstName" class="block mb-2 text-sm font-medium text-gray-900"></label>
    <input type="firstName" id="firstName" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="First Name" required />
  </div>
  <!-- last name -->
    <div class="mb-3">
    <label for="lastName" class="block mb-2 text-sm font-medium text-gray-900"></label>
    <input type="lastName" id="lastName" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Last Name" required />
  </div>
  <div class="mb-3">
    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 "></label>
    <input type="email" id="email" v-model="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email" required />
  </div>
   <div class="mb-3">
    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 "></label>
    <input type="password" id="password" v-model="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Password" required />
  </div>


  <div class="mb-3">
    <label for="confirmPass" class="block mb-2 text-sm font-medium text-gray-900 "></label>
    <input type="confirmPass" id="confirmPass" v-model="confirmPass" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-5" placeholder="Confirm Password" required />
  </div>

  <div class="form-group form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1">
    <label class="form-check-label mb-5" for="exampleCheck1">I agree to the Terms & Conditions and Privacy policy</label>
  </div>


  <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-20 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex flex-row gap-x-3 mb-3 ">Register  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-up-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z"/>
</svg></button>
  <p v-if="error" class="text-red-500 mb-2">{{ error }}</p>
<p>Have an account?<a href="/userlogin">Sign In</a></p>



</form>
</div>
</body>

</template>

<style scoped>
body {
    background-color: #d3cfe2;
}

 form {
    background-color: white;
    border-radius: 2rem;
 }

 input {
    background-color: #EAEAEA;
    border-radius: 2rem;
 }

 .signup {
    color: #625397;
 }

 button {
    background-color: #625397;
    border-radius: 2rem;
 }
</style>