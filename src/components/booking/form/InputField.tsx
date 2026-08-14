import type { InputHTMLAttributes } from "react";

import styles from "./FormControl.module.css";

interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  wide?: boolean;
}

export function InputField({
  id,
  label,
  error,
  hint,
  wide = false,
  className,
  ...inputProps
}: InputFieldProps) {
  const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={`${styles.field} ${wide ? styles.wide : ""}`}>
      <label htmlFor={id}>{label}</label>
      <input
        {...inputProps}
        id={id}
        className={`${styles.control} ${error ? styles.invalid : ""} ${className ?? ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={messageId}
      />
      <FieldMessage id={messageId} error={error} hint={hint} />
    </div>
  );
}

interface FieldMessageProps {
  id?: string;
  error?: string;
  hint?: string;
}

function FieldMessage({ id, error, hint }: FieldMessageProps) {
  if (error) {
    return (
      <p id={id} className={styles.error} role="alert">
        {error}
      </p>
    );
  }

  return hint ? (
    <p id={id} className={styles.hint}>
      {hint}
    </p>
  ) : null;
}
