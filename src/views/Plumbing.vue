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
          <div class="technician-card" v-for="technician in technicians" :key="technician.id">
            <div class="technician-image" :style="{ backgroundColor: technician.bgColor }">
              <img :src="technician.image" :alt="technician.name" />
            </div>
            <div class="technician-info">
              <h3 class="technician-name">{{ technician.name }}</h3>
              <div class="rating">
                <i class="fa-solid fa-star" v-for="n in 5" :key="n"></i>
              </div>
              <p class="technician-description">{{ $t('technicianDescription') }}</p>
              <button class="view-profile-btn">{{ $t('viewProfile') }}</button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button class="pagination-btn"><i class="fa-solid fa-chevron-left"></i></button>
          <button class="pagination-btn active">1</button>
          <button class="pagination-btn">2</button>
          <button class="pagination-btn">3</button>
          <span class="pagination-dots">...</span>
          <button class="pagination-btn">10</button>
          <button class="pagination-btn"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
      </div>
    </section>
<EndCard />

  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import EndCard from '../components/EndCard.vue'
import SearchBar from '../components/SearchBar.vue'

const profile1 = ref('')
const profile2 = ref('')
const profile3 = ref('')
const profile4 = ref('')
const profile5 = ref('')
const profile6 = ref('')
const profile7 = ref('')
const profile8 = ref('')
const collage1 = ref('')
const collage2 = ref('')

onMounted(async () => {
  // Dynamic imports for profile images
  profile1.value = (await import('../assets/profile/1.jpg')).default
  profile2.value = (await import('../assets/profile/2.png')).default
  profile3.value = (await import('../assets/profile/3.png')).default
  profile4.value = (await import('../assets/profile/4.png')).default
  profile5.value = (await import('../assets/profile/5.jpg')).default
  profile6.value = (await import('../assets/profile/6.png')).default
  profile7.value = (await import('../assets/profile/7.png')).default
  profile8.value = (await import('../assets/profile/8.png')).default
  
  // Dynamic imports for background images
  collage1.value = (await import('../assets/Professions/Plumbing.jpg')).default
  collage2.value = (await import('../assets/Contact/end.jpg')).default
})

const technicians = computed(() => [
  {
    id: 1,
    name: 'Ahmed Salah',
    image: profile1.value,
    bgColor: '#E8E4F3'
  },
  {
    id: 2,
    name: 'Mohammed Ali',
    image: profile2.value,
    bgColor: '#E3F2FD'
  },
  {
    id: 3,
    name: 'Omar Hassan',
    image: profile3.value,
    bgColor: '#FFF3E0'
  },
  {
    id: 4,
    name: 'Youssef Ahmed',
    image: profile4.value,
    bgColor: '#F3E5F5'
  },
  {
    id: 5,
    name: 'Karim Mahmoud',
    image: profile5.value,
    bgColor: '#E8F5E8'
  },
  {
    id: 6,
    name: 'Hassan Ibrahim',
    image: profile6.value,
    bgColor: '#FFF8E1'
  },
  {
    id: 7,
    name: 'Mahmoud Ali',
    image: profile7.value,
    bgColor: '#F1F8E9'
  },
  {
    id: 8,
    name: 'Ibrahim Hassan',
    image: profile8.value,
    bgColor: '#E0F2F1'
  }
])

const heroBackgroundStyle = computed(() => {
  return {
    backgroundImage: `linear-gradient(rgba(98, 84, 152, 0.7), rgba(98, 84, 152, 0.7)), url(${collage1.value})`
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
}

.technician-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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
