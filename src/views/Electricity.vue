<template>
  <div class="plumbing-page">

    <!-- Hero Section -->
    <section class="hero-section" :style="heroBackgroundStyle">
      <div class="hero-overlay">
        <div class="hero-content">
          <h1 class="hero-title">{{ $t('electricityTitle') }}</h1>
          <SearchBar
            :filterOptions="[
              { value: 'price', label: 'Select a price' },
              { value: 'area', label: 'Select an area' },
              { value: 'rating', label: 'Rating' },
              { value: 'years', label: 'Years of experience' }
            ]"
            :sortOptions="[
              { value: 'relevance', label: 'Relevance' },
              { value: 'priceLow', label: 'Price: Low to High' },
              { value: 'priceHigh', label: 'Price: High to Low' },
              { value: 'rating', label: 'Rating' }
            ]"
            @update:filter="onFilter"
            @update:sort="onSort"
            @update:search="onSearch"
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
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ $t('meetTechniciansTeam') }}</h2>
        </div>

        <div class="technicians-grid">
          <!-- Loading Skeleton Cards -->
          <div v-if="loading" v-for="n in 8" :key="`skeleton-${n}`" class="technician-card skeleton-card">
            <div class="skeleton-image"></div>
            <div class="technician-info">
              <div class="skeleton-name"></div>
              <div class="skeleton-rating">
                <div class="skeleton-star" v-for="star in 5" :key="star"></div>
              </div>
              <div class="skeleton-description"></div>
              <div class="skeleton-description short"></div>
              <div class="skeleton-button"></div>
              <div class="skeleton-button"></div>
            </div>
          </div>

          <!-- Actual Technician Cards -->
          <div v-else v-for="technician in displayedTechnicians" :key="technician.id" class="technician-card">
            <div class="technician-image" :style="{ backgroundColor: technician.bgColor }">
              <img :src="technician.image" :alt="technician.name" />
            </div>
            <div class="technician-info">
              <h3 class="technician-name">{{ technician.name }}</h3>
              <div class="rating">
                <i class="fa-solid fa-star" v-for="n in 5" :key="n"></i>
              </div>
              <p class="technician-description">{{ $t('technicianDescription') }}</p>
                              <button class="view-profile-btn" @click="viewProfile(technician.id)">{{ $t('viewProfile') }}</button>
            </div>
          </div>
        </div>


      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useRouter } from 'vue-router'
import SearchBar from '../components/SearchBar.vue'
import profile1 from '../assets/profile/1.jpg'
import profile2 from '../assets/profile/2.png'
import profile3 from '../assets/profile/3.png'
import profile4 from '../assets/profile/4.png'
import profile5 from '../assets/profile/5.jpg'
import profile6 from '../assets/profile/6.png'
import profile7 from '../assets/profile/7.png'
import profile8 from '../assets/profile/8.png'
import plumbingBg from '../assets/Professions/Electricity.jpg'

const router = useRouter()
const loading = ref(true)
// Removed stock technicians - only show registered technicians
const firebaseTechnicians = ref([])
const searchQuery = ref('')
const filterOption = ref('')
const sortOption = ref('')
// Removed pagination logic

async function fetchTechnicians() {
  try {
    loading.value = true
    const querySnapshot = await getDocs(collection(db, 'technicians'))
    firebaseTechnicians.value = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(tech => tech.specialization === 'electricity')
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
    // Use uploaded photo if available, fallback to placeholder
    allTechs.push({
      id: fbTech.id,
      name: fbTech.fullName,
      image: fbTech.profilePhotoUrl || fbTech.idPhotoUrl || profile1, // Use profile photo first, then ID photo as fallback
      bgColor: '#E8E4F3', // or any default color
      price: fbTech.basePrice,
      description: fbTech.bio,
      rating: 5, // or fbTech.rating if available
      specialization: fbTech.specialization
    })
  })
  console.log('Firebase technicians:', allTechs)
  return allTechs
})

const filteredTechnicians = computed(() => {
  let list = mergedTechnicians.value
  const query = searchQuery.value.trim().toLowerCase()
  if (query) {
    list = list.filter(t => t.name && t.name.toLowerCase().includes(query))
  }
  if (filterOption.value === 'price') {
    list = list.filter(t => t.price)
  } else if (filterOption.value === 'area') {
    // Implement area filter if you have area data
  } else if (filterOption.value === 'rating') {
    list = list.filter(t => t.rating >= 4)
  } else if (filterOption.value === 'years') {
    // Implement years filter if you have years data
  }
  if (sortOption.value === 'priceLow') {
    list = [...list].sort((a, b) => a.price - b.price)
  } else if (sortOption.value === 'priceHigh') {
    list = [...list].sort((a, b) => b.price - a.price)
  } else if (sortOption.value === 'rating') {
    list = [...list].sort((a, b) => b.rating - a.rating)
  }
  return list
})

// Remove pagination logic
// Instead, show up to 20 technicians from the merged list

const maxTechniciansToShow = 20;

const displayedTechnicians = computed(() => {
  return filteredTechnicians.value.slice(0, maxTechniciansToShow);
});

function onSearch(query) {
  searchQuery.value = query
}
function onFilter(option) {
  filterOption.value = option
}
function onSort(option) {
  sortOption.value = option
}

function viewProfile(id) {
  router.push({ name: 'TechnicianProfile', params: { id } })
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
}
.dark .technicians-section {
  background-color: var(--primary-bg);
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
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
  margin-bottom: 0.5rem; /* Added margin to separate buttons */
}
.dark .view-profile-btn {
  background-color: var(--primary-color);
  color: var(--primary-text);
}
.view-profile-btn:hover {
  background-color: #4a3f7a;
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
    gap: 0.25rem;
  }
  
  .pagination-btn {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
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
</style>
