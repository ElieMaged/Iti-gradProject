<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="user-main">
      <div class="user-container">
        <h2 class="user-title">User Management</h2>
        <div class="user-subtitle">Personal Information</div>
        <div class="user-content-row">
          <div class="user-info">
            <div class="user-info-block">
              <div class="user-label">Full Name</div>
              <div class="user-value">{{ user.fullName }}</div>
            </div>
            <div class="user-info-block">
              <div class="user-label">Email Address</div>
              <div class="user-value">{{ user.email }}</div>
            </div>
            <div class="user-info-block">
              <div class="user-label">Phone Number</div>
              <div class="user-value">{{ user.phone }}</div>
            </div>
            <div class="user-info-block">
              <div class="user-label">Gender</div>
              <div class="user-value">{{ user.gender }}</div>
            </div>
            <div class="user-info-block">
              <div class="user-label">Address</div>
              <div class="user-value">{{ user.address }}</div>
            </div>
            <button class="delete-btn" @click="handleDelete">Delete Account</button>
          </div>
          <div class="user-photo-col">
            <div v-if="user.photo" class="user-photo">
              <img :src="user.photo" alt="User Photo" class="user-photo-img" />
            </div>
            <div v-else class="user-photo-placeholder">
              <i class="fas fa-user"></i>
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
  components: { AdminSidebar },
  props: {
    user: {
      type: Object,
      default: () => ({
        fullName: 'Omar Yasser',
        email: 'omar@gmail.com',
        phone: '+20 011 555 2323',
        gender: 'Male',
        address: '15 El-Tahrir Street, Dokki, Giza, Egypt, 12611',
        photo: null
      })
    }
  },
  methods: {
    handleDelete() {
      if (confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
        this.$emit('delete', this.user);
      }
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
.delete-btn:hover {
  background: #b91c1c;
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
</style>
