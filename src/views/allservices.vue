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
         
         <div class="technicians-grid">
          <div 
            v-for="(technician, idx) in filteredTechnicians" 
            :key="technician.id" 
            class="technician-card"
            @click="viewTechnicianDetails(technician)"
          >
            <div class="technician-image">
              <img :src="technician.image || '/images/Avatar.png'" :alt="technician.name" />
            </div>
            <div class="technician-info">
              <h3 class="technician-name">{{ technician.name }}</h3>
              <div class="rating">
                <i class="fa-solid fa-star" v-for="n in 5" :key="n"></i>
              </div>
              <p class="technician-description">{{ technician.description }}</p>
              <button class="view-profile-btn" @click.stop="viewTechnicianDetails(technician)">
                {{ $t('viewTechnician') }}
              </button>
            </div>
          </div>
        </div>

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

    <!-- Technician Details Modal -->
    <div v-if="selectedTechnician" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
        <div class="modal-body">
          <img :src="selectedTechnician.image || '/images/Avatar.png'" :alt="selectedTechnician.name" class="modal-image" />
          <div class="modal-info">
            <h2>{{ selectedTechnician.name }}</h2>
            <p class="modal-description">{{ selectedTechnician.description }}</p>
            <div class="modal-meta">
              <div class="meta-item">
                <i class="fas fa-star"></i>
                <span>{{ selectedTechnician.rating || '4.8' }} {{ $t('rating') || 'Rating' }}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>{{ selectedTechnician.location || 'Cairo' }} {{ $t('location') || 'Location' }}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-money-bill"></i>
                <span>{{ selectedTechnician.price || '200' }} EGP {{ $t('perHour') || 'per hour' }}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-clock"></i>
                <span>{{ selectedTechnician.yearsOfExperience || '5' }} {{ $t('yearsExperience') || 'years experience' }}</span>
              </div>
            </div>
            <div class="modal-skills">
              <h4>{{ $t('skills') || 'Skills' }}</h4>
              <div class="skills-grid">
                <span 
                  v-for="skill in selectedTechnician.skills" 
                  :key="skill" 
                  class="skill-tag"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
            <div class="modal-actions">
              <button class="service-btn" @click.stop="viewTechnicianDetails(technician)">
                {{ $t('viewTechnician') }}
              </button>
              <button class="modal-btn secondary" @click="closeModal">
                {{ $t('close') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase.js';

    export default {
  name: 'AllServices',
  data() {
    return {
      searchQuery: '',
      selectedTechnician: null,
      loading: true,
      technicians: [],
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

      // Filter by search query
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
            rating: data.averageRating || 4.5,
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
                rating: data.averageRating || 4.5,
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
        
        // Use only Firebase technicians
        this.technicians = firebaseTechnicians;
        console.log('Using Firebase technicians');
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
    },
    viewTechnicianDetails(technician) {
      this.selectedTechnician = technician;
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
  padding: 4rem 2rem;
  background: white;
}

.dark .services-overview-section {
  background: var(--secondary-bg);
}

.services-overview-container {
  max-width: 1200px;
  margin: 0 auto;
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

/* Services Section */
.services-section {
  padding: 3rem 2rem;
}

.services-container {
  max-width: 1200px;
  margin: 0 auto;
}

.services-header {
  text-align: center;
  margin-bottom: 2rem;
}

.services-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
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

.technicians-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  grid-auto-rows: 1fr;
  justify-items: center;
}

.dark .technicians-grid {
  background-color: var(--primary-bg);
}

.technician-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-height: 420px;
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.dark .technician-card {
  background-color: var(--secondary-bg);
  color: var(--primary-text);
}

.technician-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.technician-image {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .technician-image {
  background-color: var(--secondary-bg);
  color: var(--primary-text);
}

.technician-image img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.dark .technician-image img {
  background-color: var(--secondary-bg);
  color: var(--primary-text);
}

.technician-info {
  padding: 1.5rem;
}

.technician-name {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.dark .technician-name {
  color: var(--primary-text);
}

.rating {
  margin-bottom: 1rem;
}

.dark .rating {
  color: var(--primary-text);
}

.rating i {
  color: #FFC230;
  margin-right: 0.2rem;
}

.dark .rating i {
  color: var(--primary-text);
}

.technician-description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.dark .technician-description {
  color: var(--primary-text);
}

.view-profile-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-bottom: 0.5rem;
}

.dark .view-profile-btn {
  background-color: var(--primary-color);
  color: var(--primary-text);
}

.view-profile-btn:hover {
  background-color: #4a3f7a;
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