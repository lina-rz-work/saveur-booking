# SAVEUR — Бронирование столика

MVP страницы онлайн-бронирования столика: форма бронирования + экран
подтверждения. Тестовое задание на позицию Trainee Frontend Developer.

## Стек

- React 18 (функциональные компоненты, хуки)
- Next.js 14 (Pages Router)
- TypeScript
- CSS Modules
- Vitest
- ESLint + GitHub Actions

## Запуск локально

```bash
npm install
npm run dev
```

Приложение будет доступно на `http://localhost:3000`.

Сборка продакшн-версии:

```bash
npm run build
npm run start
```

## Структура проекта

```
src/
  components/
    AnimatedBookingView.tsx      # плавный переход между шагами
    BookingForm.tsx              # форма бронирования
    BookingForm.module.css
    ConfirmationScreen.tsx       # экран подтверждения
    ConfirmationScreen.module.css
  pages/
    _app.tsx
    index.tsx                    # главная страница
  styles/
    globals.css                  # цветовая схема и общие стили
  types/
    booking.ts                   # типы BookingFormData / BookingStatus
  utils/
    availability.ts              # слоты и демонстрационное расписание занятости
    validation.ts                # вся логика валидации полей
    validation.test.ts           # unit-тесты всех полей формы
```

## Какие решения я принял и почему

Вынес всю валидацию в `utils/validation.ts` отдельно от компонентов —
так форму проще читать, а функции (`validatePhone` и т.д.) можно
переиспользовать и покрыть тестами независимо от UI. Ошибки хранятся
в состоянии формы и проверяются как на `onBlur`, так и при отправке,
чтобы пользователь видел проблему до сабмита, но форма не ругалась
на пустые поля сразу при загрузке. Отправку данных имитировал через
`setTimeout` с состоянием `BookingStatus` (`idle | loading | success`),
которое переключает форму на экран подтверждения без роутинга — это
достаточно для одностраничного MVP.

Телефон форматируется во время ввода как `+7 (XXX) XXX-XX-XX`.
Доступность времени зависит от выбранной даты: демонстрационное расписание
находится в `utils/availability.ts`, а занятые интервалы отключены в списке и
повторно проверяются перед отправкой. Переход к подтверждению состоит из
отдельных exit/enter-анимаций и учитывает `prefers-reduced-motion`.

Проверки качества:

```bash
npm run lint
npm test
npm run build
```

Те же команды автоматически запускаются в GitHub Actions для push и pull
request.
