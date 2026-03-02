# todo-desktop

Десктоп-приложение для управления TODO-листами и задачами. Клиент к REST API `todo-api`.

> **Учебный проект** — TDD, чистая архитектура, слои ответственности.

---

## Возможности

- Регистрация и авторизация (JWT)
- CRUD списков задач
- CRUD задач внутри списков
- Статусы задач: `todo → in_progress → done`
- Переключение тёмной / светлой темы
- Кастомный title bar (без системной рамки)
- Безопасное хранение токена в Main-процессе через IPC

---

## Скриншот

> Замените на реальный скриншот: `build/screenshot.png`

---

## Технологии

| Категория | Стек |
|-----------|------|
| Desktop | Electron 40 |
| UI | React 19 + Radix UI Themes |
| State | Redux Toolkit |
| HTTP | Axios |
| Типизация | TypeScript 5 |
| Тесты | Vitest (72 теста) |
| IPC | contextBridge + ipcMain/ipcRenderer |
| Сборка | Vite + vite-plugin-electron |
| Пакетирование | electron-builder (NSIS / DMG / AppImage) |
| Линтинг | ESLint + Prettier |
| Иконки | @radix-ui/react-icons |

---

## Архитектура

```
Electron
├── Main process          — жизненный цикл, IPC-хендлеры, хранение JWT
├── Preload               — contextBridge (безопасный мост Renderer ↔ Main)
└── Renderer              — React-приложение (UI + State + API)
```

### Слои Renderer

```
UI (App, TitleBar, AuthPage, Sidebar, TasksPanel)
        ↓ dispatch / select
State (Redux Toolkit — auth, lists, tasks slices + thunks)
        ↓
API client (axios instance, interceptors)
        ↓
Backend (todo-api REST)
```

### Разделение ответственности

| Слой | Отвечает за |
|------|------------|
| UI (компоненты) | Отрисовка, пользовательские события |
| State (Redux slices) | Хранение данных, async-операции (thunks) |
| API client (`http.ts`) | HTTP-запросы, маппинг ошибок → `AppError` |
| IPC (preload) | Безопасный мост Renderer ↔ Main |
| Types | Интерфейсы (`models.ts`), enum'ы, типы ошибок |

---

## Структура проекта

```
electron-todo-electron/
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── .env                       # VITE_API_BASE_URL
│
├── build/
│   └── icon.png               # Иконка приложения (256×256+)
│
├── electron/
│   ├── main.ts                # Main process — окно, IPC, lifecycle
│   ├── preload.ts             # contextBridge — IPC мост
│   ├── tokenStore.ts          # In-memory хранилище JWT
│   └── tokenStore.test.ts
│
├── src/
│   ├── main.tsx               # Точка входа React
│   │
│   ├── app/
│   │   ├── App.tsx            # Роутинг auth / main
│   │   ├── MainLayout.tsx     # Sidebar + TasksPanel + toolbar
│   │   ├── TitleBar.tsx       # Кастомный title bar + тема
│   │   ├── ThemeContext.tsx    # Dark / Light тема
│   │   ├── store.ts           # configureStore + typed hooks
│   │   ├── tokenStorage.ts    # Адаптер: electronAPI / localStorage
│   │   ├── electronAPI.d.ts   # Типы window.electronAPI
│   │   └── global.css         # Глобальные стили
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── auth.slice.ts
│   │   │   ├── auth.api.ts
│   │   │   ├── auth.slice.test.ts
│   │   │   └── AuthPage.tsx
│   │   ├── lists/
│   │   │   ├── lists.slice.ts
│   │   │   ├── lists.api.ts
│   │   │   ├── lists.slice.test.ts
│   │   │   └── Sidebar.tsx
│   │   └── tasks/
│   │       ├── tasks.slice.ts
│   │       ├── tasks.api.ts
│   │       ├── tasks.slice.test.ts
│   │       └── TasksPanel.tsx
│   │
│   ├── api/
│   │   ├── http.ts            # axios instance + interceptors
│   │   └── http.test.ts
│   │
│   ├── types/
│   │   ├── models.ts          # User, TodoList, Task
│   │   ├── enums.ts           # TaskStatus
│   │   ├── errors.ts          # AppError
│   │   ├── models.test.ts
│   │   ├── enums.test.ts
│   │   └── errors.test.ts
│   │
│   └── test/
│       ├── setup.ts           # Vitest global setup
│       └── setup.test.ts
│
└── README.md
```

---

## Быстрый старт

### Установка

```bash
pnpm install
```

### Настройка

Создайте файл `.env` в корне проекта:

```env
VITE_API_BASE_URL=http://your-api-server:3000
```

### Разработка

```bash
pnpm dev
```

Запускает Vite dev-server + Electron. Горячая перезагрузка работает для Renderer и Main процессов.

### Тесты

```bash
pnpm test          # Однократный запуск
pnpm test:watch    # Watch-режим
```

### Сборка

```bash
# Только Vite-сборка (без упаковки)
pnpm build

# Упаковка под текущую платформу
pnpm dist

# Упаковка под конкретную ОС
pnpm dist:win      # Windows (.exe, NSIS)
pnpm dist:mac      # macOS (.dmg)
pnpm dist:linux    # Linux (AppImage)
```

Готовые файлы появятся в папке `release/`.

> **Иконка**: положите PNG-файл 256×256 (или больше) в `build/icon.png`.
> Для macOS рекомендуется 512×512 или 1024×1024.

---

## Авторизация

- JWT хранится в Main process (не в `localStorage`)
- Renderer получает токен через IPC (`contextBridge`)
- Interceptor: авто-подстановка `Authorization: Bearer <token>`
- Interceptor: перехват 401 → авто-logout

## CORS

В dev-режиме Vite proxy перенаправляет `/api/*` → API-сервер (`changeOrigin: true`).
В production Electron загружает из `file://`, и CORS не применяется.

---

## Лицензия

ISC

