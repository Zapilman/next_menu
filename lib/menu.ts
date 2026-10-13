import { getDb } from "@/lib/db";

export type Venue = {
  id: number;
  name: string;
  address: string;
  hours: string;
  phone: string;
};

export type Dish = {
  id: number;
  sectionId: number;
  name: string;
  composition: string;
  price: number;
  weight: string;
  badge: string | null;
  available: boolean;
};

export type MenuSection = {
  id: number;
  slug: string;
  title: string;
  dishes: Dish[];
};

const asNumber = (value: unknown): number => Number(value);

const asString = (value: unknown): string => String(value);

const asNullableString = (value: unknown): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  return String(value);
};

const mapDish = (row: Record<string, unknown>): Dish => ({
  id: asNumber(row.id),
  sectionId: asNumber(row.section_id),
  name: asString(row.name),
  composition: asString(row.composition),
  price: asNumber(row.price),
  weight: asString(row.weight),
  badge: asNullableString(row.badge),
  available: asNumber(row.available) === 1,
});

export const getVenue = async (): Promise<Venue> => {
  const result = await getDb().execute(
    `SELECT id, name, address, hours, phone
     FROM venue
     WHERE id = 1`,
  );
  const row = result.rows[0];

  if (!row) {
    throw new Error("В сиде нет заведения с id = 1.");
  }

  return {
    id: asNumber(row.id),
    name: asString(row.name),
    address: asString(row.address),
    hours: asString(row.hours),
    phone: asString(row.phone),
  };
};

const getDishesBySectionIds = async (sectionIds: number[]): Promise<Dish[]> => {
  if (sectionIds.length === 0) {
    return [];
  }

  const placeholders = sectionIds.map(() => "?").join(", ");
  const result = await getDb().execute({
    sql: `SELECT id, section_id, name, composition, price, weight, badge, available
          FROM dish
          WHERE available = 1 AND section_id IN (${placeholders})
          ORDER BY sort_order ASC, id ASC`,
    args: sectionIds,
  });

  return result.rows.map((row) => mapDish(row as unknown as Record<string, unknown>));
};

export const getMenu = async (): Promise<MenuSection[]> => {
  const result = await getDb().execute(
    `SELECT id, slug, title
     FROM section
     ORDER BY sort_order ASC, id ASC`,
  );

  const sections = result.rows.map((row) => ({
    id: asNumber(row.id),
    slug: asString(row.slug),
    title: asString(row.title),
  }));

  const dishes = await getDishesBySectionIds(sections.map((section) => section.id));

  return sections.map((section) => ({
    ...section,
    dishes: dishes.filter((dish) => dish.sectionId === section.id),
  }));
};

export const getSection = async (slug: string): Promise<MenuSection | null> => {
  const result = await getDb().execute({
    sql: `SELECT id, slug, title
          FROM section
          WHERE slug = ?`,
    args: [slug],
  });
  const row = result.rows[0];

  if (!row) {
    return null;
  }

  const section = {
    id: asNumber(row.id),
    slug: asString(row.slug),
    title: asString(row.title),
  };

  return {
    ...section,
    dishes: await getDishesBySectionIds([section.id]),
  };
};
