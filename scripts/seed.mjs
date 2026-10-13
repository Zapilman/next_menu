import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@libsql/client";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "data");
const dbPath = path.join(dataDir, "menu.db");
const dbUrl = `file:${dbPath.replaceAll("\\", "/")}`;

fs.mkdirSync(dataDir, { recursive: true });
for (const suffix of ["", "-wal", "-shm"]) {
  const filePath = `${dbPath}${suffix}`;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

const db = createClient({ url: dbUrl });

await db.executeMultiple(`
  CREATE TABLE venue (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    hours TEXT NOT NULL,
    phone TEXT NOT NULL
  );

  CREATE TABLE section (
    id INTEGER PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    sort_order INTEGER NOT NULL
  );

  CREATE TABLE dish (
    id INTEGER PRIMARY KEY,
    section_id INTEGER NOT NULL REFERENCES section(id),
    name TEXT NOT NULL,
    composition TEXT NOT NULL,
    price INTEGER NOT NULL,
    weight TEXT NOT NULL,
    badge TEXT,
    available INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL
  );
`);

await db.execute({
  sql: `INSERT INTO venue (id, name, address, hours, phone)
        VALUES (1, ?, ?, ?, ?)`,
  args: [
    "Бістро «Південь»",
    "вул. Нижньоюрківська 12, Київ",
    "щодня 10:00–22:00",
    "+38 044 000 12 12",
  ],
});

const sections = [
  { id: 1, slug: "kholodni", title: "Холодні страви", sortOrder: 1 },
  { id: 2, slug: "supy", title: "Супи", sortOrder: 2 },
  { id: 3, slug: "osnovni", title: "Основні", sortOrder: 3 },
  { id: 4, slug: "deserty", title: "Десерти", sortOrder: 4 },
  { id: 5, slug: "napoi", title: "Напої", sortOrder: 5 },
];

await db.batch(
  sections.map((section) => ({
    sql: `INSERT INTO section (id, slug, title, sort_order)
          VALUES (?, ?, ?, ?)`,
    args: [section.id, section.slug, section.title, section.sortOrder],
  })),
);

const dishes = [
  {
    sectionId: 1,
    name: "Брускети з томатами",
    composition: "чіабата, томати, базилік, оливкова олія",
    price: 165,
    weight: "180 г",
    badge: "новинка",
    available: 1,
    sortOrder: 1,
  },
  {
    sectionId: 1,
    name: "Салат з буряком і фетою",
    composition: "буряк, фета, руккола, волоський горіх",
    price: 189,
    weight: "220 г",
    badge: null,
    available: 1,
    sortOrder: 2,
  },
  {
    sectionId: 1,
    name: "Тартар з лосося",
    composition: "лосось, авокадо, лайм, каперси",
    price: 265,
    weight: "150 г",
    badge: "хіт",
    available: 1,
    sortOrder: 3,
  },
  {
    sectionId: 2,
    name: "Крем-суп з гарбуза",
    composition: "гарбуз, вершки, імбир, насіння гарбуза",
    price: 145,
    weight: "300 г",
    badge: null,
    available: 1,
    sortOrder: 1,
  },
  {
    sectionId: 2,
    name: "Борщ з пампушками",
    composition: "буряк, яловичина, квасоля, часникові пампушки",
    price: 159,
    weight: "350 г",
    badge: "хіт",
    available: 1,
    sortOrder: 2,
  },
  {
    sectionId: 2,
    name: "Курячий бульйон",
    composition: "курка, локшина, морква, зелень",
    price: 129,
    weight: "320 г",
    badge: null,
    available: 1,
    sortOrder: 3,
  },
  {
    sectionId: 3,
    name: "Котлета по-київськи",
    composition: "куряче філе, вершкове масло, кріп, картопляне пюре",
    price: 245,
    weight: "320 г",
    badge: null,
    available: 1,
    sortOrder: 1,
  },
  {
    sectionId: 3,
    name: "Стейк із індички",
    composition: "індичка, розмарин, овочі гриль",
    price: 289,
    weight: "280 г",
    badge: "новинка",
    available: 1,
    sortOrder: 2,
  },
  {
    sectionId: 3,
    name: "Ризото з грибами",
    composition: "рис арборіо, печериці, пармезан, чебрець",
    price: 219,
    weight: "270 г",
    badge: null,
    available: 1,
    sortOrder: 3,
  },
  {
    sectionId: 3,
    name: "Паста з креветками",
    composition: "лінгвіні, креветки, часник, чилі",
    price: 275,
    weight: "300 г",
    badge: "гостре",
    available: 1,
    sortOrder: 4,
  },
  {
    sectionId: 4,
    name: "Наполеон",
    composition: "листкове тісто, заварний крем, ваніль",
    price: 135,
    weight: "140 г",
    badge: "хіт",
    available: 1,
    sortOrder: 1,
  },
  {
    sectionId: 4,
    name: "Сирник зі сметаною",
    composition: "сир, яйце, ваніль, сметана",
    price: 125,
    weight: "160 г",
    badge: null,
    available: 1,
    sortOrder: 2,
  },
  {
    sectionId: 4,
    name: "Шоколадний фондан",
    composition: "темний шоколад, масло, яйце",
    price: 155,
    weight: "120 г",
    badge: "новинка",
    available: 0,
    sortOrder: 3,
  },
  {
    sectionId: 5,
    name: "Еспресо",
    composition: "кава арабіка",
    price: 55,
    weight: "30 мл",
    badge: null,
    available: 1,
    sortOrder: 1,
  },
  {
    sectionId: 5,
    name: "Латте",
    composition: "еспресо, молоко",
    price: 75,
    weight: "250 мл",
    badge: null,
    available: 1,
    sortOrder: 2,
  },
  {
    sectionId: 5,
    name: "Лимонад базилік-лайм",
    composition: "лайм, базилік, цукор, газована вода",
    price: 89,
    weight: "350 мл",
    badge: "новинка",
    available: 1,
    sortOrder: 3,
  },
];

await db.batch(
  dishes.map((dish) => ({
    sql: `INSERT INTO dish (
            section_id, name, composition, price, weight, badge, available, sort_order
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      dish.sectionId,
      dish.name,
      dish.composition,
      dish.price,
      dish.weight,
      dish.badge,
      dish.available,
      dish.sortOrder,
    ],
  })),
);

db.close();

console.log(`Seed OK: ${dbPath}`);
console.log(
  `Заведение 1, секций ${sections.length}, блюд ${dishes.length} (в каталоге только available = 1).`,
);
