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
            <button class="buy-button">В корзину</button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AppSidebar from '../components/AppSidebar.vue';
import { useProductStore } from '../stores/products';

const route = useRoute();
const productStore = useProductStore();

const searchQuery = computed(() => route.query.q as string || '');
const searchResults = computed(() => productStore.searchResults);
const loading = computed(() => productStore.loading);

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
  background-color: #808080;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.buy-button:hover {
  background-color: #696969;
}
</style>
