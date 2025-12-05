// API клиент для взаимодействия с бэкендом
const API_BASE = 'http://localhost:3001/api';

// Базовая функция для запросов
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include', // Для отправки куки
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Произошла ошибка');
  }

  return data;
}

// ====== ТИПЫ ======

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subscribe_news?: number;
  created_at?: string;
}

export interface Product {
  id: string;
  title: string;
  price: string;
  description: string;
  characteristics?: string;
  category_id: string;
  category_name?: string;
  images: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  products_count: number;
}

export interface Review {
  id: number;
  product_id: string;
  user_name: string;
  user_email: string;
  rating: number;
  review_text: string;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
}

export interface CheckAuthResponse {
  authenticated: boolean;
  user?: User;
}

// ====== AUTH API ======

export const authApi = {
  // Регистрация
  async register(data: {
    name: string;
    phone?: string;
    email: string;
    password: string;
    confirmPassword: string;
    subscribeNews?: boolean;
  }): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Вход
  async login(data: {
    email: string;
    password: string;
    remember?: boolean;
  }): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Выход
  async logout(): Promise<{ success: boolean }> {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  // Получить текущего пользователя
  async me(): Promise<{ user: User }> {
    return apiRequest('/auth/me');
  },

  // Проверка сессии
  async check(): Promise<CheckAuthResponse> {
    return apiRequest('/auth/check');
  },
};

// ====== PRODUCTS API ======

export const productsApi = {
  // Получить все товары
  async getAll(): Promise<Product[]> {
    return apiRequest('/products');
  },

  // Получить товар по ID
  async getById(id: string): Promise<Product> {
    return apiRequest(`/products/${id}`);
  },

  // Получить товары по категории
  async getByCategory(category: string): Promise<Product[]> {
    return apiRequest(`/products/category/${category}`);
  },

  // Поиск товаров
  async search(query: string): Promise<Product[]> {
    return apiRequest(`/products/search/${encodeURIComponent(query)}`);
  },
};

// ====== CATEGORIES API ======

export const categoriesApi = {
  // Получить все категории
  async getAll(): Promise<Category[]> {
    return apiRequest('/categories');
  },
};

// ====== REVIEWS API ======

export const reviewsApi = {
  // Получить отзывы для товара
  async getByProduct(productId: string): Promise<Review[]> {
    return apiRequest(`/reviews/${productId}`);
  },

  // Добавить отзыв
  async create(data: {
    productId: string;
    name: string;
    email: string;
    rating: number;
    text: string;
  }): Promise<{ success: boolean; review: Review }> {
    return apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export default {
  auth: authApi,
  products: productsApi,
  categories: categoriesApi,
  reviews: reviewsApi,
};
