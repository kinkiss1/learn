import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./assets/css/main.css";
import { createPinia } from "pinia";
import { useProductStore } from "./stores/products";
import { useAuthStore } from "./stores/auth";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);

// Инициализация stores
const productStore = useProductStore();
const authStore = useAuthStore();

// Загрузка данных при старте приложения
productStore.fetchAll();
authStore.checkAuth();

app.mount("#app");
