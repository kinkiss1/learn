<template>
  <main class="main">
    <section class="content">
      <div class="profile-container">
        <h2>Личный кабинет</h2>

        <div v-if="loading" class="loading">Загрузка...</div>

        <div v-else-if="!isAuthenticated" class="not-authenticated">
          <p>Вы не авторизованы</p>
          <router-link to="/login" class="auth-button">Войти</router-link>
        </div>

        <div v-else class="profile-content">
          <div class="profile-card">
            <div class="profile-avatar">
              <span class="avatar-icon">👤</span>
            </div>
            
            <div class="profile-info">
              <h3>{{ user?.name }}</h3>
              
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">{{ user?.email }}</span>
              </div>
              
              <div class="info-row" v-if="user?.phone">
                <span class="info-label">Телефон:</span>
                <span class="info-value">{{ user?.phone }}</span>
              </div>
              
              <div class="info-row" v-if="user?.created_at">
                <span class="info-label">Дата регистрации:</span>
                <span class="info-value">{{ formatDate(user.created_at) }}</span>
              </div>
              
              <div class="info-row">
                <span class="info-label">Подписка на новости:</span>
                <span class="info-value">{{ user?.subscribe_news ? 'Да' : 'Нет' }}</span>
              </div>
            </div>
          </div>

          <div class="profile-actions">
            <button class="logout-button" @click="handleLogout">
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const user = computed(() => authStore.user);
const loading = computed(() => authStore.loading);
const isAuthenticated = computed(() => authStore.isAuthenticated);

onMounted(async () => {
  await authStore.checkAuth();
  if (authStore.isAuthenticated) {
    await authStore.fetchUser();
  }
});

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

async function handleLogout() {
  await authStore.logout();
  router.push('/');
}
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.profile-container h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.not-authenticated {
  text-align: center;
  padding: 40px;
}

.not-authenticated p {
  margin-bottom: 20px;
  color: #666;
}

.profile-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.profile-avatar {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #6b8e23, #556b2f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  font-size: 40px;
}

.profile-info {
  flex: 1;
}

.profile-info h3 {
  margin: 0 0 20px;
  color: #333;
  font-size: 24px;
}

.info-row {
  display: flex;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.info-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.info-label {
  font-weight: 500;
  color: #666;
  width: 160px;
  flex-shrink: 0;
}

.info-value {
  color: #333;
}

.profile-actions {
  margin-top: 30px;
  text-align: center;
}

.logout-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #c82333;
}

.auth-button {
  display: inline-block;
  background-color: #6b8e23;
  color: white;
  text-decoration: none;
  padding: 12px 30px;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s;
}

.auth-button:hover {
  background-color: #556b2f;
}

@media (max-width: 600px) {
  .profile-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .info-row {
    flex-direction: column;
    gap: 5px;
  }

  .info-label {
    width: auto;
  }
}
</style>
