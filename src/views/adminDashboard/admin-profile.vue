// AdminProfile.vue
<template>
  <div class="admin-dashboard-layout">
    <AdminSidebar />
    <div id="admin-profile-container" class="mx-12 p-4">
      <TopBar :title="$t('personalInformation')" />
      <div id="admin-profile-wrapper">
        <div id="admin-profile-card">
          
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading profile information...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-state">
            <p class="error-message">{{ error }}</p>
            <button @click="fetchAdminProfile" class="retry-btn">Retry</button>
          </div>

          <!-- Profile Content -->
          <div v-else-if="userData" id="admin-profile-content">
            <div id="admin-profile-info">
              <div class="info-block" v-for="(value, label) in userInfo" :key="label">
                <span class="info-label">{{ label }}</span>
                <span class="info-value">{{ value }}</span>
              </div>
            </div>
            <div id="admin-profile-image">
              <img v-if="userData.profileImageUrl" :src="userData.profileImageUrl" alt="Profile" class="profile-image" />
              <i v-else class="fas fa-user" id="profile-icon"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../../components/admin-sidebar.vue';
import TopBar from '../../components/TopBar.vue';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAuth } from 'firebase/auth';

export default {
  name: 'AdminProfile',
  components: { AdminSidebar, TopBar },
  data() {
    return {
      userData: null,
      loading: true,
      error: null
    };
  },
  computed: {
    userInfo() {
      if (!this.userData) return {};
      
      return {
        [this.$t('fullName')]: this.userData.fullName || 'N/A',
        [this.$t('emailAddress')]: this.userData.email || 'N/A',
        [this.$t('phoneNumber')]: this.userData.phone || 'N/A',
        [this.$t('gender')]: this.userData.gender ? this.$t(this.userData.gender) : 'N/A',
        [this.$t('nationalId')]: this.userData.nationalId || 'N/A',
        [this.$t('address')]: this.constructAddress(this.userData) || 'N/A'
      };
    }
  },
  async mounted() {
    await this.fetchAdminProfile();
  },
  methods: {
    async fetchAdminProfile() {
      try {
        this.loading = true;
        this.error = null;
        
        const auth = getAuth();
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          this.error = 'No authenticated user found';
          return;
        }
        
        console.log('🔍 Fetching admin profile for user:', currentUser.uid);
        
        const userDoc = doc(db, 'users', currentUser.uid);
        const userSnapshot = await getDoc(userDoc);
        
        if (userSnapshot.exists()) {
          this.userData = {
            id: userSnapshot.id,
            ...userSnapshot.data()
          };
          console.log('✅ Admin profile loaded:', this.userData);
        } else {
          this.error = 'Profile not found';
          console.log('❌ Admin profile not found');
        }
      } catch (error) {
        console.error('❌ Error fetching admin profile:', error);
        this.error = 'Failed to load profile information';
      } finally {
        this.loading = false;
      }
    },
    
    constructAddress(userData) {
      if (!userData) return '';
      
      const addressParts = [];
      if (userData.street) addressParts.push(userData.street);
      if (userData.building) addressParts.push(userData.building);
      if (userData.area) addressParts.push(userData.area);
      if (userData.city) addressParts.push(userData.city);
      
      return addressParts.join(', ') || 'N/A';
    }
  }
};
</script>

<style scoped>
.admin-dashboard-layout {
  display: flex;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  background: #faf8fd;
  margin-left: 14rem;
  height: 100vh; /* reserve space for fixed sidebar */
}
.dark .admin-dashboard-layout {
  background-color: var(--primary-bg);
}
#admin-profile-container {
  background-color: #f9fafb;
  font-family: sans-serif;
  flex: 1;
}
.dark #admin-profile-container {
  background-color: var(--primary-bg);
}


#admin-profile-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}
.dark #admin-profile-card {
  background-color: var(--grey-bg);
}
#admin-profile-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 1.5rem;
}
.dark #admin-profile-title {
  color: var(--primary-color);
}

/* Loading and Error States */
.loading-state, .error-state {
  text-align: center;
  padding: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #7c6bb0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
}

.retry-btn {
  background-color: #7c6bb0;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
}

.retry-btn:hover {
  background-color: #6a5acd;
}

/* Profile Image */
.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #7c6bb0;
}

/* RTL Support for Arabic */
[dir="rtl"] #admin-profile-title {
  text-align: right;
}

[dir="rtl"] .info-label {
  text-align: right;
}

[dir="rtl"] .info-value {
  text-align: right;
}

#admin-profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 768px) {
  #admin-profile-content {
    flex-direction: row;
    align-items: flex-start;
  }
}

#admin-profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-block {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 1.125rem;
  font-weight: bold;
  color: #333;
}
.dark .info-label {
  color: var(--white);
}
.info-value {
  font-size: 1rem;
  color: #4b5563;
  margin-top: 0.25rem;
}
.dark .info-value {
  color: var(--text-muted);
}
#admin-profile-image {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10rem;
  height: 10rem;
  background-color: #e5e7eb;
  border-radius: 0.5rem;
  margin: 0 auto;
}
.dark #admin-profile-image {
  background-color: var(--input-bg);
}

#profile-icon {
  font-size: 3.5rem;
  color: var(--icon-color);
}
.dark #profile-icon {
  color: var(--text-muted);
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .layout{
    min-height: auto;
  }
  .admin-dashboard-layout {
    flex-direction: column;
    min-height: auto;
  }

  #admin-profile-container {
    min-height: auto;
    margin-top: 30px;
    padding: 0.5rem;
  }

  #admin-profile-wrapper {
    padding: 1rem;
  }

  #admin-profile-card {
    padding: 1.5rem;
  }

  #admin-profile-title {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  #admin-profile-content {
    gap: 1.5rem;
  }

  #admin-profile-info {
    gap: 1rem;
  }

  .info-label {
    font-size: 1rem;
  }

  .info-value {
    font-size: 0.9rem;
  }

  #admin-profile-image {
    width: 8rem;
    height: 8rem;
  }

  #profile-icon {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  #admin-profile-container {
    margin-top: 70px;
    padding: 0.25rem;
  }

  #admin-profile-wrapper {
    padding: 0.5rem;
  }

  #admin-profile-card {
    padding: 1rem;
  }

  #admin-profile-title {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
  }

  #admin-profile-content {
    gap: 1rem;
  }

  #admin-profile-info {
    gap: 0.8rem;
  }

  .info-label {
    font-size: 0.9rem;
  }

  .info-value {
    font-size: 0.85rem;
  }

  #admin-profile-image {
    width: 6rem;
    height: 6rem;
  }

  #profile-icon {
    font-size: 2.5rem;
  }
}
</style>
