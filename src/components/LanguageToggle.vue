<template>
  <button @click="toggleLanguage" class="lang-toggle-btn">
    <i class="fa-solid fa-globe navbar-icon"></i>
  </button>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

function toggleLanguage() {
  locale.value = locale.value === 'en' ? 'ar' : 'en';
}
</script>

<style scoped>
.lang-toggle-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: all 0.3s ease;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.navbar-icon {
  font-size: 1.2rem;
  transition: all 0.3s ease;
  width: 20px;  
  height: 20px;
  color: inherit;
}

.lang-toggle-btn:hover {
  color: var(--gray-500);
}

.navbar-icon:hover {
  transform: scale(1.1);
  color: var(--primary-color) !important;
}
</style>