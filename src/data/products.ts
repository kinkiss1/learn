export interface Product {
  id: string;
  title: string;
  price: string;
  images: string[];
  description: string;
  category: "soft" | "bedroom" | "storage";
  characteristics?: string;
}

export const products: Record<string, Product> = {
  sofa: {
    id: "sofa",
    title: "Диван «дисКомфорт»",
    price: "39 900 ₽",
    images: [
      "/src/assets/img/beds_and_sofa/Main_sofa.png",
      "/src/assets/img/beds_and_sofa/Big_sofa.png",
      "/src/assets/img/beds_and_sofa/Med_sofa.png",
      "/src/assets/img/beds_and_sofa/Small_sofa.png",
    ],
    description:
      "Современный диван с механизмом трансформации «еврокнижка». Идеально подходит для отдыха и сна.",
    category: "soft",
    characteristics:
      "Размер в собранном виде: 230 × 95 × 95 см; Спальное место: 200 × 145 см; Механизм: еврокнижка; Обивка: велюр премиум-класса; Наполнение: пружинный блок + ППУ; Каркас: массив сосны и берёзы; Цвет: серый графит / бежевый лен; Гарантия: 24 месяца",
  },
  chair: {
    id: "chair",
    title: "Кресло «Элеганс»",
    price: "24 900 ₽",
    images: ["/src/assets/img/chairs_and_desc/main_chair.png"],
    description:
      "Эргономичное кресло с мягким наполнителем. Обеспечивает правильную поддержку спины.",
    category: "soft",
  },
  sofa2: {
    id: "sofa2",
    title: "Диван «Престиж»",
    price: "45 900 ₽",
    images: ["/src/assets/img/beds_and_sofa/Big_sofa.png"],
    description:
      "Большой угловой диван для просторной гостиной. Вместительный и комфортный для всей семьи.",
    category: "soft",
  },
  bed: {
    id: "bed",
    title: "Кровать «Ронда КР-160»",
    price: "32 900 ₽",
    images: ["/src/assets/img/beds_and_sofa/white_bed1.png"],
    description:
      "Стильная кровать в стиле минимализм с ортопедическим основанием. Выбор из 4 цветов.",
    category: "bedroom",
  },
  bed2: {
    id: "bed2",
    title: "Кровать «Венеция КР-180»",
    price: "38 900 ₽",
    images: ["/src/assets/img/beds_and_sofa/black_bed1.png"],
    description:
      "Элегантная кровать размера King Size. Прочная конструкция из массива и ЛДСП премиум-класса.",
    category: "bedroom",
  },
  bed3: {
    id: "bed3",
    title: "Кровать «Комфорт КР-140»",
    price: "27 900 ₽",
    images: ["/src/assets/img/beds_and_sofa/abed1.png"],
    description:
      "Компактная кровать для небольших спален. Удобная и функциональная с ящиками для хранения.",
    category: "bedroom",
  },
  wardrobe: {
    id: "wardrobe",
    title: "Шкаф «Практик»",
    price: "29 900 ₽",
    images: ["/src/assets/img/wardrobes/wardrobe.png"],
    description:
      "Вместительный шкаф с раздвижными дверями. Идеален для хранения одежды и постельного белья.",
    category: "storage",
  },
  dresser: {
    id: "dresser",
    title: "Комод «Модерн»",
    price: "18 900 ₽",
    images: ["/src/assets/img/chairs_and_desc/desc1.png"],
    description:
      "Стильный комод с 5 выдвижными ящиками. Прочная конструкция и плавное закрывание.",
    category: "storage",
  },
  dresser2: {
    id: "dresser2",
    title: "Комод «Классик»",
    price: "21 900 ₽",
    images: ["/src/assets/img/chairs_and_desc/w_desc1.png"],
    description:
      "Элегантный комод в светлых тонах. Отлично впишется в любой интерьер спальни или гостиной.",
    category: "storage",
  },
};

export default products;
