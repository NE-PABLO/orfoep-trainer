# Правильная настройка Cloudflare Pages для развертывания

## Проблема

Cloudflare Pages автоматически запускает `wrangler deploy`, что приводит к ошибкам, потому что Pages не нужен wrangler для развертывания.

## Решение

Нужно отключить автоматический deploy в конфигурации Cloudflare Pages.

## Пошаговая инструкция

### Шаг 1: Убедитесь, что код загружен на GitHub

```bash
git status
git push origin main
```

### Шаг 2: В Cloudflare Dashboard

1. Откройте https://dash.cloudflare.com
2. Перейдите в **Pages**
3. Нажмите на ваш проект `orfoep-trainer`

### Шаг 3: Отключите автоматический deploy

1. Откройте **Settings** → **Builds & deployments**
2. Найдите **Build command** и убедитесь, что установлено:
   ```
   pnpm install && pnpm build
   ```
3. Найдите **Build output directory** и установите:
   ```
   client/dist
   ```
4. **ВАЖНО:** Найдите **Post-build command** (если есть) и оставьте пусто
5. Найдите **Deploy command** (если есть) и оставьте пусто или удалите

### Шаг 4: Сохраните и пересоберите

1. Нажмите **Save**
2. Откройте **Deployments**
3. Найдите последнее развертывание
4. Нажмите **Retry build** для пересборки

### Шаг 5: Проверьте логи

Если сборка всё ещё не работает:
1. Откройте последнее развертывание
2. Посмотрите логи
3. Проверьте, что нет ошибок в `pnpm build`

## Альтернативное решение: Использовать Vercel вместо Cloudflare Pages

Если Cloudflare Pages продолжает вызывать проблемы, рекомендуется использовать **Vercel**, который лучше поддерживает Node.js приложения:

### Развертывание на Vercel

1. Откройте https://vercel.com
2. Нажмите **Add New** → **Project**
3. Импортируйте репозиторий GitHub `NE-PABLO/orfoep-trainer`
4. Установите параметры:
   - **Framework**: Other
   - **Build Command**: `pnpm install && pnpm build`
   - **Output Directory**: `client/dist`
5. Добавьте переменные окружения:
   ```
   DATABASE_URL = mysql://username:password@host/dbname
   JWT_SECRET = your-secret-key
   OAUTH_SERVER_URL = https://api.manus.im
   VITE_APP_TITLE = Орфоэпический Тренажер
   VITE_APP_LOGO = /logo.svg
   ```
6. Нажмите **Deploy**

Vercel автоматически развернет приложение и создаст URL типа `https://orfoep-trainer.vercel.app`

## Что в wrangler.toml

Текущий `wrangler.toml` содержит только конфигурацию сборки:

```toml
name = "orfoep-trainer"

[build]
command = "pnpm install && pnpm build"
cwd = "./"
```

Это минимальная конфигурация, которая работает с Cloudflare Pages.

## Проверка работы

После успешного развертывания:

1. Откройте URL вашего приложения (например, `https://orfoep-trainer.pages.dev`)
2. Должна появиться страница входа
3. Введите ник и нажмите "Войти"
4. Должна открыться панель с модулями

## Если всё ещё не работает

1. Проверьте, что `client/dist` создается при сборке:
   ```bash
   pnpm build
   ls -la client/dist
   ```

2. Проверьте, что все зависимости установлены:
   ```bash
   pnpm install
   ```

3. Проверьте логи сборки в Cloudflare Dashboard

4. Откройте issue в GitHub: https://github.com/NE-PABLO/orfoep-trainer/issues

## Рекомендация

Для более надежного развертывания рекомендуется использовать **Vercel** вместо Cloudflare Pages, так как Vercel лучше поддерживает Node.js приложения с базами данных.
