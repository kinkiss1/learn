import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'furniture.db'));

// Создание таблиц
db.exec(`
  -- Таблица категорий
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL
  );

  -- Таблица товаров
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    price TEXT NOT NULL,
    description TEXT,
    characteristics TEXT,
    category_id TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  -- Таблица изображений товаров
  CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  -- Таблица пользователей
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    subscribe_news INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Таблица сессий (для куки)
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- Таблица отзывов
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

// Начальные данные - категории
const categories = [
  { id: 'soft', name: 'Мягкая мебель', slug: 'soft' },
  { id: 'bedroom', name: 'Спальня', slug: 'bedroom' },
  { id: 'storage', name: 'Системы хранения', slug: 'storage' }
];

const insertCategory = db.prepare(`
  INSERT OR REPLACE INTO categories (id, name, slug) VALUES (?, ?, ?)
`);

for (const cat of categories) {
  insertCategory.run(cat.id, cat.name, cat.slug);
}

// Начальные данные - товары
const products = [
  {
    id: 'sofa',
    title: 'Диван «дисКомфорт»',
    price: '39 900 ₽',
    description: 'Современный диван с механизмом трансформации «еврокнижка». Идеально подходит для отдыха и сна.',
    characteristics: 'Размер в собранном виде: 230 × 95 × 95 см; Спальное место: 200 × 145 см; Механизм: еврокнижка; Обивка: велюр премиум-класса; Наполнение: пружинный блок + ППУ; Каркас: массив сосны и берёзы; Цвет: серый графит / бежевый лен; Гарантия: 24 месяца',
    category_id: 'soft',
    images: [
      '/src/assets/img/beds_and_sofa/Main_sofa.png',
      '/src/assets/img/beds_and_sofa/Big_sofa.png',
      '/src/assets/img/beds_and_sofa/Med_sofa.png',
      '/src/assets/img/beds_and_sofa/Small_sofa.png'
    ]
  },
  {
    id: 'chair',
    title: 'Кресло «Элеганс»',
    price: '24 900 ₽',
    description: 'Эргономичное кресло с мягким наполнителем. Обеспечивает правильную поддержку спины.',
    characteristics: null,
    category_id: 'soft',
    images: ['/src/assets/img/chairs_and_desc/main_chair.png']
  },
  {
    id: 'sofa2',
    title: 'Диван «Престиж»',
    price: '45 900 ₽',
    description: 'Большой угловой диван для просторной гостиной. Вместительный и комфортный для всей семьи.',
    characteristics: null,
    category_id: 'soft',
    images: ['/src/assets/img/beds_and_sofa/Big_sofa.png']
  },
  {
    id: 'bed',
    title: 'Кровать «Ронда КР-160»',
    price: '32 900 ₽',
    description: 'Стильная кровать в стиле минимализм с ортопедическим основанием. Выбор из 4 цветов.',
    characteristics: null,
    category_id: 'bedroom',
    images: ['/src/assets/img/beds_and_sofa/white_bed1.png']
  },
  {
    id: 'bed2',
    title: 'Кровать «Венеция КР-180»',
    price: '38 900 ₽',
    description: 'Элегантная кровать размера King Size. Прочная конструкция из массива и ЛДСП премиум-класса.',
    characteristics: null,
    category_id: 'bedroom',
    images: ['/src/assets/img/beds_and_sofa/black_bed1.png']
  },
  {
    id: 'bed3',
    title: 'Кровать «Комфорт КР-140»',
    price: '27 900 ₽',
    description: 'Компактная кровать для небольших спален. Удобная и функциональная с ящиками для хранения.',
    characteristics: null,
    category_id: 'bedroom',
    images: ['/src/assets/img/beds_and_sofa/abed1.png']
  },
  {
    id: 'wardrobe',
    title: 'Шкаф «Практик»',
    price: '29 900 ₽',
    description: 'Вместительный шкаф с раздвижными дверями. Идеален для хранения одежды и постельного белья.',
    characteristics: null,
    category_id: 'storage',
    images: ['/src/assets/img/wardrobes/wardrobe.png']
  },
  {
    id: 'dresser',
    title: 'Комод «Модерн»',
    price: '18 900 ₽',
    description: 'Стильный комод с 5 выдвижными ящиками. Прочная конструкция и плавное закрывание.',
    characteristics: null,
    category_id: 'storage',
    images: ['/src/assets/img/chairs_and_desc/desc1.png']
  },
  {
    id: 'dresser2',
    title: 'Комод «Классик»',
    price: '21 900 ₽',
    description: 'Элегантный комод в светлых тонах. Отлично впишется в любой интерьер спальни или гостиной.',
    characteristics: null,
    category_id: 'storage',
    images: ['/src/assets/img/chairs_and_desc/w_desc1.png']
  }
];

const insertProduct = db.prepare(`
  INSERT OR REPLACE INTO products (id, title, price, description, characteristics, category_id) 
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertImage = db.prepare(`
  INSERT OR REPLACE INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)
`);

// Очистка изображений перед вставкой
db.exec('DELETE FROM product_images');

for (const product of products) {
  insertProduct.run(
    product.id,
    product.title,
    product.price,
    product.description,
    product.characteristics,
    product.category_id
  );
  
  product.images.forEach((img, idx) => {
    insertImage.run(product.id, img, idx);
  });
}

// Добавим тестового пользователя
const testPassword = bcrypt.hashSync('test123', 10);
const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (name, phone, email, password_hash, subscribe_news)
  VALUES (?, ?, ?, ?, ?)
`);
insertUser.run('Тестовый Пользователь', '+7 (999) 123-45-67', 'test@test.ru', testPassword, 0);

// Добавим тестовые отзывы
const insertReview = db.prepare(`
  INSERT OR IGNORE INTO reviews (product_id, user_name, user_email, rating, review_text)
  VALUES (?, ?, ?, ?, ?)
`);

insertReview.run('sofa', 'Иван Петров', 'ivan@mail.ru', 5, 'Отличный диван! Очень удобный и качественный. Рекомендую всем.');
insertReview.run('sofa', 'Мария Сидорова', 'maria@mail.ru', 4, 'Хороший диван, но доставка немного задержалась.');
insertReview.run('bed', 'Алексей Козлов', 'alex@mail.ru', 5, 'Прекрасная кровать, спим на ней уже месяц - очень довольны!');

db.close();

console.log('✅ База данных успешно инициализирована!');
console.log('📦 Добавлены категории: ' + categories.length);
console.log('📦 Добавлены товары: ' + products.length);
console.log('👤 Создан тестовый пользователь: test@test.ru / test123');
