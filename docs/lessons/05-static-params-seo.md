# Урок 5: generateStaticParams + SEO

Критерий: **7** (SEO / metadata; static params — также опора для критерия 2)

Docs: [Metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images), [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params), [not-found](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)

Роли: Юра пишет код урока руками. Чат — подходы и маленький пример. Агент — только согласованная рутина. Полных исходников здесь нет; примеры — в чате на уроке.

## В продукте

Появляется `/menu/[section]`: раздел как отдельный URL. `generateStaticParams` по секциям из SQLite. `generateMetadata` у заведения и у раздела. Нет такого slug — `notFound()` + `not-found`. Карточки блюда отдельным URL по-прежнему нет: детали остаются в списке.

## Подходы

**A.** Static + `generateStaticParams` + metadata на сервере. Разделы известны на билде. Неизвестный slug — 404, не пустой клиентский экран.

**B.** Только клиентский фильтр на `/menu` без отдельного URL. Фильтр уже есть как остров, но нет metadata раздела, нет static params, слабее Router Cache «раздел→раздел».

**Не SPA-привычка.** Не query `?section=` + `document.title` / Helmet. Поисковик и QR-гость получают title/description из серверного metadata, не после hydrate.

## Зафиксировано

[decisions.md](../decisions.md), 2026-10-12: `/menu/[section]` — отдельный урок после каталога; static + `generateStaticParams`; карточки блюда отдельным URL нет; чтение `getSection` из RSC в SQLite. Не переоткрываем. Bundle analyzer — урок 6, не здесь.

## Кто пишет

- **Юра:** `app/menu/[section]/page.tsx`; `generateStaticParams`; `generateMetadata` на `/` и на разделе; вызов `notFound()`; `not-found.tsx`; `Link` с `/menu` на раздел.
- **Агенту позже, если явно «это делаешь ты»:** дописать seed секций, если в SQLite их ещё нет — не саму страницу.

## Проверка

`next build`: список `/menu/<slug>` как static. View Source раздела: title/description заведения и раздела. Выдуманный slug — UI `not-found`, не пустой каталог. `Link` `/menu` → раздел без полной перезагрузки (Router Cache, критерий 3 на новых URL).

## Фразы на интервью

1. «Разделы меню — `generateStaticParams`: на билде известный набор slug, не SSR каждого QR-перехода.»
2. «`generateMetadata` на сервере: title раздела в HTML до hydrate.»
3. «Нет секции — `notFound()`, не `error.tsx` и не клиентский редирект.»