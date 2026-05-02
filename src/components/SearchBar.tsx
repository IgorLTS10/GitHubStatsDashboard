"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  large?: boolean;
  defaultValue?: string;
}

export default function SearchBar({ large = false, defaultValue = "" }: SearchBarProps) {
  const [username, setUsername] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Reset loading when navigation completes (pathname changes)
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed) {
      setIsLoading(true);
      router.push(`/user/${trimmed}`);
    }
  };

  return (
    <form
      id="search-form"
      className={`${styles.searchForm} ${large ? styles.large : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.inputWrapper}>
        <svg
          className={styles.searchIcon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          id="search-input"
          type="text"
          className={styles.input}
          placeholder="Enter a GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          disabled={isLoading}
        />
      </div>
      <button
        id="search-button"
        type="submit"
        className={`btn-primary ${styles.submitBtn} ${isLoading ? styles.loading : ""}`}
        disabled={!username.trim() || isLoading}
      >
        {isLoading ? (
          <>
            <span className={styles.spinnerBtn} />
            <span>Loading...</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
            <span>Explore</span>
          </>
        )}
      </button>
    </form>
  );
}
