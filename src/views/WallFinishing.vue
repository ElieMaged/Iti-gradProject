<template>
  <div class="plumbing-page">

    <!-- Hero Section -->
    <section class="hero-section" :style="heroBackgroundStyle">
      <div class="hero-overlay">
        <div class="hero-content">
          <h1 class="hero-title">{{ $t('wallFinishingTitle') }}</h1>
          <SearchBar
            @update:filter="onFilter"
            @update:sort="onSort"
            @update:search="onSearch"
            @update:location="onLocationChange"
            @update:specialization="onSpecializationChange"
          />
          <div class="breadcrumbs">
            <span>{{ $t('home') }}</span>
            <span class="separator">•</span>
            <span>{{ $t('services') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Meet Our Technicians Team Section -->
    <section class="technicians-section">
        <div class="section-header">
          <h2 class="section-title">{{ $t('meetTechniciansTeam') }}</h2>
        </div>

        <div class="team-cards">
          <!-- Loading Skeleton Cards -->
          <div v-if="loading" v-for="n in 8" :key="`skeleton-${n}`" class="team-card skeleton-card">
            <div class="card-top-section skeleton-image"></div>
            <div class="card-bottom-section">
              <div class="skeleton-name"></div>
              <div class="member-specialization"></div>
              <div class="skeleton-description"></div>
              <div class="member-details">
                <div class="detail-item rating-item">
                  <i class="fa-solid fa-star"></i>
                  <span class="skeleton-description short"></span>
                </div>
                <div class="detail-item location-item">
                  <i class="fa-solid fa-location-dot"></i>
                  <span class="skeleton-description short"></span>
                </div>
                <div class="detail-item price-item">
                  <i class="fa-solid fa-dollar-sign"></i>
                  <span class="skeleton-description short"></span>
                </div>
              </div>
              <button class="view-profile-btn skeleton-button"></button>
            </div>
          </div>

          <!-- Actual Technician Cards -->
          <div v-else v-for="technician in paginatedTechnicians" :key="technician.id" class="team-card">
            <!-- Top Section - Image Area -->
            <div class="card-top-section">
              <img :src="technician.image" :alt="technician.name" class="member-photo" />
            </div>
            <!-- Bottom Section - Information Area -->
            <div class="card-bottom-section">
              <h3 class="member-name">{{ technician.name }}</h3>
              <div class="member-specialization">{{ technician.specialization }}</div>
              <p class="member-description">{{ technician.description }}</p>
              <!-- Details Row -->
              <div class="member-details">
                <div class="detail-item rating-item">
                  <i class="fa-solid fa-star"></i>
                  <span>{{ technician.rating || 0 }}</span>
                </div>
                <div class="detail-item location-item">
                  <i class="fa-solid fa-location-dot"></i>
                  <span>{{ getLocationDisplay(technician) }}</span>
                </div>
                <div class="detail-item price-item">
                  <i class="fa-solid fa-dollar-sign"></i>
                  <span>{{ technician.price }} EGP</span>
                </div>
              </div>
              <button class="view-profile-btn" @click="viewProfile(technician)">{{ $t('viewProfile') }}</button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          @prev-page="goToPage(currentPage - 1)"
          @next-page="goToPage(currentPage + 1)"
          @page-changed="goToPage"
          class="pagination-container"
        />
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { useRouter } from 'vue-router'
import SearchBar from '../components/SearchBar.vue'
import Pagination from '../components/pagination.vue'
import profile1 from '../assets/profile/1.jpg'
import profile2 from '../assets/profile/2.png'
import profile3 from '../assets/profile/3.png'
import profile4 from '../assets/profile/4.png'
import profile5 from '../assets/profile/5.jpg'
import profile6 from '../assets/profile/6.png'
import profile7 from '../assets/profile/7.png'
import profile8 from '../assets/profile/8.png'
import plumbingBg from '../assets/Professions/Wall.jpg'
import { calculateTechnicianRatings } from '../utils/ratingCalculator'

const router = useRouter()
const loading = ref(true)
// Removed stock technicians - only show registered technicians
const firebaseTechnicians = ref([])
const searchQuery = ref('')
const filterOption = ref('')
const sortOption = ref('')
const locationFilter = ref({ government: '', district: '' })
const specializationFilter = ref('')
const priceFilter = ref('')
const ratingFilter = ref('')
// Pagination
const currentPage = ref(1)
const pageSize = 12

async function fetchTechnicians() {
  try {
    loading.value = true
    const querySnapshot = await getDocs(collection(db, 'technicians'))
    const allTechnicians = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(tech => tech.specialization === 'Wall Finishing')
    
    // Calculate ratings for all technicians
    const techniciansWithRatings = await calculateTechnicianRatings(allTechnicians)
    firebaseTechnicians.value = techniciansWithRatings
  } catch (error) {
    console.error('Error fetching technicians:', error)
  } finally {
    loading.value = false
  }
}
onMounted(fetchTechnicians)

const mergedTechnicians = computed(() => {
  // Only include Firebase technicians, no stock technicians
  const allTechs = []
  firebaseTechnicians.value.forEach(fbTech => {
    allTechs.push({
      id: fbTech.id,
      name: fbTech.fullName,
      image: fbTech.profilePhotoUrl || fbTech.idPhotoUrl || profile1, // Use profile photo first, then ID photo as fallback
      bgColor: '#E8E4F3', // or any default color
      price: fbTech.basePrice,
      description: fbTech.bio,
      rating: fbTech.rating || 0, // Use the calculated rating from reviews
      specialization: fbTech.specialization,
      government: fbTech.government, // Added government field
      district: fbTech.district, // Added district field
      area: fbTech.area || fbTech.location || 'Cairo', // Use area/location if available
      yearsOfExperience: fbTech.yearsOfExperience || 5 // Use actual years if available
    })
  })
  return allTechs
})

const filteredTechnicians = computed(() => {
  let list = mergedTechnicians.value
  const query = searchQuery.value.trim().toLowerCase()
  
  // Search filter
  if (query) {
    list = list.filter(t => t.name && t.name.toLowerCase().includes(query))
  }
  
  // Location filtering - exact matching for government and district
  if (locationFilter.value.government && locationFilter.value.government !== '') {
    list = list.filter(t => {
      const techGovernment = t.government || t.location || '';
      return techGovernment.toLowerCase() === locationFilter.value.government.toLowerCase();
    });
  }
  
  if (locationFilter.value.district && locationFilter.value.district !== '') {
    list = list.filter(t => {
      const techDistrict = t.district || t.area || '';
      return techDistrict.toLowerCase() === locationFilter.value.district.toLowerCase();
    });
  }
  
  // Specialization filtering
  if (specializationFilter.value && specializationFilter.value !== '') {
    list = list.filter(t => {
      const techSpecialization = t.specialization || '';
      return techSpecialization.toLowerCase() === specializationFilter.value.toLowerCase();
    });
  }
  
  // Price filtering with specific ranges
  if (priceFilter.value && priceFilter.value !== '') {
    list = list.filter(t => {
      if (!t.price) return false;
      const price = parseFloat(t.price);
      
      switch (priceFilter.value) {
        case '50-100':
          return price >= 50 && price <= 100;
        case '100-150':
          return price >= 100 && price <= 150;
        case '150+':
          return price > 150;
        default:
          return true;
      }
    });
  }
  
  // Rating filtering
  if (ratingFilter.value && ratingFilter.value !== '') {
    list = list.filter(t => {
      if (!t.rating) return false;
      const rating = parseFloat(t.rating);
      
      switch (ratingFilter.value) {
        case '2-3':
          return rating >= 2 && rating <= 3;
        case '3-4':
          return rating >= 3 && rating <= 4;
        case '4-5':
          return rating >= 4 && rating <= 5;
        default:
          return true;
      }
    });
  }
  
  // Sort options
  if (sortOption.value === 'priceLow') {
    list = [...list].sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0))
  } else if (sortOption.value === 'priceHigh') {
    list = [...list].sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0))
  } else if (sortOption.value === 'rating') {
    list = [...list].sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))
  }
  
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredTechnicians.value.length / pageSize)))
const paginatedTechnicians = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredTechnicians.value.slice(start, start + pageSize)
})

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function onSearch(query) {
  searchQuery.value = query
}
function onFilter(filters) {
  // Handle the new filter structure from SearchBar
  if (filters.price) {
    priceFilter.value = filters.price;
  }
  if (filters.rating) {
    ratingFilter.value = filters.rating;
  }
  if (filters.specialization) {
    specializationFilter.value = filters.specialization;
  }
}
function onSort(option) {
  sortOption.value = option
}

function onLocationChange(location) {
  locationFilter.value = location
}

function onSpecializationChange(specialization) {
  specializationFilter.value = specialization;
}

function viewProfile(member) {
  if (!member || !member.id) {
    alert('Technician profile data is missing or invalid.');
    return;
  }
  // Redirect unauthenticated users to welcome page, preserving intended route
  if (!auth.currentUser) {
    router.push({
      path: '/welcomepage',
      query: { redirect: `/technician/${member.id}` }
    });
    return;
  }
  router.push({
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
      image: member.image || ''
    }
  });
}

function getLocationDisplay(technician) {
  if (technician.government && technician.district) {
    return `${technician.government}, ${technician.district}`;
  } else if (technician.government) {
    return technician.government;
  } else if (technician.district) {
    return technician.district;
  } else {
    return 'Cairo'; // Fallback
  }
}


const heroBackgroundStyle = computed(() => {
  return {
    backgroundImage: `linear-gradient(rgba(98, 84, 152, 0.7), rgba(98, 84, 152, 0.7)), url(${plumbingBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100%'
  }
})
</script>
<style scoped>
.plumbing-page {
  width: 100%;
  overflow-x: hidden;
}
.dark .hero-section {
  background-color: var(--primary-bg);
}
/* Hero Section */
.hero-section {
  position: relative;
  height: 300px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  margin: 0;
  padding: 0;
}
.dark .hero-content {
  color: var(--primary-text);
}
.hero-content {
  color: white;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
.dark .hero-title {
  color: var(--primary-text);
}
.breadcrumbs {
  font-size: 1.1rem;
  opacity: 0.9;
}

.breadcrumbs .separator {
  margin: 0 0.5rem;
  opacity: 0.7;
}

/* Technicians Section */
.technicians-section {
  padding: 4rem 0;
  background-color: white;
  margin: 0 80px;
}
.dark .technicians-section {
  background-color: var(--primary-bg);
}
.dark .container {
  background-color: var(--primary-bg);
}
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}
.dark .section-header {
  color: var(--primary-text);
}
.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}
.dark .section-title {
  color: var(--primary-text);
}
.section-description {
  font-size: 1.1rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}
.dark .section-description {
  color: var(--primary-text);
}

/* --- Team Card Styles (copied from Plumbing.vue) --- */
.team-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  width: 100%;
  margin: 0 !important;
  margin-bottom: 30px;
  box-sizing: border-box;
}
.container {
  width: 100%;
  padding: 0;
  max-width: 1180px;
  margin: 0px;
  align-items: center;
  box-sizing: border-box;
}
.team-card {
  width: 24%;
  min-width: 240px;
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
  display: flex;
  flex-direction: column;
}
.team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}
.card-top-section {
  width: 100%;
  height: 200px;
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
.member-description {
  font-size: 0.9rem;
  color: #666666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 2.8em; /* 2 lines with line-height 1.4 */
  min-height: 2.8em;
  margin: 0.5rem 0 1rem;
  font-family: Outfit, sans-serif;
  flex: 1;
}
.member-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
  flex-shrink: 0;
  height: 35px; /* Fixed height for details row */
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
.detail-item i {
  font-size: 0.8rem;
  color: #666666;
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
.view-profile-btn:hover {
  background: #5a4e99;
  transform: translateY(-2px);
}
@media (max-width: 1200px) {
  .team-card {
    width: 31%;
  }
}
@media (max-width: 900px) {
  .team-card {
    width: 47%;
  }
}
@media (max-width: 600px) {
  .team-card {
    width: 100%;
    max-width: 100%;
  }
}


/* Call to Action Section */
.cta-section {
  position: relative;
  height: 400px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.dark .cta-section {
  background-color: var(--primary-bg);
}
.cta-content {
  color: white;
  max-width: 600px;
  padding: 0 2rem;
}
.dark .cta-content {
  color: var(--primary-text);
}
.cta-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
.dark .cta-title {
  color: var(--primary-text);
}
.cta-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  opacity: 0.9;
}
.dark .cta-description {
  color: var(--primary-text);
}
.cta-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.dark .cta-btn {
  background-color: var(--primary-color);
  color: var(--primary-text);
}
.cta-btn:hover {
  background-color: #4a3f7a;
}
.dark .cta-btn:hover {
  background-color: var(--primary-color);
  color: var(--primary-text);
}     
.cta-btn i {
  transition: transform 0.3s ease;
}
.dark .cta-btn i {
  color: var(--primary-text);
} 
.cta-btn:hover i {
  transform: translateX(5px);
}
.dark .cta-btn:hover i {
  color: var(--primary-text);
}
/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .technicians-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .cta-title {
    font-size: 2.5rem;
  }
  
  .container {
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .technicians-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-title {
    font-size: 2rem;
  }
  
  .cta-description {
    font-size: 1rem;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .pagination-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #7c6bb0;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }
  .pagination-btn:hover:not(:disabled) {
    background: #5a4e99;
  }
  .pagination-btn:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
  .dark .pagination-btn {
    background: var(--primary-color);
    color: var(--primary-text);
  }
  .dark .pagination-btn:hover:not(:disabled) {
    background: var(--grey-bg);
  }
  .dark .pagination-btn:disabled {
    background: var(--text-muted);
  }
}

/* Enhanced Responsive Design */
@media (max-width: 1200px) {
  .hero-section {
    padding: 2rem 1rem;
  }
  
  .hero-title {
    font-size: 3rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .technicians-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  .technician-card {
    padding: 1.25rem;
  }
  
  .technician-image {
    height: 250px;
  }
  
  .technician-name {
    font-size: 1.2rem;
  }
  
  .technician-description {
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 1.5rem 0.75rem;
  }
  
  .hero-title {
    font-size: 2.25rem;
    margin-bottom: 0.75rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .breadcrumbs {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .section-title {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
  }
  
  .section-description {
    font-size: 0.95rem;
  }
  
  .technicians-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.25rem;
  }
  
  .technician-card {
    padding: 1rem;
  }
  
  .technician-image {
    height: 200px;
  }
  
  .technician-info {
    padding: 1rem;
  }
  
  .technician-name {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  .rating {
    margin-bottom: 0.75rem;
  }
  
  .rating i {
    font-size: 0.9rem;
  }
  
  .technician-description {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }
  
  .view-profile-btn {
    padding: 0.6rem 1.25rem;
    font-size: 0.9rem;
  }
  
  .container {
    padding: 0 0.75rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 1rem 0.5rem;
  }
  
  .hero-title {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }
  
  .hero-subtitle {
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
  }
  
  .breadcrumbs {
    font-size: 0.8rem;
    margin-bottom: 0.75rem;
  }
  
  .section-header {
    margin-bottom: 1.5rem;
  }
  
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .section-description {
    font-size: 0.9rem;
  }
  
  .technicians-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .technician-card {
    padding: 0.75rem;
  }
  
  .technician-image {
    height: 180px;
  }
  
  .technician-info {
    padding: 0.75rem;
  }
  
  .technician-name {
    font-size: 1rem;
    margin-bottom: 0.4rem;
  }
  
  .rating {
    margin-bottom: 0.6rem;
  }
  
  .rating i {
    font-size: 0.8rem;
  }
  
  .technician-description {
    font-size: 0.8rem;
    margin-bottom: 0.75rem;
  }
  
  .view-profile-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
  
  .container {
    padding: 0 0.5rem;
  }
}

@media (max-width: 360px) {
  .hero-section {
    padding: 0.75rem 0.25rem;
  }
  
  .hero-title {
    font-size: 1.5rem;
    margin-bottom: 0.4rem;
  }
  
  .hero-subtitle {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }
  
  .breadcrumbs {
    font-size: 0.75rem;
    margin-bottom: 0.6rem;
  }
  
  .section-header {
    margin-bottom: 1.25rem;
  }
  
  .section-title {
    font-size: 1.25rem;
    margin-bottom: 0.4rem;
  }
  
  .section-description {
    font-size: 0.85rem;
  }
  
  .technicians-grid {
    gap: 0.75rem;
  }
  
  .technician-card {
    padding: 0.6rem;
  }
  
  .technician-image {
    height: 160px;
  }
  
  .technician-info {
    padding: 0.6rem;
  }
  
  .technician-name {
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
  }
  
  .rating {
    margin-bottom: 0.5rem;
  }
  
  .rating i {
    font-size: 0.75rem;
  }
  
  .technician-description {
    font-size: 0.75rem;
    margin-bottom: 0.6rem;
  }
  
  .view-profile-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .container {
    padding: 0 0.25rem;
  }
}

/* Landscape orientation adjustments */
@media (max-width: 768px) and (orientation: landscape) {
  .hero-section {
    padding: 1rem 0.5rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .technicians-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .technician-image {
    height: 150px;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .technician-image {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .technician-card,
  .view-profile-btn {
    transition: none;
  }
  
  .skeleton-image,
  .skeleton-name,
  .skeleton-description,
  .skeleton-button {
    animation: none;
  }
}

/* Skeleton Loading Animation */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton-card {
  pointer-events: none;
}

.skeleton-image {
  height: 300px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

.dark .skeleton-image {
  background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
  background-size: 200px 100%;
}

.skeleton-name {
  height: 24px;
  width: 70%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.dark .skeleton-name {
  background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
  background-size: 200px 100%;
}

.skeleton-rating {
  display: flex;
  gap: 0.2rem;
  margin-bottom: 1rem;
}

.skeleton-star {
  width: 16px;
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 2px;
}

.dark .skeleton-star {
  background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
  background-size: 200px 100%;
}

.skeleton-description {
  height: 16px;
  width: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.skeleton-description.short {
  width: 60%;
}

.dark .skeleton-description {
  background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
  background-size: 200px 100%;
}

.skeleton-button {
  height: 44px;
  width: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 25px;
  margin-bottom: 0.5rem;
}

.dark .skeleton-button {
  background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
  background-size: 200px 100%;
}
/* --- Dark Mode Technician Card Styles (matching allservices.vue) --- */
.dark .team-card {
  background: var(--secondary-bg);
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  border: 1px solid var(--border-color, #333);
}
.dark .card-bottom-section {
  background: var(--secondary-bg);
}
.dark .member-name {
  color: var(--primary-text);
}
.dark .member-specialization {
  color: #b6aaff;
}
.dark .member-description {
  color: var(--text-muted);
}
.dark .member-details {
  color: var(--primary-text);
}
.dark .detail-item {
  color: var(--primary-text);
}
.dark .detail-item i {
  color: var(--text-muted);
}
.dark .view-profile-btn {
  background: var(--primary-color);
  color: var(--primary-text);
}

</style>