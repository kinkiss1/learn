<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div class="page-wrapper">
    <AppHeader />
    <RouterView />
    <AppFooter />
  </div>
</template>

<style scoped>
/* No specific scoped styles for App.vue yet, main.css will handle global layout */
</style>