<template>
  <section class="services-section py-16">
    <div class="custom-container">
      <h3 class="services-title">Our Services</h3>
       <div class="services-overview-grid">
           <div 
             v-for="service in servicesList" 
             :key="service.id" 
             class="service-overview-card"
           >
             <img :src="service.image" :alt="service.title" class="service-overview-image" />
             <div class="service-overview-content">
               <h3 class="service-overview-name">{{ $t(service.title) || service.title }}</h3>
               <p class="service-overview-desc">{{ $t(service.description) || service.description }}</p>
               <button class="service-overview-btn" @click="navigateToService(service.route)">
                 {{ $t('bookNow') || 'Book Now' }}
                 <span class="arrow">→</span>
               </button>
             </div>
           </div>
         </div>
    </div>
  </section>
</template>

<script>
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase.js';
import { calculateTechnicianRatings } from '../utils/ratingCalculator';

    export default {
  name: 'AllServices',
  data() {
    return {
      searchQuery: '',
      selectedTechnician: null,
      loading: true,
      technicians: [],
      currentPage: 1,
      techniciansPerPage: 12, // 3 rows x 4 cards
      servicesList: [
         {
           id: 'plumbing',
           title: 'plumbingServiceTitle',
           description: 'plumbingServiceDesc',
           route: '/plumbing',
           image: '/images/servicesImages/plumbing.png'
         },
         {
           id: 'carpentry',
           title: 'carpentryServiceTitle',
           description: 'carpentryServiceDesc',
           route: '/carpentry',
           image: '/images/servicesImages/Carpentry.png'
         },
         {
           id: 'electrical',
           title: 'electricityServiceTitle',
           description: 'electricityServiceDesc',
           route: '/electricity',
           image: '/images/servicesImages/Electrecity.png'
         },
         {
           id: 'acTechnicians',
           title: 'acTechniciansServiceTitle',
           description: 'acTechniciansServiceDesc',
           route: '/aircondition',
           image: '/images/servicesImages/Ac Technicions.png'
         },
         {
           id: 'applianceRepair',
           title: 'applianceRepairServiceTitle',
           description: 'applianceRepairServiceDesc',
           route: '/elecTechnicians',
           image: '/images/servicesImages/electrical appliance repair.png'
         },
         {
           id: 'wallFinishing',
           title: 'wallFinishingServiceTitle',
           description: 'wallFinishingServiceDesc',
           route: '/wallfinishing',
           image: '/images/servicesImages/wall finishing.png'
         }
       ]
    };
  },
  computed: {
    filteredTechnicians() {
      let filtered = this.technicians;
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(technician => 
          technician.name.toLowerCase().includes(query) ||
          technician.description.toLowerCase().includes(query) ||
          technician.skills?.some(skill => skill.toLowerCase().includes(query)) ||
          technician.location?.toLowerCase().includes(query)
        );
      }
      return filtered;
    },
    paginatedTechnicians() {
      const start = (this.currentPage - 1) * this.techniciansPerPage;
      const end = start + this.techniciansPerPage;
      return this.filteredTechnicians.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredTechnicians.length / this.techniciansPerPage) || 1;
    }
  },
  methods: {
    async fetchTechnicians() {
      try {
        this.loading = true;
        
        // Fetch from Firebase technicians collection
        const techniciansCollection = collection(db, 'technicians');
        const techniciansSnapshot = await getDocs(techniciansCollection);
        
        const firebaseTechnicians = [];
        techniciansSnapshot.forEach(doc => {
          const data = doc.data();
          console.log('Technician data:', { id: doc.id, ...data });
          
          // Include all technicians regardless of status for now
          // You can add status filtering later if needed
          firebaseTechnicians.push({
            id: doc.id,
            name: data.fullName || data.name || 'Unknown Technician',
            image: data.profilePhotoUrl || data.idPhotoUrl || data.profileImage || '/images/Avatar.png',
            description: data.bio || data.description || 'Professional technician with years of experience.',
            rating: 0, // Will be calculated by calculateTechnicianRatings
            price: data.basePrice || data.hourlyRate || 200,
            location: data.government || data.location || 'Cairo',
            yearsOfExperience: data.yearsOfExperience || 5,
            skills: data.skills || ['General Repair'],
            specialization: data.specialization || 'General',
            phone: data.phone || '',
            gender: data.gender || 'Male',
            nationality: data.nationality || 'Egyptian'
          });
        });

        // Also check pendingTechnicians collection for any approved technicians
        try {
          const pendingTechniciansCollection = collection(db, 'pendingTechnicians');
          const pendingSnapshot = await getDocs(pendingTechniciansCollection);
          
          pendingSnapshot.forEach(doc => {
            const data = doc.data();
            console.log('Pending technician data:', { id: doc.id, ...data });
            
            // Only include if they have some approval status or are active
            if (data.status === 'approved' || data.status === 'active' || !data.status) {
              firebaseTechnicians.push({
                id: doc.id,
                name: data.fullName || data.name || 'Unknown Technician',
                image: data.profilePhotoUrl || data.idPhotoUrl || data.profileImage || '/images/Avatar.png',
                description: data.bio || data.description || 'Professional technician with years of experience.',
                rating: 0, // Will be calculated by calculateTechnicianRatings
                price: data.basePrice || data.hourlyRate || 200,
                location: data.government || data.location || 'Cairo',
                yearsOfExperience: data.yearsOfExperience || 5,
                skills: data.skills || ['General Repair'],
                specialization: data.specialization || 'General',
                phone: data.phone || '',
                gender: data.gender || 'Male',
                nationality: data.nationality || 'Egyptian'
              });
            }
          });
        } catch (pendingError) {
          console.log('Error fetching pending technicians:', pendingError);
        }

        console.log('Firebase technicians found:', firebaseTechnicians.length);
        
        // Calculate ratings for all technicians
        const techniciansWithRatings = await calculateTechnicianRatings(firebaseTechnicians);
        
        // Use only Firebase technicians with calculated ratings
        this.technicians = techniciansWithRatings;
        console.log('Using Firebase technicians with calculated ratings');
      } catch (error) {
        console.error('Error fetching technicians:', error);
        // Handle Firebase errors gracefully
        if (error.code === 'permission-denied') {
          console.log('Firebase permissions not configured');
        } else if (error.code === 'unavailable') {
          console.log('Firebase service unavailable');
        } else if (error.code === 'not-found') {
          console.log('Firebase collection not found');
        } else {
          console.log('Firebase error occurred');
        }
        // No fallback to stock data - technicians array will remain empty
        this.technicians = [];
      } finally {
        this.loading = false;
      }
    },
    clearSearch() {
      this.searchQuery = '';
      this.currentPage = 1;
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
viewProfile(member) {
  if (!member || !member.id) {
    alert('Technician profile data is missing or invalid.');
    return;
  }
  this.$router.push({
    path: `/technician/${member.id}`,
    query: {
      name: member.name || '',
      specialization: member.specialization || '',
      rating: member.rating || '',
      experience: member.experience || '',
      basePrice: member.basePrice || member.price || '',
      bio: member.description || '',
      location: member.location || '',
      phone: member.phone || '',
      email: member.email || '',
      status: member.status || '',
      image: member.image || '',
    }
  });
},

    closeModal() {
      this.selectedTechnician = null;
    },

    viewTechnicianDetails(technician) {
      this.selectedTechnician = technician;
    },
    navigateToService(route) {
      this.$router.push(route);
    }
  },
  async mounted() {
    await this.fetchTechnicians();
  }
};
</script>

<style scoped>
.services-overview-section {
  background: white;
}

.dark .services-overview-section {
  background: var(--primary-bg);
}

.services-overview-container {
  width: auto;
  margin: 0 80px;
}

.services-overview-header {
  text-align: center;
  margin-bottom: 3rem;
}

.services-overview-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
  font-family: Outfit, sans-serif;
}

.dark .services-overview-title {
  color: var(--primary-text);
}

.services-overview-subtitle {
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.dark .services-overview-subtitle {
  color: var(--text-muted);
}

.services-overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 32px;
  width: auto;
}

.service-overview-card {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.dark .service-overview-card {
  background: var(--secondary-bg);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.service-overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.dark .service-overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

.service-overview-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.service-overview-content {
  padding: 24px 20px 20px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.service-overview-name {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 8px;
  font-family: Outfit, sans-serif;
}

.service-overview-desc {
  font-size: 0.98rem;
  color: var(--text-muted);
  margin-bottom: 18px;
  flex: 1;
}

.service-overview-btn {
  background: #625397;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 10px 12px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: fit-content;
  min-width: 80px;
  max-width: 120px;
  transition: background 0.2s;
}

.dark .service-overview-btn {
  background: var(--primary-color);
  color: var(--primary-text);
}

.service-overview-btn:hover {
  background: #4e3b7a;
}

.dark .service-overview-btn:hover {
  background: var(--primary-color);
  color: var(--primary-text);
}

.arrow {
  margin-left: 6px;
  transform: rotate(-45deg);
}

.services-section {
  background-color: var(--primary-text);
}
.custom-container {
  margin: 0 80px;
}
.dark .services-section {
  background: var(--primary-bg);
  color: var(--primary-text);
}
@media (max-width: 1000px) {
  .services-section {
    margin: 80px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
.services-title {
  font-size: 40px;
  font-weight: 550;
  text-align: center;
  margin-bottom: 40px;
  font-family: Outfit, sans-serif;
  line-height: 56px;
}
.services-divider {
  width: 100%;
  background-color: var(--light-green);
  margin-bottom: 32px;
}
.services-grid {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  width: 100%;
}
.service-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: transform 0.2s;
  border-radius: 30px;
}
.dark .service-card {
  background: var(--secondary-bg);
}

.service-card:hover {
  transform: translateY(-4px);
}
.dark .service-card:hover {
  transform: translateY(-4px);
}
.service-image {
  width: 100%;
  height: 262px;
  object-fit: cover;
  border-radius: 30px;
}
.service-content {
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.service-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 32px;
  font-family: Outfit, sans-serif;
  color: var(--black-text);
}
.dark .service-title {
  color: var(--color-white);
}
.service-desc {
  font-size: 16px;
  color: var(--text-gray);
  margin-bottom: 18px;
  flex: 1;
  font-weight: 400;
  line-height: 24px;
}
.dark .service-desc {
  color: var(--card-text-gray);
}
.service-btn {
  background: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  cursor: pointer;
  display: flex;
  gap: 10px;
  width: fit-content;
  align-items: center;
  transition: background 0.2s;
  margin-bottom: 30px;
}
.dark .service-btn {
  background: var(--primary-color);
  color: var(--white);
}
.service-btn:hover {
  background: #4e3b7a;
}
.dark .service-btn:hover {
  background: #4e3b7a;
  color: var(--primary-text);
}
.arrow svg {
  font-size: 20px;
  font-weight: 800;
}
.arrow svg path {
  fill: var(--white);
}
.dark .arrow svg path {
  fill: var(--white);
}
/* Responsive design */
@media (max-width: 1024px) {
  .services-section {
    margin: 60px 0;
  }
  .services-title {
    font-size: 2.2rem;
    margin-bottom: 35px;
  }

  .services-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (max-width: 700px) {
  .services-section {
    margin: 40px 0;
  }
  .services-title {
    font-size: 2rem;
    margin-bottom: 30px;
  }

  .services-grid {
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
  }

  .service-card {
    max-width: 400px;
  }

  .service-content {
    padding: 20px 16px 16px 16px;
  }

  .service-title {
    font-size: 1.1rem;
  }

  .service-desc {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .services-section {
    margin: 20px 0;
  }
  .services-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .services-grid {
    gap: 16px;
  }

  .service-image {
    height: 150px;
  }

  .service-content {
    padding: 16px 12px 12px 12px;
  }

  .service-title {
    font-size: 1rem;
  }

  .service-desc {
    font-size: 0.85rem;
  }

  .service-btn {
    padding: 8px 10px;
    font-size: 0.9rem;
  }
}
</style>
