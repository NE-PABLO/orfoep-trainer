# Развертывание на Cloudflare Pages

Это руководство поможет вам развернуть приложение "Орфоэпический Тренажер" на Cloudflare Pages.

## Предварительные требования

1. **Аккаунт Cloudflare** - зарегистрируйтесь на [cloudflare.com](https://www.cloudflare.com)
2. **GitHub репозиторий** - код должен быть загружен на GitHub
3. **Cloudflare CLI** (опционально) - для локального тестирования

## Шаг 1: Подготовка GitHub репозитория

Убедитесь, что ваш код загружен в GitHub:

```bash
git remote -v
# Должно показать: origin	https://github.com/NE-PABLO/orfoep-trainer.git
```

## Шаг 2: Подключение Cloudflare Pages

1. Откройте [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Перейдите в **Pages** (левая панель)
3. Нажмите **Create a project**
4. Выберите **Connect to Git**
5. Авторизуйте GitHub и выберите репозиторий `orfoep-trainer`

## Шаг 3: Конфигурация сборки

В Cloudflare Pages установите следующие параметры:

| Параметр | Значение |
|----------|----------|
| **Framework preset** | None (Custom) |
| **Build command** | `pnpm install && pnpm build` |
| **Build output directory** | `client/dist` |
| **Root directory** | `/` |

Нажмите **Save and Deploy**

## Шаг 4: Переменные окружения

После первого развертывания:

1. В Cloudflare Dashboard откройте ваш проект
2. Перейдите в **Settings** → **Environment variables**
3. Нажмите **Add variables** и добавьте для **Production**:

```
DATABASE_URL = mysql://user:password@host/dbname
JWT_SECRET = your-secret-key-here
OAUTH_SERVER_URL = https://api.manus.im
VITE_APP_TITLE = Орфоэпический Тренажер
VITE_APP_LOGO = /logo.svg
VITE_ANALYTICS_ENDPOINT = https://your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID = your-website-id
```

4. Добавьте те же переменные для **Preview** окружения

## Шаг 5: Конфигурация базы данных

### Вариант A: Cloudflare D1 (рекомендуется)

1. В Cloudflare Dashboard перейдите в **Workers** → **D1**
2. Создайте новую базу данных: `orfoep-trainer-db`
3. Получите `database_id` и добавьте в `wrangler.toml`
4. Запустите миграции:

```bash
pnpm db:push
```

### Вариант B: Внешняя база данных (MySQL/PostgreSQL)

Используйте строку подключения в переменной `DATABASE_URL`:

```
mysql://username:password@host:3306/orfoep_trainer
```

Убедитесь, что база доступна из интернета.

## Шаг 6: Функции Cloudflare (Functions)

Cloudflare Pages автоматически развернет функции из папки `server`:

1. Убедитесь, что `server/_core/index.ts` экспортирует приложение
2. Все API маршруты будут доступны по пути `/api/*`

## Шаг 7: Развертывание

### Автоматическое развертывание (рекомендуется)

Просто загрузите код в GitHub:

```bash
git add .
git commit -m "Prepare for Cloudflare deployment"
git push origin main
```

Cloudflare Pages автоматически начнет сборку и развертывание.

### Ручное развертывание через Wrangler

```bash
# Установите Wrangler
npm install -g wrangler

# Авторизуйтесь
wrangler login

# Разверните приложение
wrangler pages deploy client/dist
```

## Шаг 8: Проверка развертывания

1. Перейдите в **Pages** в Cloudflare Dashboard
2. Выберите ваш проект `orfoep-trainer`
3. Проверьте статус последней сборки
4. Откройте URL вашего приложения (обычно `https://orfoep-trainer.pages.dev`)

## Проверка работы приложения

### Тест 1: Страница входа
- Откройте приложение
- Должна появиться страница входа
- Введите ник (например, "test-user")
- Нажмите "Войти"

### Тест 2: Панель модулей
- После входа должна открыться панель с модулями экзаменов
- Должен быть виден модуль "Орфоэпия"

### Тест 3: Тренажер
- Нажмите на модуль "Орфоэпия"
- Должны загрузиться русские слова
- Выберите гласную букву (ударный слог)

### Тест 4: Статистика
- При правильном ответе слово должно смениться через 1.5 сек
- При неправильном ответе должен показаться правильный ответ
- Статистика должна обновляться

## Решение проблем

### Ошибка: "Build failed"

Проверьте логи сборки:
1. В Cloudflare Dashboard откройте ваш проект
2. Перейдите на вкладку **Deployments**
3. Нажмите на неудачное развертывание
4. Посмотрите логи сборки

**Частые причины:**
- Неправильная команда сборки
- Отсутствующие зависимости
- Ошибки в коде
- Неправильные переменные окружения

**Решение:**
```bash
# Проверьте локально
pnpm install
pnpm build
```

### Ошибка: "Database connection failed"

Проверьте:
1. Переменная `DATABASE_URL` установлена правильно
2. База данных доступна из интернета
3. Firewall разрешает подключения с IP Cloudflare
4. Username и password правильные

### Ошибка: "API returns 404"

Убедитесь:
1. Функции находятся в папке `server`
2. Маршруты правильно экспортированы в `server/routers.ts`
3. Переменные окружения установлены
4. Перезагрузите приложение (Ctrl+Shift+R)

### Ошибка: "Страница показывает README"

Это значит, что сборка не прошла или неправильно настроена:

1. Проверьте логи сборки в Cloudflare Dashboard
2. Убедитесь, что `Build output directory` = `client/dist`
3. Проверьте, что `pnpm build` создает папку `client/dist`
4. Попробуйте пересобрать: откройте проект → нажмите на последнее развертывание → выберите "Retry build"

## Оптимизация производительности

### Включите кэширование

В Cloudflare Dashboard → Pages → Settings → Build caching:
- Включите кэширование зависимостей

### Используйте Cloudflare Workers для оптимизации

Создайте файл `_worker.js` в корне проекта для кастомной обработки запросов.

## Мониторинг

1. Включите **Analytics Engine** в Cloudflare Dashboard
2. Настройте **Alerts** для уведомлений об ошибках
3. Используйте **Logpush** для логирования запросов

## Добавление собственного домена

1. В Cloudflare Dashboard откройте ваш проект Pages
2. Перейдите в **Settings** → **Domains**
3. Нажмите **Add domain**
4. Введите ваш домен
5. Следуйте инструкциям для настройки DNS

## Дополнительные ресурсы

- [Cloudflare Pages документация](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers документация](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 документация](https://developers.cloudflare.com/d1/)
- [Wrangler CLI документация](https://developers.cloudflare.com/workers/wrangler/)

## Поддержка

Если у вас возникли проблемы:

1. Проверьте [Cloudflare Community](https://community.cloudflare.com)
2. Посмотрите [документацию](https://developers.cloudflare.com)
3. Откройте issue в GitHub репозитории: https://github.com/NE-PABLO/orfoep-trainer/issues
