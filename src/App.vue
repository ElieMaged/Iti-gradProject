<script setup>
import { useI18n } from 'vue-i18n';
import { watch } from 'vue';

const { locale } = useI18n();

watch(locale, (newLocale) => {
  document.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
}, { immediate: true });
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>