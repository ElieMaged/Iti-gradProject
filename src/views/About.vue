<script>
import EndCard from '../components/EndCard.vue';
export default {
  name: 'About',
  data() {
    return {
      services: [
        {
          icon: 'fa-solid fa-wand-sparkles',
          title: 'servicesFeature1Title',
          description: 'servicesFeature1Desc'
        },
        {
          icon: 'fa-solid fa-clock',
          title: 'servicesFeature2Title',
          description: 'servicesFeature2Desc'
        },
        {
          icon: 'fas fa-phone',
          title: 'servicesFeature3Title',
          description: 'servicesFeature3Desc'
        },
        {
          icon: 'fas fa-award',
          title: 'servicesFeature4Title',
          description: 'servicesFeature4Desc'
        }
      ],
      stats: [
        { target: 150, current: 0, label: 'teamMembers', suffix: '+' },
        { target: 100, current: 0, label: 'winningAwards', suffix: '+' },
        { target: 700, current: 0, label: 'completeProjects', suffix: '+' },
        { target: 684, current: 0, label: 'clientReviews', suffix: '+' }
      ],
      countersStarted: false
    };
  },
  components: {
    EndCard
  },
  mounted() {
    this.startCounters();
  },
  methods: {
    startCounters() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.countersStarted) {
            this.countersStarted = true;
            this.animateCounters();
          }
        });
      }, { threshold: 0.5 });

      const statsSection = document.querySelector('.about-2');
      if (statsSection) {
        observer.observe(statsSection);
      }
    },
    animateCounters() {
      this.stats.forEach((stat, index) => {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = stat.target / steps;
        const stepDuration = duration / steps;
        
        let currentStep = 0;
        const timer = setInterval(() => {
          currentStep++;
          this.stats[index].current = Math.min(
            Math.round(increment * currentStep),
            stat.target
          );
          
          if (currentStep >= steps) {
            clearInterval(timer);
          }
        }, stepDuration);
      });
    }
  }
};
</script>


<template>
    <!-- //About-1// -->
  <div class="">
      <div class="contact-1">
        <div class="blur"></div>
        <h1 class="text-center flex flex-row justify-center h1">{{ $t('aboutUsTitle') }}</h1>
    </div>
  </div>
  <div class="who-we-are-section">
    <div class="who-we-are-container">
      <div class="text-content">
        <h1 class="who-we-are-title">{{ $t('whoAreWeTitle') }}</h1>
        <p class="who-we-are-desc">{{ $t('whoAreWeDesc') }}</p>
        <p class="who-we-are-desc">{{ $t('whoAreWeDesc2') }}</p>
        <h2 class="our-mission-title">{{ $t('ourMissionTitle') }}</h2>
        <p class="our-mission-desc">{{ $t('ourMissionDesc') }}</p>
      </div>

      <div class="image-grid">
        <img class="technician-img" src="../assets/Contact/collage-1.jpg" alt="Plumber working under sink">
        <img class="technician-img" src="../assets/Contact/collage-2.jpg" alt="Technician installing device">
        <img class="technician-img" src="../assets/Contact/collage-3.png" alt="Electronic components work">
        <img class="technician-img" src="../assets/Contact/collageall.png" alt="Wood carving with chisel">
      </div>
    </div>
  </div>
     <!-- About-2 -->
   <div class="container flex flex-col md:flex-row gap-10 md:gap-15 text-center about-2 p-6">
    <div v-for="(stat, index) in stats" :key="index" class="flex-1">
      <h2 class="text-4xl font-bold mb-2 counter-number">{{ stat.current }}{{ stat.suffix }}</h2>
      <p class="text-lg">{{ $t(stat.label) }}</p>
    </div>
   </div>
                           <!-- About-3 -->

                 <div class="mt-20 mb-0">

        </div>
               <!-- About-3 -->
      <div class="mt-10 mb-5">
     <h1 class="text-center">{{ $t('whyChooseUsTitle') }}</h1>
     </div>
   <section class="services-features">
    <div class="services-container">
             <div v-for="(service, index) in services" :key="index" class="service-card">
         <div class="service-icon">
           <i :class="service.icon" style="color: var(--secondary-color); font-size: 3rem;"></i>
         </div>
         <h3 class="service-title">{{ $t(service.title) }}</h3>
         <p class="service-description">{{ $t(service.description) }}</p>
       </div>
    </div>
     </section>
   
<EndCard />
<!-- <div class="flex flex-col justify-center end md:m-20 align-items-center">
<h2 class="h1">We're Here to Help You.</h2>
<p>We’re here to help you achieve your goals, overcome challenges and make every step smoother along the way.</p>
<button class="buttony text-white font-bold py-2 px-4 rounded-full">
  Book an Appointment ->
</button>
</div> -->

   
   
</template>


<style scoped>
.services-features {
  padding: 40px 0;
  padding: 40px 0;
  width: 100%;
  border-radius: 16px;
}


.services-header {
  text-align: center;
  margin-bottom: 60px;
  background-color: #F4F4F5;
  color: #333;
  padding: 20px;
  margin-bottom: 0;
}
.dark .services-header {
  background-color: var(--secondary-bg);
  color: var(--primary-text);
}



.services-container {
  width: 1280px;
  margin: 0 auto;
  display: flex;
  gap: 40px;
  justify-content: center;
  max-width: calc(100vw - 160px);
}

.service-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px 32px;
  text-align: left;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  flex: 1;
  max-width: 300px;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  position: relative;
}
.dark .service-card {
  background: var(--secondary-bg);
}


.service-card:hover {
  transform: translateY(-4px);
}

.service-icon {
  position: absolute;
  top: 24px;
  left: 24px;
  margin-bottom: 0;
}

.service-icon i {
  font-size: 3.5rem;
  color: var(--secondary-color);
}

.service-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  font-family: Outfit, sans-serif;
  margin-top: 4rem;
}
.dark .service-title {
  color: var(--primary-text);
}
.service-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 0;
  font-family: Outfit, sans-serif;
  text-align: left;
}
.dark .service-description {
  color: var(--text-muted);
}
.get-started-btn {
  color: var(--primary-color);
  margin-left: 100px;
  border: none;
  border-radius: 25px;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
  transition: background 0.2s;

}
.dark .get-started-btn {
  color: var(--primary-text);
}
.get-started-btn:hover {
  border: 1px solid var(--primary-color);
}

.get-started-btn i {
  font-size: 0.8rem;
}

/* Responsive design */
@media (max-width: 1024px) {
  .services-container {
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .service-card {
    flex: 1 1 calc(50% - 20px);
    min-width: 280px;
  }
}

@media (max-width: 768px) {
  .services-header {
    padding: 16px;
  }
  
  .commitment-title {
    font-size: 48px;
    line-height: 56px;
  }
  
  .commitment-description {
    font-size: 14px;
    line-height: 20px;
  }
  
  .services-container {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  
  .service-card {
    width: 100%;
    max-width: 320px;
  }
}

@media (max-width: 480px) {
  .commitment-title {
    font-size: 36px;
    line-height: 42px;
  }
  
  .service-card {
    padding: 24px 16px;
    text-align: center;
  }
  
  .service-title {
    text-align: center;
  }
  
  .service-description {
    text-align: center;
  }
  
  .get-started-btn {
    margin: 0 auto;
    justify-content: center;
  }
}

.service-container {
  background-color: var(--primary-bg);
}
.who-we-are-section {
  padding: 2rem 0;
  margin: 1rem 0;
}

.why-choose-us-title {
  width: 1280px;
  margin: 0 auto;
  max-width: calc(100vw - 160px);
  padding: 40px 0;
  padding: 2rem 0;
  margin: 1rem 0;
}

.dark .who-we-are-section {
  
  color: var(--primary-text);
}

.who-we-are-container {
  width: 1280px;
  margin: 0 auto;
  display: flex;
  gap: 8rem;
  align-items: center;
  padding: 0;
  max-width: calc(100vw - 160px);
}

.text-content {
  flex: 1;
  max-width: 100%;
}

.who-we-are-title {
  color: black;
  /* 40/Semibold */
  font-family: Outfit, sans-serif;
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-bottom: 0.75rem;
}

.dark .who-we-are-title {
  
  color: var(--primary-text);
}

.who-we-are-desc {
  color: var(--text-muted);
  /* 16/Regular */
  font-family: Outfit, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  margin-bottom: 1rem;
}

.dark .who-we-are-desc {
  color: var(--text-muted);
}

.our-mission-title {
  color: var(--text-color-text-primary, #1F2021);
  /* Paragraph Medium/Medium */
  font-family: Outfit, sans-serif;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 144.444% */
  margin-bottom: 0.5rem;
}
.dark .our-mission-title {
  color: var(--primary-text);
}
.our-mission-desc {
    color: var(--text-color-text-secondary, #8C8E90);

  /* 16/Regular */
  font-family: Outfit, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
}

.image-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 600px;
  margin-left: auto;
}

.technician-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.bg-white {
  background: var(--secondary-bg) !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.bg-white:hover {
  transform: translateY(-2px);
}

.dark .bg-white {
  background: var(--secondary-bg) !important;
}

.text-gray-700 {
  color: var(--primary-text) !important;
}

.dark .text-gray-700 {
  color: var(--primary-text) !important;
}

.dark .accolades {
  color: var(--primary-text) !important;
}

.contact-1 {
  background-image: url('../assets/Contact/aboutUs.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 250px;
  color: white;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 3rem;
  border-radius: 0;
  overflow: hidden;
  width: 100%;
  margin: 0;
  padding: 0;
}

.contact-1::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.contact-1 h1,
.contact-1 .breadcrumb {
  position: relative;
  z-index: 2;
}

.contact-1 h1 {
  font-size: 48px;
  font-weight: bold;
}

.breadcrumb {
  font-size: 1rem;
  margin-top: 1rem;
}

.accolades {
  border-right: solid rgb(255, 255, 255) 0.1rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.dark .accolades {
  color: var(--primary-text) !important;
}

.noBorders {
  border: 0rem;
}

.collage-all {
  background-color: var(--primary-bg) !important;
}

.dark .collage-all {
  background-color: var(--primary-bg) !important;
}

.about-2 {
  background-color: #FAE084;
  border-radius: 1rem;
  padding: 2rem;
  width: 1280px;
  margin: 0 auto;
  max-width: calc(100vw - 160px);
  padding: 1.5rem;
}

.dark .about-2 {
  background-color:#FFC230;
  color: var(--primary-text) !important;
}

.counter-number {
  transition: all 0.3s ease;
  font-weight: bold;
  color: #333;
}

.dark .counter-number {
  color: var(--primary-text);
}

.collage-all {
  width: 300rem;
  height: 100%;
}



/* Responsive adjustments */
@media (max-width: 768px) {
  .contact-1 {
    font-size: 2rem;
    height: 15rem;
  }
  
  .about-2 {
    flex-direction: column;
    gap: 1rem;
  }
  
  .about-2 > div {
    margin-bottom: 1rem;
  }
  
  .who-we-are-container {
    flex-direction: column;
    gap: 2rem;
    padding: 0 1rem;
  }
  
  .who-we-are-title {
    
    background-color: black;
  }
  
  .image-grid {
    max-width: 100%;
  }
  
  .technician-img {
    height: 120px;
  }
}
</style>
