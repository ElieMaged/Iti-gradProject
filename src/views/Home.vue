<template>
  <div class="home">
    <!-- Test Notification Button for Debugging -->
    <div class="debug-section" style="position: fixed; top: 10px; right: 10px; z-index: 1000;">
      <button 
        @click="testFirebaseNotification" 
        class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
      >
        Test Firebase Notification
      </button>
      <button 
        @click="debugFirebaseAuth" 
        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors ml-2"
      >
        Debug Firebase Auth
      </button>
    </div>

    <Navbar />
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">{{ $t('heroTitle') }}</h1>
        <p class="hero-subtitle">{{ $t('heroSubtitle') }}</p>
        <div class="hero-buttons">
          <router-link to="/services" class="btn-primary">{{ $t('exploreServices') }}</router-link>
          <router-link to="/about" class="btn-secondary">{{ $t('learnMore') }}</router-link>
        </div>
      </div>
    </div>
    <!-- Rest of the template... -->
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default {
  components: {
    Navbar,
  },
  setup() {
    const testFirebaseNotification = async () => {
      try {
        console.log('=== TESTING FIREBASE NOTIFICATION ===');
        
        if (!auth.currentUser) {
          console.error('❌ No user logged in');
          alert('❌ Please log in first to test notifications');
          return;
        }
        
        console.log('Current user:', auth.currentUser.uid);
        
        const notification = {
          title: 'Test Firebase Notification',
          message: 'This is a test notification from the home page',
          type: 'test',
          recipientId: auth.currentUser.uid,
          recipientType: 'user',
          createdAt: new Date(),
          read: false
        };
        
        console.log('Creating notification:', notification);
        
        const docRef = await addDoc(collection(db, 'notifications'), notification);
        console.log('✅ Notification created with ID:', docRef.id);
        alert('✅ Firebase notification created! Check the notification bell.');
        
      } catch (error) {
        console.error('❌ Error creating notification:', error);
        alert('❌ Error: ' + error.message);
      }
    };

    const debugFirebaseAuth = () => {
      console.log('=== DEBUGGING FIREBASE AUTH ===');
      console.log('Auth object:', auth);
      console.log('Current user:', auth.currentUser);
      console.log('User type from localStorage:', localStorage.getItem('userType'));
      
      if (auth.currentUser) {
        alert(`✅ User logged in: ${auth.currentUser.email}\nUID: ${auth.currentUser.uid}\nUser Type: ${localStorage.getItem('userType')}`);
      } else {
        alert('❌ No user logged in');
      }
    };

    return {
      testFirebaseNotification,
      debugFirebaseAuth,
    };
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>