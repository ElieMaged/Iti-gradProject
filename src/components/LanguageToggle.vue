<template>
  <button @click="toggleLanguage" class="lang-toggle-btn">
    <i class="fa-solid fa-globe"></i>
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
  border: 1px solid #6B4FA1;
  color: #6B4FA1;
  border-radius: 20px;
  padding: 0.5rem 1.25rem;
  font-weight: 600;
  cursor: pointer;
  margin-left: 1rem;
  transition: background 0.2s, color 0.2s;
}

.lang-toggle-btn:hover {
  background: #6B4FA1;
  color: #fff;
}
</style>