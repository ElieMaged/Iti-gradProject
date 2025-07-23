<template>
  <section class="how-it-works">
    <div class="flex flex-col items-center justify-center">
    <h2 class="how-title">{{ $t('howItWorksTitle') }}</h2>
    <p class="how-it-works-subtitle">{{ $t('howItWorksSubtitle') }}</p>
    <div class="steps-container">
      <div v-for="(step, index) in steps" :key="index" class="step-item">
                  <div class="step-icon-container">
            <div class="step-icon">
              <img :src="step.src" alt="step-icon" class="step-icon-img">
            </div>
            <div v-if="index < steps.length - 1" class="step-arrow">
              <img src="/images/Booking/Vector.png" alt="arrow" class="arrow-img">
            </div>
          </div>
        <h3 class="step-title">{{ $t(step.title) }}</h3>
        <p class="step-description">{{ $t(step.description) }}</p>
      </div>
    </div>
  </div>
  </section>
</template>

<script>
export default {
  name: 'HowItWorks',
  data() {
    return {
      steps: [
        {
            src: '/images/Booking/booking1.png',
            title: 'howStep1Title',
            description: 'howStep1Desc'
        },
        {
          src: '/images/Booking/booking2.png',
          title: 'howStep2Title',
          description: 'howStep2Desc'
        },
        {
          src: '/images/Booking/Details.png',
          title: 'howStep3Title',
          description: 'howStep3Desc'
        },
        {
          src: '/images/Booking/Completed.png',
          title: 'howStep4Title',
          description: 'howStep4Desc'
        }
      ]
    };
  }
};
</script>

<style scoped>
.how-it-works {
  width: 90%;
  max-width: 1100px;
  margin: 0 auto 60px auto;
  padding: 40px 0;
  text-align: center;
}

.how-it-works-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  font-family: Outfit, sans-serif;
}

.how-it-works-subtitle {
  font-size: 1.2rem;
  color: #8c8e90;
  margin-bottom: 48px;
  font-family: Outfit, sans-serif;
}

.steps-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 40px;
}

.step-item {
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 240px;
}

.step-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  position: relative;
}

.step-icon {
  width: 110px;
  height: 110px;
  background: #fff;
  border: 3px dashed #625397;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.step-icon::before {
  content: '';
  position: absolute;
  width: 90px;
  height: 90px;
  background: #FAE084;
  border-radius: 50%;
  z-index: -1;
}

.step-icon-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  z-index: 3;
  position: relative;
}

.step-arrow {
  position: absolute;
  right: -60px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-img {
  width: 70px;
  height: 70px;
  object-fit: contain;
  margin-right: 20px;
}

.step-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
  font-family: Outfit, sans-serif;
}

.step-description {
  font-size: 0.95rem;
  color: #8c8e90;
  line-height: 1.5;
  text-align: center;
}

/* Responsive design */
@media (max-width: 1024px) {
  .how-it-works {
    padding: 60px 0;
  }
  
  .steps-container {
    gap: 40px;
  }
  
  .step-item {
    width: 200px;
  }
  
  .step-icon {
    width: 100px;
    height: 100px;
  }
  
  .step-icon::before {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 768px) {
  .how-it-works {
    padding: 50px 0;
  }
  
  .how-it-works-title {
    font-size: 2rem;
  }
  
  .how-it-works-description {
    font-size: 0.9rem;
  }
  
  .steps-container {
    flex-direction: column;
    gap: 30px;
  }
  
  .step-item {
    width: 100%;
    max-width: 300px;
  }
  
  .step-arrow {
    display: none;
  }
  
  .step-description {
    max-width: 250px;
  }
}

@media (max-width: 480px) {
  .how-it-works {
    padding: 40px 0;
  }
  
  .how-it-works-title {
    font-size: 1.8rem;
  }
  
  .how-it-works-subtitle {
    font-size: 0.85rem;
  }
  
  .steps-container {
    gap: 25px;
  }
  
  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .step-icon {
    width: 90px;
    height: 90px;
  }
  
  .step-icon::before {
    width: 70px;
    height: 70px;
  }
  
  .step-icon-img {
    width: 35px;
    height: 35px;
  }
  
  .step-title {
    font-size: 1.1rem;
    text-align: center;
  }
  
  .step-description {
    font-size: 0.9rem;
    max-width: 200px;
    text-align: center;
    margin: 0 auto;
  }
}
</style> 