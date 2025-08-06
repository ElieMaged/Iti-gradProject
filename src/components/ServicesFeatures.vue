<template>
  <div class="services-header">
    <div class="custom-container">
      <h2 class="commitment-title">{{ $t("servicesFeaturesTitle") }}</h2>
      <p class="commitment-description">
        {{ $t("servicesCommitmentDescription") }}
      </p>
    </div>
  </div>
  <section class="services-features">
    <div class="services-container">
      <div
        v-for="(service, index) in services"
        :key="index"
        class="service-card"
      >
        <div class="service-icon">
          <i
            :class="service.icon"
            style="color: var(--secondary-color); font-size: 3rem"
          ></i>
        </div>
        <h3 class="service-title">{{ $t(service.title) }}</h3>
        <p class="service-description">{{ $t(service.description) }}</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ServicesFeatures",
  data() {
    return {
      services: [
        {
          icon: "fa-solid fa-wand-sparkles",
          title: "servicesFeature1Title",
          description: "servicesFeature1Desc",
        },
        {
          icon: "fa-solid fa-clock",
          title: "servicesFeature2Title",
          description: "servicesFeature2Desc",
        },
        {
          icon: "fas fa-phone",
          title: "servicesFeature3Title",
          description: "servicesFeature3Desc",
        },
        {
          icon: "fas fa-award",
          title: "servicesFeature4Title",
          description: "servicesFeature4Desc",
        },
      ],
    };
  },
};
</script>

<style scoped>
.services-features {
  padding: 80px 0;
  width: 100%;
  background-color: var(--primary-color);
  border-radius: 16px;
  margin-bottom: 60px;
}

.services-header {
  text-align: center;
  margin-bottom: 40px;
  color: var(--primary-text-dark);
  padding: 20px;
  margin-top: 40px;
  margin-bottom: 20px;
}
.dark .services-header {
  color: var(--primary-text);
}

.commitment-title {
  font-family: Outfit, sans-serif;
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 15px;
  color: var(--primary-text-dark);
}
.dark .commitment-title {
  color: var(--primary-text);
}

.commitment-description {
  font-family: Outfit, sans-serif;
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  color: var(--text-gray);
}
.dark .commitment-description {
  color: var(--black-gray);
}

.services-container {
  background: var(--primary-color);
  margin: 0 auto;
  margin: 0 80px;
  display: flex;
  gap: 24px;
  justify-content: space-between;
}
.dark .services-container {
  background: var(--surface-color-surface-brand, var(--primary-color));
}
.service-card {
  background: #fff;
  border-radius: 26px;
  padding: 32px 24px;
  /* text-align: center; */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  flex: 1;
  max-width: 280px;
  transition: transform 0.2s;
}
.dark .service-card {
  background: var(--surface-color-surface-secondary, var(--secondary-bg));
}

.service-card:hover {
  transform: translateY(-4px);
}

.service-icon {
  margin-bottom: 70px;
}

.service-icon i {
  font-size: 3rem;
  color: var(--secondary-color);
}
.dark .service-icon i {
  background: var(
    --surface-color-surface-brand-secondary,
    var(--secondary-color)
  );
}
.service-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--black-text);
  font-family: Outfit, sans-serif;
  margin-bottom: 15px;
}
.dark .service-title {
  color: var(--primary-text);
}
.service-description {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-gray);
  line-height: 1.5;
  font-family: Outfit, sans-serif;
  align-items: center;
}
.dark .service-description {
  color: var(--card-text-gray);
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
    margin: auto;
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
    font-size: 1.8rem;
    line-height: 42px;
  }
  .commitment-description {
    font-size: 0.9rem;
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
