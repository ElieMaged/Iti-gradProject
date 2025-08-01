<script>
import { ref, reactive } from 'vue';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.js';

export default {
  name: 'Contact',
  setup() {
    const formData = reactive({
      name: '',
      email: '',
      subject: '',
      complaint: ''
    });

    const formErrors = reactive({
      name: '',
      email: '',
      subject: '',
      complaint: ''
    });

    const isSubmitting = ref(false);
    const submitSuccess = ref(false);
    const submitError = ref('');

    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const validateForm = () => {
      let isValid = true;
      
      // Reset errors
      Object.keys(formErrors).forEach(key => {
        formErrors[key] = '';
      });

      // Validate name
      if (!formData.name.trim()) {
        formErrors.name = 'Name is required';
        isValid = false;
      } else if (formData.name.trim().length < 2) {
        formErrors.name = 'Name must be at least 2 characters';
        isValid = false;
      }

      // Validate email
      if (!formData.email.trim()) {
        formErrors.email = 'Email is required';
        isValid = false;
      } else if (!validateEmail(formData.email)) {
        formErrors.email = 'Please enter a valid email address';
        isValid = false;
      }

      // Validate subject
      if (!formData.subject.trim()) {
        formErrors.subject = 'Subject is required';
        isValid = false;
      } else if (formData.subject.trim().length < 5) {
        formErrors.subject = 'Subject must be at least 5 characters';
        isValid = false;
      }

      // Validate complaint
      if (!formData.complaint.trim()) {
        formErrors.complaint = 'Message is required';
        isValid = false;
      } else if (formData.complaint.trim().length < 10) {
        formErrors.complaint = 'Message must be at least 10 characters';
        isValid = false;
      }

      return isValid;
    };

    const clearForm = () => {
      Object.keys(formData).forEach(key => {
        formData[key] = '';
      });
      Object.keys(formErrors).forEach(key => {
        formErrors[key] = '';
      });
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      
      if (!validateForm()) {
        return;
      }

      isSubmitting.value = true;
      submitError.value = '';

      try {
        console.log('Creating contact form notification...');
        
        // Create notification document in Firestore
        const notificationData = {
          type: 'contact_form',
          title: `New Contact Form Submission: ${formData.subject}`,
          message: formData.complaint,
          senderName: formData.name,
          senderEmail: formData.email,
          subject: formData.subject,
          status: 'unread',
          createdAt: serverTimestamp(),
          priority: 'medium'
        };

        console.log('Notification data:', notificationData);

        // Add notification to Firestore
        const docRef = await addDoc(collection(db, 'notifications'), notificationData);
        
        console.log('Notification created successfully with ID:', docRef.id);
        
        submitSuccess.value = true;
        clearForm();
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          submitSuccess.value = false;
        }, 5000);
        
      } catch (error) {
        console.error('=== ERROR CREATING NOTIFICATION ===');
        console.error('Error details:', error);
        console.error('Error message:', error.message || 'No error message');
        console.error('Error code:', error.code || 'No error code');
        
        submitError.value = `Failed to send message: ${error.message || 'Unknown error'}. Please try again or contact us directly.`;
      } finally {
        isSubmitting.value = false;
      }
    };

    const handleInput = (field) => {
      // Clear error when user starts typing
      if (formErrors[field]) {
        formErrors[field] = '';
      }
    };

    return {
      formData,
      formErrors,
      isSubmitting,
      submitSuccess,
      submitError,
      handleSubmit,
      handleInput
    };
  }
};
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-32 justify-center items-center min-h-[calc(100vh-100px)] px-20 py-10">
    <div class="flex flex-col gap-5">
      <div>
        <h2 class="title text-7xl font-semibold">{{ $t('contactUs') }}</h2>
        <p class="text-large text-xl leading-relaxed">{{ $t('contactIntro') }}<br>We're here to help and answer any questions you might have.</p>
      </div>

      <div class="flex flex-col md:grid md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-2 items-center text-center">
          <div class="flex flex-col items-center gap-2">
            <i class="fas fa-phone text-6xl text-[#625397]"></i>
            <h4 class="text-xl">{{ $t('phone') }}</h4>
          </div>
          <p class="text-xl">+20 112 345 5565</p>
        </div>

        <div class="flex flex-col gap-2 items-center text-center">
          <div class="flex flex-col items-center gap-2">
            <i class="fab fa-whatsapp text-6xl text-[#625397]"></i>
            <h3 class="text-xl">{{ $t('whatsapp') }}</h3>
          </div>
          <p class="text-xl">+20 112 345 5565</p>
        </div>

        <div class="flex flex-col gap-2 items-center text-center">
          <div class="flex flex-col items-center gap-2">
            <i class="fas fa-envelope text-6xl text-[#625397]"></i>
            <h4 class="text-xl">{{ $t('email') }}</h4>
          </div>
          <a href="mailto:boltfix@gmail.com" class="text-xl">boltfix@gmail.com</a>
        </div>

        <div class="flex flex-col gap-2 items-center text-center">
          <div class="flex flex-col items-center gap-2">
            <i class="fab fa-facebook text-6xl text-[#625397]"></i>
            <h4 class="text-xl">{{ $t('facebook') }}</h4>
          </div>
          <p class="text-xl">facebook/link</p>
        </div>
      </div>
    </div>

    <form @submit="handleSubmit" class="flex flex-col">
      <h2 class="title text-7xl font-semibold">{{ $t('getInTouch') }}</h2>
      
      <!-- Success Message -->
      <div v-if="submitSuccess" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
        <div class="flex items-center">
          <i class="fas fa-check-circle mr-2"></i>
          <span>Thank you! Your message has been sent successfully. We'll get back to you soon.</span>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="submitError" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <div class="flex items-center">
          <i class="fas fa-exclamation-circle mr-2"></i>
          <span>{{ submitError }}</span>
        </div>
      </div>

      <div class="mb-3">
        <label for="name" class="block mb-2 text-xl font-medium text-gray-900">{{ $t('name') }}</label>
        <input 
          v-model="formData.name"
          @input="handleInput('name')"
          type="text" 
          id="name"
          :class="[
            'w-full bg-gray-50 border text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500',
            formErrors.name ? 'border-red-500' : 'border-gray-300'
          ]"
          :placeholder="$t('name')" 
          required 
        />
        <p v-if="formErrors.name" class="mt-1 text-sm text-red-600">{{ formErrors.name }}</p>
      </div>

      <div class="mb-3">
        <label for="email" class="block mb-2 text-xl font-medium text-gray-900">{{ $t('yourEmail') }}</label>
        <input 
          v-model="formData.email"
          @input="handleInput('email')"
          type="email" 
          id="email"
          :class="[
            'w-full bg-gray-50 border text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500',
            formErrors.email ? 'border-red-500' : 'border-gray-300'
          ]"
          :placeholder="$t('yourEmail')" 
          required 
        />
        <p v-if="formErrors.email" class="mt-1 text-sm text-red-600">{{ formErrors.email }}</p>
      </div>

      <div class="mb-3">
        <label for="subject" class="block mb-2 text-xl font-medium text-gray-900">{{ $t('yourSubject') }}</label>
        <input 
          v-model="formData.subject"
          @input="handleInput('subject')"
          type="text" 
          id="subject"
          :class="[
            'w-full bg-gray-50 border text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500',
            formErrors.subject ? 'border-red-500' : 'border-gray-300'
          ]"
          :placeholder="$t('yourSubject')" 
          required 
        />
        <p v-if="formErrors.subject" class="mt-1 text-sm text-red-600">{{ formErrors.subject }}</p>
      </div>

      <div class="mb-3">
        <label for="complaint" class="block mb-2 text-xl font-medium text-gray-900">{{ $t('yourComplaint') }}</label>
        <textarea 
          v-model="formData.complaint"
          @input="handleInput('complaint')"
          id="complaint"
          rows="4"
          :class="[
            'w-full bg-gray-50 border text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-150 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
            formErrors.complaint ? 'border-red-500' : 'border-gray-300'
          ]"
          :placeholder="$t('myComplaintIs')" 
          required
        ></textarea>
        <p v-if="formErrors.complaint" class="mt-1 text-sm text-red-600">{{ formErrors.complaint }}</p>
      </div>

      <button 
        type="submit"
        :disabled="isSubmitting"
        :class="[
          'text-white font-medium rounded-lg text-xl w-full sm:w-auto p-3 text-center transition-all duration-200',
          isSubmitting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        ]"
      >
        <span v-if="isSubmitting" class="flex items-center justify-center">
          <i class="fas fa-spinner fa-spin mr-2"></i>
          Sending...
        </span>
        <span v-else>{{ $t('submit') }}</span>
      </button>
    </form>
  </div>

</template>

<style scoped>
.title {
  color: #625397;
}

input,
textarea {
  background-color: #EAEAEA;
  border-radius: 5rem;
}

button {
  background-color: #625397;
  border-radius: 3rem;
}

button:hover {
  background-color: #7563b7;
}

button:active {
  background-color: #433867;
}

.dark .title {
  color: var(--primary-text) !important;
}

.dark input,
textarea {
  background-color: var(--input-bg) !important;
  color: var(--primary-text-dark) !important;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .flex.flex-col.lg\:flex-row {
    gap: 2rem;
    padding: 1rem;
  }
  
  .title {
    font-size: 2.5rem;
  }
  
  .text-large {
    font-size: 1.125rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
}

@media (max-width: 768px) {
  .flex.flex-col.lg\:flex-row {
    margin: 1rem;
    gap: 2rem;
    padding: 1rem;
    min-height: auto;
  }
  
  .title {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
  
  .text-large {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .text-xl {
    font-size: 1rem;
  }
  
  .flex.flex-col.md\:grid.md\:grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .flex.flex-col.gap-2 {
    gap: 0.75rem;
  }
  
  .flex.flex-col.items-center.gap-2 {
    gap: 0.75rem;
  }
  
  .text-6xl {
    font-size: 3rem;
  }
  
  h3, h4 {
    font-size: 1rem;
  }
  
  p, a {
    font-size: 1rem;
  }
  
  form {
    gap: 1rem;
  }
  
  .mb-3 {
    margin-bottom: 1rem;
  }
  
  .block.mb-2 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }
  
  input, textarea {
    padding: 0.75rem;
    font-size: 1rem;
  }
  
  button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .flex.flex-col.lg\:flex-row {
    margin: 0.75rem;
    gap: 1.5rem;
    padding: 0.75rem;
  }
  
  .title {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }
  
  .text-large {
    font-size: 0.95rem;
    margin-bottom: 1.25rem;
  }
  
  .text-xl {
    font-size: 0.95rem;
  }
  
  .flex.flex-col.md\:grid.md\:grid-cols-2 {
    gap: 1.25rem;
  }
  
  .flex.flex-col.gap-2 {
    gap: 0.6rem;
  }
  
  .flex.flex-col.items-center.gap-2 {
    gap: 0.6rem;
  }
  
  .text-6xl {
    font-size: 2.5rem;
  }
  
  h3, h4 {
    font-size: 0.95rem;
  }
  
  p, a {
    font-size: 0.95rem;
  }
  
  form {
    gap: 0.75rem;
  }
  
  .mb-3 {
    margin-bottom: 0.75rem;
  }
  
  .block.mb-2 {
    margin-bottom: 0.4rem;
    font-size: 0.95rem;
  }
  
  input, textarea {
    padding: 0.6rem;
    font-size: 0.95rem;
  }
  
  button {
    padding: 0.6rem 1.25rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 360px) {
  .flex.flex-col.lg\:flex-row {
    margin: 0.5rem;
    gap: 1.25rem;
    padding: 0.5rem;
  }
  
  .title {
    font-size: 1.5rem;
    margin-bottom: 0.4rem;
  }
  
  .text-large {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
  
  .text-xl {
    font-size: 0.9rem;
  }
  
  .flex.flex-col.md\:grid.md\:grid-cols-2 {
    gap: 1rem;
  }
  
  .flex.flex-col.gap-2 {
    gap: 0.5rem;
  }
  
  .flex.flex-col.items-center.gap-2 {
    gap: 0.5rem;
  }
  
  .text-6xl {
    font-size: 2rem;
  }
  
  h3, h4 {
    font-size: 0.9rem;
  }
  
  p, a {
    font-size: 0.9rem;
  }
  
  form {
    gap: 0.6rem;
  }
  
  .mb-3 {
    margin-bottom: 0.6rem;
  }
  
  .block.mb-2 {
    margin-bottom: 0.3rem;
    font-size: 0.9rem;
  }
  
  input, textarea {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}

/* Landscape orientation adjustments */
@media (max-width: 768px) and (orientation: landscape) {
  .flex.flex-col.lg\:flex-row {
    flex-direction: row;
    gap: 1.5rem;
  }
  
  .flex.flex-col.md\:grid.md\:grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  form {
    flex: 1;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  input, textarea {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  button {
    transition: none;
  }
}

/* Form validation styles */
.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.success-message {
  background-color: #f0fdf4;
  border-color: #22c55e;
  color: #166534;
}

.error-alert {
  background-color: #fef2f2;
  border-color: #f87171;
  color: #dc2626;
}

/* Dark mode for messages */
.dark .success-message {
  background-color: #064e3b;
  border-color: #059669;
  color: #d1fae5;
}

.dark .error-alert {
  background-color: #450a0a;
  border-color: #dc2626;
  color: #fecaca;
}

/* Input focus states */
input:focus,
textarea:focus {
  outline: none;
  border-color: #625397;
  box-shadow: 0 0 0 3px rgba(98, 83, 151, 0.1);
}

/* Disabled button styles */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.fa-spin {
  animation: spin 1s linear infinite;
}
</style>