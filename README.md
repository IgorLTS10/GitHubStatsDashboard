# 🚀 GitHub Stats Dashboard

<div align="center">

![GitHub Stats Dashboard](https://img.shields.io/badge/GitHub_Stats-Dashboard-8b5cf6?style=for-the-badge&logo=github&logoColor=white)

**Visualize any GitHub developer's profile with beautiful charts and stats.**

Enter a GitHub username → Get an instant visual breakdown of their coding life.

[🌐 **Live Demo**](https://github-stats-dashboard.vercel.app) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

---

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2-22b5bf?style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?style=flat-square&logo=vercel)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 👤 **Profile Overview** | Avatar, bio, location, followers/following, account age |
| 📊 **Language Breakdown** | Interactive donut chart with official GitHub language colors |
| 🔥 **Contribution Heatmap** | GitHub-style contribution calendar with purple/cyan gradient |
| 🏆 **Streak Stats** | Current streak, longest streak, best day, total contributions |
| 📈 **Activity Timeline** | Beautiful area chart showing monthly contribution trends |
| ⭐ **Popular Repos** | Top repositories sorted by stars with language badges |
| 🌙 **Dark Mode** | Premium glassmorphism dark design with animated background |
| 📱 **Fully Responsive** | Looks amazing on desktop, tablet, and mobile |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, TypeScript)
- **Charts**: [Recharts](https://recharts.org/) — Composable React charting library
- **API**: [GitHub REST API](https://docs.github.com/en/rest) + [GraphQL API](https://docs.github.com/en/graphql)
- **Styling**: CSS Modules + CSS Custom Properties (no framework needed)
- **Font**: [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- A [GitHub Personal Access Token](https://github.com/settings/tokens) (free, takes 2 minutes)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/GitHubStatsDashboard.git
cd GitHubStatsDashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your GitHub token:

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **💡 How to create a GitHub token:**
> 1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
> 2. Click **"Generate new token (classic)"**
> 3. Select scope: **`read:user`** (that's all you need)
> 4. Copy the token and paste it in `.env.local`

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

---

## 🌐 Deployment (Vercel)

The easiest way to deploy this app:

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add the environment variable:
   - **Name**: `GITHUB_TOKEN`
   - **Value**: your GitHub Personal Access Token
5. Click **Deploy** ✨

> The app will be live at `https://your-project.vercel.app`

---

## 📡 API Endpoints

The app uses server-side API routes to keep your GitHub token secure.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/github/user?username=xxx` | GET | User profile data |
| `/api/github/repos?username=xxx` | GET | Repositories (sorted by ⭐) |
| `/api/github/languages?username=xxx` | GET | Language breakdown |
| `/api/github/contributions?username=xxx` | GET | Contribution calendar + streaks |

All endpoints cache data for 5 minutes to respect GitHub API rate limits.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/github/        # Server-side API routes
│   │   ├── user/           
│   │   ├── repos/          
│   │   ├── languages/      
│   │   └── contributions/  
│   ├── user/[username]/   # Dashboard page
│   ├── layout.tsx         # Root layout + metadata
│   ├── page.tsx           # Landing page
│   └── globals.css        # Design system
├── components/
│   ├── SearchBar.tsx      # Search input
│   ├── StatCard.tsx       # Stat metric card
│   ├── ContributionHeatmap.tsx
│   ├── LanguageChart.tsx  # Donut chart (Recharts)
│   ├── ActivityChart.tsx  # Area chart (Recharts)
│   ├── RepoCard.tsx       # Repository card
│   ├── SkeletonLoader.tsx # Loading skeletons
│   └── Footer.tsx
```

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

<div align="center">

Built with ♥ by **[Your Name](https://github.com/YOUR_USERNAME)**

</div>