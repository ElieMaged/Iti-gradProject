<template>
    <div class="plumbing-page">
      <!-- Hero Section -->
      <section class="hero-section m-5" :style="heroBackgroundStyle">
        <div class="hero-overlay">
          <div class="hero-content">
            <h1 class="hero-title">{{ $t('electricityTitle') }}</h1>
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
            <p class="section-description">{{ $t('electricityTeamDescription') }}</p>
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
            <button class="pagination-btn active">{{ $t('page1') }}</button>
            <button class="pagination-btn">{{ $t('page2') }}</button>
            <button class="pagination-btn">{{ $t('page3') }}</button>
            <span class="pagination-dots">{{ $t('paginationDots') }}</span>
            <button class="pagination-btn">{{ $t('page10') }}</button>
            <button class="pagination-btn"><i class="fa-solid fa-chevron-right"></i></button>
          </div>
        </div>
      </section>
  <EndCard />
  
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import profile1 from '../assets/profile/1.jpg'
  import profile2 from '../assets/profile/2.png'
  import profile3 from '../assets/profile/3.png'
  import profile4 from '../assets/profile/4.png'
  import profile5 from '../assets/profile/5.jpg'
  import profile6 from '../assets/profile/6.png'
  import profile7 from '../assets/profile/7.png'
  import profile8 from '../assets/profile/8.png'
  import collage1 from '../assets/Professions/Electricity.jpg'
  import collage2 from '../assets/Contact/end.jpg'
  import EndCard from '../components/EndCard.vue'
  
  const technicians = [
    {
      id: 1,
      name: 'Ahmed Salah',
      image: profile1,
      bgColor: '#E8E4F3'
    },
    {
      id: 2,
      name: 'Mohammed Ali',
      image: profile2,
      bgColor: '#E3F2FD'
    },
    {
      id: 3,
      name: 'Omar Hassan',
      image: profile3,
      bgColor: '#FFF3E0'
    },
    {
      id: 4,
      name: 'Youssef Ahmed',
      image: profile4,
      bgColor: '#F3E5F5'
    },
    {
      id: 5,
      name: 'Karim Mahmoud',
      image: profile5,
      bgColor: '#E8F5E8'
    },
    {
      id: 6,
      name: 'Hassan Ibrahim',
      image: profile6,
      bgColor: '#FFF8E1'
    },
    {
      id: 7,
      name: 'Mahmoud Ali',
      image: profile7,
      bgColor: '#F1F8E9'
    },
    {
      id: 8,
      name: 'Ibrahim Hassan',
      image: profile8,
      bgColor: '#E0F2F1'
    }
  ]
  
  const heroBackgroundStyle = computed(() => {
    return {
      backgroundImage: `linear-gradient(rgba(98, 84, 152, 0.7), rgba(98, 84, 152, 0.7)), url(${collage1})`
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
  