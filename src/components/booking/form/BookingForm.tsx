"use client";

import type { BookingFormData } from "@/types/booking";
import { useBookingForm } from "@/hooks/useBookingForm";

import { BookingFields } from "./BookingFields";
import styles from "./BookingForm.module.css";

interface BookingFormProps {
  today: string;
  isLoading: boolean;
  onSubmit: (data: BookingFormData) => void;
}

export function BookingForm({ today, isLoading, onSubmit }: BookingFormProps) {
  const form = useBookingForm({ today, onSubmit });

  return (
    <div className={styles.content}>
      <header className={styles.heading}>
        <p className={styles.step}>01 / Бронирование</p>
        <h2>Найдём лучший столик</h2>
        <p className={styles.subtitle}>Все поля обязательны</p>
      </header>

      <form className={styles.form} onSubmit={form.handleSubmit} noValidate>
        <BookingFields
          values={form.values}
          errors={form.errors}
          today={today}
          disabled={isLoading}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
        />

        <button
          className={styles.submitButton}
          type="submit"
          disabled={isLoading}
        >
          {isLoading && <span className={styles.spinner} aria-hidden="true" />}
          <span>{isLoading ? "Бронирую..." : "Забронировать столик"}</span>
        </button>
      </form>
    </div>
  );
}
