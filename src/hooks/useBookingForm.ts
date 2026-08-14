"use client";

import { ChangeEvent, FormEvent, useState } from "react";

import { INITIAL_BOOKING } from "@/config/booking";
import type {
  BookingErrors,
  BookingField,
  BookingFormData,
} from "@/types/booking";
import { validateBooking } from "@/utils/bookingValidation";

interface UseBookingFormOptions {
  today: string;
  onSubmit: (data: BookingFormData) => void;
}

const ALL_FIELDS_TOUCHED: Record<BookingField, boolean> = {
  name: true,
  phone: true,
  date: true,
  time: true,
  guests: true,
};

export function useBookingForm({ today, onSubmit }: UseBookingFormOptions) {
  const [values, setValues] = useState<BookingFormData>(INITIAL_BOOKING);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<BookingField, boolean>>
  >({});

  function updateField(field: BookingField, value: string | number) {
    const nextValues = { ...values, [field]: value } as BookingFormData;
    setValues(nextValues);

    if (touched[field] || errors[field]) {
      const nextErrors = validateBooking(nextValues, today);
      setErrors((current) => ({
        ...current,
        [field]: nextErrors[field],
      }));
    }
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    const field = name as BookingField;

    updateField(field, field === "guests" ? Number(value) : value);
  }

  function handleBlur(field: BookingField) {
    setTouched((current) => ({ ...current, [field]: true }));

    const nextErrors = validateBooking(values, today);
    setErrors((current) => ({
      ...current,
      [field]: nextErrors[field],
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateBooking(values, today);
    setErrors(nextErrors);
    setTouched(ALL_FIELDS_TOUCHED);

    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      ...values,
      name: values.name.trim(),
      phone: values.phone.trim(),
    });
  }

  return {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
