import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p className={styles.text}>
          Built with{" "}
          <span className={styles.heart}>♥</span>{" "}
          using{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Next.js
          </a>
          {" "}&{" "}
          <a
            href="https://recharts.org"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Recharts
          </a>
        </p>
        <p className={styles.subtext}>
          Data from{" "}
          <a
            href="https://docs.github.com/en/rest"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            GitHub API
          </a>
        </p>
      </div>
    </footer>
  );
}
