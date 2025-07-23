<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { useI18n } from 'vue-i18n';
import { watch } from 'vue';

const { locale } = useI18n();

watch(locale, (newLocale) => {
  document.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
}, { immediate: true });
</script>

<template>
  <Navbar />
  <div id="app">
    <router-view />
  </div>
  <Footer />
</template>