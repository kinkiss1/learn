<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>О компании</h3>
        <p>
          Интерьер-центр — современный магазин мебели с широким
          ассортиментом для дома и офиса.
        </p>
        <p>Качество, стиль и комфорт в каждом изделии.</p>
      </div>

      <div class="footer-section">
        <h3>Категории</h3>
        <router-link to="/category-soft">Мягкая мебель</router-link>
        <router-link to="/category-bedroom">Спальня</router-link>
        <router-link to="/category-storage">Системы хранения</router-link>
      </div>

      <div class="footer-section">
        <h3>Информация</h3>
        <router-link to="/about">О нас</router-link>
        <router-link to="/catalog">Каталог</router-link>
        <router-link to="/contacts">Контакты</router-link>
        <router-link to="/privacy-policy">Политика конфиденциальности</router-link>
      </div>

      <div class="footer-section">
        <h3>Контакты</h3>
        <p>📞 +7 (800) 123-45-67</p>
        <p>📧 info@interior-center.ru</p>
        <p>📍 Москва, ул. Примерная, д. 1</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 Интерьер-центр. Все права защищены.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No script logic needed for now
</script>

<style scoped>
/* Scoped styles for footer if any, otherwise main.css will handle it */
</style>
