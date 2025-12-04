# Исправленное развертывание на Cloudflare Pages

## Проблема

При первой попытке развертывания возникли ошибки в конфигурации `wrangler.toml`:
- Неподдерживаемые поля (`type`, `zone_id`, `functions`, `watch_paths`)
- Пустые значения в `account_id`, `route`
- Неправильная конфигурация KV namespaces

## Решение

Я исправил конфигурацию. Теперь используется правильная структура для Cloudflare Pages.

### Обновленные файлы:

1. **wrangler.toml** - упрощенная конфигурация только для Pages
2. **_routes.json** - маршрутизация для API запросов
3. **package.json** - правильная команда сборки

## Шаги для развертывания

### 1. Убедитесь, что код загружен на GitHub

```bash
git status
git push origin main
```

### 2. В Cloudflare Dashboard

1. Откройте https://dash.cloudflare.com
2. Перейдите в **Pages**
3. Нажмите **Create a project** → **Connect to Git**
4. Выберите репозиторий `NE-PABLO/orfoep-trainer`

### 3. Конфигурация сборки

На странице конфигурации установите:

| Поле | Значение |
|------|----------|
| **Framework preset** | None (Custom) |
| **Build command** | `pnpm install && pnpm build` |
| **Build output directory** | `client/dist` |
| **Root directory** | `/` |

### 4. Добавьте переменные окружения

После создания проекта:

1. Откройте **Settings** → **Environment variables**
2. Нажмите **Add variables** для **Production**
3. Добавьте:

```
DATABASE_URL = mysql://username:password@host:3306/orfoep_trainer
JWT_SECRET = your-random-secret-key-here
OAUTH_SERVER_URL = https://api.manus.im
VITE_APP_TITLE = Орфоэпический Тренажер
VITE_APP_LOGO = /logo.svg
```

4. Добавьте те же переменные для **Preview**

### 5. Настройте базу данных

**Вариант A: Cloudflare D1 (рекомендуется)**

```bash
# Установите Wrangler глобально
npm install -g wrangler

# Авторизуйтесь
wrangler login

# Создайте D1 базу
wrangler d1 create orfoep-trainer-db

# Скопируйте database_id из вывода выше

# Обновите DATABASE_URL в Cloudflare Pages:
# DATABASE_URL = "file:./db.sqlite"
```

**Вариант B: Внешняя MySQL база**

Используйте полную строку подключения:
```
mysql://username:password@your-host.com:3306/orfoep_trainer
```

### 6. Запустите сборку

1. В Cloudflare Dashboard откройте ваш проект
2. На вкладке **Deployments** проверьте статус
3. Если статус **Success** - приложение развернуто!

## Проверка работы

### Тест 1: Страница входа
- Откройте URL вашего приложения (например, `https://orfoep-trainer.pages.dev`)
- Должна появиться страница входа
- Введите ник (например, "test-user")
- Нажмите "Войти"

### Тест 2: Панель модулей
- После входа должна открыться панель с модулями
- Должен быть виден модуль "Орфоэпия"

### Тест 3: Тренажер
- Нажмите на модуль "Орфоэпия"
- Должны загрузиться слова
- Выберите гласную букву

### Тест 4: Статистика
- При правильном ответе слово должно смениться через 1.5 сек
- При неправильном ответе должен показаться правильный ответ
- Статистика должна обновляться

## Решение проблем

### "Build failed" - ошибка сборки

**Решение:**
1. Проверьте логи сборки в Cloudflare Dashboard
2. Убедитесь, что `pnpm install` работает локально:
   ```bash
   pnpm install
   pnpm build
   ```
3. Проверьте, что `client/dist` создается при сборке

### "Database connection failed" - ошибка подключения БД

**Решение:**
1. Проверьте `DATABASE_URL` в Environment variables
2. Убедитесь, что база доступна из интернета
3. Проверьте username и password
4. Для D1: убедитесь, что база создана и database_id правильный

### "API returns 404" - API не работает

**Решение:**
1. Проверьте, что переменные окружения установлены
2. Убедитесь, что `_routes.json` находится в корне проекта
3. Перезагрузите приложение (Ctrl+Shift+R)
4. Проверьте логи в Cloudflare Dashboard

### "Страница показывает README" - неправильная сборка

**Решение:**
1. Проверьте, что `Build output directory` = `client/dist`
2. Убедитесь, что `pnpm build` создает папку `client/dist`
3. Попробуйте пересобрать: откройте последнее развертывание → нажмите "Retry build"

## Локальное тестирование перед развертыванием

Перед развертыванием на Cloudflare протестируйте локально:

```bash
# Установка зависимостей
pnpm install

# Запуск dev сервера
pnpm dev

# Сборка для production
pnpm build

# Проверка, что client/dist создана
ls -la client/dist
```

## Дополнительные ресурсы

- [Cloudflare Pages документация](https://developers.cloudflare.com/pages/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Cloudflare D1 документация](https://developers.cloudflare.com/d1/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

## Контакты

Если возникли проблемы:
1. Проверьте логи в Cloudflare Dashboard
2. Откройте issue в GitHub: https://github.com/NE-PABLO/orfoep-trainer/issues
