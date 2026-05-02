import { NextRequest, NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

function calculateStreaks(weeks: ContributionWeek[]) {
  const days = weeks.flatMap((w) => w.contributionDays).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let bestDay = { date: "", count: 0 };

  // Calculate longest streak and best day
  for (const day of days) {
    if (day.contributionCount > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }

    if (day.contributionCount > bestDay.count) {
      bestDay = { date: day.date, count: day.contributionCount };
    }
  }

  // Calculate current streak (from today backwards)
  const today = new Date().toISOString().split("T")[0];
  const reversedDays = [...days].reverse();
  let startedCounting = false;

  for (const day of reversedDays) {
    if (!startedCounting) {
      // Skip future days and today if no contributions
      if (day.date > today) continue;
      if (day.date === today && day.contributionCount === 0) continue;
      if (day.contributionCount > 0) {
        startedCounting = true;
        currentStreak = 1;
      } else if (day.date < today) {
        // Yesterday had no contributions, streak is 0
        break;
      }
    } else {
      if (day.contributionCount > 0) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { currentStreak, longestStreak, bestDay };
}

function getMonthlyActivity(weeks: ContributionWeek[]) {
  const monthlyMap: Record<string, number> = {};

  for (const week of weeks) {
    for (const day of week.contributionDays) {
      const monthKey = day.date.substring(0, 7); // "2024-01"
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + day.contributionCount;
    }
  }

  return Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, contributions]) => ({
      month,
      label: new Date(month + "-01").toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      contributions,
    }));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username parameter is required" },
      { status: 400 }
    );
  }

  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "GitHub token not configured. Contributions data requires authentication." },
      { status: 503 }
    );
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "github-stats-dashboard",
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch contributions" },
        { status: res.status }
      );
    }

    const json = await res.json();

    if (json.errors) {
      const notFound = json.errors.some(
        (e: { type?: string }) => e.type === "NOT_FOUND"
      );
      if (notFound) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "GraphQL error", details: json.errors },
        { status: 400 }
      );
    }

    const calendar =
      json.data.user.contributionsCollection.contributionCalendar;
    const weeks: ContributionWeek[] = calendar.weeks;
    const streaks = calculateStreaks(weeks);
    const monthlyActivity = getMonthlyActivity(weeks);

    return NextResponse.json({
      totalContributions: calendar.totalContributions,
      weeks,
      currentStreak: streaks.currentStreak,
      longestStreak: streaks.longestStreak,
      bestDay: streaks.bestDay,
      monthlyActivity,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
