<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ensureUserRole, fetchUserRole } from '../utils/userRole';
import emailjs from 'emailjs-com';

const email = ref('');
const password = ref('');
const confirmPass = ref('');
const firstName = ref('');
const lastName = ref('');
const error = ref('');
const router = useRouter();

// Function to send welcome email to the user
async function sendWelcomeEmail(userEmail, firstName, lastName) {
  try {
    console.log('=== SENDING WELCOME EMAIL TO USER ===');
    console.log('Email:', userEmail);
    console.log('Name:', firstName, lastName);

    const fullName = `${firstName} ${lastName}`.trim();
    
    const templateParams = {
      to_email: userEmail,
      to_name: fullName || 'Valued Customer',
      subject: 'Welcome to BoltFix! Your Account is Ready',
      message: `Dear ${fullName || 'Valued Customer'},\n\nWelcome to BoltFix! Your account has been successfully created and you're now ready to connect with skilled technicians for all your home service needs.\n\nYour account details:\nEmail: ${userEmail}\n\nYou can now:\n- Browse available technicians\n- Book appointments\n- Track your bookings\n- Leave reviews\n\nThank you for choosing BoltFix!\n\nBest regards,\nThe BoltFix Team`
    };

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
    console.log('Welcome email sent successfully!');
    return true;
  } catch (error) {
    console.error('=== ERROR SENDING WELCOME EMAIL ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    return false;
  }
}

const handleRegister = async () => {
  error.value = '';
  if (password.value !== confirmPass.value) {
    error.value = "Passwords do not match.";
    return;
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    
    // Send welcome email using reactive form data
    await sendWelcomeEmail(email.value, firstName.value, lastName.value);
    
    // Enforce persistent admin role for elie1400674@gmail.com
    await ensureUserRole(userCredential.user);
    await fetchUserRole(userCredential.user);
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
    <h1 class="title signup 3xl">{{ $t('signUp') }}</h1>
    <p class="title">{{ $t('createAccount') }}</p>
    <!-- first name -->
  <div class="mb-3">
    <label for="firstName" class="block mb-2 text-sm font-medium text-gray-900"></label>
    <input type="firstName" id="firstName" v-model="firstName" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" :placeholder="$t('firstName')" required />
  </div>
  <!-- last name -->
    <div class="mb-3">
    <label for="lastName" class="block mb-2 text-sm font-medium text-gray-900"></label>
    <input type="lastName" id="lastName" v-model="lastName" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" :placeholder="$t('lastName')" required />
  </div>
  <div class="mb-3">
    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 "></label>
    <input type="email" id="email" v-model="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" :placeholder="$t('email')" required />
  </div>
   <div class="mb-3">
    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 "></label>
    <input type="password" id="password" v-model="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" :placeholder="$t('password')" required />
  </div>


  <div class="mb-3">
    <label for="confirmPass" class="block mb-2 text-sm font-medium text-gray-900 "></label>
    <input type="confirmPass" id="confirmPass" v-model="confirmPass" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-5" :placeholder="$t('confirmPassword')" required />
  </div>

  <div class="form-group form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1">
    <label class="form-check-label mb-5" for="exampleCheck1">{{ $t('agreeToTerms') }}</label>
  </div>


  <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-20 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex flex-row gap-x-3 mb-3 ">{{ $t('register') }}  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-up-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z"/>
</svg></button>
  <p v-if="error" class="text-red-500 mb-2">{{ error }}</p>
<p>{{ $t('haveAccount') }} <a href="/userlogin">{{ $t('signIn') }}</a></p>



</form>
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
    margin-bottom: 2rem;
 }
 .dark form {
  background-color: var(--secondary-bg);
 }
 input {
    background-color: #EAEAEA;
    border-radius: 2rem;
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
 }
 .dark button {
  background-color: var(--primary-color);
  color: var(--primary-text);
 }
</style>