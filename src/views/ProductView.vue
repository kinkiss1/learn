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

            <div v-if="product" class="product-page">
                <!-- Основной блок товара -->
                <div class="product-main">
                    <!-- Левая колонка - изображения -->
                    <div class="product-gallery">
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
                            <span 
                                v-for="(img, idx) in product.images" 
                                :key="idx" 
                                @click="setSlide(idx)"
                                :class="{ active: currentSlide === idx }"
                            >
                                <img :src="img" :alt="`Превью ${idx + 1}`" />
                            </span>
                        </div>
                    </div>

                    <!-- Правая колонка - информация -->
                    <div class="product-details">
                        <h1 class="product-title">{{ product.title }}</h1>
                        
                        <div class="product-price-block">
                            <span class="current-price">{{ product.price }}</span>
                            <span class="availability">📦 В наличии</span>
                        </div>

                        <p class="delivery-info">🚚 Доставка по всей России за 3–5 дней</p>

                        <div class="product-actions">
                            <button 
                                class="add-to-cart-btn" 
                                :class="{ 'added': addedToCart, 'in-cart': isInCart }"
                                @click="handleAddToCart"
                            >
                                <span v-if="addedToCart">✓ Добавлено!</span>
                                <span v-else-if="isInCart">🛒 В корзине ({{ quantityInCart }})</span>
                                <span v-else>🛒 Купить</span>
                            </button>
                            <router-link to="/cart" v-if="isInCart" class="go-to-cart-btn">
                                Перейти в корзину
                            </router-link>
                        </div>

                        <div class="short-description">
                            <p>{{ product.description }}</p>
                        </div>
                    </div>
                </div>

                <!-- Блок с подробным описанием -->
                <div class="product-info-blocks">
                    <div class="info-block about-block">
                        <h3><span class="icon">📝</span> Описание товара</h3>
                        <p>{{ product.description }}</p>
                    </div>

                    <div v-if="product.characteristics" class="info-block characteristics-block">
                        <h3><span class="icon">📋</span> Характеристики</h3>
                        <p>{{ product.characteristics }}</p>
                    </div>
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
/* Основной контейнер страницы товара */
.product-page {
    max-width: 1200px;
    margin: 0 auto;
}

/* Основной блок товара - две колонки */
.product-main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Галерея изображений */
.product-gallery {
    display: flex;
    flex-direction: column;
}

.product-gallery .slider {
    width: 100%;
    max-width: none;
    margin: 0;
    border-radius: 15px;
    min-height: 350px;
    max-height: 450px;
}

.product-gallery .thumbnails {
    margin-top: 15px;
}

.product-gallery .thumbnails span {
    display: inline-block;
    border: 2px solid transparent;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.product-gallery .thumbnails span.active,
.product-gallery .thumbnails span:hover {
    border-color: #4caf50;
}

.product-gallery .thumbnails span.active img {
    opacity: 1;
}

/* Детали товара */
.product-details {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 10px 0;
}

.product-title {
    font-size: 2em;
    color: #333;
    margin: 0 0 20px 0;
    font-weight: 700;
    line-height: 1.2;
}

.product-price-block {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 15px;
}

.current-price {
    font-size: 2.2em;
    font-weight: 700;
    color: #2e7d32;
}

.availability {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    color: #2e7d32;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9em;
    font-weight: 500;
}

.delivery-info {
    color: #666;
    font-size: 1em;
    margin-bottom: 25px;
    padding: 12px 15px;
    background: #f5f5f5;
    border-radius: 10px;
    border-left: 4px solid #4caf50;
}

.short-description {
    margin-top: 25px;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 12px;
    font-size: 0.95em;
    color: #555;
    line-height: 1.6;
}

.short-description p {
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Информационные блоки */
.product-info-blocks {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
    margin-bottom: 40px;
}

.info-block {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.info-block h3 {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 15px 0;
    color: #333;
    font-size: 1.2em;
    padding-bottom: 12px;
    border-bottom: 2px solid #4caf50;
}

.info-block .icon {
    font-size: 1.3em;
}

.info-block p {
    margin: 0;
    color: #555;
    line-height: 1.7;
    font-size: 1em;
}

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
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
    margin-bottom: 30px;
}

.reviews-section h3 {
    margin: 0 0 20px 0;
    color: #333;
    font-size: 1.3em;
    padding-bottom: 12px;
    border-bottom: 2px solid #4caf50;
}

.no-reviews {
    text-align: center;
    padding: 30px;
    color: #666;
    background: #f5f5f5;
    border-radius: 10px;
}

.reviews-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.review-item {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #eee;
    transition: all 0.3s ease;
}

.review-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.review-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 12px;
    flex-wrap: wrap;
}

.review-author {
    font-weight: 600;
    color: #333;
    font-size: 1.05em;
}

.review-rating {
    color: #f5a623;
    font-size: 1.1em;
}

.review-date {
    color: #999;
    font-size: 0.9em;
}

.review-text {
    color: #555;
    line-height: 1.7;
    margin: 0;
}

/* Форма отзыва */
.review-form-container {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
}

.review-form-container h3 {
    margin: 0 0 20px 0;
    color: #333;
    font-size: 1.3em;
    padding-bottom: 12px;
    border-bottom: 2px solid #4caf50;
}

.review-error {
    background-color: #ffebee;
    color: #c62828;
    padding: 12px 18px;
    border-radius: 8px;
    margin-bottom: 20px;
    border-left: 4px solid #c62828;
}

.review-success {
    background-color: #e8f5e9;
    color: #2e7d32;
    padding: 12px 18px;
    border-radius: 8px;
    margin-bottom: 20px;
    border-left: 4px solid #2e7d32;
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
    flex-wrap: wrap;
}

.add-to-cart-btn {
    padding: 18px 40px;
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.1em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(69, 160, 73, 0.3);
}

.add-to-cart-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 25px rgba(69, 160, 73, 0.4);
}

.add-to-cart-btn.added {
    background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
}

.add-to-cart-btn.in-cart {
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
    box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
}

.add-to-cart-btn.in-cart:hover {
    box-shadow: 0 6px 25px rgba(25, 118, 210, 0.4);
}

.go-to-cart-btn {
    padding: 18px 30px;
    background: transparent;
    color: #1976d2;
    border: 2px solid #1976d2;
    border-radius: 12px;
    font-size: 1em;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
}

.go-to-cart-btn:hover {
    background: #1976d2;
    color: white;
}

/* Адаптивность */
@media (max-width: 900px) {
    .product-main {
        grid-template-columns: 1fr;
        gap: 25px;
        padding: 20px;
    }

    .product-title {
        font-size: 1.6em;
    }

    .current-price {
        font-size: 1.8em;
    }

    .product-info-blocks {
        grid-template-columns: 1fr;
    }
}
</style>
