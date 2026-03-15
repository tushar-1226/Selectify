import { useState, useRef } from "react";
import { useOutletContext } from "react-router";

const BACKEND_URL = "http://localhost:8000";

export const meta = () => ([
  { title: 'Selectify | Profile Settings' },
  { name: 'description', content: 'Manage your Selectify profile' },
]);

interface Resume {
  id: number;
  filename: string;
  file_path: string;
  uploaded_at: string | null;
}

export default function Profile() {
  const { user } = useOutletContext<{ user: { id: string; email: string; name: string | null } }>();

  const [activeTab, setActiveTab] = useState<"profile" | "resumes">("profile");
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Get JWT token from cookie
  function getToken(): string | null {
    const match = document.cookie.match(/token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  // Load profile from backend
  async function loadProfile() {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setName(data.profile.name || "");
          setEmail(data.profile.email || "");
          setBio(data.profile.bio || "");
          setAvatarUrl(data.profile.profile_picture_url || null);
        }
      }
    } catch { /* ignore */ }
  }

  // Load resumes from backend
  async function loadResumes() {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/resumes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(data.resumes || []);
      }
    } catch { /* ignore */ }
  }

  // Load on first render
  if (!loaded) {
    setLoaded(true);
    loadProfile();
    loadResumes();
  }

  // Save profile
  async function handleSave() {
    const token = getToken();
    if (!token) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, bio }),
      });
      if (res.ok) {
        setSaveMsg("Profile updated successfully!");
      } else {
        const err = await res.json();
        setSaveMsg(err.detail || "Failed to update profile");
      }
    } catch {
      setSaveMsg("Network error");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  }

  // Upload avatar
  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = getToken();
    if (!token) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BACKEND_URL}/api/upload-avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setAvatarUrl(data.profile_picture_url);
      }
    } catch { /* ignore */ }
  }

  // Upload resume
  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = getToken();
    if (!token) return;

    setResumeUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BACKEND_URL}/api/resumes`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        await loadResumes();
      }
    } catch { /* ignore */ }
    finally {
      setResumeUploading(false);
    }
  }

  // Delete resume
  async function handleDeleteResume(id: number) {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/resumes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setResumes((prev) => prev.filter((r) => r.id !== id));
      }
    } catch { /* ignore */ }
  }

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : email[0]?.toUpperCase() || "U";

  return (
    <main className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="glass-card p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-500 to-sky-600 flex items-center justify-center text-3xl font-bold text-white ring-4 ring-white/10 overflow-hidden cursor-pointer"
                onClick={() => avatarInputRef.current?.click()}
              >
                {avatarUrl ? (
                  <img
                    src={`${BACKEND_URL}${avatarUrl}`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                onClick={() => avatarInputRef.current?.click()}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>

            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-white">{name || "Your Name"}</h1>
              <p className="text-slate-400 text-sm">{email}</p>
              {bio && <p className="text-slate-500 text-sm mt-1">{bio}</p>}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-800/50 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "profile"
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Profile Settings
          </button>
          <button
            onClick={() => setActiveTab("resumes")}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "resumes"
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            My Resumes
          </button>
        </div>

        {/* Profile Settings Tab */}
        {activeTab === "profile" && (
          <div className="glass-card p-8 animate-in fade-in duration-300">
            <h2 className="text-lg font-semibold text-white mb-6">Edit Profile</h2>
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a bit about yourself..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors resize-none"
                />
              </div>

              {saveMsg && (
                <div className={`rounded-xl px-4 py-3 text-sm ${
                  saveMsg.includes("success")
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}>
                  {saveMsg}
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="primary-button w-full sm:w-auto self-end flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Resumes Tab */}
        {activeTab === "resumes" && (
          <div className="glass-card p-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Your Resumes</h2>
              <button
                onClick={() => resumeInputRef.current?.click()}
                disabled={resumeUploading}
                className="bg-sky-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {resumeUploading ? "Uploading..." : "Upload Resume"}
              </button>
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={handleResumeUpload}
              />
            </div>

            {resumes.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-slate-400 text-sm">No resumes uploaded yet</p>
                <p className="text-slate-500 text-xs mt-1">Upload your resume to get started</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:border-sky-500/30 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{resume.filename}</p>
                      <p className="text-xs text-slate-500">
                        {resume.uploaded_at ? new Date(resume.uploaded_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Recently uploaded"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`${BACKEND_URL}${resume.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-sky-400"
                        title="Download"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </a>
                      <button
                        onClick={() => handleDeleteResume(resume.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-slate-400 hover:text-red-400"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
