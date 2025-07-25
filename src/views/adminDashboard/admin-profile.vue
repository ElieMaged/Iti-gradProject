// AdminProfile.vue
<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div id="admin-profile-container">
      <div id="admin-profile-wrapper">
        <div id="admin-profile-card">
          <h2 id="admin-profile-title">Personal Information</h2>
          <div id="admin-profile-content">
            <div id="admin-profile-info">
              <div class="info-block" v-for="(value, label) in userInfo" :key="label">
                <span class="info-label">{{ label }}</span>
                <span class="info-value">{{ value }}</span>
              </div>
            </div>
            <div id="admin-profile-image">
              <i class="fas fa-user" id="profile-icon"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '../../components/admin-sidebar.vue';
export default {
  name: 'AdminProfile',
  components: { AdminSidebar },
  data() {
    return {
      userInfo: {
        'Full Name': 'Mohamed Ali Mohamed',
        'Email Address': 'mohamed@gmail.com',
        'Phone Number': '+20 011 555 2323',
        'Gender': 'Male',
        'National id': '60504441591478',
        'Address': '15 El-Tahrir Street, Dokki, Giza, Egypt, 12611'
      }
    };
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
#admin-profile-container {
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: sans-serif;
  flex: 1;
}

#admin-profile-wrapper {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

#admin-profile-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}

#admin-profile-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 1.5rem;
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

.info-value {
  font-size: 1rem;
  color: #4b5563;
  margin-top: 0.25rem;
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

#profile-icon {
  font-size: 3.5rem;
  color: #9ca3af;
}
</style>
