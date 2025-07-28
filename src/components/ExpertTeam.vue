<template>
  <section class="expert-team m-20">
    <div class="team-header">
      <div class="team-title-section">
        <h2 class="team-title">{{ $t('meetOurExpertTechnicians') || 'Meet Our Expert Technicians' }}</h2>
      </div>
      <div class="team-subtitle-section">
        <h3 class="team-subtitle">{{ $t('ourTechniciansSubtitle') || 'Our technicians are highly skilled and ready to help you.' }}</h3>
        <p class="team-description">{{ $t('ourTechniciansDescription') || 'Browse our team of professionals and view their profiles to find the right expert for your needs.' }}</p>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ $t('loadingTeamMembers') }}</p>
    </div>

    <div v-else class="team-cards">
      <button @click="prevSlide" :disabled="currentIndex === 0" class="slider-btn">
        <i class="fas fa-arrow-left"></i>
      </button>
      <div v-for="(member, index) in teamMembers.slice(currentIndex, currentIndex + 4)" :key="member.id" class="team-card">
        <div class="member-image">
          <img :src="member.image" :alt="member.name" class="member-photo" />
        </div>
        <div class="member-info">
          <h3 class="member-name">{{ $t(member.name) }}</h3>
          <div class="member-rating">
            <i v-for="star in Math.floor(member.rating || 5)" :key="star" class="fas fa-star"></i>
          </div>
          <p class="member-description">{{ $t(member.description) }}</p>
          <button class="view-profile-btn" @click="viewProfile(member)">
            {{ $t('viewProfile') }}
            <i class="fas fa-arrow-right arrow-right"></i>
          </button>
        </div>
      </div>
      <button @click="nextSlide" :disabled="currentIndex + 4 >= teamMembers.length" class="slider-btn">
        <i class="fas fa-arrow-right"></i>
      </button>
    </div>
  </section>
</template>

<script>
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';
import { stockTechnicians } from '../assets/stockTechnicians.js';

export default {
  name: 'ExpertTeam',
  data() {
    return {
      teamMembers: [],
      loading: true,
      currentIndex: 0, // start of the visible window
    };
  },
  async mounted() {
    await this.fetchTechnicians();
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
            image: data.idPhotoUrl || data.profileImage || '/images/Avatar.png',
            description: data.bio || data.description || 'Professional technician with years of experience.',
            rating: data.averageRating || 4.5,
          });
        });

        // Fallback to stockTechnicians if none found
        this.teamMembers = firebaseTechnicians.length > 0
          ? firebaseTechnicians
          : stockTechnicians.map(tech => ({
              id: tech.id,
              name: tech.name,
              image: tech.image || '/images/Avatar.png',
              description: tech.description,
              rating: tech.rating || 4.5,
            }));
      } catch (error) {
        console.error('Error fetching technicians:', error);
        // Fallback to stockTechnicians
        this.teamMembers = stockTechnicians.map(tech => ({
          id: tech.id,
          name: tech.name,
          image: tech.image || '/images/Avatar.png',
          description: tech.description,
          rating: tech.rating || 4.5,
        }));
      } finally {
        this.loading = false;
      }
    },
    nextSlide() {
      if (this.currentIndex + 4 < this.teamMembers.length) {
        this.currentIndex += 4;
      }
    },
    prevSlide() {
      if (this.currentIndex - 4 >= 0) {
        this.currentIndex -= 4;
      }
    },
    viewProfile(member) {
      this.$router.push({ path: `/technician/${member.id}` });
    }
  }
};
</script>

<style scoped>

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
  justify-content: center;
  width: 100%;
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
  background: linear-gradient(135deg, #f8f5ff 0%, #ffffff 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(98, 83, 151, 0.1);
  transition: transform 0.2s;
  border: 1px solid var(--primary-color);
}

.dark .team-card {
  background: var(--secondary-bg);
  border: 1px solid var(--primary-color);
}

.team-card:hover {
  transform: translateY(-4px);
}

.member-image {
  width: 100%;
  height: 300px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.member-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px 20px 0 0;
}

.member-info {
  padding: 24px 20px;
  text-align: center;
}

.member-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  font-family: Outfit, sans-serif;
}

.member-rating {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  gap: 2px;
  color: #f3d361;
}

.member-rating i {
  color: #f3d361 !important;
  font-size: 1.1rem;
}

.member-description {
  font-size: 0.9rem;
  color: #8c8e90;
  line-height: 1.5;
  margin-bottom: 20px;
  font-family: Outfit, sans-serif;
}

.view-profile-btn {
  background: #625397;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;
  width: 100%;
}

.view-profile-btn:hover {
  background: #4e3b7a;
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

  .member-description {
    font-size: 0.85rem;
    text-align: center;
  }
}

.slider-btn {
  background: #625397;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin: 0 10px;
  cursor: pointer;
  transition: background 0.2s;
}
.slider-btn:disabled {
  background: #ccc;
  color: #888;
  cursor: not-allowed;
}
.slider-btn i {
  pointer-events: none;
}
</style>