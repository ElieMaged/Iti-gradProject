<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="technician-profile-bg">
      <div class="technician-profile-main">
        <div class="technician-profile-container">
          <h2 class="profile-title">Technician Management</h2>
          <div class="profile-section-title">Personal Information</div>
          <div v-if="technician" class="profile-content-row">
            <div class="profile-info">
              <div class="profile-info-block">
                <div class="profile-label">Full Name</div>
                <div class="profile-value">{{ technician.fullName }}</div>
              </div>
              <div class="profile-info-block">
                <div class="profile-label">Email Address</div>
                <div class="profile-value">{{ technician.email }}</div>
              </div>
              <div class="profile-info-block">
                <div class="profile-label">Phone Number</div>
                <div class="profile-value">{{ technician.phone }}</div>
              </div>
              <div class="profile-info-block">
                <div class="profile-label">Address</div>
                <div class="profile-value">{{ technician.address }}</div>
              </div>
              <div class="profile-info-block profile-info-flex">
                <div>
                  <div class="profile-label">Service</div>
                  <div class="profile-value">{{ technician.service }}</div>
                </div>
                <div>
                  <div class="profile-label">Rate Per Visit</div>
                  <div class="profile-value">{{ technician.rate }}</div>
                </div>
              </div>
              <div class="profile-info-block">
                <div class="profile-label">About</div>
                <div class="profile-value">{{ technician.about }}</div>
              </div>
              <button class="delete-btn" @click="handleDelete">Delete Account</button>
            </div>
            <div class="profile-photo-col">
              <img :src="technician.photo" alt="Technician Photo" class="profile-photo" />
            </div>
          </div>
          <div v-else class="not-found">
            <h3>Technician not found</h3>
            <p>The technician you're looking for doesn't exist.</p>
            <button @click="$router.push('/all-technicians')" class="back-btn">Back to Technicians</button>
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
  data() {
    return {
      technicians: [
        {
          id: 1,
          fullName: 'Ahmed Hassan',
          email: 'test123@gmail.com',
          phone: '+20 011 555 2323',
          address: '123 Nile Street, Giza, Egypt',
          service: 'Carpentry',
          rate: '250 EGP',
          about: 'Experienced carpenter specializing in residential and commercial woodwork.',
          photo: 'https://randomuser.me/api/portraits/men/75.jpg'
        },
        {
          id: 2,
          fullName: 'Mohamed Ali Mohamed',
          email: 'mohamed@gmail.com',
          phone: '+20 011 555 2324',
          address: '456 Cairo Street, Cairo, Egypt',
          service: 'Plumbing',
          rate: '300 EGP',
          about: 'Experienced plumber specializing in residential plumbing repairs and installations.',
          photo: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
          id: 3,
          fullName: 'Omar Hassan',
          email: 'omar@gmail.com',
          phone: '+20 011 555 2325',
          address: '789 Alexandria Road, Alexandria, Egypt',
          service: 'Electrical',
          rate: '350 EGP',
          about: 'Certified electrician with expertise in electrical installations and repairs.',
          photo: 'https://randomuser.me/api/portraits/men/45.jpg'
        },
        {
          id: 4,
          fullName: 'Ali Mohamed',
          email: 'ali@gmail.com',
          phone: '+20 011 555 2326',
          address: '321 Giza Avenue, Giza, Egypt',
          service: 'Painting',
          rate: '200 EGP',
          about: 'Professional painter with years of experience in interior and exterior painting.',
          photo: 'https://randomuser.me/api/portraits/men/67.jpg'
        },
        {
          id: 5,
          fullName: 'Hassan Omar',
          email: 'hassan@gmail.com',
          phone: '+20 011 555 2327',
          address: '654 Cairo Boulevard, Cairo, Egypt',
          service: 'Cleaning',
          rate: '150 EGP',
          about: 'Reliable cleaning specialist providing thorough residential and commercial cleaning services.',
          photo: 'https://randomuser.me/api/portraits/men/89.jpg'
        }
      ]
    };
  },
  computed: {
    technician() {
      const technicianId = parseInt(this.$route.params.id);
      return this.technicians.find(tech => tech.id === technicianId);
    }
  },
  methods: {
    handleDelete() {
      if (confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
        this.$emit('delete', this.technician);
        this.$router.push('/all-technicians');
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
.technician-profile-bg {
  flex: 1;
  background: #f9fafb;
  min-height: 100vh;
  font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
}
.technician-profile-main {
  display: flex;
  min-height: 100vh;
}
.technician-profile-container {
  flex: 1;
  padding: 3rem 0;
  max-width: 900px;
  margin: 0 auto;
}
.profile-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 0.5rem;
}
.profile-section-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.profile-content-row {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
@media (min-width: 768px) {
  .profile-content-row {
    flex-direction: row;
    align-items: flex-start;
    gap: 3rem;
  }
}
.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.profile-info-block {
  margin-bottom: 0.5rem;
}
.profile-info-flex {
  display: flex;
  gap: 3rem;
}
.profile-label {
  font-weight: bold;
  font-size: 1.1rem;
  color: #222;
}
.profile-value {
  color: #333;
  font-size: 1rem;
  margin-top: 0.2rem;
}
.delete-btn {
  margin-top: 2.5rem;
  background: #ef4444;
  color: #fff;
  padding: 0.7rem 2.5rem;
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
.profile-photo-col {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 2rem;
}
@media (min-width: 768px) {
  .profile-photo-col {
    justify-content: flex-end;
    margin-top: 0;
  }
}
.profile-photo {
  width: 190px;
  height: 190px;
  object-fit: cover;
  border-radius: 0.7rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.not-found {
  text-align: center;
  padding: 3rem 1rem;
}
.not-found h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 1rem;
}
.not-found p {
  color: #666;
  margin-bottom: 2rem;
}
.back-btn {
  background: #7c6bb0;
  color: #fff;
  padding: 0.6rem 2rem;
  border: none;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}
.back-btn:hover {
  background: #5a4a8c;
}
</style>
