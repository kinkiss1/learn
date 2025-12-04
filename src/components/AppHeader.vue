<template>
  <header class="header">
    <div>
      <img class="Logo" src="/src/assets/img/logo_IC_.png" alt="Logo" />
    </div>
    <h1>Интерьер-центр</h1>

    <!-- Поиск товаров -->
    <div class="search-box">
      <input type="search" placeholder="Поиск товаров..." class="search-input" />
      <button type="button" class="search-button">🔍</button>
    </div>

    <div class="auth-links">
      <router-link to="/login" class="auth-link-btn">Вход</router-link>
      <router-link to="/register" class="auth-link-btn">Регистрация</router-link>
    </div>
  </header>

  <nav class="top-nav">
    <router-link to="/category-soft">Мягкая мебель</router-link>
    <router-link to="/category-bedroom">Спальня</router-link>
    <router-link to="/category-storage">Системы хранения</router-link>
    <router-link to="/contacts">Контакты</router-link>
  </nav>
</template>

<script setup lang="ts">
// No script logic needed for now
</script>

<style scoped>
/* Scoped styles for header if any, otherwise main.css will handle it */
</style>
