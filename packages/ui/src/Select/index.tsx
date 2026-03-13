import type { SelectHTMLAttributes } from "react";
import styles from "./Select.module.css";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export default function Select({
  label,
  error,
  helperText,
  fullWidth = false,
  options,
  placeholder,
  id,
  className,
  ...rest
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const errorId = error ? `${selectId}-error` : undefined;
  const helperId = helperText ? `${selectId}-helper` : undefined;

  return (
    <div
      className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ""} ${className || ""}`}
    >
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`${styles.select} ${error ? styles.selectError : ""}`}
        aria-invalid={!!error}
        aria-describedby={
          [errorId, helperId].filter(Boolean).join(" ") || undefined
        }
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
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
