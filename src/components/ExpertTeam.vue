<template>
<section class="expert-team" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'" :lang="$i18n.locale">
    <div class="team-header">
      <div class="team-title-section">
        <h2 class="team-title">{{ $t('meetOurExpertTechnicians') }}</h2>
      </div>
      <div class="team-subtitle-section">
        <h3 class="team-subtitle">{{ $t('ourTechniciansSubtitle') }}</h3>
        <p class="team-description">{{ $t('ourTechniciansDescription') }}</p>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ $t('loadingTeamMembers') }}</p>
    </div>

    <div v-else class="team-cards">
      <div v-for="(member, index) in teamMembers.slice(currentIndex, currentIndex + 4)" :key="member.id" class="team-card">
        <!-- Top Section - Image Area -->
        <div class="card-top-section">
          <img :src="member.image" :alt="member.name" class="member-photo" />
        </div>
        
        <!-- Bottom Section - Information Area -->
        <div class="card-bottom-section">
          <h3 class="member-name">{{ $t(member.name) }}</h3>
          <div class="member-specialization">{{ $t(member.specialization) }}</div>
          <p class="member-description">{{ $t(member.description) }}</p>
          
          <!-- Details Row -->
          <div class="member-details">
            <div class="detail-item rating-item">
              <i class="fas fa-star"></i>
              <span>{{ member.rating }}</span>
            </div>
            <div class="detail-item location-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>{{ $t(member.location) }}</span>
            </div>
            <div class="detail-item price-item">
              <i class="fa-solid fa-dollar-sign"></i>
              <span>{{ member.basePrice }} {{ $t('EGP') }}</span>
            </div>
          </div>
          
          <button class="view-profile-btn" @click="viewProfile(member)">
            {{ $t('viewProfile') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Points navigation -->
    <div class="slider-points" v-if="teamMembers.length > 4">
      <div 
        v-for="(point, index) in totalSlides" 
        :key="index"
        @click="goToSlide(index)"
        :class="['slider-point', { active: currentSlideIndex === index }]"
      ></div>
    </div>
  </section>
</template>

<script>
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase.js';
import { calculateTechnicianRatings } from '../utils/ratingCalculator';

export default {
  name: 'ExpertTeam',
  data() {
    return {
      teamMembers: [],
      loading: true,
      currentIndex: 0, // start of the visible window
      currentSlideIndex: 0, // current slide index for points
      autoSlideInterval: null,
    };
  },
  computed: {
    totalSlides() {
      return Math.ceil(this.teamMembers.length / 4);
    }
  },
  async mounted() {
    await this.fetchTechnicians();
    this.startAutoSlide();
  },
  beforeUnmount() {
    this.stopAutoSlide();
  },
  methods: {
    async fetchTechnicians() {
      try {
        this.loading = true;
        const techniciansCollection = collection(db, 'technicians');
        const techniciansSnapshot = await getDocs(techniciansCollection);

        const firebaseTechnicians = [];
        techniciansSnapshot.forEach(doc => {
          const data = doc.data();
          firebaseTechnicians.push({
            id: doc.id,
            name: data.fullName || data.name || 'Unknown Technician',
            image: data.profilePhotoUrl || data.idPhotoUrl || '/images/Avatar.png',
            description: data.bio || data.description || 'Professional technician with years of experience.',
            rating: 0, // Will be calculated by calculateTechnicianRatings
            specialization: data.specialization || 'General Technician',
            experience: data.experience || data.yearsOfExperience ? `${data.yearsOfExperience || data.experience}+ years` : '5+ years',
            basePrice: data.basePrice || '300',
            status: data.status || 'approved',
            location: data.government || data.location || 'Cairo',
            phone: data.phone || '+20 111 222 3333',
            email: data.email || 'technician@example.com'
          });
        });

        // Calculate ratings for all technicians
        const techniciansWithRatings = await calculateTechnicianRatings(firebaseTechnicians);
        
        // Only use Firebase technicians with calculated ratings
        this.teamMembers = techniciansWithRatings;
      } catch (error) {
        console.error('Error fetching technicians:', error);
        // No fallback - only show registered technicians
        this.teamMembers = [];
      } finally {
        this.loading = false;
      }
    },
    nextSlide() {
      if (this.currentSlideIndex < this.totalSlides - 1) {
        this.currentSlideIndex++;
        this.currentIndex = this.currentSlideIndex * 4;
      } else {
        // Loop back to first slide
        this.currentSlideIndex = 0;
        this.currentIndex = 0;
      }
    },
    prevSlide() {
      if (this.currentSlideIndex > 0) {
        this.currentSlideIndex--;
        this.currentIndex = this.currentSlideIndex * 4;
      } else {
        // Loop to last slide
        this.currentSlideIndex = this.totalSlides - 1;
        this.currentIndex = this.currentSlideIndex * 4;
      }
    },
    goToSlide(slideIndex) {
      this.currentSlideIndex = slideIndex;
      this.currentIndex = slideIndex * 4;
      this.resetAutoSlide();
    },
    startAutoSlide() {
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide();
      }, 10000); // 10 seconds
    },
    stopAutoSlide() {
      if (this.autoSlideInterval) {
        clearInterval(this.autoSlideInterval);
        this.autoSlideInterval = null;
      }
    },
    resetAutoSlide() {
      this.stopAutoSlide();
      this.startAutoSlide();
    },
    viewProfile(member) {
      // If user is not authenticated, redirect to welcome page and preserve intended route
      if (!auth.currentUser) {
        this.$router.push({
          path: '/welcomepage',
          query: { redirect: `/technician/${member.id}` }
        });
        return;
      }

      // Navigate to technician profile with the specific technician's ID and all available data
      this.$router.push({
        path: `/technician/${member.id}`,
        query: { 
          name: member.name,
          specialization: member.specialization,
          rating: member.rating,
          experience: member.experience,
          basePrice: member.basePrice,
          bio: member.description,
          location: member.location,
          phone: member.phone,
          email: member.email,
          status: member.status,
          image: member.image
        }
      });
    }
  }
};
</script>

<style scoped>
.expert-team {
  margin: 40px 80px;
  width: auto;
}
.team-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 48px;
  gap: 40px;
}

.team-title-section {
  flex: 1;
}

.team-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
  font-family: Outfit, sans-serif;
  text-align: start;
  margin-bottom: 10px;
}

.dark .team-title {
  color: var(--primary-text);
}

.team-subtitle-section {
  flex: 1;
  max-width: 400px;
}

.team-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  font-family: Outfit, sans-serif;
}

.dark .team-subtitle {
  color: var(--primary-text);
}

.team-description {
  font-size: 1rem;
  color: #8c8e90;
  line-height: 1.6;
  font-family: Outfit, sans-serif;
}

.dark .team-description {
  color: var(--text-muted);
}

.team-cards {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 30px;
}

.dark .member-name {
  color: var(--primary-text);
}

.dark .member-description {
  color: var(--text-muted);
}

.dark .member-rating i {
  color: var(--primary-color);
}

.team-card {
  width: 300px;
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
  display: flex;
  flex-direction: column;
}

.dark .team-card {
  background: var(--secondary-bg);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

/* Top Section - Image Area */
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

/* Bottom Section - Information Area */
.card-bottom-section {
  padding: 16px 20px;
  background: #ffffff;
  text-align: left;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 250px; /* Fixed height for bottom section */
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
  height: 20px; /* Fixed height for name */
  overflow: hidden;
  text-overflow:ellipsis;
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
  height: 20px; /* Fixed height for specialization */
  overflow: hidden;
  text-overflow: ellipsis;
}

.member-description {
  font-size: 0.9rem;
  color: #666666;
  line-height: 1.4;
  margin-bottom: 0px;
  font-family: Outfit, sans-serif;
  flex: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.8em; /* 2 lines with line-height 1.4 */
  max-height: 2.8em; /* 2 lines with line-height 1.4 */
}

.dark .member-description {
  color: var(--text-muted);
}

/* Details Row */
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

.dark .detail-item {
  color: var(--primary-text);
}

.detail-item i {
  font-size: 0.8rem;
  color: #666666;
}

/* Star icon - Rating (Yellow) */

.fa-star  {
  color: var(--color-secondary)!important;
}

/* Map marker icon - Location (Blue) */
.fa-location-dot {
  color: #4d7cfe !important;
}

/* Dollar sign icon - Price (Green) */
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
  margin-top: auto; /* Push to bottom of flex container */
}

.view-profile-btn:hover {
  background: #5a4e99;
  transform: translateY(-2px);
}

.view-profile-btn i {
  font-size: 0.8rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #625397;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.arrow-right {
  transform: rotate(-45deg);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Slider Points */
.slider-points {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.slider-point {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ddd;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.slider-point:hover {
  background-color: #625397;
  transform: scale(1.2);
}

.slider-point.active {
  background-color: #625397;
  transform: scale(1.3);
  border-color: #625397;
}

.dark .slider-point {
  background-color: #444;
}

.dark .slider-point:hover {
  background-color: var(--primary-color);
}

.dark .slider-point.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

/* Responsive design */
@media (max-width: 1024px) {
  .team-cards {
    flex-wrap: wrap;
    gap: 20px;
  }

  .team-card {
    flex: 1 1 calc(50% - 20px);
    min-width: 280px;
  }
}

@media (max-width: 768px) {
  .expert-team {
    margin: 0 auto 40px auto;
    padding: 30px 0;
  }

  .team-header {
    flex-direction: column;
    gap: 24px;
    margin-bottom: 32px;
  }

  .team-title {
    font-size: 2rem;
  }

  .team-subtitle {
    font-size: 1.3rem;
  }

  .team-cards {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .team-card {
    width: 100%;
    max-width: 320px;
  }

  .member-image {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .expert-team {
    width: 95%;
    margin: 0 auto 30px auto;
    padding: 20px 0;
  }

  .team-header {
    gap: 16px;
    margin-bottom: 24px;
    text-align: center;
  }

  .team-title {
    font-size: 1.8rem;
    text-align: center;
  }

  .team-subtitle {
    font-size: 1.2rem;
    text-align: center;
  }

  .team-description {
    font-size: 0.9rem;
    text-align: center;
  }

  .team-cards {
    gap: 16px;
  }

  .team-card {
    max-width: 280px;
  }

  .member-image {
    height: 200px;
  }

  .member-info {
    padding: 20px 16px;
    text-align: center;
  }

  .member-name {
    font-size: 1.2rem;
    text-align: center;
  }

  .member-specialization {
    font-size: 0.8rem;
    text-align: center;
  }

  .member-location {
    font-size: 0.8rem;
    text-align: center;
  }

  .member-description {
    font-size: 0.85rem;
    text-align: center;
  }

  .member-experience {
    font-size: 0.8rem;
    text-align: center;
  }

  .slider-points {
    gap: 8px;
  }

  .slider-point {
    width: 10px;
    height: 10px;
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .team-cards {
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
  
  .team-card {
    width: 100%;
    max-width: 350px;
  }
  
  .card-top-section {
    height: 180px;
  }
  
  .member-name {
    font-size: 1.3rem;
  }
  
  .member-specialization {
    font-size: 0.9rem;
  }
  
  .member-description {
    font-size: 0.85rem;
  }
  
  .detail-item {
    font-size: 0.8rem;
  }
  
  .view-profile-btn {
    font-size: 0.9rem;
    padding: 10px 20px;
  }
}

@media (max-width: 480px) {
  .team-card {
    max-width: 320px;
  }
  
  .card-top-section {
    height: 160px;
  }
  
  .card-bottom-section {
    padding: 20px 16px;
  }
  
  .member-name {
    font-size: 1.2rem;
  }
  
  .member-specialization {
    font-size: 0.85rem;
  }
  
  .member-description {
    font-size: 0.8rem;
  }
  
  .detail-item {
    font-size: 0.75rem;
  }
  
  .view-profile-btn {
    font-size: 0.85rem;
    padding: 8px 16px;
  }
}
/* RTL support for Arabic */
[dir="rtl"] .expert-team {
  direction: rtl;
  text-align: right;
}
[dir="rtl"] .team-header,
[dir="rtl"] .team-title-section,
[dir="rtl"] .team-subtitle-section,
[dir="rtl"] .team-cards,
[dir="rtl"] .team-card,
[dir="rtl"] .card-bottom-section {
  text-align: right;
}
[dir="rtl"] .member-details {
  flex-direction: row-reverse;
}
[dir="rtl"] .slider-points {
  flex-direction: row-reverse;
}
</style>