<template>
  <section class="expert-team">
    <div class="team-header">
      <div class="team-title-section">
        <h2 class="team-title">Effective Cleaning Requires an Expert Cleaning Team</h2>
      </div>
      <div class="team-subtitle-section">
        <h3 class="team-subtitle">Expert Team</h3>
        <p class="team-description">We have professional expert cleaning staff ensuring top-notch cleanliness and hygiene for your space.</p>
      </div>
    </div>
    
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading team members...</p>
    </div>
    
    <div v-else class="team-cards">
      <div v-for="(member, index) in teamMembers" :key="member.id" class="team-card">
        <div class="member-image">
          <img :src="member.image" :alt="member.name" class="member-photo" />
        </div>
        <div class="member-info">
          <h3 class="member-name">{{ member.name }}</h3>
          <div class="member-rating">
            <i v-for="star in member.rating" :key="star" class="fas fa-star"></i>
          </div>
          <p class="member-description">{{ member.description }}</p>
          <button class="view-profile-btn">
            View Profile
            <i class="fas fa-arrow-right arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import { collection, getDocs } from 'firebase/firestore';
// import { ref, getDownloadURL } from 'firebase/storage';
// import { db, storage } from '../firebase.js';

export default {
  name: 'ExpertTeam',
  data() {
    return {
      teamMembers: [
        {
          id: '1',
          name: 'Erick Reynolds',
          image: '/public/images/Image.png',
          description: 'Skilled technician with a strong track record of customer satisfaction. Professional, and ready for your job.',
          rating: 5
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          image: '/public/images/Image.png',
          description: 'Expert cleaning specialist with 5+ years of experience. Dedicated to providing exceptional service.',
          rating: 5
        },
        {
          id: '3',
          name: 'Mike Chen',
          image: '/public/images/Image.png',
          description: 'Professional technician with excellent attention to detail. Committed to customer satisfaction.',
          rating: 5
        },
        {
          id: '4',
          name: 'Lisa Rodriguez',
          image: '/public/images/Image.png',
          description: 'Experienced team member with strong work ethic. Delivers quality results every time.',
          rating: 5
        }
      ],
      loading: false
    };
  },
  // async mounted() {
  //   await this.fetchTeamMembers();
  // },
  // methods: {
  //   async fetchTeamMembers() {
  //     try {
  //       const teamCollection = collection(db, 'team');
  //       const teamSnapshot = await getDocs(teamCollection);
  //       
  //       const members = [];
  //       for (const doc of teamSnapshot.docs) {
  //         const memberData = doc.data();
  //         
  //         // Get image URL from Firebase Storage
  //         let imageUrl = '';
  //         if (memberData.imagePath) {
  //           const imageRef = ref(storage, memberData.imagePath);
  //           try {
  //               imageUrl = await getDownloadURL(imageRef);
  //           } catch (error) {
  //               console.error('Error loading image:', error);
  //               imageUrl = '/public/images/team/default-avatar.png'; // fallback image
  //           }
  //         }
  //         
  //         members.push({
  //           id: doc.id,
  //           name: memberData.name || 'Unknown',
  //           image: imageUrl,
  //           description: memberData.description || 'Professional team member with excellent service record.',
  //           rating: memberData.rating || 5
  //         });
  //       }
  //       
  //       this.teamMembers = members;
  //       this.loading = false;
  //     } catch (error) {
  //       console.error('Error fetching team members:', error);
  //       this.loading = false;
  //     }
  //   }
  // }
};
</script>

<style scoped>
.expert-team {
  width: 90%;
  max-width: 1100px;
  margin: 0 auto 60px auto;
  padding: 40px 0;
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

.team-description {
  font-size: 1rem;
  color: #8c8e90;
  line-height: 1.6;
  font-family: Outfit, sans-serif;
}

.team-cards {
  display: flex;
  gap: 20px;
  justify-content: center;
  width: 100%;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
</style> 