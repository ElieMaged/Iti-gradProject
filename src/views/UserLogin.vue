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
  <!-- Main Content -->
  <div class="main-container">
    <!-- Login Form Card -->
    <div class="login-card">
      <div class="logo-container">
        <img class="logo-image" src="../assets/logo-secondary.png" alt="BoltFix Logo">
      </div>
      <h1 class="welcome-text">{{ $t('welcomeBack') }}</h1>
      <p class="signup-text">{{ $t('dontHaveAccount') }} <a href="/usersignup" class="signup-link">{{ $t('signUpNow') }}</a></p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <input 
            v-model="email" 
            type="email" 
            :placeholder="$t('email')" 
            class="form-input" 
            required 
          />
        </div>
        
        <div class="input-group password-group">
          <input
            v-model="password"
            type="password"
            :placeholder="$t('enterPassword')"
            class="form-input"
            required
          />
          <i class="fa-solid fa-eye password-toggle"></i>
        </div>

        <div class="form-options">
          <div class="remember-me">
            <input id="remember" type="checkbox" class="checkbox" />
            <label for="remember">{{ $t('rememberMe') }}</label>
          </div>
          <a href="#" @click.prevent="openForgotPasswordModal" class="forgot-password-link">
            {{ $t('forgotPassword') }}
          </a>
        </div>

        <button type="submit" class="login-btn">
          {{ $t('login') }}
          <i class="fa-solid fa-arrow-right"></i>
        </button>
        
        <p v-if="error" class="error-message">{{ error }}</p>
        
        <div class="divider">
          <span>{{ $t('or') }}</span>
        </div>
        
        <button type="button" @click="handleGoogleSignIn" class="google-btn">
          <img src="../assets/Icons/google.png" alt="Google" class="google-icon" />
          {{ $t('signInWithGoogle') }}
        </button>
      </form>
    </div>

    <!-- Worker Image -->
    <div class="worker-image-container">
      <img src="../assets/login/standing.png" alt="Worker" class="worker-image" />
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
</template>

<style scoped>
/* Main Container */
.main-container {
  background-color: #d3cfe2;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}
.dark .main-container {
  background-color: var(--primary-bg);
} 
/* Login Card */
.login-card {
  background-color: white;
  border-radius: 32px;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
.dark .login-card {
  background-color: var(--secondary-bg);
}

.logo-container {
  text-align: center;
  margin-bottom: 20px;
  display: flex;
justify-content: center;
align-items: center;
}

.logo-image {
  width: 106.437px;
height: 101px;
flex-shrink: 0;
aspect-ratio: 106.44/101.00;

}

.welcome-text {
  font-size: 28px;
  font-weight: bold;
  color: #625397;
  text-align: center;
  margin-bottom: 10px;
}

.signup-text {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.signup-link {
  color: #625397;
  text-decoration: none;
  font-weight: 500;
}

.signup-link:hover {
  text-decoration: underline;
}

/* Form Styles */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 15px;
  border: 1px solid #e5e7eb;
  border-radius: 16px !important;
  background-color: #f9fafb;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #625397;
  background-color: white;
}

.password-group {
  position: relative;
}

.password-group .form-input {
  border-radius: 16px !important;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  cursor: pointer;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox {
  width: 16px;
  height: 16px;
  accent-color: #625397;
}

.forgot-password-link {
  color: #625397;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password-link:hover {
  text-decoration: underline;
}

.login-btn {
  background-color: #625397;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #4c3d7a;
}

.error-message {
  color: #dc2626;
  text-align: center;
  font-size: 14px;
}

.divider {
  text-align: center;
  position: relative;
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #e5e7eb;
}

.divider span {
  padding: 0 15px;
  color: #666;
  font-size: 14px;
  margin: 0 10px;
}

.google-btn {
  background-color: white;
  color: #000;
  border: 1px solid #e5e7eb;
  padding: 15px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;
}

.google-btn:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.google-icon {
  width: 20px;
  height: 20px;
}

/* Worker Image */
.worker-image-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 600px;
}

.worker-image {
  width: 437px;
height: 466px;
flex-shrink: 0;
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
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

.modal-body {
  padding: 1.5rem;
}

.modal-description {
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
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

.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
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

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 0 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid #e5e7eb;
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

.btn-secondary:hover {
  background-color: #e5e7eb;
  border-color: #9ca3af;
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

.btn-primary:hover {
  background-color: #4c3d7a;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    gap: 30px;
  }
  
  .login-card {
    padding: 30px 20px;
  }
}
</style>