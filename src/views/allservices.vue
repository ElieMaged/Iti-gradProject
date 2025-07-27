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
            @click="navigateToService(service.route)"
          >
            <div class="service-overview-icon">
              <i :class="service.icon"></i>
            </div>
            <div class="service-overview-content">
              <h3 class="service-overview-name">{{ $t(service.title) || service.title }}</h3>
              <p class="service-overview-desc">{{ $t(service.description) || service.description }}</p>
              <div class="service-overview-meta">
                <span class="service-overview-price">{{ service.price }}</span>
                <span class="service-overview-duration">{{ service.duration }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-container">
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
    </div>

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
        
        <div class="services-grid">
          <div 
            v-for="(technician, idx) in filteredTechnicians" 
            :key="technician.id" 
            class="service-card"
            @click="viewTechnicianDetails(technician)"
          >
            <div class="service-image-container">
              <img :src="technician.image || '/images/Avatar.png'" :alt="technician.name" class="service-image" />
              <div class="service-overlay">
                <span class="service-category">{{ technician.specialization || 'General' }}</span>
              </div>
            </div>
            <div class="service-content">
              <h3 class="service-title">{{ technician.name }}</h3>
              <p class="service-desc">{{ technician.description }}</p>
              <div class="service-meta">
                <span class="service-rating">
                  <i class="fas fa-star"></i>
                  {{ technician.rating || '4.8' }}
                </span>
                <span class="service-time">
                  <i class="fas fa-map-marker-alt"></i>
                  {{ technician.location || 'Cairo' }}
                </span>
                <span class="service-price">
                  <i class="fas fa-money-bill"></i>
                  {{ technician.price || '200' }} EGP
                </span>
              </div>
              <div class="technician-skills">
                <span 
                  v-for="skill in technician.skills?.slice(0, 2)" 
                  :key="skill" 
                  class="skill-tag"
                >
                  {{ skill }}
                </span>
                <span v-if="technician.skills?.length > 2" class="skill-tag more">
                  +{{ technician.skills.length - 2 }} more
                </span>
              </div>
              <button class="service-btn" @click.stop="bookTechnician(technician)">
                {{ $t('bookNow') }}
                <span class="arrow">→</span>
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
              <button class="modal-btn primary" @click="bookTechnician(selectedTechnician)">
                {{ $t('bookNow') }}
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
import { stockTechnicians } from '../assets/stockTechnicians.js';

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
          icon: 'fas fa-faucet',
          price: '150-300 EGP',
          duration: '2-4 hours'
        },
        {
          id: 'carpentry',
          title: 'carpentryServiceTitle',
          description: 'carpentryServiceDesc',
          route: '/carpentry',
          icon: 'fas fa-hammer',
          price: '200-400 EGP',
          duration: '3-6 hours'
        },
        {
          id: 'electrical',
          title: 'electricityServiceTitle',
          description: 'electricityServiceDesc',
          route: '/electricity',
          icon: 'fas fa-bolt',
          price: '180-350 EGP',
          duration: '1-3 hours'
        },
        {
          id: 'acTechnicians',
          title: 'acTechniciansServiceTitle',
          description: 'acTechniciansServiceDesc',
          route: '/aircondition',
          icon: 'fas fa-snowflake',
          price: '250-500 EGP',
          duration: '2-5 hours'
        },
        {
          id: 'applianceRepair',
          title: 'applianceRepairServiceTitle',
          description: 'applianceRepairServiceDesc',
          route: '/elecTechnicians',
          icon: 'fas fa-tools',
          price: '120-280 EGP',
          duration: '1-2 hours'
        },
        {
          id: 'wallFinishing',
          title: 'wallFinishingServiceTitle',
          description: 'wallFinishingServiceDesc',
          route: '/wallfinishing',
          icon: 'fas fa-paint-roller',
          price: '300-600 EGP',
          duration: '4-8 hours'
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
        
        // Try to fetch from Firebase first
        const techniciansCollection = collection(db, 'technicians');
        const techniciansSnapshot = await getDocs(techniciansCollection);
        
        const firebaseTechnicians = [];
        techniciansSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.status === 'approved' || data.status === 'active') {
            firebaseTechnicians.push({
              id: doc.id,
              ...data,
              // Add default values for missing fields
              rating: data.rating || 4.5,
              price: data.hourlyRate || 200,
              location: data.location || 'Cairo',
              yearsOfExperience: data.yearsOfExperience || 5,
              skills: data.skills || ['General Repair'],
              specialization: data.specialization || 'General'
            });
          }
        });

        // If we have Firebase data, use it; otherwise use stock data
        if (firebaseTechnicians.length > 0) {
          this.technicians = firebaseTechnicians;
        } else {
          // Use stock data with some modifications for variety
          this.technicians = stockTechnicians.map((tech, index) => ({
            ...tech,
            specialization: this.getSpecialization(index),
            skills: tech.skills || ['General Repair'],
            rating: tech.rating || 4.5,
            price: tech.price || 200,
            location: tech.location || 'Cairo',
            yearsOfExperience: tech.yearsOfExperience || 5
          }));
        }
      } catch (error) {
        console.error('Error fetching technicians:', error);
        // Handle Firebase permissions error gracefully
        if (error.code === 'permission-denied') {
          console.log('Firebase permissions not configured, using stock data');
        } else if (error.code === 'unavailable') {
          console.log('Firebase service unavailable, using stock data');
        } else {
          console.log('Firebase error occurred, using stock data');
        }
        // Fallback to stock data
        this.technicians = stockTechnicians.map((tech, index) => ({
          ...tech,
          specialization: this.getSpecialization(index),
          skills: tech.skills || ['General Repair'],
          rating: tech.rating || 4.5,
          price: tech.price || 200,
          location: tech.location || 'Cairo',
          yearsOfExperience: tech.yearsOfExperience || 5
        }));
      } finally {
        this.loading = false;
      }
    },
    getSpecialization(index) {
      const specializations = [
        'Plumbing',
        'Electrical', 
        'Carpentry',
        'AC Technician',
        'Appliance Repair',
        'Wall Finishing',
        'Plumbing',
        'Electrical'
      ];
      return specializations[index % specializations.length];
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
    bookTechnician(technician) {
      // Navigate to booking page with technician info
      this.$router.push({
        path: '/booking',
        query: {
          technicianId: technician.id,
          technicianName: technician.name,
          service: technician.specialization
        }
      });
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
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.dark .services-overview-section {
  background: linear-gradient(135deg, var(--secondary-bg) 0%, var(--primary-bg) 100%);
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.service-overview-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.dark .service-overview-card {
  background: var(--secondary-bg);
}

.service-overview-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border-color: #625397;
}

.service-overview-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #625397 0%, #4e3b7a 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.service-overview-icon i {
  font-size: 1.5rem;
  color: white;
}

.service-overview-content {
  flex: 1;
}

.service-overview-name {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  color: #333;
}

.dark .service-overview-name {
  color: var(--primary-text);
}

.service-overview-desc {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.dark .service-overview-desc {
  color: var(--text-muted);
}

.service-overview-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.dark .service-overview-meta {
  border-top-color: var(--border-color);
}

.service-overview-price {
  font-weight: 600;
  color: #625397;
  font-size: 0.9rem;
}

.service-overview-duration {
  color: #666;
  font-size: 0.85rem;
}

.dark .service-overview-duration {
  color: var(--text-muted);
}

/* Search Section */
.search-section {
  background: white;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.dark .search-section {
  background: var(--secondary-bg);
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  margin-bottom: 1.5rem;
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

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  align-items: start;
}

.service-card {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  height: fit-content;
  display: flex;
  flex-direction: column;
}

.dark .service-card {
  background: var(--secondary-bg);
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.service-image-container {
  position: relative;
}

.service-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.service-overlay {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(98, 83, 151, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.service-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.service-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #333;
}

.dark .service-title {
  color: var(--primary-text);
}

.service-desc {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
  min-height: 3rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dark .service-desc {
  color: var(--text-muted);
}

.service-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
  flex-wrap: wrap;
}

.dark .service-meta {
  color: var(--text-muted);
}

.service-rating,
.service-time,
.service-price {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.technician-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  min-height: 2rem;
  align-items: flex-start;
}

.skill-tag {
  background: #f0f0f0;
  color: #666;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.dark .skill-tag {
  background: var(--primary-bg);
  color: var(--text-muted);
}

.skill-tag.more {
  background: #625397;
  color: white;
}

.service-btn {
  background: #625397;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.8rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  width: fit-content;
  margin-top: auto;
}

.service-btn:hover {
  background: #4e3b7a;
  transform: translateY(-2px);
}

.arrow {
  transition: transform 0.3s ease;
}

.service-btn:hover .arrow {
  transform: translateX(3px);
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
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .services-overview-section {
    padding: 2rem 1rem;
  }
  
  .services-overview-title {
    font-size: 2rem;
  }
  
  .services-overview-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .service-overview-card {
    padding: 1.5rem;
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
}
</style>