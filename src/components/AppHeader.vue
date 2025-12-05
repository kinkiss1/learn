<template>
  <header class="header">
    <div>
      <img class="Logo" src="/img/logo_IC_.png" alt="Logo" />
    </div>
    <h1>Интерьер-центр</h1>

    <!-- Поиск товаров -->
    <div class="search-box">
      <input 
        type="search" 
        v-model="searchQuery"
        @keyup.enter="handleSearch"
        placeholder="Поиск товаров..." 
        class="search-input" 
      />
      <button type="button" class="search-button" @click="handleSearch">🔍</button>
    </div>

    <!-- Корзина -->
    <router-link to="/cart" class="cart-link">
      <span class="cart-icon">🛒</span>
      <span v-if="cartItemsCount > 0" class="cart-badge">{{ cartItemsCount }}</span>
    </router-link>

    <div class="auth-links">
      <template v-if="isAuthenticated">
        <router-link to="/profile" class="auth-link-btn user-btn">
          👤 {{ user?.name }}
        </router-link>
        <button class="auth-link-btn logout-btn" @click="handleLogout">Выход</button>
      </template>
      <template v-else>
        <router-link to="/login" class="auth-link-btn">Вход</router-link>
        <router-link to="/register" class="auth-link-btn">Регистрация</router-link>
      </template>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const searchQuery = ref('');

const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);
const cartItemsCount = computed(() => cartStore.totalItems);

onMounted(async () => {
  await authStore.checkAuth();
});

function handleSearch() {
  const query = searchQuery.value.trim();
  if (query) {
    router.push({ path: '/search', query: { q: query } });
  }
}

async function handleLogout() {
  await authStore.logout();
  router.push('/');
}
</script>

<style scoped>
.cart-link {
  position: relative;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.cart-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.cart-icon {
  font-size: 24px;
}

.cart-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #dc3545;
  color: white;
  font-size: 12px;
  font-weight: bold;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.auth-links {
  display: flex;
  gap: 10px;
  align-items: center;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 5px;
}

.logout-btn {
  background-color: transparent;
  border: 1px solid #dc3545;
  color: #dc3545;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 5px;
  transition: all 0.3s;
}

.logout-btn:hover {
  background-color: #dc3545;
  color: white;
}
</style>
