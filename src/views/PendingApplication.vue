<template>
  <div class="pending-application-bg min-h-screen flex items-center justify-center">
    <div class="pending-application-card w-full max-w-2xl rounded-3xl shadow-lg p-10">
      <div class="flex flex-col items-center text-center">
        <div class="pending-icon mb-6">
          <i class="fas fa-clock text-6xl text-yellow-500"></i>
        </div>
        
        <h1 class="text-3xl font-bold text-[#6B4FA1] mb-4">{{ $t('applicationPending') }}</h1>
        
        <div class="status-card bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6 w-full">
          <div class="flex items-center justify-center mb-4">
            <div class="loading-spinner mr-3"></div>
            <span class="text-lg font-semibold text-yellow-700">{{ $t('underReview') }}</span>
          </div>
          <p class="text-gray-600 text-center">{{ $t('applicationUnderReview') }}</p>
        </div>
        
        <div class="info-section w-full mb-6">
          <h3 class="text-xl font-semibold text-[#6B4FA1] mb-4">{{ $t('whatHappensNext') }}</h3>
          <div class="space-y-3">
            <div class="flex items-start">
              <div class="step-number mr-3">1</div>
              <p class="text-gray-700">{{ $t('adminReviewStep') }}</p>
            </div>
            <div class="flex items-start">
              <div class="step-number mr-3">2</div>
              <p class="text-gray-700">{{ $t('approvalNotificationStep') }}</p>
            </div>
            <div class="flex items-start">
              <div class="step-number mr-3">3</div>
              <p class="text-gray-700">{{ $t('accessGrantedStep') }}</p>
            </div>
          </div>
        </div>
        
        <div class="contact-info bg-blue-50 border border-blue-200 rounded-xl p-4 w-full mb-6">
          <h4 class="font-semibold text-blue-800 mb-2">{{ $t('needHelp') }}</h4>
          <p class="text-blue-700 text-sm">{{ $t('contactSupport') }}</p>
        </div>
        
        <div class="actions w-full">
          <button @click="goHome" class="btn-primary w-full mb-3">
            {{ $t('goToHomepage') }}
          </button>
          <button @click="logout" class="btn-secondary w-full">
            {{ $t('logout') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default {
  name: 'PendingApplication',
  setup() {
    const router = useRouter();

    const goHome = () => {
      router.push('/');
    };

    const logout = async () => {
      try {
        await signOut(auth);
        localStorage.removeItem('userType');
        router.push('/');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    return {
      goHome,
      logout
    };
  }
};
</script>

<style scoped>
.pending-application-bg {
  background-color: #d3cfe2;
  min-height: 100vh;
}

.pending-application-card {
  background-color: white;
  border-radius: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.pending-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #f59e0b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.step-number {
  width: 24px;
  height: 24px;
  background-color: #6B4FA1;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.btn-primary {
  background-color: #6B4FA1;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #5a4a8c;
}

.btn-secondary {
  background-color: transparent;
  color: #6B4FA1;
  padding: 12px 24px;
  border: 2px solid #6B4FA1;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background-color: #6B4FA1;
  color: white;
}

/* Dark mode support */
.dark .pending-application-card {
  background-color: var(--secondary-bg);
  color: var(--primary-text);
}

.dark .status-card {
  background-color: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.3);
}

.dark .contact-info {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}
</style> 