import { useState } from 'react';
import styles from './BookingForm.module.css';
import { BookingFormData, BookingStatus, FormErrors } from '@/types/booking';
import { TIME_SLOTS, validateField, validateForm } from '@/utils/validation';

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
  const isLoading = status === 'loading';

  function updateField<K extends keyof BookingFormData>(
    field: K,
    value: BookingFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field: keyof BookingFormData) {
    const error = validateField(field, form);
    setErrors((prev) => ({ ...prev, [field]: error ?? undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formErrors = validateForm(form);
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
        />
        {errors.name && <p className={styles.errorText}>{errors.name}</p>}
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
          onChange={(e) => updateField('phone', e.target.value)}
          onBlur={() => handleBlur('phone')}
          disabled={isLoading}
        />
        {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
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
            onChange={(e) => updateField('date', e.target.value)}
            onBlur={() => handleBlur('date')}
            disabled={isLoading}
          />
          {errors.date && <p className={styles.errorText}>{errors.date}</p>}
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
            disabled={isLoading}
          >
            <option value="">Выберите время</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {errors.time && <p className={styles.errorText}>{errors.time}</p>}
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
        />
        {errors.guests && <p className={styles.errorText}>{errors.guests}</p>}
      </div>

      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading && <span className={styles.spinner} />}
        {isLoading ? 'Бронирую...' : 'Забронировать столик'}
      </button>
    </form>
  );
}
