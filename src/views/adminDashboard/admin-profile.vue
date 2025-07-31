// AdminProfile.vue
<template>
  <div class="admin-dashboard-layout">
    <AdminSidebar />
    <div id="admin-profile-container" class="mr-20 p-4">
      <div id="admin-profile-wrapper">
        <div id="admin-profile-card">
          <h2 id="admin-profile-title">{{ $t('personalInformation') }}</h2>
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
      userData: {
        fullName: 'Mohamed Ali Mohamed',
        emailAddress: 'mohamed@gmail.com',
        phoneNumber: '+20 011 555 2323',
        gender: 'male',
        nationalId: '60504441591478',
        address: '15 El-Tahrir Street, Dokki, Giza, Egypt, 12611'
      }
    };
  },
  computed: {
    userInfo() {
      return {
        [this.$t('fullName')]: this.userData.fullName,
        [this.$t('emailAddress')]: this.userData.emailAddress,
        [this.$t('phoneNumber')]: this.userData.phoneNumber,
        [this.$t('gender')]: this.$t(this.userData.gender),
        [this.$t('nationalId')]: this.userData.nationalId,
        [this.$t('address')]: this.userData.address
      };
    }
  }
};
</script>

<style scoped>
.admin-dashboard-layout {
  display: flex;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
  background: #faf8fd;
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
#admin-profile-wrapper {
  max-width: 1000px;
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
