import type { ChangeEvent } from "react";

import { GUEST_OPTIONS, TIME_SLOTS } from "@/config/booking";
import type {
  BookingErrors,
  BookingField,
  BookingFormData,
} from "@/types/booking";
import { getGuestLabel } from "@/utils/bookingFormat";

import { InputField } from "./InputField";
import { SelectField, type SelectOption } from "./SelectField";

const TIME_OPTIONS: SelectOption[] = TIME_SLOTS.map((time) => ({
  value: time,
  label: time,
}));

const GUEST_SELECT_OPTIONS: SelectOption[] = GUEST_OPTIONS.map((count) => ({
  value: count,
  label: `${count} ${getGuestLabel(count)}`,
}));

interface BookingFieldsProps {
  values: BookingFormData;
  errors: BookingErrors;
  today: string;
  disabled: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onBlur: (field: BookingField) => void;
}

export function BookingFields({
  values,
  errors,
  today,
  disabled,
  onChange,
  onBlur,
}: BookingFieldsProps) {
  return (
    <>
      <InputField
        id="name"
        name="name"
        label="Имя гостя"
        type="text"
        autoComplete="name"
        placeholder="Например, Анна"
        value={values.name}
        error={errors.name}
        disabled={disabled}
        onChange={onChange}
        onBlur={() => onBlur("name")}
        wide
      />

      <InputField
        id="phone"
        name="phone"
        label="Телефон"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+7 (999) 123-45-67"
        value={values.phone}
        error={errors.phone}
        disabled={disabled}
        onChange={onChange}
        onBlur={() => onBlur("phone")}
        wide
      />

      <InputField
        id="date"
        name="date"
        label="Дата"
        type="date"
        min={today || undefined}
        value={values.date}
        error={errors.date}
        disabled={disabled}
        onChange={onChange}
        onBlur={() => onBlur("date")}
      />

      <SelectField
        id="time"
        name="time"
        label="Время"
        value={values.time}
        options={TIME_OPTIONS}
        placeholder="Выберите"
        error={errors.time}
        disabled={disabled}
        onChange={onChange}
        onBlur={() => onBlur("time")}
      />

      <SelectField
        id="guests"
        name="guests"
        label="Количество гостей"
        value={values.guests}
        options={GUEST_SELECT_OPTIONS}
        error={errors.guests}
        hint="Для компании больше 12 гостей позвоните нам"
        disabled={disabled}
        onChange={onChange}
        onBlur={() => onBlur("guests")}
        wide
      />
    </>
  );
}
