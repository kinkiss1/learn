<script setup lang="ts">
import { computed } from 'vue'
import AppSidebar from '../components/AppSidebar.vue'
import { useProductStore } from '../stores/products'

const store = useProductStore()
const softCount = computed(() => store.getByCategory('soft').length)
const bedroomCount = computed(() => store.getByCategory('bedroom').length)
const storageCount = computed(() => store.getByCategory('storage').length)

</script>

<template>
  <main class="main">
    <AppSidebar />
    <section class="content">
      <h2>Каталог товаров</h2>
      <p class="catalog-intro">Выберите интересующую вас категорию товаров</p>

      <!-- Категории как карточки -->
      <div class="categories-grid">
        <div class="category-card">
          <router-link to="/category-soft">
            <img src="/src/assets/img/beds_and_sofa/Main_sofa.png" alt="Мягкая мебель" class="category-image" />
            <h3>Мягкая мебель</h3>
            <p class="category-description">
              Диваны, кресла и другая мягкая мебель для вашего комфорта
            </p>
            <span class="category-count">{{ softCount }} товара</span>
          </router-link>
        </div>

        <div class="category-card">
          <router-link to="/category-bedroom">
            <img src="/src/assets/img/beds_and_sofa/white_bed1.png" alt="Спальня" class="category-image" />
            <h3>Спальня</h3>
            <p class="category-description">
              Кровати различных размеров и стилей для здорового сна
            </p>
            <span class="category-count">{{ bedroomCount }} товара</span>
          </router-link>
        </div>

        <div class="category-card">
          <router-link to="/category-storage">
            <img src="/src/assets/img/wardrobes/wardrobe.png" alt="Системы хранения" class="category-image" />
            <h3>Системы хранения</h3>
            <p class="category-description">
              Шкафы, комоды и другая мебель для хранения вещей
            </p>
            <span class="category-count">{{ storageCount }} товара</span>
          </router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Scoped styles for CatalogView if any */
</style>