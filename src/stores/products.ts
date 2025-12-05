import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { productsApi, type Product } from "../api";
// Импорт локальных данных как fallback
import productsData from "../data/products";

export const useProductStore = defineStore("products", () => {
  const items = ref<Record<string, Product>>({});
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchResults = ref<Product[]>([]);
  const searchQuery = ref("");

  const all = computed(() => Object.values(items.value));

  // Загрузка всех товаров из API
  async function fetchAll() {
    try {
      loading.value = true;
      error.value = null;
      const products = await productsApi.getAll();
      items.value = products.reduce((acc, p) => {
        acc[p.id] = p;
        return acc;
      }, {} as Record<string, Product>);
    } catch (e: any) {
      error.value = e.message;
      // Fallback на локальные данные
      items.value = Object.entries(productsData).reduce((acc, [id, p]) => {
        acc[id] = {
          ...p,
          category_id: p.category,
        } as Product;
        return acc;
      }, {} as Record<string, Product>);
    } finally {
      loading.value = false;
    }
  }

  // Получить товар по ID (синхронно из кеша)
  function getById(id: string): Product | undefined {
    return items.value[id];
  }

  // Получить товар по ID из API
  async function fetchById(id: string): Promise<Product | null> {
    try {
      const product = await productsApi.getById(id);
      items.value[id] = product;
      return product;
    } catch (e: any) {
      // Fallback на локальные данные
      const local = productsData[id];
      if (local) {
        return {
          ...local,
          category_id: local.category,
        } as Product;
      }
      return null;
    }
  }

  // Получить товары по категории (синхронно из кеша)
  function getByCategory(category: string): Product[] {
    return all.value.filter((p) => p.category_id === category);
  }

  // Поиск товаров
  async function search(query: string): Promise<Product[]> {
    if (!query.trim()) {
      searchResults.value = [];
      searchQuery.value = "";
      return [];
    }

    try {
      loading.value = true;
      searchQuery.value = query;
      const results = await productsApi.search(query);
      searchResults.value = results;
      return results;
    } catch (e: any) {
      // Локальный поиск как fallback
      const q = query.toLowerCase();
      const results = all.value.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
      searchResults.value = results;
      return results;
    } finally {
      loading.value = false;
    }
  }

  // Очистить поиск
  function clearSearch() {
    searchResults.value = [];
    searchQuery.value = "";
  }

  return {
    items,
    all,
    loading,
    error,
    searchResults,
    searchQuery,
    fetchAll,
    getById,
    fetchById,
    getByCategory,
    search,
    clearSearch,
  };
});

export default useProductStore;
