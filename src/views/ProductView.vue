<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'
import { useProductStore } from '../stores/products'

const route = useRoute()
const store = useProductStore()
const id = computed(() => route.params.id as string)
const product = computed(() => store.getById(id.value))
const currentSlide = ref(0)

const imagesCount = computed(() => product.value?.images.length || 1)

const slidesContainerStyle = computed(() => ({
    transform: `translateX(-${currentSlide.value * 100}%)`
}))

watch(product, () => {
    currentSlide.value = 0
}, { immediate: true })

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
                <a href="#" class="buy-button">Купить сейчас</a>

                <div class="about_product">
                    <h3>Описание товара:</h3>
                    <p>{{ product.description }}</p>

                    <template v-if="product.characteristics">
                        <h3>Характеристики</h3>
                        <p>{{ product.characteristics }}</p>
                    </template>
                </div>

                <!-- Форма отзыва -->
                <div class="review-form-container">
                    <h3>Оставьте отзыв о товаре</h3>
                    <form class="review-form" action="#" method="post">
                        <div class="form-group">
                            <label for="review-name">Ваше имя <span class="required">*</span></label>
                            <input type="text" id="review-name" name="name" placeholder="Введите ваше имя" required />
                        </div>

                        <div class="form-group">
                            <label for="review-email">Email <span class="required">*</span></label>
                            <input type="email" id="review-email" name="email" placeholder="example@mail.ru" required />
                        </div>

                        <div class="form-group">
                            <label for="review-rating">Оценка товара <span class="required">*</span></label>
                            <select id="review-rating" name="rating" required>
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
                            <textarea id="review-text" name="review" rows="5"
                                placeholder="Расскажите о вашем опыте использования товара" required></textarea>
                        </div>

                        <button type="submit" class="review-submit-btn">Отправить отзыв</button>
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
</style>
