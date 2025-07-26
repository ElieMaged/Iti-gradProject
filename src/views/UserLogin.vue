<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, provider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { ensureUserRole, fetchUserRole } from '../utils/userRole';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

// Forgot password functionality
const showForgotPasswordModal = ref(false);
const forgotPasswordEmail = ref('');
const forgotPasswordError = ref('');
const forgotPasswordSuccess = ref('');

const handleLogin = async () => {
  error.value = '';
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    // Enforce persistent admin role for admin emails
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
      // Enforce persistent admin role for admin emails
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

const openForgotPasswordModal = () => {
  showForgotPasswordModal.value = true;
  forgotPasswordEmail.value = '';
  forgotPasswordError.value = '';
  forgotPasswordSuccess.value = '';
};

const closeForgotPasswordModal = () => {
  showForgotPasswordModal.value = false;
  forgotPasswordEmail.value = '';
  forgotPasswordError.value = '';
  forgotPasswordSuccess.value = '';
};

const handleForgotPassword = async () => {
  forgotPasswordError.value = '';
  forgotPasswordSuccess.value = '';
  
  if (!forgotPasswordEmail.value.trim()) {
    forgotPasswordError.value = t('pleaseEnterEmail');
    return;
  }

  try {
    await sendPasswordResetEmail(auth, forgotPasswordEmail.value.trim());
    forgotPasswordSuccess.value = t('passwordResetEmailSent');
    // Auto-close modal after 3 seconds
    setTimeout(() => {
      closeForgotPasswordModal();
    }, 3000);
  } catch (err) {
    console.error('Password reset error:', err);
    switch (err.code) {
      case 'auth/user-not-found':
        forgotPasswordError.value = t('emailNotFound');
        break;
      case 'auth/invalid-email':
        forgotPasswordError.value = t('invalidEmail');
        break;
      case 'auth/too-many-requests':
        forgotPasswordError.value = t('tooManyRequests');
        break;
      default:
        forgotPasswordError.value = t('passwordResetFailed');
    }
  }
};
</script>

<template>

<body>
    
<div class="container pt-5  flex flex-col lg:flex-row">
<form class="flex flex-col justify-center align-items-center ml-10 mr-10 p-20 px-40" @submit.prevent="handleLogin">
    <img class="w-40" src="../assets/logo-secondary.png" alt="">
    <h1 class="title signup 3xl mb-5">{{ $t('welcomeBack') }}</h1>
    <p class="title">{{ $t('dontHaveAccount') }} <a href="/usersignup" class="brand">{{ $t('signUpNow') }}</a></p>

  <div class="mb-3">
    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 "></label>
    <input v-model="email" type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-120 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" :placeholder="$t('email')" required />
  </div>
<div class="relative mb-5">
    <input
      type="password"
      v-model="password"
      :placeholder="$t('enterPassword')"
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
      <!-- Remember me -->
<div class="flex flex-col md:flex-row  mb-5 ">

<div class="flex flex-row h-5">
      <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 " required />
    </div>
    <label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{ $t('rememberMe') }}</label>
    <div class="md:ml-30"><a href="#" @click.prevent="openForgotPasswordModal" class="forgot-password-link">{{ $t('forgotPassword') }}</a></div>
</div>
<!-- Login button -->
  <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-20 md:px-36 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex flex-row gap-x-3 mb-3">{{ $t('login') }}</button>
  <p v-if="error" class="text-red-500 mb-2">{{ error }}</p>
<p>{{ $t('or') }}</p>
  <button type="button" @click="handleGoogleSignIn" class=" hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-20 py-2.5 text-center bg-white text-black dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex flex-row gap-x-3 mb-3"> <img class="w-5 h-5" src="../assets/Icons/google.png" alt="">{{ $t('signInWithGoogle') }}
  </button>



</form>
<div>
<img class="md:mt-20 standing" src="../assets/login/standing.png" alt="">

</div>
</div>

<!-- Forgot Password Modal -->
<div v-if="showForgotPasswordModal" class="modal-overlay" @click="closeForgotPasswordModal">
  <div class="modal-content" @click.stop>
    <div class="modal-header">
      <h2 class="modal-title">{{ $t('forgotPassword') }}</h2>
      <button @click="closeForgotPasswordModal" class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <p class="modal-description">{{ $t('forgotPasswordDescription') }}</p>
      <div class="form-group">
        <label for="forgot-email" class="form-label">{{ $t('email') }}</label>
        <input
          id="forgot-email"
          v-model="forgotPasswordEmail"
          type="email"
          :placeholder="$t('enterYourEmail')"
          class="form-input"
          required
        />
      </div>
      <div v-if="forgotPasswordError" class="error-message">
        {{ forgotPasswordError }}
      </div>
      <div v-if="forgotPasswordSuccess" class="success-message">
        {{ forgotPasswordSuccess }}
      </div>
    </div>
    <div class="modal-footer">
      <button @click="closeForgotPasswordModal" class="btn-secondary">
        {{ $t('cancel') }}
      </button>
      <button @click="handleForgotPassword" class="btn-primary">
        {{ $t('sendResetEmail') }}
      </button>
    </div>
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

 .forgot-password-link {
    color: #625397;
    text-decoration: none;
    cursor: pointer;
 }
 .dark .forgot-password-link {
  color: var(--primary-color);
 }
 .forgot-password-link:hover {
    text-decoration: underline;
 }

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 1rem;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.dark .modal-content {
  background-color: var(--secondary-bg);
  color: var(--primary-text);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .modal-header {
  border-bottom-color: #374151;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.dark .modal-title {
  color: var(--primary-text);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
}

.modal-close:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.dark .modal-close:hover {
  background-color: #374151;
  color: var(--primary-text);
}

.modal-body {
  padding: 1.5rem;
}

.modal-description {
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.dark .modal-description {
  color: #9ca3af;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.dark .form-label {
  color: var(--primary-text);
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: white;
  color: #111827;
}

.dark .form-input {
  background-color: var(--primary-bg);
  border-color: #4b5563;
  color: var(--primary-text);
}

.form-input:focus {
  outline: none;
  border-color: #625397;
  box-shadow: 0 0 0 3px rgba(98, 83, 151, 0.1);
}

.dark .form-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(124, 107, 176, 0.1);
}

.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.dark .error-message {
  background-color: #450a0a;
  border-color: #7f1d1d;
  color: #fca5a5;
}

.success-message {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.dark .success-message {
  background-color: #052e16;
  border-color: #166534;
  color: #86efac;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 0 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.dark .modal-footer {
  border-top-color: #374151;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .btn-secondary {
  background-color: #374151;
  color: var(--primary-text);
  border-color: #4b5563;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

.dark .btn-secondary:hover {
  background-color: #4b5563;
  border-color: #6b7280;
}

.btn-primary {
  background-color: #625397;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .btn-primary {
  background-color: var(--primary-color);
  color: var(--primary-text);
}

.btn-primary:hover {
  background-color: #4c3d7a;
}

.dark .btn-primary:hover {
  background-color: #5a4b8a;
}

.btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.dark .btn-primary:disabled {
  background-color: #6b7280;
}
</style>