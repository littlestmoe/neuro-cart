import type { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: "none" | "small" | "medium" | "large";
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  hoverable = false,
  padding = "medium",
  onClick,
}: CardProps) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      className={`${styles.card} ${styles[padding]} ${hoverable ? styles.hoverable : ""} ${className || ""}`}
      onClick={onClick}
      {...(onClick ? { type: "button" as const } : {})}
    >
      {children}
    </Tag>
  );
}
