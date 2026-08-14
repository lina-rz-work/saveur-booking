import type { BookingErrors, BookingFormData } from "@/types/booking";

export function validatePhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 11 && (digits[0] === "7" || digits[0] === "8")) {
    return null;
  }

  return "Введите номер в формате +7XXXXXXXXXX";
}

export function getLocalDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function validateBooking(
  values: BookingFormData,
  today: string,
): BookingErrors {
  const errors: BookingErrors = {};

  if (!values.name.trim()) {
    errors.name = "Укажите имя гостя";
  } else if (values.name.trim().length < 2) {
    errors.name = "Имя должно содержать минимум 2 символа";
  }

  if (!values.phone.trim()) {
    errors.phone = "Укажите номер телефона";
  } else {
    const phoneError = validatePhone(values.phone);
    if (phoneError) errors.phone = phoneError;
  }

  if (!values.date) {
    errors.date = "Выберите дату";
  } else if (today && values.date < today) {
    errors.date = "Дата не может быть раньше сегодняшней";
  }

  if (!values.time) {
    errors.time = "Выберите время";
  }

  if (!Number.isInteger(values.guests) || values.guests < 1 || values.guests > 12) {
    errors.guests = "Выберите от 1 до 12 гостей";
  }

  return errors;
}
