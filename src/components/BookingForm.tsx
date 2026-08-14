"use client";

import { ChangeEvent, FormEvent, useState } from "react";

import type {
  BookingErrors,
  BookingField,
  BookingFormData,
} from "@/types/booking";
import { validateBooking } from "@/utils/bookingValidation";

import styles from "./Booking.module.css";

const TIME_SLOTS = Array.from({ length: 11 }, (_, index) => `${index + 12}:00`);
const GUEST_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);

const INITIAL_VALUES: BookingFormData = {
  name: "",
  phone: "",
  date: "",
  time: "",
  guests: 2,
};

interface BookingFormProps {
  today: string;
  isLoading: boolean;
  onSubmit: (data: BookingFormData) => void;
}

export function BookingForm({ today, isLoading, onSubmit }: BookingFormProps) {
  const [values, setValues] = useState<BookingFormData>(INITIAL_VALUES);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [touched, setTouched] = useState<Partial<Record<BookingField, boolean>>>({});

  function updateField(field: BookingField, value: string | number) {
    const nextValues = { ...values, [field]: value } as BookingFormData;
    setValues(nextValues);

    if (touched[field] || errors[field]) {
      const nextErrors = validateBooking(nextValues, today);
      setErrors((current) => ({ ...current, [field]: nextErrors[field] }));
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    const field = name as BookingField;
    updateField(field, field === "guests" ? Number(value) : value);
  }

  function handleBlur(field: BookingField) {
    setTouched((current) => ({ ...current, [field]: true }));
    const nextErrors = validateBooking(values, today);
    setErrors((current) => ({ ...current, [field]: nextErrors[field] }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateBooking(values, today);
    setErrors(nextErrors);
    setTouched({ name: true, phone: true, date: true, time: true, guests: true });

    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({ ...values, name: values.name.trim(), phone: values.phone.trim() });
  }

  function fieldClass(field: BookingField) {
    return `${styles.control} ${errors[field] ? styles.controlError : ""}`;
  }

  return (
    <div className={styles.cardContent}>
      <div className={styles.cardHeading}>
        <p className={styles.step}>01 / Бронирование</p>
        <h2>Найдём лучший столик</h2>
        <p>Все поля обязательны</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={`${styles.field} ${styles.fieldWide}`}>
          <label htmlFor="name">Имя гостя</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Например, Анна"
            value={values.name}
            onChange={handleInputChange}
            onBlur={() => handleBlur("name")}
            className={fieldClass("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            disabled={isLoading}
          />
          {errors.name && (
            <p id="name-error" className={styles.error} role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className={`${styles.field} ${styles.fieldWide}`}>
          <label htmlFor="phone">Телефон</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 (999) 123-45-67"
            value={values.phone}
            onChange={handleInputChange}
            onBlur={() => handleBlur("phone")}
            className={fieldClass("phone")}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            disabled={isLoading}
          />
          {errors.phone && (
            <p id="phone-error" className={styles.error} role="alert">
              {errors.phone}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="date">Дата</label>
          <input
            id="date"
            name="date"
            type="date"
            min={today || undefined}
            value={values.date}
            onChange={handleInputChange}
            onBlur={() => handleBlur("date")}
            className={fieldClass("date")}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? "date-error" : undefined}
            disabled={isLoading}
          />
          {errors.date && (
            <p id="date-error" className={styles.error} role="alert">
              {errors.date}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="time">Время</label>
          <select
            id="time"
            name="time"
            value={values.time}
            onChange={handleInputChange}
            onBlur={() => handleBlur("time")}
            className={fieldClass("time")}
            aria-invalid={Boolean(errors.time)}
            aria-describedby={errors.time ? "time-error" : undefined}
            disabled={isLoading}
          >
            <option value="">Выберите</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {errors.time && (
            <p id="time-error" className={styles.error} role="alert">
              {errors.time}
            </p>
          )}
        </div>

        <div className={`${styles.field} ${styles.fieldWide}`}>
          <label htmlFor="guests">Количество гостей</label>
          <select
            id="guests"
            name="guests"
            value={values.guests}
            onChange={handleInputChange}
            onBlur={() => handleBlur("guests")}
            className={fieldClass("guests")}
            aria-invalid={Boolean(errors.guests)}
            aria-describedby={errors.guests ? "guests-error" : "guests-hint"}
            disabled={isLoading}
          >
            {GUEST_OPTIONS.map((guestCount) => (
              <option key={guestCount} value={guestCount}>
                {guestCount} {getGuestLabel(guestCount)}
              </option>
            ))}
          </select>
          {errors.guests ? (
            <p id="guests-error" className={styles.error} role="alert">
              {errors.guests}
            </p>
          ) : (
            <p id="guests-hint" className={styles.hint}>
              Для компании больше 12 гостей позвоните нам
            </p>
          )}
        </div>

        <button className={styles.submitButton} type="submit" disabled={isLoading}>
          {isLoading && <span className={styles.spinner} aria-hidden="true" />}
          <span>{isLoading ? "Бронирую..." : "Забронировать столик"}</span>
        </button>
      </form>
    </div>
  );
}

function getGuestLabel(count: number) {
  if (count === 1) return "гость";
  if (count >= 2 && count <= 4) return "гостя";
  return "гостей";
}
