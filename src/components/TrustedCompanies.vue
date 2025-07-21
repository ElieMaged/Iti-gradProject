<template>
  <div class="trusted-section">
    <div class="trusted-header">
      <hr class="trusted-line" />
      <span class="trusted-text">Trusted by 4,000+ companies</span>
      <hr class="trusted-line" />
    </div>
    <div class="trusted-logos">
      <div class="trusted-logo-item" v-for="(company, idx) in companies" :key="idx">
        <img :src="company.logo" :alt="company.name" class="trusted-logo-img" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrustedCompanies',
  data() {
    return {
      companies: [
        { logo: '/images/logo1.png' },
        { logo: '/images/logo2.png' },
        { logo: '/images/logo3.png' },
        { logo: '/images/logo4.png' },
        { logo: '/images/logo5.png' },
      ],
    };
  },
};
</script>

<style scoped>
.trusted-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #F4F4F5;
}
.trusted-header {
  padding-top: 40px;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1100px;
  margin-bottom: 32px;
}
.trusted-line {
  flex: 1;
  border: none;
  border-top: 1px solid #bdbdbd;
  height: 1px;
  margin: 0 16px;
}
.trusted-text {
  color: #8c8e90;
  font-size: 20px;
  font-family: Outfit, sans-serif;
  font-weight: 500;
  white-space: nowrap;
}
.trusted-logos {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  width: 100%;
  max-width: 1100px;
}
.trusted-logo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.trusted-logo-img {
  width: 150px;
  height: 150px;
  object-fit: contain;
  margin-bottom: 8px;
}
.trusted-logo-label {
  color: #3d2c22;
  font-size: 20px;
  font-family: Outfit, sans-serif;
  font-weight: 700;
}

/* Responsive design */
@media (max-width: 1024px) {
  .trusted-header {
    padding-top: 30px;
    margin-bottom: 24px;
  }
  
  .trusted-text {
    font-size: 18px;
  }
  
  .trusted-logos {
    gap: 30px;
  }
  
  .trusted-logo-img {
    width: 120px;
    height: 120px;
  }
}

@media (max-width: 768px) {
  .trusted-header {
    padding-top: 20px;
    margin-bottom: 20px;
  }
  
  .trusted-text {
    font-size: 16px;
  }
  
  .trusted-logos {
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }
  
  .trusted-logo-img {
    width: 100px;
    height: 100px;
  }
}

@media (max-width: 480px) {
  .trusted-header {
    padding-top: 15px;
    margin-bottom: 15px;
  }
  
  .trusted-text {
    font-size: 14px;
  }
  
  .trusted-line {
    margin: 0 8px;
  }
  
  .trusted-logos {
    gap: 15px;
  }
  
  .trusted-logo-img {
    width: 80px;
    height: 80px;
  }
}
</style>