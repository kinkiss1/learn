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
            <router-link :to="`/product/${product.id}`">
              <img :src="product.images[0]" :alt="product.title" />
              <h3>{{ product.title }}</h3>
              <p class="price">{{ product.price }}</p>
            </router-link>
            <button 
              class="buy-button"
              :class="{ 'added': isAdded(product.id), 'in-cart': isInCart(product.id) }"
              @click="addToCart(product)"
            >
              <span v-if="isAdded(product.id)">✓ Добавлено</span>
              <span v-else-if="isInCart(product.id)">🛒 В корзине</span>
              <span v-else>В корзину</span>
            </button>
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: contain;
  margin-bottom: 10px;
}

.product-card h3 {
  font-size: 16px;
  margin-bottom: 8px;
  color: #333;
}

.product-card .price {
  font-weight: bold;
  color: #6b8e23;
  margin-bottom: 15px;
}

.buy-button {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
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

.buy-button:hover {
  background-color: #696969;
}
</style>
