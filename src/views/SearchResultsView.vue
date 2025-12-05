<template>
  <main class="main">
    <AppSidebar />
    <section class="content">
      <nav class="breadcrumb">
        <router-link to="/">Главная</router-link> /
        <span>Поиск</span>
      </nav>

      <h2>Результаты поиска: "{{ searchQuery }}"</h2>

      <div v-if="loading" class="loading">
        Поиск...
      </div>

      <div v-else-if="searchResults.length === 0" class="no-results">
        <p>По вашему запросу ничего не найдено</p>
        <router-link to="/catalog" class="browse-catalog">Перейти в каталог</router-link>
      </div>

      <div v-else class="catalog">
        <div class="product-grid">
          <div v-for="product in searchResults" :key="product.id" class="product-card">
            <!-- Контейнер с изображением -->
            <router-link :to="`/product/${product.id}`" class="product-image-container">
              <img :src="product.images[0]" :alt="product.title" class="product-image" />
            </router-link>
            <!-- Контейнер с информацией -->
            <div class="product-info">
              <router-link :to="`/product/${product.id}`" class="product-link">
                <h3 class="product-title">{{ product.title }}</h3>
                <p class="product-description-short">{{ product.description }}</p>
              </router-link>
              <div class="product-footer">
                <span class="product-price">{{ product.price }}</span>
                <button 
                  class="buy-button"
                  :class="{ 'added': isAdded(product.id), 'in-cart': isInCart(product.id) }"
                  @click="addToCart(product)"
                >
                  <span v-if="isAdded(product.id)">✓ Добавлено</span>
                  <span v-else-if="isInCart(product.id)">🛒 В корзине</span>
                  <span v-else>Купить</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import AppSidebar from '../components/AppSidebar.vue';
import { useProductStore } from '../stores/products';
import { useCartStore } from '../stores/cart';
import type { Product } from '../api';

const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();

const searchQuery = computed(() => route.query.q as string || '');
const searchResults = computed(() => productStore.searchResults);
const loading = computed(() => productStore.loading);
const addedItems = ref<Set<string>>(new Set());

function addToCart(product: Product) {
  cartStore.addItem(product);
  addedItems.value.add(product.id);
  setTimeout(() => {
    addedItems.value.delete(product.id);
  }, 2000);
}

function isAdded(id: string): boolean {
  return addedItems.value.has(id);
}

function isInCart(id: string): boolean {
  return cartStore.isInCart(id);
}

// Выполнить поиск при загрузке или изменении запроса
async function performSearch() {
  const query = searchQuery.value;
  if (query) {
    await productStore.search(query);
  }
}

onMounted(() => {
  performSearch();
});

watch(searchQuery, () => {
  performSearch();
});
</script>

<style scoped>
.content h2 {
  margin-bottom: 20px;
  color: #333;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  background: #f9f9f9;
  border-radius: 10px;
}

.no-results p {
  margin-bottom: 20px;
  color: #666;
  font-size: 18px;
}

.browse-catalog {
  display: inline-block;
  background-color: #6b8e23;
  color: white;
  text-decoration: none;
  padding: 12px 30px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.browse-catalog:hover {
  background-color: #556b2f;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.product-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  box-shadow: 0 8px 25px rgba(69, 160, 73, 0.15);
  transform: translateY(-5px);
  border-color: rgba(69, 160, 73, 0.2);
}

/* Контейнер с изображением */
.product-image-container {
  display: block;
  background-color: #f5f5f5;
  padding: 15px;
  text-decoration: none;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

/* Контейнер с информацией */
.product-info {
  padding: 15px 20px 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-link {
  text-decoration: none;
  color: inherit;
  display: block;
  flex-grow: 1;
}

.product-title {
  font-size: 1.1em;
  margin: 0 0 10px 0;
  color: #333;
  font-weight: 600;
  line-height: 1.3;
}

.product-description-short {
  font-size: 0.9em;
  color: #666;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 5.4em;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.product-price {
  font-size: 1.3em;
  font-weight: bold;
  color: #2e7d32;
  margin: 0;
}

.buy-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  white-space: nowrap;
}

.buy-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(69, 160, 73, 0.3);
}

.buy-button.added {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
}

.buy-button.in-cart {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
}
</style>
