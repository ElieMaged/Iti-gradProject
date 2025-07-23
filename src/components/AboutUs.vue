<template>
  <section class="about-us">
    <div class="about-container">
      <div class="about-content">
        <div class="about-text">
          <h2 class="aboutus-title">{{ $t('aboutUsSectionTitle') }}</h2>
          <p class="about-description">
            {{ $t('aboutUsSectionDesc') }}
          </p>
          
          <div class="about-features">
            <div class="feature-item">
              <div class="feature-icon">
                <img src="/images/About-Us images/Frame 18596.png" alt="Qualified team" />
              </div>
              <div class="feature-content">
                <h3 class="feature-title">{{ $t('aboutFeature1Title') }}</h3>
                <p class="feature-description">{{ $t('aboutFeature1Desc') }}</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <img src="/images/About-Us images/Frame 18596.png" alt="Qualified team" />
              </div>
              <div class="feature-content">
                <h3 class="feature-title">{{ $t('aboutFeature2Title') }}</h3>
                <p class="feature-description">{{ $t('aboutFeature2Desc') }}</p>
              </div>
            </div>
          </div>
          

          <button class="about-btn">
            {{ $t('aboutMoreBtn') }}

          <button class="about-btn" @click="$router.push('/about')">
            More About Us

          </button>
        </div>
      </div>
      
      <div class="about-images">
        <div class="image-container">
   
          <div class="">
            <img src="/images/About-Us images/allview.jpg" alt="Carpentry work" />
          </div>
        
          
          <!-- Decorative stars -->
          <div class="star star-1"></div>
          <div class="star star-2"></div>
          <div class="star star-3"></div>
          <div class="star star-4"></div>
          <div class="star star-5"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AboutUs'
};
</script>

<style scoped>
.about-us {
  background: #f3d361;
  padding: 80px 0;
  width: 100%;
  position: relative;
}

@media (max-width: 1000px) {
  .about-container {
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

.about-container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 60px;
}

.about-content {
  flex: 1;
}

.about-text {
  max-width: 500px;
}

.about-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
  margin-bottom: 24px;
  font-family: Outfit, sans-serif;
}

.about-description {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 32px;
  font-family: Outfit, sans-serif;
}

.about-features {
  display: flex;
    flex-direction: row;
  gap: 50px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;
}

.feature-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4px;
}

.feature-icon i {
  color: #fff;
  font-size: 0.8rem;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-family: Outfit, sans-serif;
}

.feature-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  font-family: Outfit, sans-serif;
}

.about-btn {
  background: #625397;
  color: #fff;
  border: none;
  border-radius: 30px;
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-family: Outfit, sans-serif;
}

.about-btn:hover {
  background: #4e3b7a;
}

.about-images {
  flex: 1;
  position: relative;
  height: 500px;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.circular-image {
  position: absolute;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-radius: 240px;
}

.circular-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.top-right {
  width: 232px;
  height: 300px;
  top: -50px;
  right: 60px;
}

.middle {
  width: 295px;
  height: 400px;
  top: 60%;
  left: 25%;
  transform: translate(-50%, -50%);
}

.bottom-right {
  width: 217px;
  height: 271px;
  bottom: -30px;
  right: 30px;
}

/* Decorative stars */
.star {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #333;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}

.star-1 {
  top: 10%;
  left: 20%;
}

.star-2 {
  top: 30%;
  right: 15%;
}

.star-3 {
  bottom: 20%;
  left: 10%;
}

.star-4 {
  top: 60%;
  left: 30%;
}

.star-5 {
  bottom: 40%;
  right: 25%;
}

/* Responsive design */
@media (max-width: 1024px) {
  .about-container {
    gap: 40px;
  }
  
  .about-title {
    font-size: 2.2rem;
  }
  
  .about-images {
    height: 450px;
  }
  
  .top-right {
    width: 200px;
    height: 260px;
    top: -40px;
    right: 50px;
  }
  
  .middle {
    width: 260px;
    height: 350px;
    top: 55%;
    left: 30%;
  }
  
  .bottom-right {
    width: 190px;
    height: 240px;
    bottom: -25px;
    right: 25px;
  }
}

@media (max-width: 768px) {
  .about-container {
    flex-direction: column;
    gap: 40px;
  }
  
  .about-title {
    font-size: 2rem;
  }
  
  .about-description {
    font-size: 1rem;
  }
  
  .about-images {
    height: 400px;
    position: relative;
  }
  
  .circular-image {
    width: 150px;
    height: 150px;
  }
  
  .top-right {
    width: 180px;
    height: 220px;
    top: -30px;
    right: 40px;
  }
  
  .middle {
    width: 220px;
    height: 300px;
    top: 50%;
    left: 50%;
  }
  
  .bottom-right {
    width: 160px;
    height: 200px;
    bottom: -20px;
    right: 20px;
  }
  .star-1 {
    top: 5%;
    left: 15%;
  }
  
  .star-2 {
    top: 25%;
    right: 10%;
  }
  
  .star-3 {
    bottom: 15%;
    left: 5%;
  }
  
  .star-4 {
    top: 55%;
    left: 25%;
  }
  
  .star-5 {
    bottom: 35%;
    right: 20%;
  }
}

@media (max-width: 480px) {
  .about-us {
    padding: 60px 0;
  }
  
  .about-container {
    gap: 30px;
  }
  
  .about-title {
    font-size: 1.8rem;
    text-align: center;
  }
  
  .about-description {
    font-size: 0.9rem;
    text-align: center;
  }
  
  .about-text {
    text-align: center;
  }
  
  .about-features {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .feature-item {
    text-align: center;
  }
  
  .feature-content {
    text-align: center;
  }
  
  .about-images {
    height: 300px;
    display: none; /* Hide images on small screens */
  }
  
  .circular-image {
    display: none; /* Hide all circular images */
  }
  
  .star {
    display: none; /* Hide all stars */
  }
  
  /* Remove specific positioning since images are hidden */
  .top-right,
  .middle,
  .bottom-right {
    display: none;
  }
}
</style> 