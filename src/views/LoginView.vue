<template>
  <main class="main">
    <section class="content">
      <div class="auth-container">
        <h2>Вход в личный кабинет</h2>
        <p class="auth-description">
          Войдите в свой аккаунт для доступа к истории заказов и избранному
        </p>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

        <form class="auth-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email или телефон</label>
            <input
              type="text"
              id="email"
              v-model="email"
              placeholder="example@mail.ru"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Пароль</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="Введите пароль"
              required
            />
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="remember" />
              <span>Запомнить меня</span>
            </label>
          </div>

          <button type="submit" class="auth-button" :disabled="loading">
            {{ loading ? 'Вход...' : 'Войти' }}
          </button>

          <p class="auth-footer">
            <router-link to="#" class="auth-link">Забыли пароль?</router-link>
          </p>

          <p class="auth-footer">
            Нет аккаунта?
            <router-link to="/register" class="auth-link">Зарегистрироваться</router-link>
          </p>
        </form>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const remember = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

async function handleLogin() {
  errorMessage.value = '';
  successMessage.value = '';
  
  if (!email.value || !password.value) {
    errorMessage.value = 'Заполните все поля';
    return;
  }
  
  loading.value = true;
  
  const result = await authStore.login({
    email: email.value,
    password: password.value,
    remember: remember.value
  });
  
  loading.value = false;
  
  if (result.success) {
    successMessage.value = 'Вход выполнен успешно!';
    setTimeout(() => {
      router.push('/profile');
    }, 1000);
  } else {
    errorMessage.value = result.error || 'Ошибка входа';
  }
}
</script>

<style scoped>
.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px 15px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 14px;
}

.success-message {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 10px 15px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 14px;
}

.auth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>