<script setup lang="ts">
import { computed } from 'vue'
import AppSidebar from '../components/AppSidebar.vue'
import { useProductStore } from '../stores/products'

const store = useProductStore()
const items = computed(() => store.getByCategory('soft'))
</script>

<template>
  <main class="main">
    <AppSidebar />
    <section class="content">
      <!-- Хлебные крошки -->
      <nav class="breadcrumb">
        <router-link to="/">Главная</router-link> /
        <router-link to="/catalog">Каталог</router-link> /
        <span>Мягкая мебель</span>
      </nav>

      <h2>Мягкая мебель</h2>
      <p class="category-intro">
        Диваны, кресла и другая мягкая мебель для вашего комфорта
      </p>

      <div class="catalog-grid">
        <div v-for="item in items" :key="item.id" class="product-card">
          <router-link :to="`/product/${item.id}`">
            <img :src="item.images[0]" :alt="item.title" class="product-image" />
            <h3>{{ item.title }}</h3>
            <p class="product-price">{{ item.price }}</p>
            <p class="product-description">{{ item.description }}</p>
            <span class="buy-button">Подробнее</span>
          </router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Scoped styles for CategorySoftView if any */
</style>
