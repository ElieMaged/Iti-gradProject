<template>
  <section class="hero-section">
    <div class="hero-banner">
      <div class="hero-background">
        <img src="/images/WhatsApp Image 2025-07-20 at 15.30.04_8395c57a.jpg" alt="Handyman working" class="background-image" />
        <div class="overlay"></div>
      </div>
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">{{ $t('heroSectionTitle') }}</h1>
          <p class="hero-description">
            {{ $t('heroSectionDescription') }}
          </p>
          <button class="hero-btn">
            {{ $t('heroSectionBookBtn') }}
            <span class="arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection'
};
</script>

<style scoped>
.hero-section {
  padding: 0;
  width: 100%;
  min-height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-banner {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  background: #2c2c2c;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.3;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
  padding: 0 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.hero-text {
  padding: 50px 0;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hero-title {
  color: var(--text-color-text-white, #FFF);
  font-family: Outfit, sans-serif;
  font-size: 55px;
  font-style: normal;
  font-weight: 600;
  line-height: 72px; /* 118.033% */
}

.hero-description {
  font-size: 1rem;
  color: #fff;
  line-height: 1.5;
  margin-bottom: 24px;
  font-family: Outfit, sans-serif;
  opacity: 0.9;
}

.hero-btn {
  background: #625397;
  color: #fff;
  border: none;
  border-radius: 30px;
  padding: 5px 15px;
  font-size: 1.1rem;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.2s;
  font-family: Outfit, sans-serif;
  justify-content: center;
  margin: 0 auto;
}

.hero-btn:hover {
  background: #4e3b7a;
}

.arrow {
  font-size: 1.5rem;
  font-weight: 600;
}

/* Responsive design */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 48px;
    line-height: 60px;
  }
  
  .hero-description {
    font-size: 0.95rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 500px;
  }
  
  .hero-banner {
    min-height: 300px;
  }
  
  .hero-content {
    padding: 0 20px;
    min-height: 300px;
  }
  
  .hero-title {
    font-size: 36px;
    line-height: 44px;
  }
  
  .hero-description {
    font-size: 0.9rem;
    margin-bottom: 20px;
  }
  
  .hero-btn {
    padding: 12px 24px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    min-height: 400px;
  }
  
  .hero-banner {
    min-height: 250px;
    border-radius: 12px;
  }
  
  .hero-content {
    padding: 0 16px;
    min-height: 250px;
  }
  
  .hero-title {
    font-size: 28px;
    line-height: 36px;
  }
  
  .hero-description {
    font-size: 0.85rem;
    margin-bottom: 16px;
  }
  
  .hero-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style> 