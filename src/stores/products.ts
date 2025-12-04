import { defineStore } from "pinia";
import { computed, ref } from "vue";
import productsData from "../data/products";
import type { Product } from "../data/products";

export const useProductStore = defineStore("products", () => {
  const items = ref<Record<string, Product>>(productsData);
  const all = computed(() => Object.values(items.value));
  function getById(id: string) {
    return items.value[id];
  }
  function getByCategory(category: string) {
    return all.value.filter((p) => p.category === category);
  }

  return { items, all, getById, getByCategory };
});

export default useProductStore;
