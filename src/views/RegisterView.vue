<template>
  <main class="main">
    <section class="content">
      <div class="auth-container">
        <h2>Регистрация</h2>
        <p class="auth-description">
          Создайте аккаунт для удобной покупки мебели и получения
          специальных предложений
        </p>

        <form class="auth-form" action="#" method="post">
          <div class="form-group">
            <label for="name">Имя <span class="required">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
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
              name="phone"
              placeholder="+7 (___) ___-__-__"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email <span class="required">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
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
              name="password"
              placeholder="Минимум 6 символов"
              minlength="6"
              required
            />
          </div>

          <div class="form-group">
            <label for="password-confirm"
              >Подтвердите пароль <span class="required">*</span></label
            >
            <input
              type="password"
              id="password-confirm"
              name="password-confirm"
              placeholder="Повторите пароль"
              minlength="6"
              required
            />
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" name="agree-personal" required />
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
              <input type="checkbox" name="agree-privacy" required />
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
              <input type="checkbox" name="subscribe" />
              <span>Подписаться на новости и акции</span>
            </label>
          </div>

          <button type="submit" class="auth-button">
            Зарегистрироваться
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
// No specific script logic yet.
</script>

<style scoped>
/* Scoped styles for RegisterView if any */
</style>