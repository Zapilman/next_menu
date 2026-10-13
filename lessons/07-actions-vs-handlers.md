# Урок 7: Прямое чтение vs Action vs Route Handler

Критерий: **4**

Docs: [Mutating Data](https://nextjs.org/docs/app/getting-started/mutating-data), [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)

Роли: Юра пишет код урока руками. Чат — подходы и маленький пример. Агент — только согласованная рутина. Полных исходников здесь нет; примеры — в чате на уроке.

## В продукте

Тонкий кабинет: список блюд + смена цены / наличия. Чтение по-прежнему `getVenue` / `getMenu` / `getSection` из RSC в SQLite, не `/api`. Запись — Server Action + `revalidateTag('menu')`. Route Handler — только контраст в уроке, не слой доступа к БД. Логин и cookie — урок 8: здесь учим мутацию, не закрываем критерий 5.

## Подходы

**A.** RSC читает SQLite напрямую. Форма кабинета вызывает Server Action; после UPDATE — `revalidateTag('menu')`, гостевой ISR сбрасывается точечно. Action — не REST.

**B.** Route Handler `POST /api/dishes` + клиентский `fetch` как «нормальный бэкенд». Лишний hop, SPA-модель, хуже критерий 4. Имеет смысл, если нужен HTTP для чужого клиента — у нас QR webhook нет.

**Не SPA-привычка.** Не Axios + React Query `invalidateQueries` после REST. Гостевой кэш — слои Next.js, не клиентский стор.

## Зафиксировано

[decisions.md](../decisions.md), 2026-10-12: чтение из RSC в SQLite; запись — Server Action + `revalidateTag('menu')`; Route Handler — контраст в уроке; логин — тоже Action, но в уроке 8; без ORM, без записи в JSON, без NextAuth. Кабинет — отдельная ветка маршрутов, не общий layout с публичным Full Route Cache. Не переоткрываем.

## Кто пишет

- **Юра:** Server Action (цена / наличие); форма кабинета; `revalidateTag('menu')`; короткий Route Handler только как контраст «лишний hop», не как постоянный API меню.
- **Агенту позже, если явно «это делаешь ты»:** дописать таблицы SQLite под UPDATE, если сид только на чтение; каркас пустой страницы кабинета без Action.

## Проверка

Сменить цену в кабинете → открыть `/menu` (лучше `next start`): новая цена после revalidate, не через 60 с вслепую. Гостевое меню по-прежнему без `/api/menu` в Network. Показать, что тот же UPDATE через Route Handler + client fetch добавляет hop и не нужен RSC.

## Фразы на интервью

1. «RSC может читать SQLite без API-слоя; `/api/menu` для своих же страниц — лишний hop.»
2. «Server Action — мутация с серверным замыканием, не REST-ресурс.»
3. «После цены зову `revalidateTag('menu')`: сбрасываю Data/Full Route кэш каталога, не весь сайт.»