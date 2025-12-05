import { defineStore } from 'pinia';
import { ref } from 'vue';
import { reviewsApi, type Review } from '../api';

export const useReviewsStore = defineStore('reviews', () => {
  const reviews = ref<Record<string, Review[]>>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Получить отзывы для товара
  async function fetchByProduct(productId: string): Promise<Review[]> {
    try {
      loading.value = true;
      error.value = null;
      const productReviews = await reviewsApi.getByProduct(productId);
      reviews.value[productId] = productReviews;
      return productReviews;
    } catch (e: any) {
      error.value = e.message;
      return [];
    } finally {
      loading.value = false;
    }
  }

  // Получить отзывы из кеша
  function getByProduct(productId: string): Review[] {
    return reviews.value[productId] || [];
  }

  // Добавить отзыв
  async function addReview(data: {
    productId: string;
    name: string;
    email: string;
    rating: number;
    text: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      loading.value = true;
      error.value = null;
      const response = await reviewsApi.create(data);
      
      // Добавляем новый отзыв в кеш
      if (!reviews.value[data.productId]) {
        reviews.value[data.productId] = [];
      }
      const productReviews = reviews.value[data.productId];
      if (productReviews) {
        productReviews.unshift(response.review);
      }
      
      return { success: true };
    } catch (e: any) {
      error.value = e.message;
      return { success: false, error: e.message };
    } finally {
      loading.value = false;
    }
  }

  return {
    reviews,
    loading,
    error,
    fetchByProduct,
    getByProduct,
    addReview,
  };
});

export default useReviewsStore;
