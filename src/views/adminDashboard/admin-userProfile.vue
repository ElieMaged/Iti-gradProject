<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="user-main">
      <div class="user-container">
        <h2 class="user-title">User Management</h2>
        <div class="user-subtitle">Personal Information</div>
        
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading user information...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <p class="error-message">{{ error }}</p>
          <button @click="fetchUser" class="retry-btn">Retry</button>
        </div>

        <!-- User Content -->
        <div v-else-if="user" class="user-content-row">
          <div class="user-info">
            <div class="user-info-block">
              <div class="user-label">Full Name</div>
              <div class="user-value">{{ user.fullName || 'N/A' }}</div>
            </div>
            <div class="user-info-block">
              <div class="user-label">Email Address</div>
              <div class="user-value">{{ user.email }}</div>
            </div>
            <div class="user-info-block">
              <div class="user-label">Phone Number</div>
              <div class="user-value">{{ user.phone || 'N/A' }}</div>
            </div>
            <div class="user-info-block">
              <div class="user-label">Gender</div>
              <div class="user-value">{{ user.gender || 'N/A' }}</div>
            </div>
            <div class="user-info-block">
              <div class="user-label">Address</div>
              <div class="user-value">{{ user.address || 'N/A' }}</div>
            </div>
            <div class="user-info-block">
              <div class="user-label">Role</div>
              <div class="user-value">{{ user.role || 'user' }}</div>
            </div>
            <button 
              class="delete-btn" 
              @click="handleDelete"
              :disabled="deleting"
            >
              {{ deleting ? 'Deleting...' : 'Delete Account' }}
            </button>
          </div>
          <div class="user-photo-col">
            <div v-if="user.profileImageUrl" class="user-photo">
              <img :src="user.profileImageUrl" alt="User Photo" class="user-photo-img" />
            </div>
            <div v-else class="user-photo-placeholder">
              <i class="fas fa-user"></i>
            </div>
          </div>
        </div>

        <!-- User Not Found -->
        <div v-else class="not-found-state">
          <p>User not found</p>
          <button @click="goBack" class="back-btn">Go Back</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../../components/admin-sidebar.vue';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useRouter } from 'vue-router';

export default {
  components: { AdminSidebar },
  data() {
    return {
      user: null,
      loading: true,
      error: null,
      deleting: false
    };
  },
  async mounted() {
    await this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        this.loading = true;
        this.error = null;
        
        const userId = this.$route.params.id;
        console.log('🔍 Fetching user with ID:', userId);
        
        const userDoc = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDoc);
        
        if (userSnapshot.exists()) {
          this.user = {
            id: userSnapshot.id,
            ...userSnapshot.data()
          };
          console.log('✅ User data loaded:', this.user);
        } else {
          this.error = 'User not found';
          console.log('❌ User not found');
        }
      } catch (error) {
        console.error('❌ Error fetching user:', error);
        this.error = 'Failed to load user information';
      } finally {
        this.loading = false;
      }
    },

    async handleDelete() {
      if (!this.user) return;
      
      if (!confirm('Are you sure you want to delete this user account? This action cannot be undone.')) {
        return;
      }

      try {
        this.deleting = true;
        console.log('🗑️ Deleting user:', this.user.fullName || this.user.email, 'with ID:', this.user.id);
        
        // Delete from users collection
        const userDoc = doc(db, 'users', this.user.id);
        await deleteDoc(userDoc);
        console.log('✅ User document deleted from Firestore');

        // Show success message
        alert('User account deleted successfully!');
        
        // Redirect to previous page
        this.goBack();
        
      } catch (error) {
        console.error('❌ Error deleting user:', error);
        alert('Failed to delete user account. Please try again.');
      } finally {
        this.deleting = false;
      }
    },

    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.admin-dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  background: #faf8fd;
}
.user-main {
  flex: 1;
  padding: 3rem;
  background: #f9fafb;
}
.user-container {
  max-width: 900px;
  margin: 0 auto;
}
.user-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 0.5rem;
}
.user-subtitle {
  font-size: 1.3rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
.user-content-row {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
@media (min-width: 768px) {
  .user-content-row {
    flex-direction: row;
    align-items: flex-start;
    gap: 3rem;
  }
}
.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.user-info-block {
  margin-bottom: 0.5rem;
}
.user-label {
  font-weight: bold;
  font-size: 1.1rem;
  color: #222;
}
.user-value {
  color: #333;
  font-size: 1rem;
  margin-top: 0.2rem;
}
.delete-btn {
  margin-top: 2rem;
  background: #ef4444;
  color: #fff;
  padding: 0.7rem 2rem;
  border: none;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  width: 200px;
}
.delete-btn:hover:not(:disabled) {
  background: #b91c1c;
}
.delete-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
.user-photo-col {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 2rem;
}
@media (min-width: 768px) {
  .user-photo-col {
    justify-content: flex-end;
    margin-top: 0;
  }
}
.user-photo {
  width: 190px;
  height: 190px;
  border-radius: 0.7rem;
  overflow: hidden;
}
.user-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.user-photo-placeholder {
  width: 190px;
  height: 190px;
  background: #e5e7eb;
  border-radius: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-photo-placeholder i {
  font-size: 5rem;
  color: #9ca3af;
}

/* Loading and Error States */
.loading-state, .error-state, .not-found-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #7c6bb0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #dc2626;
  font-weight: 600;
  margin-bottom: 1rem;
}

.retry-btn, .back-btn {
  background: #7c6bb0;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
}

.retry-btn:hover, .back-btn:hover {
  background: #5a4a8c;
}

@media (max-width: 768px) {
  .user-main {
    padding: 1.5rem;
  }
  .user-title {
    font-size: 1.5rem;
  }
  .user-subtitle {
    font-size: 1.1rem;
  }
  .user-photo,
  .user-photo-placeholder {
    width: 150px;
    height: 150px;
  }
  .user-photo-placeholder i {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .user-main {
    padding: 1rem;
  }
  
  .user-title {
    font-size: 1.25rem;
  }
  
  .user-subtitle {
    font-size: 1rem;
  }
  
  .user-content-row {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .user-info {
    gap: 1rem;
  }
  
  .user-info-block {
    gap: 0.5rem;
  }
  
  .user-label {
    font-size: 0.9rem;
  }
  
  .user-value {
    font-size: 0.95rem;
  }
  
  .user-photo,
  .user-photo-placeholder {
    width: 120px;
    height: 120px;
  }
  
  .user-photo-placeholder i {
    font-size: 2.5rem;
  }
  
  .delete-btn {
    padding: 0.6rem 1.25rem;
    font-size: 0.9rem;
  }
  
  .loading-state, .error-state, .not-found-state {
    padding: 2rem 1rem;
  }
  
  .loading-spinner {
    width: 35px;
    height: 35px;
  }
  
  .error-message {
    font-size: 0.9rem;
  }
  
  .retry-btn, .back-btn {
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 360px) {
  .user-main {
    padding: 0.75rem;
  }
  
  .user-title {
    font-size: 1.1rem;
  }
  
  .user-subtitle {
    font-size: 0.9rem;
  }
  
  .user-content-row {
    gap: 1rem;
  }
  
  .user-info {
    gap: 0.75rem;
  }
  
  .user-info-block {
    gap: 0.4rem;
  }
  
  .user-label {
    font-size: 0.85rem;
  }
  
  .user-value {
    font-size: 0.9rem;
  }
  
  .user-photo,
  .user-photo-placeholder {
    width: 100px;
    height: 100px;
  }
  
  .user-photo-placeholder i {
    font-size: 2rem;
  }
  
  .delete-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
  
  .loading-state, .error-state, .not-found-state {
    padding: 1.5rem 0.75rem;
  }
  
  .loading-spinner {
    width: 30px;
    height: 30px;
  }
  
  .error-message {
    font-size: 0.85rem;
  }
  
  .retry-btn, .back-btn {
    padding: 0.4rem 0.7rem;
    font-size: 0.85rem;
  }
}

/* Landscape orientation adjustments */
@media (max-width: 768px) and (orientation: landscape) {
  .user-main {
    padding: 1rem;
  }
  
  .user-content-row {
    flex-direction: row;
    gap: 1rem;
  }
  
  .user-photo,
  .user-photo-placeholder {
    width: 100px;
    height: 100px;
  }
  
  .user-photo-placeholder i {
    font-size: 2.5rem;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .user-photo-img {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: none;
  }
  
  .delete-btn,
  .retry-btn,
  .back-btn {
    transition: none;
  }
}
</style>
