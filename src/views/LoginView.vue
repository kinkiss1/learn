<template>
  <main class="main">
    <section class="content">
      <div class="auth-container">
        <h2>Вход в личный кабинет</h2>
        <p class="auth-description">
          Войдите в свой аккаунт для доступа к истории заказов и избранному
        </p>

        <form class="auth-form" action="#" method="post">
          <div class="form-group">
            <label for="email">Email или телефон</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="example@mail.ru"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Введите пароль"
              required
            />
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" name="remember" />
              <span>Запомнить меня</span>
            </label>
          </div>

          <button type="submit" class="auth-button">Войти</button>

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
// No specific script logic yet.
</script>

<style scoped>
/* Scoped styles for LoginView if any */
</style>