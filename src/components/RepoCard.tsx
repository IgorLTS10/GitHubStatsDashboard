import styles from "./RepoCard.module.css";

interface RepoCardProps {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  languageColor?: string;
  url: string;
  archived: boolean;
}

export default function RepoCard({
  name,
  description,
  stars,
  forks,
  language,
  languageColor,
  url,
  archived,
}: RepoCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`glass-card ${styles.card}`}
      id={`repo-card-${name}`}
    >
      <div className={styles.header}>
        <svg
          className={styles.repoIcon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
        <h3 className={styles.name}>{name}</h3>
        {archived && <span className={styles.badge}>archived</span>}
      </div>

      {description && (
        <p className={styles.description}>{description}</p>
      )}

      <div className={styles.meta}>
        {language && (
          <span className={styles.metaItem}>
            <span
              className={styles.langDot}
              style={{ background: languageColor || "#8b8b9e" }}
            />
            {language}
          </span>
        )}
        <span className={styles.metaItem}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {stars.toLocaleString()}
        </span>
        <span className={styles.metaItem}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="18" r="3" />
            <circle cx="6" cy="6" r="3" />
            <circle cx="18" cy="6" r="3" />
            <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" />
            <path d="M12 12v3" />
          </svg>
          {forks.toLocaleString()}
        </span>
      </div>
    </a>
  );
}
