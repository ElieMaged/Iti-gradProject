<script setup>
import Hero from '../components/Hero.vue';
</script>

<template>
  <div>
<<<<<<< HEAD
    <HeroSection />
    <Hero />
    <TrustedCompanies />
    <ServicesSection />
    <HowItWorks />
    <ExpertTeam />
    <AboutUs />
    <ServicesFeatures />
    <Testimonials />
    <FAQ />
=======
    <Hero />

>>>>>>> 81385828d5b564d11a1c72d926d514c10deab9a0
  </div>
</template>

<script>
import Hero from '../components/Hero.vue'
import TrustedCompanies from '../components/TrustedCompanies.vue'
import ServicesSection from '../components/ServicesSection.vue'
import HowItWorks from '../components/HowItWorks.vue'
import ExpertTeam from '../components/ExpertTeam.vue'
import AboutUs from '../components/AboutUs.vue'
import ServicesFeatures from '../components/ServicesFeatures.vue'
import Testimonials from '../components/Testimonials.vue'
import FAQ from '../components/FAQ.vue'
import HeroSection from '../components/HeroSection.vue'

export default {
  name: 'HomePage',
  components: {
    Hero,
    TrustedCompanies,
    ServicesSection,
    HowItWorks,
    ExpertTeam,
    AboutUs,
    ServicesFeatures,
    Testimonials,
    FAQ,
    HeroSection
  }
}
</script>
