# Публикация проекта

Ниже два этапа: сначала GitHub-репозиторий, затем публичное превью на Vercel.

## 1. Проверить проект локально

Распакуйте архив, откройте терминал в папке `saveur-booking` и выполните:

```bash
npm install
npm run dev
```

Откройте `http://localhost:3000`. Перед публикацией также полезно запустить:

```bash
npm test
npm run lint
npm run build
```

## 2. Создать репозиторий GitHub

1. Войдите на `github.com`.
2. Нажмите **+ → New repository**.
3. Назовите репозиторий `saveur-booking`.
4. Выберите **Public** — это требование тестового задания.
5. Не добавляйте README, `.gitignore` или лицензию: они уже есть в проекте.
6. Нажмите **Create repository** и скопируйте HTTPS-адрес репозитория.

В терминале из папки проекта выполните:

```bash
git init
git add .
git commit -m "Implement restaurant booking page"
git branch -M main
git remote add origin https://github.com/ВАШ-ЛОГИН/saveur-booking.git
git push -u origin main
```

Замените `ВАШ-ЛОГИН` на имя аккаунта GitHub. Если Git просит указать автора коммита:

```bash
git config --global user.name "Ваше имя"
git config --global user.email "ваша-почта@example.com"
```

Затем повторите `git commit` и `git push`.

## 3. Задеплоить на Vercel

1. Войдите на `vercel.com` через GitHub.
2. Разрешите Vercel доступ к созданному репозиторию.
3. В панели Vercel нажмите **Add New… → Project**.
4. Найдите `saveur-booking` и нажмите **Import**.
5. Проверьте, что Framework Preset определился как **Next.js**.
6. Оставьте Root Directory равной `./`. Переменные окружения не нужны.
7. Нажмите **Deploy**.
8. Дождитесь статуса успешного деплоя и откройте адрес вида `https://saveur-booking-....vercel.app`.

После подключения репозитория каждый новый `git push` в ветку `main` будет автоматически обновлять production-деплой.

## 4. Что отправить рекрутеру

- ссылку на публичный GitHub-репозиторий;
- ссылку на проект `*.vercel.app`;
- при желании — короткую пометку: «Форма валидируется при blur и submit, отправка имитируется 1,5 секунды, добавлены unit-тесты телефона».
