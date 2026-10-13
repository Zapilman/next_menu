# Формат уроков

Код появляется только уроком. Нет урока — нет фичи. Урок не «сделай страницу», а «выбор из docs и как он бьёт по QR-меню».

## Что решить до кода

- Порядок уроков: публичный срез → измерения → кабинет → SPA-контраст
- Один урок = один критерий или узкая связка (не «весь App Router»)
- Где живёт текст урока: `docs/` vs `lessons/` в репо — решить перед первым PR с кодом

## Рекомендуемый дефолт

Шаблон урока (копировать как есть):

```md
# Урок N: <тема>
Критерий: <1–9>
Docs: <каноническая ссылка Next.js>

## Задача в продукте
Что именно появляется в QR-меню (маршрут, поле, поведение).

## Подходы
1. Подход A — как в docs, плюс/минус для этой фичи
2. Подход B — альтернатива
3. Почему не C (часто: SPA-привычка)

## Выбор
Что берём и как это меняет фичу (кэш, JS, SEO, безопасность).

## Проверка
Что открыть, что измерить, какую фразу сказать на собеседовании.
```

Черновик порядка (не код, не обязательства):

| N | Тема | Docs (якоря) | Фича |
|---|------|----------------|------|
| 1 | RSC vs Client, payload vs hydrate | [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) | Каталог RSC + клиентский accordion состава |
| 2 | Static / ISR / dynamic | [Rendering](https://nextjs.org/docs/app/getting-started/caching-and-revalidating) | Заведение + меню static; кабинет не трогаем |
| 3 | Четыре кэша | [Caching](https://nextjs.org/docs/app/getting-started/caching-and-revalidating) | Одно меню, разные слои |
| 4 | Прямое чтение vs Action vs Route Handler | [Mutating Data](https://nextjs.org/docs/app/getting-started/mutating-data), [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers) | `getMenu()` в RSC; запись — только с кабинетом |
| 5 | Auth на сервере | [Authentication](https://nextjs.org/docs/app/guides/authentication) | Тонкий кабинет |
| 6 | Streaming / error | [Loading UI](https://nextjs.org/docs/app/api-reference/file-conventions/loading), [Error Handling](https://nextjs.org/docs/app/getting-started/error-handling) | Suspense секций, `not-found` раздела |
| 7 | SEO + bundle | [Metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images), [Bundle Analyzer](https://nextjs.org/docs/app/guides/package-bundling) | `generateMetadata` заведения; замер клиентского JS |
| 8 | Прод | [Production](https://nextjs.org/docs/app/getting-started/deploying), [CI](https://nextjs.org/docs/app/guides/production-checklist) | `next build`, сценарий QR-гостя |
| 9 | Контраст SPA | React Query docs + Next cache | Тот же фильтр меню: Query vs RSC — не фундамент |

Правило: ссылка на docs обязательна. «Я так привык» — не аргумент урока.

## Альтернативы

- Свободный туториал без шаблона — быстрее писать, хуже готовит к интервью.
- Один огромный урок «сделай ChoiceQR» — фичи без критериев.
- Сначала кабинет и auth — Юра уйдёт в сессии раньше RSC.
- Видео/созвон без текста — нельзя привязать к docs в репозитории.

## Компромиссы

- Жёсткий шаблон замедляет, но заставляет назвать альтернативу.
- React Query только в уроке 9: терпение vs риск снова собрать SPA.
- Канонические URL Next.js меняются между мажорами — в уроке фиксировать path из текущей версии.

## Зафиксировано (см. [decisions.md](./decisions.md))

Порядок:

| N | Тема | Фича |
|---|------|------|
| 1 | RSC vs Client, payload vs hydrate | `/` + `/menu`, острова |
| 2 | Static / ISR / dynamic | заведение static, меню ISR |
| 3 | Четыре кэша | те же данные, разные слои |
| 4 | Streaming и ошибки | `loading.tsx`, Suspense секций, `error.tsx` |
| 5 | `generateStaticParams` + SEO | `/menu/[section]`, metadata, `not-found` |
| 6 | Bundle | замер JS островов |
| 7 | Прямое чтение vs Action vs Route Handler | кабинет: цена/наличие |
| 8 | Auth на сервере | логин, cookie, серверная проверка |
| 9 | Прод + компромиссы | `next build`, QR-гость; React Query только как контраст |

Роли:

- Юра пишет код, который относится к уроку
- В чате разбираем подход и смотрим пример реализации, не сдаём готовый проект «под ключ»
- Код вне урока (скаффолд, сид, конфиг, рутина) — агент, и только если в обсуждении явно решили «это делаешь ты»
- Тексты уроков — `lessons/` в репо; решения — Context `docs/`
- В каждом уроке 2–3 фразы для интервью

## Брифинги

Читать до урока: [lessons/README.md](./lessons/README.md). Предварительный разбор, не туториал и не исходники.