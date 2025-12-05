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
            <div class="profile-avatar" @click="triggerFileInput">
              <img 
                v-if="user?.avatar" 
                :src="getAvatarUrl(user.avatar)" 
                alt="Аватар" 
                class="avatar-image"
              />
              <span v-else class="avatar-icon">👤</span>
              <div class="avatar-overlay">
                <span>📷</span>
              </div>
              <input 
                ref="fileInput"
                type="file" 
                accept="image/*" 
                @change="handleAvatarUpload"
                class="file-input"
              />
            </div>
            <div class="avatar-actions" v-if="user?.avatar">
              <button class="delete-avatar-btn" @click="handleDeleteAvatar" title="Удалить аватар">
                🗑️ Удалить фото
              </button>
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

          <div v-if="uploadError" class="error-message">{{ uploadError }}</div>
          <div v-if="uploadSuccess" class="success-message">{{ uploadSuccess }}</div>

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
import { onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const fileInput = ref<HTMLInputElement | null>(null);
const uploadError = ref('');
const uploadSuccess = ref('');

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

function getAvatarUrl(avatar: string): string {
  return `http://localhost:3001${avatar}`;
}

function triggerFileInput() {
  fileInput.value?.click();
}

async function handleAvatarUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (!file) return;
  
  // Проверка размера (5MB)
  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = 'Файл слишком большой. Максимальный размер: 5MB';
    return;
  }
  
  // Проверка типа
  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Разрешены только изображения';
    return;
  }
  
  uploadError.value = '';
  uploadSuccess.value = '';
  
  const result = await authStore.uploadAvatar(file);
  
  if (result.success) {
    uploadSuccess.value = 'Аватар успешно обновлён!';
    setTimeout(() => {
      uploadSuccess.value = '';
    }, 3000);
  } else {
    uploadError.value = result.error || 'Ошибка загрузки';
  }
  
  // Очищаем input
  input.value = '';
}

async function handleDeleteAvatar() {
  if (!confirm('Удалить аватар?')) return;
  
  uploadError.value = '';
  uploadSuccess.value = '';
  
  const result = await authStore.deleteAvatar();
  
  if (result.success) {
    uploadSuccess.value = 'Аватар удалён';
    setTimeout(() => {
      uploadSuccess.value = '';
    }, 3000);
  } else {
    uploadError.value = result.error || 'Ошибка удаления';
  }
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
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.profile-avatar {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #6b8e23, #556b2f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.3s;
}

.profile-avatar:hover {
  transform: scale(1.05);
}

.profile-avatar:hover .avatar-overlay {
  opacity: 1;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-icon {
  font-size: 60px;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 50%;
}

.avatar-overlay span {
  font-size: 30px;
}

.file-input {
  display: none;
}

.avatar-actions {
  margin-top: -10px;
}

.delete-avatar-btn {
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.delete-avatar-btn:hover {
  background: #dc3545;
  color: white;
}

.profile-info {
  width: 100%;
}

.profile-info h3 {
  margin: 0 0 20px;
  color: #333;
  font-size: 24px;
  text-align: center;
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

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 15px;
  text-align: center;
}

.success-message {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 15px;
  text-align: center;
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
    padding: 20px;
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
