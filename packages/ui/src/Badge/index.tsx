import type { ReactNode } from "react";
import styles from "./Badge.module.css";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "small" | "medium";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  size = "small",
  className,
}: BadgeProps) {
  return (
    <span
      className={`${styles.badge} ${styles[variant]} ${styles[size]} ${className || ""}`}
    >
      {children}
    </span>
  );
}
