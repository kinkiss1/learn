<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'
import { useProductStore } from '../stores/products'
import { useReviewsStore } from '../stores/reviews'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const route = useRoute()
const productStore = useProductStore()
const reviewsStore = useReviewsStore()
const authStore = useAuthStore()
const cartStore = useCartStore()

const id = computed(() => route.params.id as string)
const product = computed(() => productStore.getById(id.value))
const reviews = computed(() => reviewsStore.getByProduct(id.value))
const currentSlide = ref(0)
const addedToCart = ref(false)

// Проверка есть ли товар в корзине
const isInCart = computed(() => cartStore.isInCart(id.value))
const quantityInCart = computed(() => cartStore.getItemQuantity(id.value))

// Форма отзыва
const reviewName = ref('')
const reviewEmail = ref('')
const reviewRating = ref('')
const reviewText = ref('')
const reviewLoading = ref(false)
const reviewError = ref('')
const reviewSuccess = ref('')

// Заполняем email из авторизации
watch(() => authStore.user, (user) => {
    if (user) {
        reviewName.value = user.name || ''
        reviewEmail.value = user.email || ''
    }
}, { immediate: true })

//const imagesCount = computed(() => product.value?.images.length || 1)

const slidesContainerStyle = computed(() => ({
    transform: `translateX(-${currentSlide.value * 100}%)`
}))

watch(product, () => {
    currentSlide.value = 0
}, { immediate: true })

// Загрузка отзывов при изменении товара
watch(id, async (newId) => {
    if (newId) {
        await reviewsStore.fetchByProduct(newId)
    }
}, { immediate: true })

onMounted(async () => {
    // Загружаем данные о товаре из API если нет в кеше
    if (!product.value) {
        await productStore.fetchById(id.value)
    }
    await reviewsStore.fetchByProduct(id.value)
    await authStore.checkAuth()
})

function setSlide(index: number) {
    currentSlide.value = index
}

function prevSlide() {
    if (!product.value) return
    currentSlide.value = (currentSlide.value - 1 + product.value.images.length) % product.value.images.length
}

function nextSlide() {
    if (!product.value) return
    currentSlide.value = (currentSlide.value + 1) % product.value.images.length
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

function renderStars(rating: number): string {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
}

function handleAddToCart() {
    if (product.value) {
        cartStore.addItem(product.value)
        addedToCart.value = true
        setTimeout(() => {
            addedToCart.value = false
        }, 2000)
    }
}

async function handleReviewSubmit() {
    reviewError.value = ''
    reviewSuccess.value = ''

    if (!reviewName.value || !reviewEmail.value || !reviewRating.value || !reviewText.value) {
        reviewError.value = 'Заполните все поля'
        return
    }

    reviewLoading.value = true

    const result = await reviewsStore.addReview({
        productId: id.value,
        name: reviewName.value,
        email: reviewEmail.value,
        rating: parseInt(reviewRating.value),
        text: reviewText.value
    })

    reviewLoading.value = false

    if (result.success) {
        reviewSuccess.value = 'Спасибо за ваш отзыв!'
        reviewRating.value = ''
        reviewText.value = ''
    } else {
        reviewError.value = result.error || 'Ошибка при отправке отзыва'
    }
}
</script>

<template>
    <main class="main">
        <AppSidebar />
        <section class="content">
            <nav class="breadcrumb">
                <router-link to="/">Главная</router-link> /
                <router-link to="/catalog">Каталог</router-link> /
                <span>{{ product?.title }}</span>
            </nav>

            <div v-if="product">
                <!-- Слайдер -->
                <div class="slider">
                    <div class="slides-container" :style="slidesContainerStyle">
                        <div v-for="(img, idx) in product.images" :key="idx" class="slide-item">
                            <img :src="img" :alt="product.title" />
                        </div>
                    </div>
                    <div class="arrows">
                        <span class="prev" @click="prevSlide">&#10094;</span>
                        <span class="next" @click="nextSlide">&#10095;</span>
                    </div>
                </div>

                <!-- Мини-превью -->
                <div class="thumbnails">
                    <span v-for="(img, idx) in product.images" :key="idx" @click="setSlide(idx)">
                        <img :src="img" :alt="`Превью ${idx + 1}`" />
                    </span>
                </div>

                <p class="price">
                    Цена {{ product.price }} 📦 В наличии — доставка по всей России за 3–5 дней.
                </p>
                
                <div class="product-actions">
                    <button 
                        class="add-to-cart-btn" 
                        :class="{ 'added': addedToCart, 'in-cart': isInCart }"
                        @click="handleAddToCart"
                    >
                        <span v-if="addedToCart">✓ Добавлено!</span>
                        <span v-else-if="isInCart">🛒 В корзине ({{ quantityInCart }})</span>
                        <span v-else>🛒 В корзину</span>
                    </button>
                    <router-link to="/cart" v-if="isInCart" class="go-to-cart-btn">
                        Перейти в корзину
                    </router-link>
                </div>

                <div class="about_product">
                    <h3>Описание товара:</h3>
                    <p>{{ product.description }}</p>

                    <template v-if="product.characteristics">
                        <h3>Характеристики</h3>
                        <p>{{ product.characteristics }}</p>
                    </template>
                </div>

                <!-- Отзывы -->
                <div class="reviews-section">
                    <h3>Отзывы о товаре ({{ reviews.length }})</h3>
                    
                    <div v-if="reviews.length === 0" class="no-reviews">
                        <p>Пока нет отзывов. Будьте первым!</p>
                    </div>
                    
                    <div v-else class="reviews-list">
                        <div v-for="review in reviews" :key="review.id" class="review-item">
                            <div class="review-header">
                                <span class="review-author">{{ review.user_name }}</span>
                                <span class="review-rating">{{ renderStars(review.rating) }}</span>
                                <span class="review-date">{{ formatDate(review.created_at) }}</span>
                            </div>
                            <p class="review-text">{{ review.review_text }}</p>
                        </div>
                    </div>
                </div>

                <!-- Форма отзыва -->
                <div class="review-form-container">
                    <h3>Оставьте отзыв о товаре</h3>
                    
                    <div v-if="reviewError" class="review-error">{{ reviewError }}</div>
                    <div v-if="reviewSuccess" class="review-success">{{ reviewSuccess }}</div>
                    
                    <form class="review-form" @submit.prevent="handleReviewSubmit">
                        <div class="form-group">
                            <label for="review-name">Ваше имя <span class="required">*</span></label>
                            <input type="text" id="review-name" v-model="reviewName" placeholder="Введите ваше имя" required />
                        </div>

                        <div class="form-group">
                            <label for="review-email">Email <span class="required">*</span></label>
                            <input type="email" id="review-email" v-model="reviewEmail" placeholder="example@mail.ru" required />
                        </div>

                        <div class="form-group">
                            <label for="review-rating">Оценка товара <span class="required">*</span></label>
                            <select id="review-rating" v-model="reviewRating" required>
                                <option value="">Выберите оценку</option>
                                <option value="5">⭐⭐⭐⭐⭐ Отлично</option>
                                <option value="4">⭐⭐⭐⭐ Хорошо</option>
                                <option value="3">⭐⭐⭐ Нормально</option>
                                <option value="2">⭐⭐ Плохо</option>
                                <option value="1">⭐ Очень плохо</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="review-text">Ваш отзыв <span class="required">*</span></label>
                            <textarea id="review-text" v-model="reviewText" rows="5"
                                placeholder="Расскажите о вашем опыте использования товара" required></textarea>
                        </div>

                        <button type="submit" class="review-submit-btn" :disabled="reviewLoading">
                            {{ reviewLoading ? 'Отправка...' : 'Отправить отзыв' }}
                        </button>
                    </form>
                </div>
            </div>

            <div v-else>
                <p>Товар не найден</p>
            </div>
        </section>
    </main>
</template>

<style scoped>
/* Слайдер с динамическими стилями */
.slides-container {
    display: flex;
    height: 100%;
    transition: transform 0.5s ease;
    align-items: center;
}

.slide-item {
    min-width: 100%;
    width: 100%;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.slide-item img {
    max-width: 100%;
    max-height: 400px;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    margin: 0 auto;
}

.arrows span {
    pointer-events: all;
    cursor: pointer;
    font-size: 40px;
    color: white;
    padding: 0 20px;
    text-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
    transition: 0.3s;
    user-select: none;
}

.arrows span:hover {
    color: #dcdcdc;
}

.thumbnails span {
    cursor: pointer;
}

/* Секция отзывов */
.reviews-section {
    margin-top: 40px;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 10px;
}

.reviews-section h3 {
    margin-bottom: 20px;
    color: #333;
}

.no-reviews {
    text-align: center;
    padding: 20px;
    color: #666;
}

.reviews-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.review-item {
    background: #fff;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.review-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 10px;
    flex-wrap: wrap;
}

.review-author {
    font-weight: bold;
    color: #333;
}

.review-rating {
    color: #f5a623;
}

.review-date {
    color: #999;
    font-size: 14px;
}

.review-text {
    color: #555;
    line-height: 1.6;
}

/* Форма отзыва */
.review-error {
    background-color: #ffebee;
    color: #c62828;
    padding: 10px 15px;
    border-radius: 5px;
    margin-bottom: 15px;
}

.review-success {
    background-color: #e8f5e9;
    color: #2e7d32;
    padding: 10px 15px;
    border-radius: 5px;
    margin-bottom: 15px;
}

.review-submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Кнопки корзины */
.product-actions {
    display: flex;
    gap: 15px;
    align-items: center;
    margin: 20px 0;
    flex-wrap: wrap;
}

.add-to-cart-btn {
    padding: 15px 30px;
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(69, 160, 73, 0.3);
}

.add-to-cart-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(69, 160, 73, 0.4);
}

.add-to-cart-btn.added {
    background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
}

.add-to-cart-btn.in-cart {
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
    box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
}

.add-to-cart-btn.in-cart:hover {
    box-shadow: 0 6px 20px rgba(25, 118, 210, 0.4);
}

.go-to-cart-btn {
    padding: 15px 25px;
    background: transparent;
    color: #1976d2;
    border: 2px solid #1976d2;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
}

.go-to-cart-btn:hover {
    background: #1976d2;
    color: white;
}
</style>
