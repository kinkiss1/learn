<template>
  <main class="main">
    <section class="content">
      <nav class="breadcrumb">
        <router-link to="/">Главная</router-link> /
        <span>Корзина</span>
      </nav>

      <h2>Корзина</h2>

      <div v-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <p>Ваша корзина пуста</p>
        <router-link to="/catalog" class="continue-shopping">Перейти в каталог</router-link>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.product.id" class="cart-item">
            <router-link :to="`/product/${item.product.id}`" class="item-image">
              <img :src="item.product.images[0]" :alt="item.product.title" />
            </router-link>
            
            <div class="item-details">
              <router-link :to="`/product/${item.product.id}`" class="item-title">
                {{ item.product.title }}
              </router-link>
              <p class="item-price">{{ item.product.price }}</p>
            </div>

            <div class="item-quantity">
              <button class="qty-btn" @click="decreaseQuantity(item.product.id)">−</button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button class="qty-btn" @click="increaseQuantity(item.product.id)">+</button>
            </div>

            <div class="item-total">
              {{ formatPrice(getItemTotal(item)) }}
            </div>

            <button class="remove-btn" @click="removeItem(item.product.id)" title="Удалить">
              ✕
            </button>
          </div>
        </div>

        <div class="cart-summary">
          <h3>Итого</h3>
          <div class="summary-row">
            <span>Товаров:</span>
            <span>{{ totalItems }} шт.</span>
          </div>
          <div class="summary-row total">
            <span>Сумма:</span>
            <span>{{ formattedTotal }}</span>
          </div>
          <button class="checkout-btn" @click="handleCheckout">
            Оформить заказ
          </button>
          <button class="clear-cart-btn" @click="clearCart">
            Очистить корзину
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCartStore, type CartItem } from '../stores/cart';

const cartStore = useCartStore();

const cartItems = computed(() => cartStore.items);
const totalItems = computed(() => cartStore.totalItems);
const formattedTotal = computed(() => cartStore.formattedTotal);

function removeItem(productId: string) {
  cartStore.removeItem(productId);
}

function increaseQuantity(productId: string) {
  cartStore.increaseQuantity(productId);
}

function decreaseQuantity(productId: string) {
  cartStore.decreaseQuantity(productId);
}

function clearCart() {
  if (confirm('Вы уверены, что хотите очистить корзину?')) {
    cartStore.clearCart();
  }
}

function getItemTotal(item: CartItem): number {
  const price = parseFloat(item.product.price.replace(/[^\d]/g, ''));
  return price * item.quantity;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

function handleCheckout() {
  alert('Функция оформления заказа будет добавлена позже');
}
</script>

<style scoped>
.content h2 {
  margin-bottom: 30px;
  color: #333;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  background: #f9f9f9;
  border-radius: 10px;
}

.empty-cart-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-cart p {
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
}

.continue-shopping {
  display: inline-block;
  background-color: #6b8e23;
  color: white;
  text-decoration: none;
  padding: 12px 30px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.continue-shopping:hover {
  background-color: #556b2f;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-image {
  flex-shrink: 0;
}

.item-image img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: 8px;
}

.item-details {
  flex: 1;
}

.item-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  text-decoration: none;
  display: block;
  margin-bottom: 8px;
}

.item-title:hover {
  color: #6b8e23;
}

.item-price {
  color: #666;
  font-size: 14px;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.qty-btn:hover {
  background: #f0f0f0;
}

.qty-value {
  font-size: 16px;
  font-weight: 500;
  min-width: 30px;
  text-align: center;
}

.item-total {
  font-weight: bold;
  font-size: 16px;
  color: #333;
  min-width: 100px;
  text-align: right;
}

.remove-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  transition: color 0.3s;
}

.remove-btn:hover {
  color: #dc3545;
}

.cart-summary {
  background: #fff;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.cart-summary h3 {
  margin: 0 0 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  color: #333;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #666;
}

.summary-row.total {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.checkout-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(69, 160, 73, 0.4);
}

.clear-cart-btn {
  width: 100%;
  padding: 12px;
  background: transparent;
  color: #999;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s;
}

.clear-cart-btn:hover {
  border-color: #dc3545;
  color: #dc3545;
}

@media (max-width: 900px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-item {
    flex-wrap: wrap;
  }

  .item-details {
    flex-basis: calc(100% - 120px);
  }

  .item-quantity,
  .item-total {
    flex-basis: auto;
  }

  .cart-summary {
    position: static;
  }
}
</style>
