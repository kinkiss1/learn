import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// База данных
const db = new Database(join(__dirname, 'furniture.db'));

// Папка для аватаров
const uploadsDir = join(__dirname, 'uploads', 'avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${req.user.id}-${Date.now()}.${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Разрешены только изображения (JPEG, PNG, GIF, WebP)'));
    }
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Статические файлы для аватаров
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// ====== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ======

// Валидация пароля
function validatePassword(password) {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Пароль должен содержать минимум 6 символов');
  }
  if (!/[A-Za-zА-Яа-я]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну букву');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну цифру');
  }
  
  return errors;
}

// Middleware для проверки авторизации
function requireAuth(req, res, next) {
  const sessionId = req.cookies.sessionId;
  
  if (!sessionId) {
    return res.status(401).json({ error: 'Необходима авторизация' });
  }
  
  const session = db.prepare(`
    SELECT s.*, u.id as user_id, u.name, u.email, u.phone
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.id = ? AND s.expires_at > datetime('now')
  `).get(sessionId);
  
  if (!session) {
    res.clearCookie('sessionId');
    return res.status(401).json({ error: 'Сессия истекла' });
  }
  
  req.user = {
    id: session.user_id,
    name: session.name,
    email: session.email,
    phone: session.phone
  };
  
  next();
}

// ====== API МАРШРУТЫ ======

// --- АВТОРИЗАЦИЯ ---

// Регистрация
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, phone, email, password, confirmPassword, subscribeNews } = req.body;
    
    // Проверка обязательных полей
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }
    
    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Пароли не совпадают' });
    }
    
    // Валидация пароля
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ error: passwordErrors.join('. ') });
    }
    
    // Проверка email
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }
    
    // Хеширование пароля
    const passwordHash = bcrypt.hashSync(password, 10);
    
    // Создание пользователя
    const result = db.prepare(`
      INSERT INTO users (name, phone, email, password_hash, subscribe_news)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, phone || null, email, passwordHash, subscribeNews ? 1 : 0);
    
    // Создание сессии
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 дней
    
    db.prepare(`
      INSERT INTO sessions (id, user_id, expires_at)
      VALUES (?, ?, ?)
    `).run(sessionId, result.lastInsertRowid, expiresAt.toISOString());
    
    // Установка куки
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });
    
    res.json({
      success: true,
      user: {
        id: result.lastInsertRowid,
        name,
        email,
        phone
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Вход
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password, remember } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Введите email и пароль' });
    }
    
    // Поиск пользователя
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    
    // Проверка пароля
    const validPassword = bcrypt.compareSync(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    
    // Создание сессии
    const sessionId = uuidv4();
    const expiresAt = remember 
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 дней
      : new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 день
    
    db.prepare(`
      INSERT INTO sessions (id, user_id, expires_at)
      VALUES (?, ?, ?)
    `).run(sessionId, user.id, expiresAt.toISOString());
    
    // Установка куки
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });
    
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Выход
app.post('/api/auth/logout', (req, res) => {
  const sessionId = req.cookies.sessionId;
  
  if (sessionId) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
    res.clearCookie('sessionId');
  }
  
  res.json({ success: true });
});

// Получить текущего пользователя
app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = db.prepare(`
    SELECT id, name, email, phone, avatar, subscribe_news, created_at
    FROM users WHERE id = ?
  `).get(req.user.id);
  
  res.json({ user });
});

// Загрузка аватара
app.post('/api/auth/avatar', requireAuth, upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }
    
    // Удаляем старый аватар, если есть
    const oldUser = db.prepare('SELECT avatar FROM users WHERE id = ?').get(req.user.id);
    if (oldUser?.avatar) {
      const oldPath = join(__dirname, oldUser.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    
    db.prepare('UPDATE users SET avatar = ? WHERE id = ?').run(avatarPath, req.user.id);
    
    res.json({ success: true, avatar: avatarPath });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Ошибка загрузки аватара' });
  }
});

// Удаление аватара
app.delete('/api/auth/avatar', requireAuth, (req, res) => {
  try {
    const user = db.prepare('SELECT avatar FROM users WHERE id = ?').get(req.user.id);
    
    if (user?.avatar) {
      const avatarPath = join(__dirname, user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
      
      db.prepare('UPDATE users SET avatar = NULL WHERE id = ?').run(req.user.id);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Avatar delete error:', error);
    res.status(500).json({ error: 'Ошибка удаления аватара' });
  }
});

// Проверка сессии
app.get('/api/auth/check', (req, res) => {
  const sessionId = req.cookies.sessionId;
  
  if (!sessionId) {
    return res.json({ authenticated: false });
  }
  
  const session = db.prepare(`
    SELECT s.*, u.id as user_id, u.name, u.email, u.phone
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.id = ? AND s.expires_at > datetime('now')
  `).get(sessionId);
  
  if (!session) {
    res.clearCookie('sessionId');
    return res.json({ authenticated: false });
  }
  
  res.json({
    authenticated: true,
    user: {
      id: session.user_id,
      name: session.name,
      email: session.email,
      phone: session.phone
    }
  });
});

// --- ТОВАРЫ ---

// Получить все товары
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `).all();
    
    // Добавляем изображения к каждому товару
    const productsWithImages = products.map(product => {
      const images = db.prepare(`
        SELECT image_url FROM product_images 
        WHERE product_id = ? ORDER BY sort_order
      `).all(product.id);
      
      return {
        ...product,
        images: images.map(i => i.image_url)
      };
    });
    
    res.json(productsWithImages);
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получить товар по ID
app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).get(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    const images = db.prepare(`
      SELECT image_url FROM product_images 
      WHERE product_id = ? ORDER BY sort_order
    `).all(product.id);
    
    res.json({
      ...product,
      images: images.map(i => i.image_url)
    });
  } catch (error) {
    console.error('Product error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получить товары по категории
app.get('/api/products/category/:category', (req, res) => {
  try {
    const products = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ?
    `).all(req.params.category);
    
    const productsWithImages = products.map(product => {
      const images = db.prepare(`
        SELECT image_url FROM product_images 
        WHERE product_id = ? ORDER BY sort_order
      `).all(product.id);
      
      return {
        ...product,
        images: images.map(i => i.image_url)
      };
    });
    
    res.json(productsWithImages);
  } catch (error) {
    console.error('Products by category error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Поиск товаров
app.get('/api/products/search/:query', (req, res) => {
  try {
    const query = `%${req.params.query}%`;
    
    const products = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.title LIKE ? OR p.description LIKE ?
    `).all(query, query);
    
    const productsWithImages = products.map(product => {
      const images = db.prepare(`
        SELECT image_url FROM product_images 
        WHERE product_id = ? ORDER BY sort_order
      `).all(product.id);
      
      return {
        ...product,
        images: images.map(i => i.image_url)
      };
    });
    
    res.json(productsWithImages);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// --- КАТЕГОРИИ ---

// Получить все категории
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT c.*, COUNT(p.id) as products_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
    `).all();
    
    res.json(categories);
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// --- ОТЗЫВЫ ---

// Получить отзывы для товара
app.get('/api/reviews/:productId', (req, res) => {
  try {
    const reviews = db.prepare(`
      SELECT * FROM reviews 
      WHERE product_id = ? 
      ORDER BY created_at DESC
    `).all(req.params.productId);
    
    res.json(reviews);
  } catch (error) {
    console.error('Reviews error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Добавить отзыв
app.post('/api/reviews', (req, res) => {
  try {
    const { productId, name, email, rating, text } = req.body;
    
    if (!productId || !name || !email || !rating || !text) {
      return res.status(400).json({ error: 'Заполните все поля' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Оценка должна быть от 1 до 5' });
    }
    
    // Проверяем существование товара
    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId);
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    const result = db.prepare(`
      INSERT INTO reviews (product_id, user_name, user_email, rating, review_text)
      VALUES (?, ?, ?, ?, ?)
    `).run(productId, name, email, rating, text);
    
    const newReview = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
    
    res.json({ success: true, review: newReview });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log('📦 API эндпоинты:');
  console.log('   POST /api/auth/register - Регистрация');
  console.log('   POST /api/auth/login - Вход');
  console.log('   POST /api/auth/logout - Выход');
  console.log('   GET  /api/auth/me - Данные пользователя');
  console.log('   GET  /api/auth/check - Проверка сессии');
  console.log('   GET  /api/products - Все товары');
  console.log('   GET  /api/products/:id - Товар по ID');
  console.log('   GET  /api/products/category/:category - Товары по категории');
  console.log('   GET  /api/products/search/:query - Поиск товаров');
  console.log('   GET  /api/categories - Все категории');
  console.log('   GET  /api/reviews/:productId - Отзывы товара');
  console.log('   POST /api/reviews - Добавить отзыв');
});
