<template>
  <div class="all-services-page">

    <!-- Services Overview Section -->
    <section class="services-overview-section">
      <div class="services-overview-container">
        <div class="services-overview-header">
          <h2 class="services-overview-title">{{ $t('ourServices') || 'Our Services' }}</h2>
          <p class="services-overview-subtitle">{{ $t('servicesOverviewDesc') || 'Discover our comprehensive range of professional services' }}</p>
        </div>
        
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

         <!-- Loading State -->
    <div v-if="loading" class="loading-section">
      <div class="loading-spinner"></div>
      <p>{{ $t('loadingTechnicians') || 'Loading technicians...' }}</p>
    </div>

    <!-- Technicians Grid -->
    <section v-else class="services-section">
      <div class="services-container">
                 <div class="services-header">
           <h2 class="services-title">{{ $t('meetTechniciansTeam') || 'Meet Our Technicians' }}</h2>
           <hr class="services-divider" />
           <p class="services-count">{{ filteredTechnicians.length }} {{ $t('techniciansFound') || 'technicians found' }}</p>
         </div>
         
         <!-- Search Section -->
         <div class="search-section">
           <div class="search-box">
             <i class="fas fa-search search-icon"></i>
             <input 
               v-model="searchQuery" 
               type="text" 
               :placeholder="$t('searchServices')"
               class="search-input"
             />
           </div>
         </div>
         
         <div class="team-cards">
           <div 
             v-for="(technician, idx) in paginatedTechnicians" 
             :key="technician.id" 
             class="team-card"
             @click="viewTechnicianDetails(technician)"
           >
             <div class="card-top-section">
               <img :src="technician.image || '/images/Avatar.png'" :alt="technician.name" class="member-photo" />
             </div>
             <div class="card-bottom-section">
               <h3 class="member-name">{{ technician.name }}</h3>
               <div class="member-specialization">{{ technician.specialization }}</div>
               <p class="member-description">{{ technician.description }}</p>
               <div class="member-details">
                 <div class="detail-item rating-item">
                   <i class="fas fa-star"></i>
                   <span>{{ technician.rating || 'No reviews' }}</span>
                 </div>
                 <div class="detail-item location-item">
                   <i class="fas fa-map-marker-alt"></i>
                   <span>{{ getLocationDisplay(technician) }}</span>
                 </div>
                 <div class="detail-item price-item">
                   <i class="fa-solid fa-dollar-sign"></i>
                   <span>{{ technician.price }} EGP</span>
                 </div>
               </div>
               <button class="view-profile-btn" @click.stop="viewProfile(technician)">
                 {{ $t('viewProfile') || 'View Profile' }}
               </button>
             </div>
           </div>
         </div>

         <!-- Pagination Component -->
        <Pagination
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          @prev-page="goToPage(currentPage - 1)"
          @next-page="goToPage(currentPage + 1)"
          @page-changed="goToPage"
          class="pagination-container"
        />

        <!-- No Results Message -->
        <div v-if="filteredTechnicians.length === 0 && !loading" class="no-results">
          <i class="fas fa-search"></i>
          <h3>{{ $t('noTechniciansFound') || 'No technicians found' }}</h3>
          <p>{{ $t('tryDifferentSearch') || 'Try adjusting your search' }}</p>
          <button @click="clearSearch" class="clear-search-btn">
            {{ $t('clearSearch') || 'Clear Search' }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase.js';
import { waitForAuth, isAuthenticated } from '../utils/auth';
import Pagination from '../components/pagination.vue';
import { calculateTechnicianRatings } from '../utils/ratingCalculator';

    export default {
  name: 'AllServices',
  components: {
    Pagination
  },
  data() {
    return {
      searchQuery: '',
      selectedTechnician: null,
      loading: true,
      technicians: [],
      currentPage: 1,
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
      const cardsPerPage = 12; // 3 rows × 4 cards per row
      const start = (this.currentPage - 1) * cardsPerPage;
      const end = start + cardsPerPage;
      return this.filteredTechnicians.slice(start, end);
    },
    totalPages() {
      const cardsPerPage = 12; // 3 rows × 4 cards per row
      return Math.max(1, Math.ceil(this.filteredTechnicians.length / cardsPerPage));
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
            government: data.government,
            district: data.district,
            location: data.location || 'Cairo',
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
                government: data.government,
                district: data.district,
                location: data.location || 'Cairo',
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
    async viewProfile(member) {
      if (!member || !member.id) {
        alert('Technician profile data is missing or invalid.');
        return;
      }

      // Ensure auth status is ready, then check
      await waitForAuth();
      if (!isAuthenticated()) {
        // Redirect unauthenticated users to Welcome page
        this.$router.push('/welcomepage');
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
    },
    getLocationDisplay(technician) {
      if (technician.government && technician.district) {
        return `${technician.government}, ${technician.district}`;
      } else if (technician.government) {
        return technician.government;
      } else if (technician.district) {
        return technician.district;
      } else if (technician.location) {
        return technician.location;
      } else {
        return 'Cairo'; // Default location
      }
    }
  },
  async mounted() {
    await this.fetchTechnicians();
  }
};
</script>

<style scoped>
.all-services-page {
  min-height: 100vh;
  background-color: var(--primary-bg);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #625397 0%, #4e3b7a 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  font-family: Outfit, sans-serif;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

/* Services Overview Section */
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
  width: 100%;
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

/* Search Section */
.search-section {
  margin-bottom: 2rem;
}

.search-box {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
}

.dark .search-input {
  background: var(--primary-bg);
  color: var(--primary-text);
  border-color: var(--border-color);
}

.search-input:focus {
  outline: none;
  border-color: #625397;
}

/* Loading Section */
.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #625397;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}



.services-container {
  margin: 0 80px;
}

.services-header {
  text-align: center;
  margin-bottom: 2rem;
}

.services-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 2rem 0;
  font-family: Outfit, sans-serif;
}

.services-divider {
  width: 100px;
  border: 2px solid #625397;
  margin: 1rem auto;
}

.services-count {
  color: #666;
  font-size: 1rem;
}

.dark .services-count {
  color: var(--text-muted);
}


/* --- ExpertTeam Card Styles for All Services --- */
.team-cards {
  display: flex;
  gap: 15px;
  justify-content: center;
  width: 100%;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

/* Pagination Container */
.pagination-container {
  margin: 2rem 0;
  display: flex;
  justify-content: center;
  width: 100%;
}

/* Ensure the pagination component takes full width on mobile */
@media (max-width: 768px) {
  .pagination-container {
    padding: 0 1rem;
  }
}

.team-card {
  width: 24%;
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  cursor: pointer;
}
.dark .team-card {
  background: var(--secondary-bg);
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  border: 1px solid var(--border-color, #333);
}
.team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}
.card-top-section {
  width: 100%;
  height: 250px;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}
.member-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}
.card-bottom-section {
  padding: 16px 20px;
  background: #ffffff;
  text-align: left;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 250px;
}
.dark .card-bottom-section {
  background: var(--secondary-bg);
}
.member-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #333333;
  margin-bottom: 8px;
  font-family: Outfit, sans-serif;
  line-height: 1.2;
  flex-shrink: 0;
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dark .member-name {
  color: var(--primary-text);
}
.member-specialization {
  font-size: 1rem;
  color: #7c6bb0;
  font-weight: 500;
  font-family: Outfit, sans-serif;
  flex-shrink: 0;
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dark .member-specialization {
  color: #b6aaff;
}
.member-description {
  font-size: 0.9rem;
  color: #666666;
  line-height: 1.4;
  margin: 0.5rem 0 0.5rem;
  font-family: Outfit, sans-serif;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 1.4em;
  max-height: 1.4em;
}
.dark .member-description {
  color: var(--text-muted);
}
.member-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
  flex-shrink: 0;
  height: 35px;
}
.dark .member-details {
  color: var(--primary-text);
}
.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #333333;
  font-weight: 500;
  flex-shrink: 0;
}
.dark .detail-item {
  color: var(--primary-text);
}
.detail-item i {
  font-size: 0.8rem;
  color: #666666;
}
.dark .detail-item i {
  color: var(--text-muted);
}
.fa-star  {
  color: var(--color-secondary)!important;
}
.fa-location-dot {
  color: #4d7cfe !important;
}
.fa-dollar-sign{
  color: #34c759 !important;
}
.view-profile-btn {
  background: #7c6bb0;
  color: #ffffff;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: block;
  width: 100%;
  text-align: center;
  transition: background 0.3s ease;
  font-family: Outfit, sans-serif;
  flex-shrink: 0;
  margin-top: auto;
}
.dark .view-profile-btn {
  background: var(--primary-color);
  color: var(--primary-text);
}
.view-profile-btn:hover {
  background: #5a4e99;
  transform: translateY(-2px);
}

/* No Results */
.no-results {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.dark .no-results {
  color: var(--text-muted);
}

.no-results i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ccc;
}

.clear-search-btn {
  background: #625397;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.8rem 1.5rem;
  margin-top: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-search-btn:hover {
  background: #4e3b7a;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.dark .modal-content {
  background: var(--secondary-bg);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.2);
}

.modal-body {
  padding: 2rem;
}

.modal-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 15px;
  margin-bottom: 1.5rem;
}

.modal-info h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
}

.dark .modal-info h2 {
  color: var(--primary-text);
}

.modal-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.dark .modal-description {
  color: var(--text-muted);
}

.modal-meta {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.dark .meta-item {
  color: var(--text-muted);
}

.modal-skills {
  margin-bottom: 2rem;
}

.modal-skills h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: #333;
}

.dark .modal-skills h4 {
  color: var(--primary-text);
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.modal-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.modal-btn.primary {
  background: #625397;
  color: white;
}

.modal-btn.primary:hover {
  background: #4e3b7a;
}

.modal-btn.secondary {
  background: transparent;
  color: #666;
  border: 2px solid #e0e0e0;
}

.dark .modal-btn.secondary {
  color: var(--text-muted);
  border-color: var(--border-color);
}

.modal-btn.secondary:hover {
  background: #f5f5f5;
}

.dark .modal-btn.secondary:hover {
  background: var(--primary-bg);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .services-overview-section {
    width: 95%;
    padding: 30px 0 0 0;
  }
  
  .services-overview-title {
    font-size: 2.2rem;
  }
  
  .services-overview-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .services-overview-section {
    width: 95%;
    margin: 0 auto 40px auto;
    padding: 20px 0 0 0;
  }
  
  .services-overview-title {
    font-size: 2rem;
  }
  
  .services-overview-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .service-overview-card {
    max-width: 400px;
  }
  
  .service-overview-content {
    padding: 20px 16px 16px 16px;
  }
  
  .service-overview-name {
    font-size: 1.1rem;
  }
  
  .service-overview-desc {
    font-size: 0.9rem;
  }
  
  .search-section {
    padding: 1rem;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 2rem 1rem;
  }
  
  .services-section {
    padding: 2rem 1rem;
  }
  
  .service-content {
    padding: 1rem;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .services-overview-section {
    width: 100%;
    padding: 15px 0 0 0;
  }
  
  .services-overview-title {
    font-size: 1.8rem;
  }
  
  .services-overview-grid {
    gap: 16px;
  }
  
  .service-overview-image {
    height: 150px;
  }
  
  .service-overview-content {
    padding: 16px 12px 12px 12px;
  }
  
  .service-overview-name {
    font-size: 1rem;
  }
  
  .service-overview-desc {
    font-size: 0.85rem;
  }
  
  .service-overview-btn {
    padding: 8px 10px;
    font-size: 0.9rem;
  }
}
</style>