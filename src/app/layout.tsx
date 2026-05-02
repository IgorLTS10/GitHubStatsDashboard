import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHub Stats Dashboard — Visualize Any Developer's Profile",
  description:
    "Enter any GitHub username to get a beautiful visual breakdown of their coding stats: languages, contributions, popular repos, streaks, and more.",
  keywords: ["GitHub", "stats", "dashboard", "developer", "contributions", "languages", "profile"],
  openGraph: {
    title: "GitHub Stats Dashboard",
    description: "Visualize any GitHub developer's profile with beautiful charts and stats.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Animated background */}
        <div className="bg-grid" aria-hidden="true" />
        <div className="bg-glow bg-glow--purple" aria-hidden="true" />
        <div className="bg-glow bg-glow--cyan" aria-hidden="true" />

        {/* Main content */}
        <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
      </body>
    </html>
  );
}
