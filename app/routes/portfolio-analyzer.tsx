import { useState } from "react";
import { requireAuth } from "~/lib/session.server";
import LoadingSpinner from "~/components/LoadingSpinner";
import type { Route } from "./+types/portfolio-analyzer";

export function meta() {
  return [
    { title: "Selectify | Portfolio Analyzer" },
    { name: "description", content: "Analyze your GitHub portfolio for job relevance" },
  ];
}

export async function loader({ request }: { request: Request }) {
  await requireAuth(request);
  return {};
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
}

interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

export default function PortfolioAnalyzer() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!username.trim()) {
      setError("GitHub username is required");
      return;
    }

    setIsLoading(true);
    setError("");
    setUser(null);
    setRepos([]);

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`),
      ]);

      if (!userRes.ok) {
        setError("User not found. Check the username and try again.");
        setIsLoading(false);
        return;
      }

      const userData = await userRes.json();
      const reposData = await reposRes.json();

      setUser(userData);
      setRepos(reposData);
    } catch {
      setError("Failed to fetch GitHub data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const languageStats = repos.reduce<Record<string, number>>((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  const sortedLanguages = Object.entries(languageStats).sort((a, b) => b[1] - a[1]);
  const totalWithLang = repos.filter((r) => r.language).length;

  const langColors: Record<string, string> = {
    JavaScript: "bg-yellow-400", TypeScript: "bg-blue-400", Python: "bg-green-400",
    Java: "bg-orange-400", Go: "bg-cyan-400", Rust: "bg-red-400",
    "C++": "bg-pink-400", Ruby: "bg-red-500", PHP: "bg-indigo-400",
    Swift: "bg-orange-500", Kotlin: "bg-purple-400", Dart: "bg-sky-400",
  };

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Portfolio Analyzer
        </h1>
        <p className="text-slate-400 text-lg">Evaluate how your GitHub projects align with your target roles.</p>
      </div>

      <div className="glass p-6 rounded-2xl mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
              placeholder="Enter GitHub username (e.g., torvalds)"
            />
          </div>
          <button onClick={handleAnalyze} disabled={isLoading}
            className="bg-sky-500 text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {isLoading ? <><LoadingSpinner size="sm" /> Analyzing...</> : "Analyze"}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center gap-4 py-16">
          <LoadingSpinner size="lg" />
          <p className="text-slate-400">Fetching GitHub profile and repositories...</p>
        </div>
      )}

      {user && (
        <div className="space-y-6">
          <div className="glass p-8 rounded-2xl flex items-center gap-6">
            <img src={user.avatar_url} alt={user.login} className="w-20 h-20 rounded-2xl border-2 border-white/10" />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">{user.name || user.login}</h2>
                <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="text-sky-400 text-sm hover:text-sky-300">@{user.login}</a>
              </div>
              {user.bio && <p className="text-sm text-slate-400 mt-1">{user.bio}</p>}
              <div className="flex gap-6 mt-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{user.public_repos}</p>
                  <p className="text-xs text-slate-500">Repos</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{user.followers}</p>
                  <p className="text-xs text-slate-500">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{user.following}</p>
                  <p className="text-xs text-slate-500">Following</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider mb-4">Language Distribution</h3>
              <div className="space-y-3">
                {sortedLanguages.slice(0, 8).map(([lang, count]) => {
                  const percentage = Math.round((count / totalWithLang) * 100);
                  const color = langColors[lang] || "bg-slate-400";
                  return (
                    <div key={lang}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300 font-medium">{lang}</span>
                        <span className="text-slate-500">{percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider mb-2">Top Repositories</h3>
              {repos.slice(0, 8).map((repo) => (
                <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer"
                  className="glass p-4 rounded-xl flex items-center justify-between hover:bg-white/[0.03] transition-colors block">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-sky-400 truncate">{repo.name}</h4>
                      {repo.language && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <span className={`w-2 h-2 rounded-full ${langColors[repo.language] || "bg-slate-400"}`} />
                          {repo.language}
                        </span>
                      )}
                    </div>
                    {repo.description && <p className="text-xs text-slate-400 truncate">{repo.description}</p>}
                  </div>
                  <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      {repo.forks_count}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
