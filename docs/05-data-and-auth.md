# Данные и auth

Чтение публичного меню — на сервере, напрямую. Мутации — не через доверенный клиент. Auth — проверка на сервере, не `if (user) { showEdit }`.

Опора: [Mutating Data](https://nextjs.org/docs/app/getting-started/mutating-data), [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers), [Authentication](https://nextjs.org/docs/app/guides/authentication).

## Что решить до кода

- JSON или SQLite (см. [02-tech-stack.md](./02-tech-stack.md))
- Где живёт модель: `getVenue()`, `getMenu()`, `getSection(slug)`
- Нужен ли кабинет в первом срезе
- Как хранить сессию, если кабинет будет: cookie httpOnly, кто подписывает

## Рекомендуемый дефолт

**Чтение (публичное):** RSC вызывает `getMenu()` / `getVenue()`. Это прямой доступ к JSON или SQLite, не `/api/menu`. Нет Axios, нет React Query на гостевом пути.

**Запись (кабинет, позже):** Server Action `updateDishPrice` / `toggleAvailability`. После записи — `revalidateTag('menu')` или `revalidatePath('/menu')`, чтобы гость увидел ISR-сброс.

**Route Handler:** не использовать как «слой доступа к БД для своих же RSC». Имеет смысл для:

- webhook/QR-провайдер (у нас нет)
- логин, если решим выставить POST `/login` вместо Action
- bundle-agnostic JSON для внешнего клиента — не цель проекта

**Auth:**

- Гостевые страницы без сессии
- Кабинет: httpOnly cookie, проверка в Server Action и в server page. Клиентский флаг «я админ» — только UX
- Без NextAuth в первом срезе. Один учебный пользователь в env (`CABINET_PASSWORD`) допустим
- Права: роль «персонал этого заведения» = видит кабинет. Нет ACL на блюда, нет мультиаренды

Не доверять: скрытым кнопкам, query `?admin=1`, телу запроса `role: 'admin'`.

## Альтернативы

| Подход | Плюс | Минус |
|--------|------|-------|
| JSON + только чтение | Ноль инфраструктуры | Нет честной мутации |
| JSON + запись файла | Без БД | Плохо для деплоя, гонки |
| SQLite | Честный UPDATE | Лишняя lib, путь к файлу на хосте |
| Route Handler + клиентский fetch | Привычный SPA | Лишний hop, хуже критерий 4 |
| Server Actions везде, включая login | Один паттерн | Сложнее объяснить CSRF/origin |
| Auth.js | Провайдеры | Шире стек, чем нужно |
| Middleware как единственная защита | Удобный редирект | Не замена проверке в Action |

## Компромиссы

- Прямой доступ из RSC ломает привычку «всегда API». Это и есть урок.
- Action без кабинета некуда повесить: либо откладываем критерий 4 в коде, либо делаем тонкий кабинет.
- Учебный пароль в env — не прод-auth, зато видно cookie и server check.
- `revalidatePath` проще, `revalidateTag` точнее (сброс меню, не всего сайта). Для собеседования лучше tag, для первого урока — path.

## Зафиксировано (см. [decisions.md](./decisions.md))

- SQLite сразу; чтение только из RSC, не `/api`
- `getVenue()`, `getMenu()`, `getSection(slug)`
- Кабинет позже: Server Action на запись и на логин; Route Handler — контраст в уроке
- `revalidateTag('menu')` после мутации
- httpOnly cookie + user id; один учебный пароль в env
- Проверка в Action и RSC; middleware не граница безопасности
- Без NextAuth, ORM, записи в JSON
- Путь SQLite на деплое — категория «прод»