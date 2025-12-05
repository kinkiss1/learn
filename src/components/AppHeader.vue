<template>
  <header class="header">
    <div>
      <img class="Logo" src="/src/assets/img/logo_IC_.png" alt="Logo" />
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

const router = useRouter();
const authStore = useAuthStore();

const searchQuery = ref('');

const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);

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
