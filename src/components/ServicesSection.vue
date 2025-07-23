<template>
  <section class="services-section">
    <div class="">
    <h2 class="services-title">What Do You Need Fixed?</h2>
    <hr class="services-divider" />
    <div class="services-grid">
      <div v-for="(service, idx) in services" :key="idx" class="service-card">
        <img :src="service.image" :alt="service.title" class="service-image" />
        <div class="service-content">
          <h3 class="service-title">{{ service.title }}</h3>
          <p class="service-desc">{{ service.desc }}</p>
          <button class="service-btn" @click="$router.push(service.route || '#')">
            Book Now
            <span class="arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  </section>
</template>

<script>
export default {
  name: 'ServicesSection',
  data() {
    return {
      services: [
        {
          title: 'Plumbing',
          route: '/plumbing',
          image: '/images/servicesImages/plumbing.png',
          desc: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular maintenance services:',
        },
        {
          title: 'Carpentry',
          route: '/carpentry',
          image: '/images/servicesImages/Carpentry.png',
          desc: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular maintenance services:',
        },
        {
          title: 'Electricity',
          route: '/electricity',
          image: '/images/servicesImages/Electrecity.png',
          desc: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular maintenance services:',
        },
        {
          title: 'AC Technicians',
          route: '/ac-technicians',
          image: '/images/servicesImages/Ac Technicions.png',
          desc: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular maintenance services:',
        },
        {
          title: 'Electrical Appliance Repair',
          route: '/electrical-appliance-repair',
          image: '/images/servicesImages/electrical appliance repair.png',
          desc: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular maintenance services:',
        },
        {
          title: 'Wall finishing',
          route: '/wall-finishing',
          image: '/images/servicesImages/wall finishing.png',
          desc: 'While we can customize your cleaning plan to suit your needs, most clients schedule regular maintenance services:',
        },
      ],
    };
  },
};
</script>

<style scoped>
.services-section {
  width: 90%;
  max-width: 1100px;
  margin: 0 auto 60px auto;
  padding: 40px 0 0 0;

}
@media (max-width: 1000px) {
  .services-section {
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
.services-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
  font-family: Outfit, sans-serif;
}
.services-divider {
  width: 100%;
  border: 1.5px solid #c2bebe;
  margin-bottom: 32px;
}
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 32px;
  width: 100%;
}
.service-card {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
}
.service-card:hover {
  transform: translateY(-2px);
}
.service-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.service-content {
  padding: 24px 20px 20px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.service-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 8px;
  font-family: Outfit, sans-serif;
}
.service-desc {
  font-size: 0.98rem;
  color: #8c8e90;
  margin-bottom: 18px;
  flex: 1;
}
.service-btn {
  background: #625397;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 10px 12px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: fit-content;
  min-width: 80px;
  max-width: 120px;
  transition: background 0.2s;
}
.service-btn:hover {
  background: #4e3b7a;
}
.arrow {
  
  margin-left: 6px;
  transform: rotate(-45deg);
}

/* Responsive design */
@media (max-width: 1024px) {
  .services-section {
    width: 95%;
    padding: 30px 0 0 0;
  }
  
  .services-title {
    font-size: 2.2rem;
  }
  
  .services-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .services-section {
    width: 95%;
    margin: 0 auto 40px auto;
    padding: 20px 0 0 0;
  }
  
  .services-title {
    font-size: 2rem;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .service-card {
    max-width: 400px;
  }
  
  .service-content {
    padding: 20px 16px 16px 16px;
  }
  
  .service-title {
    font-size: 1.1rem;
  }
  
  .service-desc {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .services-section {
    width: 100%;
    padding: 15px 0 0 0;
  }
  
  .services-title {
    font-size: 1.8rem;
  }
  
  .services-grid {
    gap: 16px;
  }
  
  .service-image {
    height: 150px;
  }
  
  .service-content {
    padding: 16px 12px 12px 12px;
  }
  
  .service-title {
    font-size: 1rem;
  }
  
  .service-desc {
    font-size: 0.85rem;
  }
  
  .service-btn {
    padding: 8px 10px;
    font-size: 0.9rem;
  }
}
</style> 