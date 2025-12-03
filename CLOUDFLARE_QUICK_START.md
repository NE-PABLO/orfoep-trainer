# Быстрый старт: Развертывание на Cloudflare Pages

## За 5 минут до запуска

### 1. Создайте аккаунт Cloudflare (если его нет)
- Перейдите на [cloudflare.com](https://www.cloudflare.com)
- Зарегистрируйтесь или войдите

### 2. Подключите GitHub репозиторий

1. В Cloudflare Dashboard откройте **Pages**
2. Нажмите **Create a project** → **Connect to Git**
3. Авторизуйте GitHub
4. Выберите репозиторий `NE-PABLO/orfoep-trainer`
5. Нажмите **Begin setup**

### 3. Настройте параметры сборки

На странице конфигурации установите:

| Поле | Значение |
|------|----------|
| Framework preset | None (Custom) |
| Build command | `pnpm install && pnpm build` |
| Build output directory | `client/dist` |
| Root directory | `/` |

Нажмите **Save and Deploy**

### 4. Добавьте переменные окружения

После первого развертывания:

1. Откройте **Settings** → **Environment variables**
2. Нажмите **Add variables**
3. Добавьте для **Production**:

```
DATABASE_URL = mysql://user:password@host/dbname
JWT_SECRET = your-random-secret-key
OAUTH_SERVER_URL = https://api.manus.im
VITE_APP_TITLE = Орфоэпический Тренажер
VITE_APP_LOGO = /logo.svg
```

4. Добавьте те же переменные для **Preview**

### 5. Настройте базу данных

#### Вариант A: Cloudflare D1 (проще)

```bash
# Установите Wrangler
npm install -g wrangler

# Авторизуйтесь
wrangler login

# Создайте D1 базу
wrangler d1 create orfoep-trainer-db

# Обновите wrangler.toml с database_id из вывода выше

# Запустите миграции
pnpm db:push
```

#### Вариант B: Внешняя база (MySQL/PostgreSQL)

Используйте строку подключения в `DATABASE_URL`:

```
mysql://username:password@your-host.com:3306/orfoep_trainer
```

### 6. Проверьте развертывание

1. В Cloudflare Dashboard откройте ваш проект
2. На вкладке **Deployments** проверьте статус
3. Если статус **Success** - откройте URL вашего приложения
4. Должна открыться страница входа

## Проверка работы

### Тест 1: Страница входа
- Откройте приложение
- Введите ник (например, "test-user")
- Нажмите "Войти"

### Тест 2: Тренажер
- После входа должна открыться панель модулей
- Нажмите на "Орфоэпия"
- Должны загрузиться слова

### Тест 3: Статистика
- Выберите правильный ударный слог
- Статистика должна обновиться
- Слово должно автоматически смениться через 1.5 сек

## Решение проблем

### "Build failed"
- Проверьте логи сборки в Cloudflare Dashboard
- Убедитесь, что `pnpm install` работает локально
- Проверьте синтаксис в коде

### "Database connection error"
- Проверьте `DATABASE_URL` в переменных окружения
- Убедитесь, что база доступна из интернета
- Проверьте credentials (username/password)

### "API returns 404"
- Убедитесь, что функции в папке `server`
- Проверьте, что переменные окружения установлены
- Перезагрузите приложение (Ctrl+Shift+R)

### "Страница показывает README"
- Это значит, что сборка не прошла
- Проверьте логи сборки
- Убедитесь, что `client/dist` создается при сборке

## Что дальше?

После успешного развертывания:

1. **Добавьте домен** (опционально)
   - В Cloudflare Dashboard → Pages → Settings
   - Добавьте ваш домен

2. **Включите SSL** (автоматически)
   - Cloudflare автоматически включает HTTPS

3. **Настройте аналитику**
   - В Cloudflare Dashboard → Analytics

4. **Добавьте новые модули**
   - Смотрите `PROJECT_DOCUMENTATION.md`

## Полная документация

Для подробной информации смотрите:
- `CLOUDFLARE_DEPLOYMENT.md` - полный гайд развертывания
- `PROJECT_DOCUMENTATION.md` - документация проекта
- `README.md` - основная информация о проекте

## Поддержка

Если возникли проблемы:
1. Проверьте логи в Cloudflare Dashboard
2. Смотрите `CLOUDFLARE_DEPLOYMENT.md` раздел "Решение проблем"
3. Откройте issue в GitHub: https://github.com/NE-PABLO/orfoep-trainer/issues
