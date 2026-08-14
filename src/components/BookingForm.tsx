import { useMemo, useState } from 'react';
import styles from './BookingForm.module.css';
import { BookingFormData, BookingStatus, FormErrors } from '@/types/booking';
import { getOccupiedTimeSlots, TIME_SLOTS } from '@/utils/availability';
import {
  formatPhone,
  validateField,
  validateForm,
} from '@/utils/validation';

const EMPTY_FORM: BookingFormData = {
  name: '',
  phone: '',
  date: '',
  time: '',
  guests: 2,
};

interface BookingFormProps {
  status: BookingStatus;
  onSubmit: (data: BookingFormData) => void;
}

export default function BookingForm({ status, onSubmit }: BookingFormProps) {
  const [form, setForm] = useState<BookingFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  const today = new Date().toISOString().split('T')[0];
  const isLoading = status !== 'idle';
  const occupiedTimeSlots = useMemo(
    () => getOccupiedTimeSlots(form.date),
    [form.date]
  );

  function updateField<K extends keyof BookingFormData>(
    field: K,
    value: BookingFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleDateChange(value: string) {
    const nextOccupiedTimeSlots = getOccupiedTimeSlots(value);
    setForm((prev) => ({
      ...prev,
      date: value,
      time: nextOccupiedTimeSlots.some((slot) => slot === prev.time)
        ? ''
        : prev.time,
    }));
    setErrors((prev) => ({ ...prev, date: undefined, time: undefined }));
  }

  function handleBlur(field: keyof BookingFormData) {
    const error = validateField(field, form, { occupiedTimeSlots });
    setErrors((prev) => ({ ...prev, [field]: error ?? undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formErrors = validateForm(form, { occupiedTimeSlots });
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      onSubmit(form);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="name">
          Имя гостя
        </label>
        <input
          id="name"
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          type="text"
          placeholder="Иван Иванов"
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          disabled={isLoading}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className={styles.errorText}>
            {errors.name}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="phone">
          Номер телефона
        </label>
        <input
          id="phone"
          className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
          type="tel"
          placeholder="+7 (___) ___-__-__"
          value={form.phone}
          onChange={(e) =>
            updateField('phone', formatPhone(e.target.value, form.phone))
          }
          onBlur={() => handleBlur('phone')}
          disabled={isLoading}
          inputMode="tel"
          autoComplete="tel"
          maxLength={18}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className={styles.errorText}>
            {errors.phone}
          </p>
        )}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="date">
            Дата
          </label>
          <input
            id="date"
            className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
            type="date"
            min={today}
            value={form.date}
            onChange={(e) => handleDateChange(e.target.value)}
            onBlur={() => handleBlur('date')}
            disabled={isLoading}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? 'date-error' : undefined}
          />
          {errors.date && (
            <p id="date-error" className={styles.errorText}>
              {errors.date}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="time">
            Время
          </label>
          <select
            id="time"
            className={`${styles.select} ${errors.time ? styles.inputError : ''}`}
            value={form.time}
            onChange={(e) => updateField('time', e.target.value)}
            onBlur={() => handleBlur('time')}
            disabled={isLoading || !form.date}
            aria-invalid={Boolean(errors.time)}
            aria-describedby={
              errors.time ? 'time-error' : form.date ? 'time-hint' : undefined
            }
          >
            <option value="">
              {form.date ? 'Выберите время' : 'Сначала выберите дату'}
            </option>
            {TIME_SLOTS.map((slot) => (
              <option
                key={slot}
                value={slot}
                disabled={occupiedTimeSlots.includes(slot)}
              >
                {slot}{occupiedTimeSlots.includes(slot) ? ' — занято' : ''}
              </option>
            ))}
          </select>
          {errors.time ? (
            <p id="time-error" className={styles.errorText}>
              {errors.time}
            </p>
          ) : (
            form.date && (
              <p id="time-hint" className={styles.hintText}>
                Занятые интервалы недоступны для выбора
              </p>
            )
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="guests">
          Количество гостей
        </label>
        <input
          id="guests"
          className={`${styles.input} ${errors.guests ? styles.inputError : ''}`}
          type="number"
          min={1}
          max={12}
          value={form.guests}
          onChange={(e) => updateField('guests', Number(e.target.value))}
          onBlur={() => handleBlur('guests')}
          disabled={isLoading}
          aria-invalid={Boolean(errors.guests)}
          aria-describedby={errors.guests ? 'guests-error' : undefined}
        />
        {errors.guests && (
          <p id="guests-error" className={styles.errorText}>
            {errors.guests}
          </p>
        )}
      </div>

      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading && <span className={styles.spinner} />}
        {isLoading ? 'Бронирую...' : 'Забронировать столик'}
      </button>
    </form>
  );
}
