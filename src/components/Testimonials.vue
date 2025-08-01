<template>
  <section class="testimonials pt-14">
    <div class="testimonials-container custom-container">
      <!-- Header Section -->
      <div class="testimonials-header">
        <div class="header-left">
          <h2 class="testimonials-title">{{ $t("testimonialsTitle") }}</h2>
        </div>
      </div>

      <!-- Testimonial Card -->
      <div class="testimonial-card">
        <img src="../assets/home/quotes.png" alt="quote" class="quote-icon" />
        <div class="testimonial-content">
          <div class="testimonial-image">
            <img
              src="/images/AhmedSabry.png"
              alt="Ahmed Sabry"
              class="client-photo"
            />
          </div>

          <div class="testimonial-text">
            <div class="quote-marks">"</div>
            <h3 class="testimonial-heading">{{ $t("testimonialHeading") }}</h3>

            <div class="testimonial-rating">
              <i v-for="star in 5" :key="star" class="fas fa-star"></i>
            </div>

            <p class="testimonial-text-content">
              {{ $t("testimonialTextContent") }}
            </p>

            <div class="client-info">
              <h4 class="client-name">{{ $t("clientName") }}</h4>
              <p class="client-title">{{ $t("clientTitle") }}</p>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="testimonial-nav">
          <button class="nav-btn prev-btn" :title="$t('testimonialPrev')">
            <i class="fas fa-arrow-left"></i>
          </button>
          <button class="nav-btn next-btn" :title="$t('testimonialNext')">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Testimonials",
};
</script>

<style scoped>
.testimonials {
  background-color: #f4f4f5;
  width: 100%;
}
.dark .testimonials {
  background-color: var(--color-black);
  color: var(--primary-text);
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
  color: var(--black-text);
  text-align: center;
  justify-content: center;
  font-family: Outfit, sans-serif;
  border-radius: 12px;
  font-size: 48px;
  font-weight: 600;
  font-family: Outfit, sans-serif;
  display: flex;
  margin-bottom: 8px;
}
.dark .testimonials-title {
  color: var(--primary-text);
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
.dark .testimonial-card {
  background-color: transparent;
  box-shadow: none;
}
.quote-icon {
  width: 104px;
  position: absolute;
  top: 2px;
  left: 271px;
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
  font-size: 31px;
  font-weight: 600;
  max-width: 406px;
  color: var(--black-text);
  margin-bottom: 16px;
  font-family: Outfit, sans-serif;
}
.dark .testimonial-heading {
  color: var(--primary-text);
}
.testimonial-rating {
  margin-bottom: 20px;
  color: var(--primary-color);
}

.testimonial-rating svg {
  color: var(--primary-color);
  font-size: 1rem;
  margin-right: 6px;
}
.dark .testimonial-rating svg {
  color: var(--surface-color-surface-brand, #7b6fa8);
}
.testimonial-text-content {
  font-size: 20px;
  font-weight: 500;
  color: var(--text-gray);
  line-height: 1.6;
  margin-bottom: 80px;
  font-family: Outfit, sans-serif;
}
.dark .testimonial-text-content {
  color: var(--card-text-gray);
}

.client-name {
  font-size: 24px;
  font-weight: 600;
  color: var(--black-text);
  margin-bottom: 4px;
  font-family: Outfit, sans-serif;
}
.dark .client-name {
  color: var(--primary-text);
}
.client-title {
  font-size: 16px;
  color: var(--text-gray);
  font-family: Outfit, sans-serif;
}
.dark .client-title {
  color: var(--card-text-gray);
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
.dark .nav-btn {
  background: var(--primary-color);
  color: var(--primary-text);
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
  .header-left {
    width: 100%;
  }
  .testimonials-title {
    font-size: 2rem;
    width: 100%;
    text-align: center;
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
  .header-left {
    width: 100%;
  }
  .testimonials-title {
    font-size: 1.5rem;
    width: 100%;
    text-align: center;
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
  .quote-icon {
    display: none;
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
