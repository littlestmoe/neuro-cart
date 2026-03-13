import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export default function Input({
  label,
  error,
  helperText,
  fullWidth = false,
  id,
  className,
  ...rest
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  return (
    <div
      className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ""} ${className || ""}`}
    >
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        aria-invalid={!!error}
        aria-describedby={
          [errorId, helperId].filter(Boolean).join(" ") || undefined
        }
        {...rest}
      />
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={helperId} className={styles.helper}>
          {helperText}
        </span>
      )}
    </div>
  );
}
