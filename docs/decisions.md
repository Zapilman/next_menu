# Журнал решений

Сюда попадают только подтверждённые решения (дата + выбор + зачем). Рекомендации из соседних файлов — не решения.

| Дата | Тема | Решение | Зачем |
|------|------|---------|-------|
| 2026-10-12 | Стили | CSS Modules, без Tailwind | Не учить второй DSL параллельно с App Router |
| 2026-10-12 | Данные | SQLite | Честный прямой доступ к БД из RSC / Server Action (критерий 4) |
| 2026-10-13 | SQLite-драйвер | `@libsql/client` (файл `data/menu.db`), сид `pnpm seed`. Чтение: `getVenue` / `getMenu` / `getSection` в `lib/menu.ts` | SQLite без ORM. `better-sqlite3` не собрался на Windows (node-gyp + SSL). Геттеры async — RSC это нормально |
| 2026-10-13 | Cache Components | Выключены `cacheComponents` / `partialPrefetching` (дефолт create-next-app 16.4) | Уроки 2–3 про `revalidate: 60` и четыре слоя старого App Router, не `'use cache'` |
| 2026-10-12 | Порядок обучения | От простого к сложному: публичное заведение+меню → кэш/streaming/SEO → кабинет (Actions + auth) → прод и SPA-контраст | Кабинет не в первом срезе: иначе auth перебивает RSC |
| 2026-10-12 | Стек ядра | Next.js App Router + React + TypeScript | Без Zustand, React Query, NextAuth, UI-кита в фундаменте |
| 2026-10-12 | Маршруты | Раздельные страницы ради техник, не клон ChoiceQR. Первый срез: `/` заведение + `/menu` каталог. Потом `/menu/[section]`. Карточки блюда отдельным URL нет. Одно заведение | Профиль vs каталог vs `generateStaticParams`. Состав/фильтр — клиентские острова в списке. Кабинет позже |
| 2026-10-12 | Рендер и кэш | `/` static; `/menu` ISR 60с; `/menu/[section]` static + `generateStaticParams`; кабинет dynamic `no-store`. Чтение меню не через `/api`. Клиент — острова (фильтр, accordion). Сначала `loading.tsx`, потом Suspense на секцию | Четыре слоя кэша на одних данных: Request Memoization, Data Cache, Full Route Cache, Router Cache |
| 2026-10-12 | Данные и auth | Чтение: `getVenue` / `getMenu` / `getSection` из RSC в SQLite. Запись (позже): Server Action + `revalidateTag('menu')`. Логин: Server Action; Route Handler — контраст в уроке. Сессия: httpOnly cookie + user id; пароль в env. Проверка в Action и RSC; middleware только редирект. Без NextAuth/ORM | Критерии 4–5 без SPA-слоя API и без доверия клиенту |
| 2026-10-12 | Уроки | 9 уроков, шаблон задача/подходы/выбор/проверка + фразы для интервью. Перед каждым уроком — отдельный брифинг в Context `docs/lessons/`. Когда появится репо — копия в `lessons/`. Код урока пишет Юра руками. В чате — подходы и пример. Рутину и код вне урока делает агент, только после явного «это делаешь ты» | Фича без урока не появляется; не смешивать учёбу с бойлерплейтом |
| 2026-10-12 | Прод | Главная проверка: локальные `next build` + `next start`. Vercel — опциональный read-only деплой публичного меню (SQLite на билде). Запись кабинета только на локальном `next start`. Analyzer в уроке 6. Без Docker/CI/`standalone` в первом срезе. Секреты только в env | Full Route Cache виден в prod, не в `next dev`. Serverless + файл БД — осознанный компромисс |

Открыто: ничего из предстартовых категорий. Скаффолд/сид как рутина перед уроком 1 — ещё не делили.