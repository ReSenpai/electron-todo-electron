# todo-desktop

Десктоп-приложение для управления TODO-листами и задачами. Клиент к API `todo-api`.

> **Учебный проект** — TDD, чистая архитектура, предсказуемое состояние.

---

## Цель

- Авторизация / регистрация пользователей
- CRUD TODO-листов
- CRUD задач внутри листов
- Статусы задач: `todo → in_progress → done`
- Чёткое разделение UI / State / API

---

## Архитектура

```
Electron
├── Main process          — жизненный цикл, хранение токенов, IPC-хендлеры
├── Renderer process      — React-приложение (UI + State + API client)
└── Shared (types/)       — интерфейсы, enum'ы, типы ошибок
```

### Слои Renderer-процесса

```
UI (pages, components)
        ↓ dispatch / select
State (Redux Toolkit slices + createAsyncThunk)
        ↓ вызов
API client (axios, http-обёртка)
        ↓
Backend (todo-api)
```

> **Почему нет отдельного слоя DTO?**
> API-слой сам определяет типы запросов/ответов и маппит их в доменные типы.
> Выделять `dto/` в отдельную папку при 3-4 эндпоинтах — преждевременная абстракция.

### Разделение ответственности

| Слой | Отвечает за |
|------|------------|
| UI (pages / components) | Отрисовка, пользовательские события |
| State (Redux slices) | Хранение данных, async-операции (thunks) |
| API client | HTTP-запросы, маппинг ответов |
| IPC (preload) | Безопасный мост Renderer ↔ Main |
| Types | Интерфейсы, enum'ы, типы ошибок |

---

## Структура проекта

```
electron-todo-electron/
├── package.json
├── electron/
│   ├── main.ts                # Main process — окно, lifecycle
│   ├── preload.ts             # contextBridge — безопасный IPC
│   └── ipc/
│       └── auth.ipc.ts        # IPC-хендлеры для токенов
│
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── store.ts           # configureStore
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ListsPage.tsx
│   │   └── TasksPage.tsx
│   │
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   └── TaskItem.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── auth.slice.ts      # slice + thunks
│   │   │   ├── auth.api.ts        # HTTP-вызовы
│   │   │   └── auth.slice.test.ts
│   │   ├── lists/
│   │   │   ├── lists.slice.ts
│   │   │   ├── lists.api.ts
│   │   │   └── lists.slice.test.ts
│   │   └── tasks/
│   │       ├── tasks.slice.ts
│   │       ├── tasks.api.ts
│   │       └── tasks.slice.test.ts
│   │
│   ├── api/
│   │   └── http.ts            # axios instance, interceptors
│   │
│   ├── types/
│   │   ├── models.ts          # User, TodoList, Task
│   │   ├── enums.ts           # TaskStatus
│   │   └── errors.ts          # AppError, ApiError
│   │
│   └── test/
│       └── setup.ts           # глобальный setup для Vitest
│
└── README.md
```

---

## Авторизация

- JWT хранится в Main process (не в localStorage)
- Renderer получает токен только через IPC (`contextBridge`)
- Авто-logout при 401

## Работа с API

- Все запросы через `api/http.ts` (axios instance)
- Interceptor: автоподстановка `Authorization: Bearer`
- Interceptor: перехват 401 → logout
- Маппинг backend-ошибок → `AppError`

---

## Тестирование

| Что | Как |
|-----|-----|
| Redux slices + thunks | Unit-тесты с мок-API |
| API client | Тесты с мок-сервером (msw или axios-mock-adapter) |
| UI | Минимально — smoke-тесты критических путей |

---

## Технологии

| Категория | Стек |
|-----------|------|
| Desktop | Electron |
| UI | React |
| State | Redux Toolkit |
| HTTP | Axios |
| Типизация | TypeScript |
| Тесты | Vitest |
| IPC | contextBridge |
| Сборка | Vite + electron-builder |
| Линтинг | ESLint + Prettier |


