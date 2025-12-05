import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import CatalogView from "../views/CatalogView.vue";
import ContactsView from "../views/ContactsView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import ProfileView from "../views/ProfileView.vue";
import PrivacyPolicyView from "../views/PrivacyPolicyView.vue";
import CategorySoftView from "../views/CategorySoftView.vue";
import CategoryBedroomView from "../views/CategoryBedroomView.vue";
import CategoryStorageView from "../views/CategoryStorageView.vue";
import ProductView from "../views/ProductView.vue";
import SearchResultsView from "../views/SearchResultsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    {
      path: "/catalog",
      name: "catalog",
      component: CatalogView,
    },
    {
      path: "/contacts",
      name: "contacts",
      component: ContactsView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
    },
    {
      path: "/privacy-policy",
      name: "privacy-policy",
      component: PrivacyPolicyView,
    },
    {
      path: "/category-soft",
      name: "category-soft",
      component: CategorySoftView,
    },
    {
      path: "/category-bedroom",
      name: "category-bedroom",
      component: CategoryBedroomView,
    },
    {
      path: "/category-storage",
      name: "category-storage",
      component: CategoryStorageView,
    },
    {
      path: "/product/:id",
      name: "product",
      component: ProductView,
    },
    {
      path: "/search",
      name: "search",
      component: SearchResultsView,
    },
  ],
});

export default router;
