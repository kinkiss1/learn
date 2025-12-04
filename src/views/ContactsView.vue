<script setup lang="ts">
import AppSidebar from '../components/AppSidebar.vue'
</script>

<template>
  <main class="main">
    <AppSidebar />
    <section class="content">
      <h2>Контакты</h2>

      <div class="contacts-container">
        <div class="contact-info">
          <h3>Наши контактные данные</h3>

          <p>
            <strong>📍 Адрес:</strong><br />
            г. Пенза, ул. Германа Титова, д.5
          </p>

          <p>
            <strong>📞 Телефон:</strong><br />
            +7 (495) 123-45-67<br />
            +7 (800) 555-35-35 (бесплатный звонок)
          </p>

          <p>
            <strong>✉️ Email:</strong><br />
            mebeliskad3@mail.ru<br />
            support@Интерьер-центр-shop.ru
          </p>

          <p>
            <strong>🕐 Время работы:</strong><br />
            Понедельник - Воскресенье: 10:00 — 21:00<br />
            Без выходных
          </p>

          <h3>Социальные сети</h3>
          <p>
            Следите за нашими новостями и акциями:<br />
            <a href="#" style="color: #0066cc">ВКонтакте</a> |
            <a href="#" style="color: #0066cc">Telegram</a> |
            <a href="#" style="color: #0066cc">Instagram*</a>
          </p>

          <p style="font-size: 0.85em; color: #666">
            * Instagram признан экстремистской организацией на территории РФ
          </p>
        </div>

        <div class="map-container">
          <h3>Мы на карте</h3>
          <div style="position: relative; overflow: hidden">
            <a
              href="https://yandex.ru/maps/21641/lobnja/?utm_medium=mapframe&utm_source=maps"
              style="
                color: #eee;
                font-size: 12px;
                position: absolute;
                top: 0px;
              "
              >Лобня</a
            ><a
              href="https://yandex.ru/maps/49/penza/house/ulitsa_germana_titova_5/YE0YfwBnS0ECQFtpfX5zcnRhbQ==/?ll=44.977245%2C53.223830&utm_medium=mapframe&utm_source=maps&z=16"
              style="
                color: #eee;
                font-size: 12px;
                position: absolute;
                top: 14px;
              "
              >Улица Германа Титова, 5 — Яндекс Карты</a
            ><iframe
              src="https://yandex.ru/map-widget/v1/?ll=44.977245%2C53.223830&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgoxNTYwMDg3NTA2EkPQoNC-0YHRgdC40Y8sINCf0LXQvdC30LAsINGD0LvQuNGG0LAg0JPQtdGA0LzQsNC90LAg0KLQuNGC0L7QstCwLCA1IgoNsugzQhUz5VRC&z=16"
              width="560"
              height="400"
              frameborder="1"
              allowfullscreen="true"
              style="position: relative"
            ></iframe>
          </div>
          <p style="margin-top: 10px; font-size: 0.9em; color: #666">
            Удобное расположение в центре города. Рядом метро, парковка для
            клиентов.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Scoped styles for ContactsView if any */
</style>