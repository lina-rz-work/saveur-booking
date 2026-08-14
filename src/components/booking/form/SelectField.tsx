import type { SelectHTMLAttributes } from "react";

import styles from "./FormControl.module.css";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  id: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  hint?: string;
  wide?: boolean;
}

export function SelectField({
  id,
  label,
  options,
  placeholder,
  error,
  hint,
  wide = false,
  className,
  ...selectProps
}: SelectFieldProps) {
  const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={`${styles.field} ${wide ? styles.wide : ""}`}>
      <label htmlFor={id}>{label}</label>
      <select
        {...selectProps}
        id={id}
        className={`${styles.control} ${error ? styles.invalid : ""} ${className ?? ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={messageId}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={messageId} className={styles.error} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
