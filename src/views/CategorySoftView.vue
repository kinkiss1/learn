<script setup lang="ts">
import { computed, ref } from 'vue'
import AppSidebar from '../components/AppSidebar.vue'
import { useProductStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import type { Product } from '../api'

const store = useProductStore()
const cartStore = useCartStore()
const items = computed(() => store.getByCategory('soft'))
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
        <span>Мягкая мебель</span>
      </nav>

      <h2>Мягкая мебель</h2>
      <p class="category-intro">
        Диваны, кресла и другая мягкая мебель для вашего комфорта
      </p>

      <div class="catalog-grid">
        <div v-for="item in items" :key="item.id" class="product-card">
          <!-- Контейнер с изображением -->
          <router-link :to="`/product/${item.id}`" class="product-image-container">
            <img :src="item.images[0]" :alt="item.title" class="product-image" />
          </router-link>
          <!-- Контейнер с информацией -->
          <div class="product-info">
            <router-link :to="`/product/${item.id}`" class="product-link">
              <h3 class="product-title">{{ item.title }}</h3>
              <p class="product-description-short">{{ item.description }}</p>
            </router-link>
            <div class="product-footer">
              <span class="product-price">{{ item.price }}</span>
              <button 
                class="cart-btn" 
                :class="{ 'added': isAdded(item.id), 'in-cart': isInCart(item.id) }"
                @click="addToCart(item)"
              >
                <span v-if="isAdded(item.id)">✓ Добавлено</span>
                <span v-else-if="isInCart(item.id)">🛒 В корзине</span>
                <span v-else>Купить</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.cart-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
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
