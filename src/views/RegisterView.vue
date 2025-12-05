<template>
  <main class="main">
    <section class="content">
      <div class="auth-container">
        <h2>Регистрация</h2>
        <p class="auth-description">
          Создайте аккаунт для удобной покупки мебели и получения
          специальных предложений
        </p>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

        <form class="auth-form" @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="name">Имя <span class="required">*</span></label>
            <input
              type="text"
              id="name"
              v-model="name"
              placeholder="Введите ваше имя"
              required
            />
          </div>

          <div class="form-group">
            <label for="phone"
              >Телефон <span class="required">*</span></label
            >
            <input
              type="tel"
              id="phone"
              v-model="phone"
              placeholder="+7 (___) ___-__-__"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email <span class="required">*</span></label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="example@mail.ru"
              required
            />
          </div>

          <div class="form-group">
            <label for="password"
              >Пароль <span class="required">*</span></label
            >
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="Минимум 6 символов"
              minlength="6"
              required
              @input="validatePasswordOnInput"
            />
            <div v-if="passwordErrors.length > 0" class="password-requirements">
              <ul>
                <li v-for="(err, idx) in passwordErrors" :key="idx" class="password-error">{{ err }}</li>
              </ul>
            </div>
            <div v-else-if="password" class="password-valid">✓ Пароль соответствует требованиям</div>
          </div>

          <div class="form-group">
            <label for="password-confirm"
              >Подтвердите пароль <span class="required">*</span></label
            >
            <input
              type="password"
              id="password-confirm"
              v-model="confirmPassword"
              placeholder="Повторите пароль"
              minlength="6"
              required
            />
            <div v-if="confirmPassword && password !== confirmPassword" class="password-mismatch">
              Пароли не совпадают
            </div>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="agreePersonal" required />
              <span>
                Я согласен на обработку
                <router-link to="/privacy-policy" class="policy-link"
                  >персональных данных</router-link
                >
                <span class="required">*</span>
              </span>
            </label>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="agreePrivacy" required />
              <span>
                Я ознакомлен с
                <router-link to="/privacy-policy" class="policy-link"
                  >политикой конфиденциальности</router-link
                >
                <span class="required">*</span>
              </span>
            </label>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="subscribeNews" />
              <span>Подписаться на новости и акции</span>
            </label>
          </div>

          <button type="submit" class="auth-button" :disabled="loading || !isFormValid">
            {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </button>

          <p class="auth-footer">
            Уже есть аккаунт?
            <router-link to="/login" class="auth-link">Войти</router-link>
          </p>
        </form>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const phone = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreePersonal = ref(false);
const agreePrivacy = ref(false);
const subscribeNews = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Валидация пароля
const passwordErrors = computed(() => {
  const errors: string[] = [];
  if (!password.value) return errors;
  
  if (password.value.length < 6) {
    errors.push('Минимум 6 символов');
  }
  if (!/[A-Za-zА-Яа-яЁё]/.test(password.value)) {
    errors.push('Должна быть хотя бы одна буква');
  }
  if (!/[0-9]/.test(password.value)) {
    errors.push('Должна быть хотя бы одна цифра');
  }
  
  return errors;
});

const isFormValid = computed(() => {
  return (
    name.value &&
    email.value &&
    password.value &&
    confirmPassword.value &&
    password.value === confirmPassword.value &&
    passwordErrors.value.length === 0 &&
    agreePersonal.value &&
    agreePrivacy.value
  );
});

function validatePasswordOnInput() {
  // Реактивная валидация - passwordErrors обновляется автоматически
}

async function handleRegister() {
  errorMessage.value = '';
  successMessage.value = '';
  
  if (!isFormValid.value) {
    errorMessage.value = 'Пожалуйста, заполните все обязательные поля корректно';
    return;
  }
  
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Пароли не совпадают';
    return;
  }
  
  loading.value = true;
  
  const result = await authStore.register({
    name: name.value,
    phone: phone.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    subscribeNews: subscribeNews.value
  });
  
  loading.value = false;
  
  if (result.success) {
    successMessage.value = 'Регистрация успешна! Перенаправление...';
    setTimeout(() => {
      router.push('/profile');
    }, 1500);
  } else {
    errorMessage.value = result.error || 'Ошибка регистрации';
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

.password-requirements {
  margin-top: 5px;
}

.password-requirements ul {
  margin: 0;
  padding-left: 20px;
}

.password-error {
  color: #c62828;
  font-size: 12px;
}

.password-valid {
  color: #2e7d32;
  font-size: 12px;
  margin-top: 5px;
}

.password-mismatch {
  color: #c62828;
  font-size: 12px;
  margin-top: 5px;
}

.auth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>