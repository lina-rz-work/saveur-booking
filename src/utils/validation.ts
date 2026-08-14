import { BookingFormData, FormErrors } from '@/types/booking';

export const TIME_SLOTS = [
  '12:00', '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00', '19:00', '20:00', '21:00', '22:00',
];

// Имитация занятых слотов: реального бэкенда нет (по условию задания),
// поэтому детерминированно "бронируем" пару слотов на основе даты,
// чтобы UI занятых слотов можно было продемонстрировать без сервера.
export function getBusySlots(date: string): string[] {
  if (!date) return [];

  let hash = 0;
  for (let i = 0; i < date.length; i += 1) {
    hash = (hash * 31 + date.charCodeAt(i)) % 1000;
  }

  const first = TIME_SLOTS[hash % TIME_SLOTS.length];
  const second = TIME_SLOTS[(hash + 4) % TIME_SLOTS.length];
  return Array.from(new Set([first, second]));
}

// Форматирует ввод в маску +7 (XXX) XXX-XX-XX по мере набора
export function formatPhoneInput(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (digits.length === 0) return '';

  // Нормализуем первую цифру: 8 или 7 в начале — код страны
  if (digits[0] === '8') digits = '7' + digits.slice(1);
  if (digits[0] !== '7') digits = '7' + digits;
  digits = digits.slice(0, 11);

  const rest = digits.slice(1); // 10 цифр номера
  let result = '+7';
  if (rest.length > 0) result += ` (${rest.slice(0, 3)}`;
  if (rest.length >= 3) result += ')';
  if (rest.length > 3) result += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) result += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) result += `-${rest.slice(8, 10)}`;

  return result;
}

export function validatePhone(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) {
    return null;
  }
  return 'Введите номер в формате +7XXXXXXXXXX';
}

function validateName(value: string): string | null {
  if (value.trim().length < 2) {
    return 'Введите имя (минимум 2 символа)';
  }
  return null;
}

function validateDate(value: string): string | null {
  if (!value) return 'Выберите дату';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const picked = new Date(value);
  picked.setHours(0, 0, 0, 0);

  if (picked.getTime() < today.getTime()) {
    return 'Дата не может быть раньше сегодняшней';
  }
  return null;
}

function validateTime(value: string, date: string): string | null {
  if (!TIME_SLOTS.includes(value)) {
    return 'Выберите время из списка';
  }
  if (getBusySlots(date).includes(value)) {
    return 'Это время уже занято, выберите другое';
  }
  return null;
}

function validateGuests(value: number): string | null {
  if (!Number.isInteger(value) || value < 1 || value > 12) {
    return 'Количество гостей: от 1 до 12';
  }
  return null;
}

export function validateField(
  field: keyof BookingFormData,
  data: BookingFormData
): string | null {
  switch (field) {
    case 'name':
      return validateName(data.name);
    case 'phone':
      return validatePhone(data.phone);
    case 'date':
      return validateDate(data.date);
    case 'time':
      return validateTime(data.time, data.date);
    case 'guests':
      return validateGuests(data.guests);
    default:
      return null;
  }
}

export function validateForm(data: BookingFormData): FormErrors {
  const errors: FormErrors = {};
  (Object.keys(data) as (keyof BookingFormData)[]).forEach((field) => {
    const error = validateField(field, data);
    if (error) errors[field] = error;
  });
  return errors;
}
