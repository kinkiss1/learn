import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi, type User } from '../api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);

  // Проверка авторизации при загрузке приложения
  async function checkAuth() {
    try {
      loading.value = true;
      const response = await authApi.check();
      if (response.authenticated && response.user) {
        user.value = response.user;
      } else {
        user.value = null;
      }
    } catch (e) {
      user.value = null;
    } finally {
      loading.value = false;
    }
  }

  // Регистрация
  async function register(data: {
    name: string;
    phone?: string;
    email: string;
    password: string;
    confirmPassword: string;
    subscribeNews?: boolean;
  }) {
    try {
      loading.value = true;
      error.value = null;
      const response = await authApi.register(data);
      user.value = response.user;
      return { success: true };
    } catch (e: any) {
      error.value = e.message;
      return { success: false, error: e.message };
    } finally {
      loading.value = false;
    }
  }

  // Вход
  async function login(data: {
    email: string;
    password: string;
    remember?: boolean;
  }) {
    try {
      loading.value = true;
      error.value = null;
      const response = await authApi.login(data);
      user.value = response.user;
      return { success: true };
    } catch (e: any) {
      error.value = e.message;
      return { success: false, error: e.message };
    } finally {
      loading.value = false;
    }
  }

  // Выход
  async function logout() {
    try {
      await authApi.logout();
    } finally {
      user.value = null;
    }
  }

  // Получить данные пользователя
  async function fetchUser() {
    try {
      loading.value = true;
      const response = await authApi.me();
      user.value = response.user;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    checkAuth,
    register,
    login,
    logout,
    fetchUser,
  };
});

export default useAuthStore;
