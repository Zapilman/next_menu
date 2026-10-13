# Урок 3: Четыре кэша

Критерий: **3**

Docs: [Caching and Revalidating](https://nextjs.org/docs/app/getting-started/caching-and-revalidating), [Linking and Navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

Роли: Юра пишет код урока руками. Чат — подходы и маленький пример. Агент — только согласованная рутина. Полных исходников здесь нет; примеры — в чате на уроке.

## В продукте

Те же данные меню (`getMenu()` / `getVenue()`), без новых экранов. Показываем четыре слоя на одном каталоге. Навигация пока `/` ↔ `/menu` (`Link`). Раздел→раздел — после урока 5.

## Подходы

**A.** Назвать слои своими именами, на одних данных:

1. **Request Memoization** — два `getMenu()` в layout и page за один запрос не бьют SQLite дважды (`cache()` из React).
2. **Data Cache** — явная политика вокруг чтения меню по docs Caching, **не** через `/api`. Точный API слоя выбираем в чате по текущим docs (не JSON-моки, SQLite уже зафиксирован).
3. **Full Route Cache** — готовые HTML + RSC Payload `/` и `/menu` в проде.
4. **Router Cache** — клиентский переход `Link` без полного refetch, пока нет `refresh` / revalidate.

**B.** Один `force-cache` / «у нас просто cache» без имён слоёв. На собеседовании не отличить memo от Data Cache от Router Cache.

**Не SPA-привычка.** React Query — не «кэш Next.js». Он кэширует клиентский fetch, другие три слоя не видны. В фундамент его нет.

## Зафиксировано

[decisions.md](../decisions.md), 2026-10-12: четыре слоя на одних данных меню; чтение не через `/api`; `/` static, `/menu` ISR 60 с; клиент только острова. Не переоткрываем. PPR / `'use cache'` как фундамент — не старт ([04](../04-rendering-and-caching.md)).

## Кто пишет

- **Юра:** второй вызов `getMenu()` (layout + page); обёртка memo; `Link` `/` ↔ `/menu`; лог/счётчик обращений к SQLite на запрос; наблюдение prod vs dev.
- **Агенту позже, если явно «это делаешь ты»:** хелпер логирования запросов к БД, не смена кэш-модели.

## Проверка

Один запрос `/menu`: `getMenu` на диске один раз при двух вызовах в дереве. `next start`: маршрут из Full Route Cache. Клик `Link` заведение→меню: нет полной перезагрузки, Router Cache. `router.refresh` — отдельное поведение, не путать с Data Cache.

## Фразы на интервью

1. «Четыре слоя: Request Memoization, Data Cache, Full Route Cache, Router Cache — не „просто cache“.»
2. «Memo живёт внутри одного RSC-рендера; Data Cache — между запросами; Full Route — HTML/Payload маршрута; Router — на клиенте.»
3. «React Query кэширует SPA-fetch; гостевое меню у нас читает RSC, без `/api`.»