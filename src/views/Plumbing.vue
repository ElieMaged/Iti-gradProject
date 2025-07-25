<template>
  <div class="plumbing-page">

    <!-- Hero Section -->
    <section class="hero-section m-5" :style="heroBackgroundStyle">
      <div class="hero-overlay">
        <div class="hero-content">
          <h1 class="hero-title">{{ $t('plumbingTitle') }}</h1>
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
          <p class="section-description">{{ $t('plumbingTeamDescription') }}</p>
        </div>

        <div class="technicians-grid">
          <div class="technician-card" v-for="technician in paginatedTechnicians" :key="technician.id">
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
              <button class="view-profile-btn" @click="goToBooking(technician.id)">{{ $t('bookNow') }}</button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button class="pagination-btn" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)"><i class="fa-solid fa-chevron-left"></i></button>
          <button
            v-for="page in totalPages"
            :key="page"
            class="pagination-btn"
            :class="{ active: currentPage === page }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button class="pagination-btn" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
      </div>
    </section>
<EndCard />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useRouter } from 'vue-router'
import EndCard from '../components/EndCard.vue'
import SearchBar from '../components/SearchBar.vue'
import profile1 from '../assets/profile/1.jpg'
import profile2 from '../assets/profile/2.png'
import profile3 from '../assets/profile/3.png'
import profile4 from '../assets/profile/4.png'
import profile5 from '../assets/profile/5.jpg'
import profile6 from '../assets/profile/6.png'
import profile7 from '../assets/profile/7.png'
import profile8 from '../assets/profile/8.png'
import plumbingBg from '../assets/Professions/Plumbing.jpg'
import { stockTechnicians } from '../assets/stockTechnicians.js';

const router = useRouter()
const loading = ref(true);
const error = ref('');
const search = ref('');
const allTechnicians = ref([]);
const filterOption = ref('')
const sortOption = ref('')
const techniciansPerPage = 8;
const currentPage = ref(1);

// Fetch registered technicians from Firestore
async function fetchRegisteredTechnicians() {
  try {
    const querySnapshot = await getDocs(collection(db, 'technicians'));
    let registered = [];
    let idCounter = 9;
    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.specialization && data.specialization.toLowerCase() === 'plumbing') {
        registered.push({
          ...data,
          id: idCounter++, // Assign id 9+ for registered
          isStock: false
        });
      }
    });
    return registered;
  } catch (err) {
    error.value = 'Error loading technicians: ' + err.message;
    return [];
  }
}

onMounted(async () => {
  loading.value = true;
  // Filter stock technicians for plumbing
  const stock = stockTechnicians
    .filter(t => t.skills && t.skills.some(skill => skill.toLowerCase().includes('plumb')))
    .map((t, idx) => ({ ...t, id: idx + 1, isStock: true }));
  // Fetch registered
  const registered = await fetchRegisteredTechnicians();
  // Map Firestore technicians to use uploaded photo as image
  const registeredWithImage = registered.map(t => ({
    ...t,
    image: t.idPhotoUrl || profile1 // fallback to a default image if missing
  }));
  allTechnicians.value = [...stock, ...registeredWithImage];
  loading.value = false;
});

const filteredTechnicians = computed(() => {
  let list = allTechnicians.value;
  const query = search.value.trim().toLowerCase()
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

const totalPages = computed(() => {
  return Math.ceil(filteredTechnicians.value.length / techniciansPerPage);
});

const paginatedTechnicians = computed(() => {
  const start = (currentPage.value - 1) * techniciansPerPage;
  const end = start + techniciansPerPage;
  return filteredTechnicians.value.slice(start, end);
});

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

function onSearch(query) {
  search.value = query
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

function goToBooking(id) {
  router.push({ path: '/bookingpage', query: { techId: id } })
}

const heroBackgroundStyle = computed(() => {
  return {
    backgroundImage: `linear-gradient(rgba(98, 84, 152, 0.7), rgba(98, 84, 152, 0.7)), url(${plumbingBg})`
  }
})
</script>

<style scoped>
.plumbing-page {
  width: 100%;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 400px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero-content {
  color: white;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
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
  background-color: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

.section-description {
  font-size: 1.1rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

.technicians-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  grid-auto-rows: 1fr;
  justify-items: center;
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

.technician-image img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
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

.rating {
  margin-bottom: 1rem;
}

.rating i {
  color: #FFC230;
  margin-right: 0.2rem;
}

.technician-description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
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
}

.view-profile-btn:hover {
  background-color: #4a3f7a;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.pagination-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.pagination-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.pagination-dots {
  color: #666;
  font-weight: bold;
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

.cta-content {
  color: white;
  max-width: 600px;
  padding: 0 2rem;
}

.cta-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.cta-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  opacity: 0.9;
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

.cta-btn:hover {
  background-color: #4a3f7a;
}

.cta-btn i {
  transition: transform 0.3s ease;
}

.cta-btn:hover i {
  transform: translateX(5px);
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
</style>
