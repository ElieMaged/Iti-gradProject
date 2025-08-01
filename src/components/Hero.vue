<template>
  <section class="pt-10">
    <div class="custom-container flex items-center justify-between">
      <div
        class="text-container w-1/2 max-w-xl mx-20"
        :class="{ 'text-right': isRTL }"
      >
        <h1 class="font-extrabold text-gray-900 leading-tight">
          {{ $t("heroTitle") }}
        </h1>
        <p class="text-gray-600 mt-4">
          {{ $t("heroDescription") }}
        </p>
        <div class="mt-6 flex gap-4">
          <button
            id="service-btn"
            @click="$router.push('/allservices')"
            class="bg-purple-200 text-purple-900 rounded-full"
          >
            {{ $t("heroShowServicesBtn") }} →
          </button>
        </div>
      </div>
      <div class="imag-container w-2/4 min-w[300px] h-[552px]">
        <img class="w-full h-full" src="../assets/home/image.png" alt="hero" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import "../style.css";

const { locale } = useI18n();
const router = useRouter();
const isRTL = ref(false);

const goToServices = () => {
  return router.push("/plumbing");
};

const toggleLanguage = () => {
  isRTL.value = !isRTL.value;
};

// Watch for locale changes to update RTL
watch(
  locale,
  (newLocale) => {
    isRTL.value =
      newLocale === "ar" || newLocale === "he" || newLocale === "fa";
  },
  { immediate: true }
);
</script>

<style scoped>
section {
  width: 100%;
  position: relative;
  background: radial-gradient(
    circle at 0% 3%,
    #ff000024 -36%,
    #f4f3f8,
    #ff000024 136%
  );
}
.dark section {
  background: none;
  background-color: var(--bg-gray);
}

h1 {
  width: 500px;
  color: var(--text-color-text-primary, #1f2021);

  /* Display Large/Semibold */
  font-family: Outfit, sans-serif;
  font-size: 54px;
  font-style: normal;
  font-weight: 700;
  line-height: 76px; /* 120% */
}
.dark h1 {
  color: var(--primary-text) !important;
}
p {
  color: var(--text-color-text-primary, #1f2021);

  /* 20/Regular */
  font-family: Outfit, sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 140% */
}
.dark p {
  color: var(--primary-text) !important;
}
#service-btn {
  border-radius: 58px;
  border: 1px solid var(--border-border-brand, var(--primary-color));
  background: var(--surface-color-surface-brand, var(--primary-color));
  color: var(--white);
  font-size: 16px;
  font-weight: 600;
  line-height: 30px;
  font-family: Outfit, sans-serif;
  font-style: normal;
  padding: 10px 60px;
  position: relative;
  z-index: 4;
  margin-top: 60px;
}
#service-btn:hover {
  background: #4e3b7a;
}
.dark #service-btn {
  background: var(--primary);
  color: var(--white);
}
.dark #service-btn:hover {
  background: #4e3b7a;
  color: var(--white);
}

/* Responsive styles for tablet and mobile only */
@media (max-width: 900px) {
  .text-container {
    width: 100%;
  }
  h1 {
    font-size: 38px;
    line-height: 48px;
    width: 100%;
    margin-bottom: 15px;
  }
  p {
    font-size: 16px;
    line-height: 24px;
  }
  .imag-container {
    width: 100%;
    margin-top: 40px;
  }
  #service-btn {
    width: 100%;
  }
  .flex {
    flex-direction: column !important;
    gap: 1rem !important;
    align-items: center !important;
  }
}
@media (max-width: 600px) {
  h1 {
    font-size: 28px;
    line-height: 38px;
  }

  p {
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 20px;
  }
  .imag-container {
    height: 452px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 24px;
    line-height: 32px;
  }

  p {
    font-size: 14px;
    line-height: 20px;
  }
  .imag-container {
    height: 300px;
  }
  #service-btn {
    font-size: 13px;
    line-height: 20px;
  }
}
</style>
