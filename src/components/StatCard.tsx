import styles from "./StatCard.module.css";

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  gradient?: "purple" | "cyan" | "pink" | "green" | "orange";
}

export default function StatCard({
  icon,
  value,
  label,
  gradient = "purple",
}: StatCardProps) {
  return (
    <div className={`glass-card ${styles.card}`}>
      <div className={`${styles.iconWrapper} ${styles[gradient]}`}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <div className={styles.content}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
}
