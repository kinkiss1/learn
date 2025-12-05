import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Product } from '../api';

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_STORAGE_KEY = 'furniture-cart';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);

  // Загрузка корзины из localStorage при инициализации
  function loadFromStorage() {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        items.value = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Ошибка загрузки корзины:', e);
    }
  }

  // Сохранение корзины в localStorage
  function saveToStorage() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value));
    } catch (e) {
      console.error('Ошибка сохранения корзины:', e);
    }
  }

  // Автосохранение при изменениях
  watch(items, () => {
    saveToStorage();
  }, { deep: true });

  // Загружаем корзину при создании store
  loadFromStorage();

  // Общее количество товаров
  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  // Общая сумма (парсим цену из строки)
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => {
      const price = parseFloat(item.product.price.replace(/[^\d]/g, ''));
      return sum + price * item.quantity;
    }, 0);
  });

  // Форматированная сумма
  const formattedTotal = computed(() => {
    return new Intl.NumberFormat('ru-RU').format(totalPrice.value) + ' ₽';
  });

  // Добавить товар в корзину
  function addItem(product: Product, quantity: number = 1) {
    const existingItem = items.value.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.value.push({ product, quantity });
    }
  }

  // Удалить товар из корзины
  function removeItem(productId: string) {
    const index = items.value.findIndex(item => item.product.id === productId);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
  }

  // Изменить количество товара
  function updateQuantity(productId: string, quantity: number) {
    const item = items.value.find(item => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        removeItem(productId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  // Увеличить количество
  function increaseQuantity(productId: string) {
    const item = items.value.find(item => item.product.id === productId);
    if (item) {
      item.quantity++;
    }
  }

  // Уменьшить количество
  function decreaseQuantity(productId: string) {
    const item = items.value.find(item => item.product.id === productId);
    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        removeItem(productId);
      }
    }
  }

  // Очистить корзину
  function clearCart() {
    items.value = [];
  }

  // Проверить, есть ли товар в корзине
  function isInCart(productId: string): boolean {
    return items.value.some(item => item.product.id === productId);
  }

  // Получить количество конкретного товара в корзине
  function getItemQuantity(productId: string): number {
    const item = items.value.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }

  return {
    items,
    totalItems,
    totalPrice,
    formattedTotal,
    addItem,
    removeItem,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };
});

export default useCartStore;
