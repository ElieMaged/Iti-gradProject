<script setup>
import Hero from '../components/Hero.vue';
import TrustedCompanies from '../components/TrustedCompanies.vue';
import ServicesSection from '../components/ServicesSection.vue';
import HowItWorks from '../components/HowItWorks.vue';
import ExpertTeam from '../components/ExpertTeam.vue';
import AboutUs from '../components/AboutUs.vue';
import ServicesFeatures from '../components/ServicesFeatures.vue';
import Testimonials from '../components/Testimonials.vue';
import FAQ from '../components/FAQ.vue';
import HeroSection from '../components/HeroSection.vue';
import ChatbotIcon from '../components/chatbotIcon.vue';
</script>

<template>
  <div class="home-page">
    <Hero />
    <ServicesSection />
    <HowItWorks />
    <ExpertTeam />
    <AboutUs />
    <ServicesFeatures />
    <Testimonials />
    <FAQ />
    <HeroSection />
    <ChatbotIcon />
  </div>
</template>

<style scoped>
/* Tablet Responsive Design */
@media (min-width: 768px) and (max-width: 1024px) {
  .home-page {
    overflow-x: hidden;
  }
  
  /* Hero Section Tablet Adjustments */
  .home-page :deep(section) {
    padding: 2rem 0;
  }
  
  .home-page :deep(.custom-container) {
    margin: 0 2rem;
    padding: 0 1rem;
  }
  
  /* Services Section Tablet Adjustments */
  .home-page :deep(.services-section) {
    padding: 3rem 0;
  }
  
  .home-page :deep(.services-overview-grid) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    padding: 0 1rem;
  }
  
  .home-page :deep(.service-overview-card) {
    padding: 1.5rem;
    border-radius: 1rem;
  }
  
  .home-page :deep(.service-overview-image) {
    height: 200px;
    object-fit: cover;
  }
  
  .home-page :deep(.service-overview-name) {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }
  
  .home-page :deep(.service-overview-desc) {
    font-size: 1rem;
    line-height: 1.5;
  }
  
  .home-page :deep(.service-overview-btn) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
  
  /* How It Works Section Tablet Adjustments */
  .home-page :deep(.how-it-works) {
    padding: 3rem 0;
  }
  
  .home-page :deep(.steps-container) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    padding: 0 1rem;
  }
  
  .home-page :deep(.step-card) {
    padding: 1.5rem;
    border-radius: 1rem;
  }
  
  .home-page :deep(.step-number) {
    font-size: 2rem;
    width: 3rem;
    height: 3rem;
  }
  
  .home-page :deep(.step-title) {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }
  
  .home-page :deep(.step-description) {
    font-size: 1rem;
    line-height: 1.5;
  }
  
  /* Expert Team Section Tablet Adjustments */
  .home-page :deep(.expert-team) {
    padding: 3rem 0;
  }
  
  .home-page :deep(.team-grid) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    padding: 0 1rem;
  }
  
  .home-page :deep(.team-member-card) {
    padding: 1.5rem;
    border-radius: 1rem;
  }
  
  .home-page :deep(.team-member-image) {
    width: 120px;
    height: 120px;
    margin-bottom: 1rem;
  }
  
  .home-page :deep(.team-member-name) {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
  
  .home-page :deep(.team-member-role) {
    font-size: 1rem;
  }
  
  /* About Us Section Tablet Adjustments */
  .home-page :deep(.about-us) {
    padding: 3rem 0;
  }
  
  .home-page :deep(.about-content) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 0 1rem;
  }
  
  .home-page :deep(.about-text) {
    font-size: 1.1rem;
    line-height: 1.6;
  }
  
  .home-page :deep(.about-image) {
    height: 300px;
    border-radius: 1rem;
  }
  
  /* Services Features Section Tablet Adjustments */
  .home-page :deep(.services-features) {
    padding: 3rem 0;
  }
  
  .home-page :deep(.features-grid) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    padding: 0 1rem;
  }
  
  .home-page :deep(.feature-card) {
    padding: 1.5rem;
    border-radius: 1rem;
  }
  
  .home-page :deep(.feature-icon) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .home-page :deep(.feature-title) {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }
  
  .home-page :deep(.feature-description) {
    font-size: 1rem;
    line-height: 1.5;
  }
  
  /* Testimonials Section Tablet Adjustments */
  .home-page :deep(.testimonials) {
    padding: 3rem 0;
  }
  
  .home-page :deep(.testimonials-grid) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    padding: 0 1rem;
  }
  
  .home-page :deep(.testimonial-card) {
    padding: 1.5rem;
    border-radius: 1rem;
  }
  
  .home-page :deep(.testimonial-text) {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  
  .home-page :deep(.testimonial-author) {
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  /* FAQ Section Tablet Adjustments */
  .home-page :deep(.faq) {
    padding: 3rem 0;
  }
  
  .home-page :deep(.faq-container) {
    padding: 0 1rem;
  }
  
  .home-page :deep(.faq-item) {
    margin-bottom: 1rem;
    border-radius: 0.75rem;
  }
  
  .home-page :deep(.faq-question) {
    font-size: 1.1rem;
    padding: 1rem 1.5rem;
  }
  
  .home-page :deep(.faq-answer) {
    font-size: 1rem;
    line-height: 1.5;
    padding: 0 1.5rem 1rem 1.5rem;
  }
  
  /* Hero Section Tablet Adjustments */
  .home-page :deep(.hero-section) {
    padding: 3rem 0;
  }
  
  .home-page :deep(.hero-content) {
    padding: 0 1rem;
    text-align: center;
  }
  
  .home-page :deep(.hero-title) {
    font-size: 2.5rem;
    line-height: 1.2;
    margin-bottom: 1rem;
  }
  
  .home-page :deep(.hero-subtitle) {
    font-size: 1.1rem;
    line-height: 1.5;
    margin-bottom: 2rem;
  }
  
  .home-page :deep(.hero-buttons) {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  
  .home-page :deep(.btn-primary),
  .home-page :deep(.btn-secondary) {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    width: 100%;
    max-width: 300px;
  }
  
  /* Trusted Companies Section Tablet Adjustments */
  .home-page :deep(.trusted-companies) {
    padding: 2rem 0;
  }
  
  .home-page :deep(.companies-grid) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    padding: 0 1rem;
  }
  
  .home-page :deep(.company-logo) {
    height: 60px;
    object-fit: contain;
  }
  
  /* Chatbot Icon Tablet Adjustments */
  .home-page :deep(.chatbot-icon) {
    bottom: 2rem;
    right: 2rem;
    width: 60px;
    height: 60px;
  }
  
  /* General Typography Adjustments for Tablet */
  .home-page :deep(h1) {
    font-size: 2.5rem;
    line-height: 1.2;
  }
  
  .home-page :deep(h2) {
    font-size: 2rem;
    line-height: 1.3;
  }
  
  .home-page :deep(h3) {
    font-size: 1.5rem;
    line-height: 1.4;
  }
  
  .home-page :deep(p) {
    font-size: 1rem;
    line-height: 1.5;
  }
  
  /* Button Adjustments for Tablet */
  .home-page :deep(button) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
  
  /* Form Input Adjustments for Tablet */
  .home-page :deep(input),
  .home-page :deep(textarea),
  .home-page :deep(select) {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
}
</style>
