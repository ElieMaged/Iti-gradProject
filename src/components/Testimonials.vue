<template>
  <section class="testimonials">
    <div class="testimonials-container">
      <!-- Header Section -->
      <div class="testimonials-header">
        <div class="header-left">
          <h2 class="testimonials-title">What Our Client Say About Us</h2>
        </div>
        
      </div>
      
      <!-- Testimonial Card -->
      <div class="testimonial-card">
        <div class="testimonial-content">
          <div class="testimonial-image">
            <img src="/images/AhmedSabry.png" alt="Ahmed Sabry" class="client-photo" />
          </div>
          
          <div class="testimonial-text">
            <div class="quote-marks">"</div>
            <h3 class="testimonial-heading">Real Stories, Real Fixes, Real Satisfaction</h3>
            
            <div class="testimonial-rating">
              <i v-for="star in 5" :key="star" class="fas fa-star"></i>
            </div>
            
            <p class="testimonial-text-content">
              Excellent service! The team was punctual, thorough, and fixed my air conditioner right a way. Highly recommend for anyone needing a reliable and detailed technicians service.
            </p>
            
            <div class="client-info">
              <h4 class="client-name">Ahmed Sabry</h4>
              <p class="client-title">Engineer</p>
            </div>
          </div>
        </div>
        
        <!-- Navigation Buttons -->
        <div class="testimonial-nav">
          <button class="nav-btn prev-btn">
            <i class="fas fa-arrow-left"></i>
          </button>
          <button class="nav-btn next-btn">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Testimonials'
};
</script>

<style scoped>
.testimonials {
  background-color: #F4F4F5;
  padding: 80px 0;
  width: 100%;
}

.testimonials-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.testimonials-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 60px;
  gap: 40px;
}

.header-left {
  flex: 1;
}

.testimonials-title {
  color: #333;
  text-align: center; 
  justify-content: center;
  font-family: Outfit, sans-serif;
  border-radius: 12px;
  font-size: 64px;
  font-weight: 700;
  font-family: Outfit, sans-serif;
  display: flex;
}

.header-right {
  flex: 1;
  max-width: 500px;
}

.testimonials-intro {
  color: #fff;
  font-size: 1.1rem;
  line-height: 1.6;
  font-family: Outfit, sans-serif;
}

.testimonial-card {
  background: #fff;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
}

.testimonial-content {
  display: flex;
  gap: 40px;
  align-items: center;
}

.testimonial-image {
  flex-shrink: 0;
}

.client-photo {
  width: 200px;
  height: 300px;
  border-radius: 16px;
  object-fit: cover;
  border: 3px solid #625397;
}

.testimonial-text {
  flex: 1;
  position: relative;
}


.testimonial-heading {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  font-family: Outfit, sans-serif;
}

.testimonial-rating {
  margin-bottom: 20px;
  color: #625397;
}

.testimonial-rating i {
  color: #625397;
  font-size: 1.2rem;
  margin-right: 4px;
}

.testimonial-text-content {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 24px;
  font-family: Outfit, sans-serif;
}

.client-info {
  margin-top: 20px;
}

.client-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
  font-family: Outfit, sans-serif;
}

.client-title {
  font-size: 0.9rem;
  color: #888;
  font-family: Outfit, sans-serif;
}

.testimonial-nav {
  position: absolute;
  bottom: 30px;
  right: 30px;
  display: flex;
  gap: 12px;
}

.nav-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #625397;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.nav-btn:hover {
  background: #4e3b7a;
}

.nav-btn i {
  font-size: 1rem;
}

/* Responsive design */
@media (max-width: 1024px) {
  .testimonials-header {
    gap: 40px;
  }
  
  .testimonials-title {
    font-size: 2rem;
  }
  
  .testimonial-heading {
    font-size: 2.2rem;
  }
}

@media (max-width: 768px) {
  .testimonials {
    padding: 60px 0;
  }
  
  .testimonials-header {
    flex-direction: column;
    gap: 30px;
  }
  
  .testimonials-title {
    font-size: 1.5rem;
    padding: 15px 20px;
  }
  
  .testimonial-content {
    flex-direction: column;
    text-align: center;
  }
  
  .client-photo {
    width: 150px;
    height: 150px;
  }
  
  .testimonial-heading {
    font-size: 1.5rem;
  }
  
  .testimonial-text-content {
    font-size: 0.9rem;
  }
  
  .testimonial-nav {
    position: static;
    justify-content: center;
    margin-top: 30px;
  }
}

@media (max-width: 480px) {
  .testimonials {
    padding: 40px 0;
  }
  
  .testimonials-header {
    gap: 20px;
  }
  
  .testimonials-title {
    font-size: 1.3rem;
    padding: 12px 16px;
  }
  
  .testimonial-heading {
    font-size: 1.3rem;
  }
  
  .testimonial-text-content {
    font-size: 0.85rem;
  }
  
  .client-photo {
    width: 120px;
    height: 120px;
  }
  
  .client-name {
    font-size: 1.1rem;
  }
  
  .client-title {
    font-size: 0.8rem;
  }
  
  .nav-btn {
    width: 40px;
    height: 40px;
  }
  
  .nav-btn i {
    font-size: 0.9rem;
  }
}
</style> 