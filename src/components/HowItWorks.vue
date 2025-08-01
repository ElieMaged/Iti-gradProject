<template>
  <section class="how-it-works custom-container">
    <div class="flex flex-col items-center justify-center">
      <h2 class="how-title">{{ $t("howItWorksTitle") }}</h2>
      <p class="how-it-works-subtitle">{{ $t("howItWorksSubtitle") }}</p>
      <div class="steps-container">
        <div v-for="(step, index) in steps" :key="index" class="step-item">
          <div class="step-icon-container">
            <div class="step-icon">
              <img :src="step.src" alt="step-icon" class="step-icon-img" />
            </div>
            <div
              v-if="index < steps.length - 1"
              class="step-arrow"
              :class="{ 'step-arrow-rtl': isRTL }"
            >
              <img
                src="/images/Booking/Vector.png"
                alt="arrow"
                class="arrow-img"
              />
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
import { computed } from "vue";
import { useI18n } from "vue-i18n";

export default {
  name: "HowItWorks",
  data() {
    return {
      steps: [
        {
          src: "/images/Booking/booking1.png",
          title: "howStep1Title",
          description: "howStep1Desc",
        },
        {
          src: "/images/Booking/booking2.png",
          title: "howStep2Title",
          description: "howStep2Desc",
        },
        {
          src: "/images/Booking/Details.png",
          title: "howStep3Title",
          description: "howStep3Desc",
        },
        {
          src: "/images/Booking/Completed.png",
          title: "howStep4Title",
          description: "howStep4Desc",
        },
      ],
    };
  },
  setup() {
    const { locale } = useI18n();
    const isRTL = computed(
      () =>
        locale.value === "ar" || locale.value === "he" || locale.value === "fa"
    );
    return {
      isRTL,
    };
  },
};
</script>

<style scoped>
.how-it-works {
  width: 90%;
  max-width: 1100px;
  margin: 120px auto 120px auto;
  padding: 40px 0;
  text-align: center;
}

.how-title {
  font-size: 3rem;
  font-weight: 700;
  line-height: 60px;
  color: var(--black-text);
  margin-bottom: 8px;
  font-family: Outfit, sans-serif;
}
.dark .how-title {
  color: var(--primary-text);
}
.how-it-works-subtitle {
  font-size: 20px;
  line-height: 28px;
  color: var(--text-gray);
  margin-bottom: 60px;
  font-family: Outfit, sans-serif;
}
.dark .how-it-works-subtitle {
  color: var(--card-text-gray);
}
.steps-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
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
  margin-bottom: 28px;
  position: relative;
}

.step-icon {
  width: 150px;
  height: 150px;
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
  content: "";
  position: absolute;
  width: 130px;
  height: 130px;
  background: var(--light-yellow);
  border-radius: 50%;
  z-index: -1;
}

.dark .step-icon::before {
  background: var(--color-brand-secondary-500, #ffc230);
}
.step-icon-img {
  width: 80px;
  height: 80px;
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
.step-arrow-rtl {
  transform: rotateY(175deg);
  top: 40px;
  left: -317px;
}
.arrow-img {
  width: 70px;
  height: 70px;
  object-fit: contain;
  margin-right: 20px;
}

.step-title {
  font-size: 20px;
  font-weight: 600;
  line-height: 32px;
  color: var(--black-text);
  margin-bottom: 12px;
  font-family: Outfit, sans-serif;
}
.dark .step-title {
  color: var(--primary-text);
}
.dark .step-description {
  color: var(--card-text-gray);
}
.step-description {
  width: 185px;
  margin: 0 auto;
  font-size: 0.95rem;
  color: var(--text-gray);
  line-height: 1.5;
  text-align: center;
}

/* Responsive design */
@media (max-width: 1024px) {
  .how-it-works {
    padding: 60px 0;
  }

  .steps-container {
    flex-direction: column;
    gap: 30px;
    width: 100%;
    align-items: center;
  }
  .step-arrow {
    display: none;
  }
  .step-description {
    font-size: 16px;
    line-height: 24px;
  }
  .step-item {
    width: 100%;
  }
  .step-description {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .how-it-works {
    padding: 50px 0;
  }

  .how-title {
    font-size: 2.5rem;
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
}

@media (max-width: 480px) {
  .how-it-works {
    padding: 40px 0;
  }

  .how-title {
    font-size: 2rem;
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
