import styles from "./Spinner.module.css";

interface SpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
  label?: string;
}

export default function Spinner({
  size = "medium",
  className,
  label = "Loading",
}: SpinnerProps) {
  return (
    <div
      className={`${styles.wrapper} ${className || ""}`}
      role="status"
      aria-label={label}
    >
      <div className={`${styles.spinner} ${styles[size]}`} aria-hidden="true" />
      <span className={styles.srOnly}>{label}</span>
    </div>
  );
}
