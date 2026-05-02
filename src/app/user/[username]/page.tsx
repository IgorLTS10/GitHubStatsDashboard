"use client";

import { useEffect, useState, use } from "react";
import dynamic from "next/dynamic";
import SearchBar from "@/components/SearchBar";
import ContributionHeatmap from "@/components/ContributionHeatmap";
import RepoCard from "@/components/RepoCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import styles from "./page.module.css";

// Dynamic imports for chart components (client-only, no SSR)
const LanguageChart = dynamic(() => import("@/components/LanguageChart"), {
  ssr: false,
  loading: () => <SkeletonLoader variant="chart" />,
});

const ActivityChart = dynamic(() => import("@/components/ActivityChart"), {
  ssr: false,
  loading: () => <SkeletonLoader variant="chart" />,
});

interface UserData {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  company: string;
  location: string;
  blog: string;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

interface Repo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  created_at: string;
  archived: boolean;
  size: number;
}

interface Language {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface MonthlyData {
  month: string;
  label: string;
  contributions: number;
}

interface ContributionsData {
  totalContributions: number;
  weeks: ContributionWeek[];
  currentStreak: number;
  longestStreak: number;
  bestDay: { date: string; count: number };
  monthlyActivity: MonthlyData[];
}

function getAccountAge(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const years = now.getFullYear() - created.getFullYear();
  const months = now.getMonth() - created.getMonth();
  const totalMonths = years * 12 + months;
  if (totalMonths < 12) return `${totalMonths}mo`;
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  return m > 0 ? `${y}y ${m}m` : `${y}y`;
}

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export default function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);

  const [user, setUser] = useState<UserData | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [contributions, setContributions] = useState<ContributionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derived stats
  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks, 0);
  const topRepo = repos.length > 0 ? repos[0] : null;
  const topLanguage = languages.length > 0 ? languages[0] : null;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const [userRes, reposRes, langRes, contribRes] = await Promise.allSettled([
          fetch(`/api/github/user?username=${username}`),
          fetch(`/api/github/repos?username=${username}`),
          fetch(`/api/github/languages?username=${username}`),
          fetch(`/api/github/contributions?username=${username}`),
        ]);

        if (userRes.status === "fulfilled" && userRes.value.ok) {
          setUser(await userRes.value.json());
        } else {
          setError("User not found. Please check the username.");
          setLoading(false);
          return;
        }

        if (reposRes.status === "fulfilled" && reposRes.value.ok) {
          const data = await reposRes.value.json();
          setRepos(data.repos);
        }

        if (langRes.status === "fulfilled" && langRes.value.ok) {
          const data = await langRes.value.json();
          setLanguages(data.languages);
        }

        if (contribRes.status === "fulfilled" && contribRes.value.ok) {
          setContributions(await contribRes.value.json());
        }
      } catch {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [username]);

  // Error state
  if (error) {
    return (
      <div className={styles.page}>
        <nav className={styles.nav}>
          <a href="/" className={styles.navLogo}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span className="gradient-text">GH Stats</span>
          </a>
          <SearchBar defaultValue={username} />
        </nav>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>😵</div>
          <h2 className={styles.errorTitle}>Oops!</h2>
          <p className={styles.errorMessage}>{error}</p>
          <a href="/" className="btn-primary">Back to Home</a>
        </div>
      </div>
    );
  }

  // Loading state is handled by loading.tsx — but also show skeletons for data
  if (loading) {
    return (
      <div className={styles.page}>
        <nav className={styles.nav}>
          <a href="/" className={styles.navLogo}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span className="gradient-text">GH Stats</span>
          </a>
          <SearchBar defaultValue={username} />
        </nav>
        <div className={styles.dashboard}>
          <div className={styles.topRow}>
            <div className={`glass-card ${styles.profileCard}`}>
              <SkeletonLoader variant="profile" />
            </div>
            <div className={styles.miniStatsGrid}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`glass-card ${styles.miniStat}`}>
                  <SkeletonLoader />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <a href="/" className={styles.navLogo}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          <span className="gradient-text">GH Stats</span>
        </a>
        <SearchBar defaultValue={username} />
      </nav>

      {/* ========== BENTO DASHBOARD ========== */}
      <div className={styles.dashboard}>

        {/* ROW 1: Profile + Mini Stats */}
        {user && (
          <div className={`${styles.topRow} fade-in-up`}>
            {/* Profile Card */}
            <div className={`glass-card ${styles.profileCard}`}>
              <div className={styles.avatarWrapper}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatar_url}
                  alt={`${user.login}'s avatar`}
                  className={styles.avatar}
                  width={80}
                  height={80}
                />
                <div className={styles.avatarGlow} />
              </div>
              <div className={styles.profileInfo}>
                <h1 className={styles.profileName}>{user.name || user.login}</h1>
                <a href={user.html_url} target="_blank" rel="noopener noreferrer" className={styles.profileLogin}>
                  @{user.login}
                </a>
                {user.bio && <p className={styles.profileBio}>{user.bio}</p>}
                <div className={styles.profileMeta}>
                  {user.location && <span className={styles.metaTag}>📍 {user.location}</span>}
                  {user.company && <span className={styles.metaTag}>🏢 {user.company}</span>}
                </div>
              </div>
            </div>

            {/* Mini Stats Grid */}
            <div className={styles.miniStatsGrid}>
              <div className={`glass-card ${styles.miniStat}`}>
                <span className={styles.miniIcon}>📦</span>
                <span className={styles.miniValue}>{user.public_repos}</span>
                <span className={styles.miniLabel}>Repos</span>
              </div>
              <div className={`glass-card ${styles.miniStat}`}>
                <span className={styles.miniIcon}>⭐</span>
                <span className={styles.miniValue}>{formatNumber(totalStars)}</span>
                <span className={styles.miniLabel}>Total Stars</span>
              </div>
              <div className={`glass-card ${styles.miniStat}`}>
                <span className={styles.miniIcon}>👥</span>
                <span className={styles.miniValue}>{formatNumber(user.followers)}</span>
                <span className={styles.miniLabel}>Followers</span>
              </div>
              <div className={`glass-card ${styles.miniStat}`}>
                <span className={styles.miniIcon}>🍴</span>
                <span className={styles.miniValue}>{formatNumber(totalForks)}</span>
                <span className={styles.miniLabel}>Total Forks</span>
              </div>
              {contributions && (
                <>
                  <div className={`glass-card ${styles.miniStat}`}>
                    <span className={styles.miniIcon}>📊</span>
                    <span className={styles.miniValue}>{formatNumber(contributions.totalContributions)}</span>
                    <span className={styles.miniLabel}>Contributions</span>
                  </div>
                  <div className={`glass-card ${styles.miniStat}`}>
                    <span className={styles.miniIcon}>🔥</span>
                    <span className={styles.miniValue}>{contributions.currentStreak}d</span>
                    <span className={styles.miniLabel}>Current Streak</span>
                  </div>
                  <div className={`glass-card ${styles.miniStat}`}>
                    <span className={styles.miniIcon}>🏆</span>
                    <span className={styles.miniValue}>{contributions.longestStreak}d</span>
                    <span className={styles.miniLabel}>Longest Streak</span>
                  </div>
                </>
              )}
              <div className={`glass-card ${styles.miniStat}`}>
                <span className={styles.miniIcon}>⏳</span>
                <span className={styles.miniValue}>{getAccountAge(user.created_at)}</span>
                <span className={styles.miniLabel}>Account Age</span>
              </div>
              {topLanguage && (
                <div className={`glass-card ${styles.miniStat}`}>
                  <span className={styles.miniIcon} style={{ color: topLanguage.color }}>●</span>
                  <span className={styles.miniValue}>{topLanguage.name}</span>
                  <span className={styles.miniLabel}>Top Language</span>
                </div>
              )}
              {topRepo && (
                <div className={`glass-card ${styles.miniStat}`}>
                  <span className={styles.miniIcon}>🌟</span>
                  <span className={styles.miniValue} title={topRepo.name}>
                    {topRepo.stars}★
                  </span>
                  <span className={styles.miniLabel} title={topRepo.name}>Top Repo</span>
                </div>
              )}
              {contributions && (
                <div className={`glass-card ${styles.miniStat}`}>
                  <span className={styles.miniIcon}>💥</span>
                  <span className={styles.miniValue}>{contributions.bestDay.count}</span>
                  <span className={styles.miniLabel}>Best Day</span>
                </div>
              )}
              <div className={`glass-card ${styles.miniStat}`}>
                <span className={styles.miniIcon}>👤</span>
                <span className={styles.miniValue}>{formatNumber(user.following)}</span>
                <span className={styles.miniLabel}>Following</span>
              </div>
            </div>
          </div>
        )}

        {/* ROW 2: Heatmap (full width) */}
        {contributions && (
          <div className={`glass-card ${styles.heatmapCard} fade-in-up`}>
            <h2 className={styles.sectionTitle}>
              <span>🔥</span> Contribution Calendar
            </h2>
            <ContributionHeatmap weeks={contributions.weeks} />
          </div>
        )}

        {/* ROW 3: Languages + Activity Chart side by side */}
        <div className={`${styles.chartsRow} fade-in-up`}>
          {languages.length > 0 && (
            <div className={`glass-card ${styles.chartPanel}`}>
              <h2 className={styles.sectionTitle}>
                <span>💻</span> Languages
              </h2>
              <LanguageChart languages={languages} />
            </div>
          )}

          {contributions && contributions.monthlyActivity.length > 0 && (
            <div className={`glass-card ${styles.chartPanel}`}>
              <h2 className={styles.sectionTitle}>
                <span>📈</span> Activity
              </h2>
              <ActivityChart data={contributions.monthlyActivity} />
            </div>
          )}
        </div>

        {/* ROW 4: Top Repos */}
        {repos.length > 0 && (
          <div className="fade-in-up">
            <h2 className={styles.sectionTitle}>
              <span>⭐</span> Top Repositories
              <span className={styles.badge}>{repos.length}</span>
            </h2>
            <div className={styles.repoGrid}>
              {repos.slice(0, 6).map((repo) => {
                const langColor = languages.find((l) => l.name === repo.language)?.color;
                return (
                  <RepoCard
                    key={repo.name}
                    name={repo.name}
                    description={repo.description}
                    stars={repo.stars}
                    forks={repo.forks}
                    language={repo.language}
                    languageColor={langColor}
                    url={repo.html_url}
                    archived={repo.archived}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Compact footer */}
      <footer className={styles.footer}>
        <span>
          Built with <span style={{ color: "var(--accent-pink)" }}>♥</span> using{" "}
          <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js</a> &{" "}
          <a href="https://recharts.org" target="_blank" rel="noopener noreferrer">Recharts</a>
          {" "}· Data from <a href="https://docs.github.com/en/rest" target="_blank" rel="noopener noreferrer">GitHub API</a>
        </span>
      </footer>
    </div>
  );
}
