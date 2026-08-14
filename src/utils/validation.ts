import type { BookingFormData, FormErrors } from '@/types/booking';
import { TIME_SLOTS } from './availability';

export { TIME_SLOTS } from './availability';

export interface ValidationOptions {
  occupiedTimeSlots?: readonly string[];
}

function normalizePhoneDigits(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  if (digits[0] === '8') return `7${digits.slice(1, 11)}`;
  if (digits[0] !== '7') return `7${digits.slice(0, 10)}`;
  return digits.slice(0, 11);
}

export function formatPhone(value: string, previousValue = ''): string {
  let digits = value.replace(/\D/g, '');
  const previousDigits = previousValue.replace(/\D/g, '');

  // При удалении автоматически добавленного разделителя удаляем и цифру перед
  // ним: иначе дефис или скобка тут же появились бы снова.
  if (
    value.length < previousValue.length &&
    digits.length === previousDigits.length
  ) {
    digits = digits.slice(0, -1);
  }

  digits = normalizePhoneDigits(digits);
  if (!digits) return '';

  const nationalNumber = digits.slice(1);
  let result = '+7';

  if (nationalNumber.length > 0) {
    result += ` (${nationalNumber.slice(0, 3)}`;
  }
  if (nationalNumber.length >= 3) {
    result += ')';
  }
  if (nationalNumber.length > 3) {
    result += ` ${nationalNumber.slice(3, 6)}`;
  }
  if (nationalNumber.length > 6) {
    result += `-${nationalNumber.slice(6, 8)}`;
  }
  if (nationalNumber.length > 8) {
    result += `-${nationalNumber.slice(8, 10)}`;
  }

  return result;
}

export function validatePhone(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) {
    return null;
  }
  return 'Введите номер в формате +7 (XXX) XXX-XX-XX';
}

export function validateName(value: string): string | null {
  if (value.trim().length < 2) {
    return 'Введите имя (минимум 2 символа)';
  }
  return null;
}

export function validateDate(value: string): string | null {
  if (!value) return 'Выберите дату';

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return 'Введите корректную дату';

  const [, yearValue, monthValue, dayValue] = match;
  const picked = new Date(
    Number(yearValue),
    Number(monthValue) - 1,
    Number(dayValue)
  );
  if (
    picked.getFullYear() !== Number(yearValue) ||
    picked.getMonth() !== Number(monthValue) - 1 ||
    picked.getDate() !== Number(dayValue)
  ) {
    return 'Введите корректную дату';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  picked.setHours(0, 0, 0, 0);

  if (picked.getTime() < today.getTime()) {
    return 'Дата не может быть раньше сегодняшней';
  }
  return null;
}

export function validateTime(
  value: string,
  occupiedTimeSlots: readonly string[] = []
): string | null {
  if (!TIME_SLOTS.some((slot) => slot === value)) {
    return 'Выберите время из списка';
  }
  if (occupiedTimeSlots.includes(value)) {
    return 'Это время уже занято — выберите другой слот';
  }
  return null;
}

export function validateGuests(value: number): string | null {
  if (!Number.isInteger(value) || value < 1 || value > 12) {
    return 'Количество гостей: от 1 до 12';
  }
  return null;
}

export function validateField(
  field: keyof BookingFormData,
  data: BookingFormData,
  options: ValidationOptions = {}
): string | null {
  switch (field) {
    case 'name':
      return validateName(data.name);
    case 'phone':
      return validatePhone(data.phone);
    case 'date':
      return validateDate(data.date);
    case 'time':
      return validateTime(data.time, options.occupiedTimeSlots);
    case 'guests':
      return validateGuests(data.guests);
    default:
      return null;
  }
}

export function validateForm(
  data: BookingFormData,
  options: ValidationOptions = {}
): FormErrors {
  const errors: FormErrors = {};
  (Object.keys(data) as (keyof BookingFormData)[]).forEach((field) => {
    const error = validateField(field, data, options);
    if (error) errors[field] = error;
  });
  return errors;
}
