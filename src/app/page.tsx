import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        {/* Logo */}
        <div className={styles.logoWrapper}>
          <div className={styles.logo}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className={styles.title}>
          GitHub Stats{" "}
          <span className="gradient-text">Dashboard</span>
        </h1>

        <p className={styles.subtitle}>
          Enter any GitHub username to explore a beautiful visual breakdown of their
          coding profile — languages, contributions, repos, and more.
        </p>

        {/* Search */}
        <div className={styles.searchWrapper}>
          <SearchBar large />
        </div>

        {/* Feature badges */}
        <div className={styles.badges}>
          <span className={styles.badge}>📊 Language Breakdown</span>
          <span className={styles.badge}>🔥 Contribution Streaks</span>
          <span className={styles.badge}>⭐ Popular Repos</span>
          <span className={styles.badge}>📈 Activity Timeline</span>
        </div>
      </div>

      <Footer />
    </div>
  );
}
