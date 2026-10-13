# Рендер и кэш

Каждая страница — эксперимент, не «везде SSR». Слои кэша называть своими именами.

Опора: [Caching](https://nextjs.org/docs/app/getting-started/caching-and-revalidating), [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components), [Linking and Navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating).

## Что решить до кода

- Где static / ISR / dynamic
- Где Suspense-границы
- Что клиентское (фильтр, раскрытие состава), что серверное (список, цена)
- Как показывать четыре кэша на одних и тех же данных меню

## Рекомендуемый дефолт

| Страница | Рендер | Кэш | Клиент |
|----------|--------|-----|--------|
| Заведение | Static / ISR | Full Route Cache + Data Cache | Почти нет |
| Каталог меню | Static / ISR (`revalidate` 60–300 с как гипотеза) | Data Cache на чтении JSON/БД, Full Route Cache на HTML | Фильтр раздела, accordion состава |
| Раздел меню | Static, `generateStaticParams` по секциям | Как каталог | Как каталог |
| Карточка блюда (если будет) | Static params + `not-found` | Data Cache по id | Нет или мало |
| Кабинет (позже) | Dynamic, `connection()` / `no-store` / cookies | Без Full Route Cache. Request-memoization внутри одного RSC-рендера | Форма редактирования |

Эксперименты по слоям (имена для собеседования):

1. **Request Memoization** — два `getMenu()` в layout и page за один запрос не бьют диск дважды.
2. **Data Cache** — `fetch` cache / `'use cache'` / чтение файла с явной политикой. Меню гостя.
3. **Full Route Cache** — готовый RSC Payload + HTML каталога в проде.
4. **Router Cache (клиент)** — `next/link` между заведением и разделом без полного refetch, пока не `router.refresh` / revalidate.

Гидратация: RSC Payload приносит серверное дерево; гидратируются только Client Components. На собеседовании не путать «приехал payload» и «выполнился hydrate».

## Альтернативы

- Всё dynamic SSR: проще рассуждать, убивает урок Full Route Cache и SEO-статику.
- Всё клиент + React Query: знакомый кэш, другие слои Next.js не видны.
- PPR / `use cache` как фундамент: можно как продвинутый урок, не как старт, пока не зафиксируем версию Next.js.
- Каталог `force-dynamic`, чтобы «цены всегда свежие»: честно для ресторана, плохо для критерия 3.

## Компромиссы

- ISR 60 с: гость может увидеть старую цену. Для учёбы это плюс (есть что ревалидировать Action’ом).
- Крупный Client Component на весь каталог: один bundle, гидратация всего списка, RSC-урок провален.
- Мелкие клиентские острова: больше файлов `'use client'`, зато payload и JS измеримы (критерий 7).
- `loading.tsx` на весь `/menu` vs Suspense на секцию: route-level проще, секции лучше показывают streaming.

## Зафиксировано (см. [decisions.md](./decisions.md))

- `/` static; `/menu` ISR `revalidate: 60`; `/menu/[section]` static + `generateStaticParams`; кабинет later — dynamic `no-store`
- Меню не читать через `/api` / Route Handler
- Клиент только островами: фильтр раздела, accordion состава
- Streaming: сначала `loading.tsx` на `/menu`, потом Suspense на секцию
- Четыре слоя кэша — отдельные уроки/проверки на тех же данных меню
- Сброс кэша при смене цены (кабинет): `revalidateTag` — уточним в данных/auth
- Кабинет — отдельная ветка маршрутов, не общий layout с публичным Full Route Cache (когда дойдём)