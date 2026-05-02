import { NextRequest, NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers: Record<string, string> = {
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "github-stats-dashboard",
};

if (GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
}

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  created_at: string;
  fork: boolean;
  archived: boolean;
  size: number;
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

  try {
    // Fetch up to 100 repos (paginated)
    const allRepos: GitHubRepo[] = [];
    let page = 1;
    const perPage = 100;

    while (page <= 3) {
      // Max 300 repos
      const res = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated&type=owner`,
        {
          headers,
          next: { revalidate: 300 },
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }
        return NextResponse.json(
          { error: "Failed to fetch repos" },
          { status: res.status }
        );
      }

      const repos: GitHubRepo[] = await res.json();
      allRepos.push(...repos);

      if (repos.length < perPage) break;
      page++;
    }

    // Filter out forks, sort by stars
    const sortedRepos = allRepos
      .filter((repo) => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .map((repo) => ({
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        topics: repo.topics,
        updated_at: repo.updated_at,
        created_at: repo.created_at,
        archived: repo.archived,
        size: repo.size,
      }));

    return NextResponse.json({
      total: sortedRepos.length,
      repos: sortedRepos,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
