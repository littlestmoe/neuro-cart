import Link from "next/link";
import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  accentColor?: boolean;
}

export default function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View All",
  accentColor = false,
}: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        {accentColor && <span className={styles.accent} aria-hidden="true" />}
        <div>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          <h2 className={styles.title}>{title}</h2>
        </div>
      </div>
      {viewAllHref && (
        <Link href={viewAllHref} className={styles.viewAll}>
          {viewAllLabel}
          <span aria-hidden="true">&rarr;</span>
        </Link>
      )}
    </div>
  );
}
