<template>
  <div class="services-header m-20">
    <h2 class="commitment-title">{{ $t('servicesFeaturesTitle') }}</h2>
    <p class="commitment-description">{{ $t('servicesCommitmentDescription') }}</p>
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
</template>

<script>
export default {
  name: 'ServicesFeatures',
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
      ]
    };
  }
};
</script>

<style scoped>
.services-features {
  padding: 80px 0;
  width: 100%;
  background-color: var(--primary-color);
  border-radius: 16px;
}


.services-header {
  text-align: center;
  margin-bottom: 60px;
  color: #333;
  padding: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.dark .services-header {
  color: var(--primary-text);
}

.commitment-title {
  font-family: Outfit, sans-serif;
  font-size: 3.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 10px;
  color: #333;
}
.dark .commitment-title {
  color: var(--primary-text);
}

.commitment-description {
  font-family: Outfit, sans-serif;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}
.dark .commitment-description {
  color: var(--text-muted);
}


.services-container {
  background: var(--primary-color);
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 24px;
  justify-content: center;
}

.service-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  flex: 1;
  max-width: 280px;
  transition: transform 0.2s;
}
.dark .service-card {
  background: var(--secondary-bg);
}


.service-card:hover {
  transform: translateY(-4px);
}

.service-icon {
  margin-bottom: 20px;
}

.service-icon i {
  font-size: 3.5rem;
  color: var(--secondary-color);
}

.service-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 16px;
  font-family: Outfit, sans-serif;
}
.dark .service-title {
  color: var(--primary-text);
}
.service-description {
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
  margin: 16px;
  font-family: Outfit, sans-serif;
  text-align: center;
  align-items: center;
}
.dark .service-description {
  color: var(--text-muted);
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
    font-size: 2rem;
    line-height: 1.2;
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
</style> 