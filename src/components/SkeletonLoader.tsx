import styles from "./SkeletonLoader.module.css";

interface SkeletonLoaderProps {
  variant?: "card" | "chart" | "heatmap" | "profile";
}

export default function SkeletonLoader({ variant = "card" }: SkeletonLoaderProps) {
  if (variant === "profile") {
    return (
      <div className={styles.profileSkeleton}>
        <div className={`skeleton ${styles.avatar}`} />
        <div className={styles.profileInfo}>
          <div className={`skeleton ${styles.line}`} style={{ width: "60%" }} />
          <div className={`skeleton ${styles.line}`} style={{ width: "40%", height: 12 }} />
          <div className={`skeleton ${styles.line}`} style={{ width: "80%", height: 14 }} />
        </div>
      </div>
    );
  }

  if (variant === "heatmap") {
    return (
      <div className={styles.heatmapSkeleton}>
        <div className={`skeleton ${styles.heatmapBlock}`} />
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div className={styles.chartSkeleton}>
        <div className={`skeleton ${styles.chartBlock}`} />
      </div>
    );
  }

  return (
    <div className={styles.cardSkeleton}>
      <div className={`skeleton ${styles.line}`} style={{ width: "70%" }} />
      <div className={`skeleton ${styles.line}`} style={{ width: "100%", height: 14 }} />
      <div className={`skeleton ${styles.line}`} style={{ width: "50%", height: 14 }} />
    </div>
  );
}
