import styles from "./RatingStars.module.css";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: "small" | "medium" | "large";
  showValue?: boolean;
  className?: string;
}

export default function RatingStars({
  rating,
  maxRating = 5,
  size = "medium",
  showValue = false,
  className,
}: RatingStarsProps) {
  return (
    <div
      className={`${styles.wrapper} ${styles[size]} ${className || ""}`}
      role="img"
      aria-label={`Rating: ${rating} out of ${maxRating} stars`}
    >
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <span
            key={i}
            className={`${styles.star} ${filled ? styles.filled : ""} ${half ? styles.half : ""}`}
            aria-hidden="true"
          >
            ★
          </span>
        );
      })}
      {showValue && <span className={styles.value}>{rating.toFixed(1)}</span>}
    </div>
  );
}
