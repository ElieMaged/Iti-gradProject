<template>
  <div class="admin-dashboard-layout">
    <admin-sidebar />
    <div class="pending-tech-profile-main">
      <div class="pending-tech-profile-container">
        <h2 class="profile-title">Technician Information</h2>
        <div v-if="technician" class="profile-content-grid">
          <!-- Personal & Professional Info -->
          <div class="info-section">
            <div class="info-block">
              <div class="info-label">Full Name</div>
              <div class="info-value">{{ technician.fullName }}</div>
            </div>
            <div class="info-block">
              <div class="info-label">Email Address</div>
              <div class="info-value">{{ technician.email }}</div>
            </div>
            <div class="info-block">
              <div class="info-label">Phone Number</div>
              <div class="info-value">{{ technician.phone }}</div>
            </div>
            <div class="info-block">
              <div class="info-label">Address</div>
              <div class="info-value">{{ technician.address }}</div>
            </div>
            <div class="info-block">
              <div class="info-label">Service</div>
              <div class="info-value">{{ technician.service }}</div>
            </div>
            <div class="info-block">
              <div class="info-label">Rate Per Visit</div>
              <div class="info-value">{{ technician.rate }}</div>
            </div>
            <div class="info-block">
              <div class="info-label">Years of Experience</div>
              <div class="info-value">{{ technician.experience }}</div>
            </div>
            <div class="info-block">
              <div class="info-label">Specialization</div>
              <div class="info-value">{{ technician.specialization }}</div>
            </div>
            <div class="info-block">
              <div class="info-label">About</div>
              <div class="info-value">{{ technician.about }}</div>
            </div>
          </div>
          <!-- ID Photo & Actions -->
          <div class="photo-actions-section">
            <div class="id-photo-container">
              <img :src="technician.photo" alt="ID Photo" class="id-photo" />
            </div>
            <div class="action-buttons">
              <button @click="approveTechnician" class="approve-btn">Approve</button>
              <button @click="rejectTechnician" class="reject-btn">Reject</button>
            </div>
          </div>
        </div>
        <div v-else class="not-found">
          <h3>Technician not found</h3>
          <p>The pending technician you're looking for doesn't exist.</p>
          <button @click="$router.push('/admin-pending-tech')" class="back-btn">Back to Pending Technicians</button>
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
      pendingTechnicians: [
        {
          id: 1,
          fullName: 'Ahmed Hassan',
          email: 'test123@gmail.com',
          phone: '+20 011 555 2323',
          address: '123 Nile Street, Giza, Egypt',
          service: 'Carpentry',
          rate: '250 EGP',
          experience: '5',
          specialization: 'Residential Carpentry',
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
          experience: '7',
          specialization: 'Residential Plumbing',
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
          experience: '8',
          specialization: 'Electrical Installations',
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
          experience: '4',
          specialization: 'Interior Painting',
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
          experience: '3',
          specialization: 'Residential Cleaning',
          about: 'Reliable cleaning specialist providing thorough residential and commercial cleaning services.',
          photo: 'https://randomuser.me/api/portraits/men/89.jpg'
        }
      ]
    };
  },
  computed: {
    technician() {
      const technicianId = parseInt(this.$route.params.id);
      return this.pendingTechnicians.find(tech => tech.id === technicianId);
    }
  },
  methods: {
    approveTechnician() {
      if (confirm(`Are you sure you want to approve ${this.technician.fullName}?`)) {
        // Handle approve logic here
        alert(`${this.technician.fullName} has been approved!`);
        this.$router.push('/admin-pending-tech');
      }
    },
    rejectTechnician() {
      if (confirm(`Are you sure you want to reject ${this.technician.fullName}?`)) {
        // Handle reject logic here
        alert(`${this.technician.fullName} has been rejected!`);
        this.$router.push('/admin-pending-tech');
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
.pending-tech-profile-main {
  flex: 1;
  padding: 3rem;
  background: #f9fafb;
}
.pending-tech-profile-container {
  max-width: 900px;
  margin: 0 auto;
}
.profile-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7c6bb0;
  margin-bottom: 0.5rem;
}
.profile-content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
}
@media (min-width: 768px) {
  .profile-content-grid {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}
.info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.info-block {
  margin-bottom: 0.5rem;
}
.info-label {
  font-weight: bold;
  font-size: 1.1rem;
  color: #222;
}
.info-value {
  color: #333;
  font-size: 1rem;
  margin-top: 0.2rem;
}
.photo-actions-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
.id-photo-container {
  width: 256px;
  height: 192px;
  border: 2px dashed #7c6bb0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  margin-bottom: 1rem;
}
.id-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.action-buttons {
  display: flex;
  gap: 2rem;
}
.approve-btn {
  background: #22c55e;
  color: #fff;
  padding: 0.7rem 2rem;
  border: none;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.approve-btn:hover {
  background: #16a34a;
}
.reject-btn {
  background: #ef4444;
  color: #fff;
  padding: 0.7rem 2rem;
  border: none;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.reject-btn:hover {
  background: #b91c1c;
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
@media (max-width: 768px) {
  .pending-tech-profile-main {
    padding: 1.5rem;
  }
  .profile-title {
    font-size: 1.5rem;
  }
  .id-photo-container {
    width: 200px;
    height: 150px;
  }
  .action-buttons {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
