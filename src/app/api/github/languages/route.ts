import { NextRequest, NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers: Record<string, string> = {
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "github-stats-dashboard",
};

if (GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
}

// Official GitHub language colors
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C#": "#178600",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Scala: "#c22d40",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Lua: "#000080",
  R: "#198CE7",
  MATLAB: "#e16737",
  Perl: "#0298c3",
  Haskell: "#5e5086",
  Elixir: "#6e4a7e",
  Clojure: "#db5855",
  Dockerfile: "#384d54",
  Makefile: "#427819",
  Jupyter: "#DA5B0B",
  Nix: "#7e7eff",
  Zig: "#ec915c",
  OCaml: "#3be133",
};

function getLanguageColor(lang: string): string {
  return LANGUAGE_COLORS[lang] || "#8b8b9e";
}

interface GitHubRepo {
  language: string | null;
  fork: boolean;
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
    // Fetch all repos to get language breakdown
    const allRepos: GitHubRepo[] = [];
    let page = 1;
    const perPage = 100;

    while (page <= 3) {
      const res = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}&type=owner`,
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

    // Aggregate languages from the language field on each repo
    const langCount: Record<string, number> = {};
    const ownedRepos = allRepos.filter((r) => !r.fork);

    for (const repo of ownedRepos) {
      if (repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + 1;
      }
    }

    const total = Object.values(langCount).reduce((a, b) => a + b, 0);

    const languages = Object.entries(langCount)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 1000) / 10,
        color: getLanguageColor(name),
      }));

    return NextResponse.json({
      total: ownedRepos.length,
      languages,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
