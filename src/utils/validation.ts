import { BookingFormData, FormErrors } from '@/types/booking';

export const TIME_SLOTS = [
  '12:00', '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00', '19:00', '20:00', '21:00', '22:00',
];

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

function validateTime(value: string): string | null {
  if (!TIME_SLOTS.includes(value)) {
    return 'Выберите время из списка';
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
      return validateTime(data.time);
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
