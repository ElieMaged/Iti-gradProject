<template>
  <section class="expert-team mx-5 md:mx-10 lg:mx-20">
    <!-- Team Header -->
    <div class="team-header">
      <div class="team-title-section">
        <h2 class="team-title">
          {{ $t("meetOurExpertTechnicians") || "Meet Our Expert Technicians" }}
        </h2>
      </div>
      <div class="team-subtitle-section">
        <h3 class="team-subtitle">
          {{
            $t("ourTechniciansSubtitle") ||
            "Our technicians are highly skilled and ready to help you."
          }}
        </h3>
        <p class="team-description">
          {{
            $t("ourTechniciansDescription") ||
            "Browse our team of professionals and view their profiles to find the right expert for your needs."
          }}
        </p>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ $t("loadingTeamMembers") }}</p>
    </div>

    <div v-else class="team-cards">
      <div
        v-for="(member, index) in teamMembers.slice(
          currentIndex,
          currentIndex + 4
        )"
        :key="member.id"
        class="team-card"
      >
        <div class="member-image">
          <img :src="member.image" :alt="member.name" class="member-photo" />
        </div>
        <div class="member-info">
          <h3 class="member-name">{{ $t(member.name) }}</h3>
          <div class="member-specialization">{{ member.specialization }}</div>
          <div class="member-location">{{ member.location }}</div>
          <div class="member-rating">
            <i
              v-for="star in Math.floor(member.rating || 5)"
              :key="star"
              class="fas fa-star"
            ></i>
          </div>
          <p class="member-description">{{ $t(member.description) }}</p>
          <div class="member-experience">
            {{ member.experience }} {{ $t("yearsOfExperience") }}
          </div>
          <button class="view-profile-btn" @click="viewProfile(member)">
            {{ $t("viewProfile") }}
            <i class="fas fa-arrow-right arrow-right"></i>
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
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";
import { stockTechnicians } from "../assets/stockTechnicians.js";

export default {
  name: "ExpertTeam",
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
    },
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
        const techniciansCollection = collection(db, "technicians");
        const techniciansSnapshot = await getDocs(techniciansCollection);

        const firebaseTechnicians = [];
        techniciansSnapshot.forEach((doc) => {
          const data = doc.data();
          firebaseTechnicians.push({
            id: doc.id,
            name: data.fullName || data.name || "Unknown Technician",
            image: data.idPhotoUrl || data.profileImage || "/images/Avatar.png",
            description:
              data.bio ||
              data.description ||
              "Professional technician with years of experience.",
            rating: data.averageRating || 4.5,
            specialization: data.specialization || "General Technician",
            experience:
              data.experience || data.yearsOfExperience
                ? `${data.yearsOfExperience || data.experience}+ years`
                : "5+ years",
            basePrice: data.basePrice || "300",
            status: data.status || "approved",
            location: data.government || data.location || "Cairo",
            phone: data.phone || "+20 111 222 3333",
            email: data.email || "technician@example.com",
          });
        });

        // Fallback to stockTechnicians if none found
        this.teamMembers =
          firebaseTechnicians.length > 0
            ? firebaseTechnicians
            : stockTechnicians.map((tech) => ({
                id: tech.id,
                name: tech.name,
                image: tech.image || "/images/Avatar.png",
                description: tech.description,
                rating: tech.rating || 4.5,
                specialization: tech.specialization || "General Technician",
                experience: tech.yearsOfExperience
                  ? `${tech.yearsOfExperience}+ years`
                  : "5+ years",
                basePrice: tech.price || "300",
                status: "approved",
                location: tech.location || "Cairo",
                phone: tech.phone || "+20 111 222 3333",
                email: "technician@example.com",
              }));
      } catch (error) {
        console.error("Error fetching technicians:", error);
        // Fallback to stockTechnicians
        this.teamMembers = stockTechnicians.map((tech) => ({
          id: tech.id,
          name: tech.name,
          image: tech.image || "/images/Avatar.png",
          description: tech.description,
          rating: tech.rating || 4.5,
          specialization: tech.specialization || "General Technician",
          experience: tech.yearsOfExperience
            ? `${tech.yearsOfExperience}+ years`
            : "5+ years",
          basePrice: tech.price || "300",
          status: "approved",
          location: tech.location || "Cairo",
          phone: tech.phone || "+20 111 222 3333",
          email: "technician@example.com",
        }));
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
      // Navigate to technician profile with the specific technician's ID and all available data
      this.$router.push({
        path: `/texhView/${member.id}`,
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
          image: member.image,
        },
      });
    },
  },
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
  font-size: 44px;
  font-weight: 600;
  line-height: 56px;
  color: var(--black-text);
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
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  color: var(--black-text);
  margin-bottom: 16px;
  font-family: Outfit, sans-serif;
}

.dark .team-subtitle {
  color: var(--primary-text);
}

.team-description {
  font-size: 16px;
  line-height: 24px;
  color: var(--text-gray);
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
  margin-bottom: 30px;
}

.dark .member-description {
  color: var(--card-text-gray);
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
}

.member-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--black-text);
  margin-bottom: 16px;
  font-family: Outfit, sans-serif;
}
.dark .member-name {
  color: var(--primary-text);
}
.member-specialization {
  font-size: 1rem;
  color: #625397;
  margin-bottom: 4px;
  font-weight: 600;
  font-family: Outfit, sans-serif;
}

.member-location {
  font-size: 1rem;
  color: var(--card-text-gray);
  margin-bottom: 8px;
  font-family: Outfit, sans-serif;
}

.member-rating {
  margin-bottom: 16px;
  display: flex;
  gap: 2px;
  color: #f3d361;
}

.member-rating i {
  color: #f3d361 !important;
  font-size: 1.1rem;
}

.member-description {
  font-size: 1rem;
  color: var(--card-text-gray);
  line-height: 1.5;
  margin-bottom: 20px;
  font-family: Outfit, sans-serif;
}

.member-experience {
  font-size: 1rem;
  color: var(--card-text-gray);
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

/* Slider Points */
.slider-points {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  margin-bottom: 60px;
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
  }
}
@media (max-width: 999px) {
  .team-header {
    flex-direction: column;
    gap: 24px;
    margin-bottom: 32px;
  }
}
@media (max-width: 768px) {
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
  }

  .member-image {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .team-header {
    gap: 16px;
    margin-bottom: 24px;
  }

  .team-title {
    font-size: 1.8rem;
  }

  .team-subtitle {
    font-size: 1.2rem;
  }

  .team-description {
    font-size: 0.9rem;
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
  .member-rating {
    justify-content: center;
  }
}
</style>
