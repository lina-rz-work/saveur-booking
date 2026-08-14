# SAVEUR — Бронирование столика

MVP страницы онлайн-бронирования столика: форма бронирования + экран
подтверждения. Тестовое задание на позицию Trainee Frontend Developer.

## Стек

- React 18 (функциональные компоненты, хуки)
- Next.js 14 (Pages Router)
- TypeScript
- CSS Modules

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

Unit-тесты (Vitest) для `validation.ts`:

```bash
npm run test
```

Линт (ESLint, конфиг `next/core-web-vitals`):

```bash
npm run lint
```

## Структура проекта

```
src/
  components/
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
    validation.ts                # вся логика валидации полей
    validation.test.ts           # unit-тесты (Vitest)
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

## Что уже доделано сверх базовой версии

- Маска ввода телефона: `+7 (___) ___-__-__` форматируется по мере набора (`formatPhoneInput`)
- Занятые слоты времени: `getBusySlots` детерминированно "бронирует" пару слотов на
  выбранную дату (имитация без бэкенда), они отключены в select и отклоняются валидацией
- Unit-тесты на `validation.ts` (Vitest) — покрыты все поля, не только телефон
- ESLint-конфигурация (`next/core-web-vitals`), `npm run lint`
- Более выраженный переход между формой и подтверждением: `viewSwap` keyframe
  (fade + slide + scale) вместо простого fade-in, с уважением `prefers-reduced-motion`

## Что бы я доделал при наличии ещё времени

- Запуск линта и тестов в CI (GitHub Actions) при пуше/PR
- Реальный источник занятых слотов вместо детерминированной имитации
- Тесты на компоненты (React Testing Library) поверх текущих тестов на утилиты
