<script setup lang="ts">
import { computed, ref } from 'vue'
import AppSidebar from '../components/AppSidebar.vue'
import { useProductStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import type { Product } from '../api'

const store = useProductStore()
const cartStore = useCartStore()
const items = computed(() => store.getByCategory('bedroom'))
const addedItems = ref<Set<string>>(new Set())

function addToCart(item: Product) {
  cartStore.addItem(item)
  addedItems.value.add(item.id)
  setTimeout(() => {
    addedItems.value.delete(item.id)
  }, 2000)
}

function isAdded(id: string): boolean {
  return addedItems.value.has(id)
}

function isInCart(id: string): boolean {
  return cartStore.isInCart(id)
}
</script>

<template>
  <main class="main">
    <AppSidebar />
    <section class="content">
      <!-- Хлебные крошки -->
      <nav class="breadcrumb">
        <router-link to="/">Главная</router-link> /
        <router-link to="/catalog">Каталог</router-link> /
        <span>Спальня</span>
      </nav>

      <h2>Спальня</h2>
      <p class="category-intro">
        Кровати различных размеров и стилей для здорового сна
      </p>

      <div class="catalog-grid">
        <div v-for="item in items" :key="item.id" class="product-card">
          <router-link :to="`/product/${item.id}`">
            <img :src="item.images[0]" :alt="item.title" class="product-image" />
            <h3>{{ item.title }}</h3>
            <p class="product-price">{{ item.price }}</p>
            <p class="product-description">{{ item.description }}</p>
          </router-link>
          <button 
            class="cart-btn" 
            :class="{ 'added': isAdded(item.id), 'in-cart': isInCart(item.id) }"
            @click="addToCart(item)"
          >
            <span v-if="isAdded(item.id)">✓ Добавлено</span>
            <span v-else-if="isInCart(item.id)">🛒 В корзине</span>
            <span v-else>В корзину</span>
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.cart-btn {
  display: block;
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(69, 160, 73, 0.3);
}

.cart-btn.added {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
}

.cart-btn.in-cart {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
}
</style>
