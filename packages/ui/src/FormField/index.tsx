import type { ReactNode } from "react";
import styles from "./FormField.module.css";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
}

export default function FormField({
  label,
  error,
  required = false,
  children,
  htmlFor,
}: FormFieldProps) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;

  return (
    <div className={styles.field}>
      <label
        htmlFor={htmlFor}
        className={`${styles.label} ${required ? styles.required : ""}`}
      >
        {label}
      </label>
      {children}
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export const inputClass = styles.input;
export const inputErrorClass = `${styles.input} ${styles.inputError}`;
export const textareaClass = styles.textarea;
