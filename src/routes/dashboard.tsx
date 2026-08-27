import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import {
  getPrograms,
  savePrograms,
  getArticles,
  saveArticles,
  getSpotlights,
  saveSpotlights,
  getUserSubmissions,
  deleteUserSubmission,
  clearAllUserSubmissions,
  type ProgramEvent,
  type ArticleItem,
  type SpotlightEntry,
  type UserSubmission,
} from "@/lib/cms-store";
import {
  User,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  BookOpen,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  Lock,
  Download,
  Database,
  Mail,
  FileSpreadsheet,
  RefreshCw,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Student Dashboard & Admin Portal — Project Polaris" },
      {
        name: "description",
        content:
          "Student workspace and admin dynamic CMS management for Project Polaris programs, articles, and spotlight features.",
      },
      { property: "og:title", content: "Student Dashboard & Admin Portal — Project Polaris" },
      { property: "og:url", content: "https://projectpolaris.in/dashboard" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://projectpolaris.in/dashboard" }],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"student" | "admin">("student");
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState("");
  const [adminError, setAdminError] = useState("");

  // CMS State
  const [programs, setProgramsState] = useState<ProgramEvent[]>(getPrograms());
  const [articles, setArticlesState] = useState<ArticleItem[]>(getArticles());
  const [spotlights, setSpotlightsState] = useState<SpotlightEntry[]>(getSpotlights());
  const [submissions, setSubmissionsState] = useState<UserSubmission[]>(getUserSubmissions());
  const [activeCmsSection, setActiveCmsSection] = useState<"programs" | "articles" | "spotlight" | "submissions">("programs");
  const [submissionFilter, setSubmissionFilter] = useState<string>("all");
  const [submissionSearch, setSubmissionSearch] = useState<string>("");
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // New Program Form State
  const [newProgram, setNewProgram] = useState<Partial<ProgramEvent>>({
    title: "",
    subtitle: "",
    category: "workshop",
    status: "upcoming",
    date: "",
    time: "6:00 PM IST",
    mode: "Online",
    details: "",
    ctaText: "Register Now →",
    ctaUrl: "https://forms.gle/",
    price: "Free",
    featured: false,
    visibility: true,
  });

  // New Article Form State
  const [newArticle, setNewArticle] = useState<Partial<ArticleItem>>({
    title: "",
    category: "Science & Astronomy",
    excerpt: "",
    content: "",
    author: { name: "Polaris Student Lead", role: "Contributor" },
    readTime: "5 min read",
    featured: false,
  });

  // New Spotlight Form State
  const [newSpotlight, setNewSpotlight] = useState<Partial<SpotlightEntry>>({
    name: "",
    category: "Student Spotlight",
    headline: "",
    story: "",
    accomplishment: "",
    featured: false,
    date: "August 2026",
  });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === "polaris2026" || adminPasscode === "admin" || adminPasscode === "polaris") {
      setAdminAuthenticated(true);
      setAdminError("");
    } else {
      setAdminError("Invalid admin access key. (Hint: 'polaris2026' or 'admin')");
    }
  };

  // Add Program Action
  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgram.title) return;
    const prog: ProgramEvent = {
      id: `prog-${Date.now()}`,
      title: newProgram.title || "New Program",
      subtitle: newProgram.subtitle || "",
      category: newProgram.category as any || "workshop",
      status: newProgram.status as any || "upcoming",
      date: newProgram.date || "Upcoming 2026",
      time: newProgram.time,
      mode: (newProgram.mode as any) || "Online",
      details: newProgram.details || "",
      benefits: ["Interactive Session", "Certificate of Participation"],
      ctaText: newProgram.ctaText || "Register Now →",
      ctaUrl: newProgram.ctaUrl || "#",
      price: newProgram.price || "Free",
      featured: Boolean(newProgram.featured),
      visibility: true,
    };
    const updated = [prog, ...programs];
    setProgramsState(updated);
    savePrograms(updated);
    setStatusFeedback("✓ Program created successfully and live across the website!");
    setTimeout(() => setStatusFeedback(null), 4000);
  };

  // Delete Program Action
  const handleDeleteProgram = (id: string) => {
    const updated = programs.filter((p) => p.id !== id);
    setProgramsState(updated);
    savePrograms(updated);
    setStatusFeedback("✓ Program removed.");
    setTimeout(() => setStatusFeedback(null), 3000);
  };

  // Add Article Action
  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title) return;
    const art: ArticleItem = {
      id: `art-${Date.now()}`,
      title: newArticle.title || "Untitled Article",
      slug: (newArticle.title || "article").toLowerCase().replace(/\s+/g, "-"),
      author: newArticle.author || { name: "Polaris Student", role: "Contributor" },
      category: (newArticle.category as any) || "Science & Astronomy",
      publishedAt: new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }),
      readTime: newArticle.readTime || "4 min read",
      excerpt: newArticle.excerpt || "",
      content: newArticle.content || "",
      featured: Boolean(newArticle.featured),
    };
    const updated = [art, ...articles];
    setArticlesState(updated);
    saveArticles(updated);
    setStatusFeedback("✓ Article published and live on the Articles page!");
    setTimeout(() => setStatusFeedback(null), 4000);
  };

  // Delete Article Action
  const handleDeleteArticle = (id: string) => {
    const updated = articles.filter((a) => a.id !== id);
    setArticlesState(updated);
    saveArticles(updated);
    setStatusFeedback("✓ Article removed.");
    setTimeout(() => setStatusFeedback(null), 3000);
  };

  // Add Spotlight Action
  const handleAddSpotlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpotlight.name) return;
    const spot: SpotlightEntry = {
      id: `spot-${Date.now()}`,
      name: newSpotlight.name || "Featured Builder",
      category: (newSpotlight.category as any) || "Student Spotlight",
      headline: newSpotlight.headline || "",
      story: newSpotlight.story || "",
      accomplishment: newSpotlight.accomplishment || "",
      image: "/polaris-logo.png",
      featured: Boolean(newSpotlight.featured),
      date: newSpotlight.date || "August 2026",
    };
    const updated = [spot, ...spotlights];
    setSpotlightsState(updated);
    saveSpotlights(updated);
    setStatusFeedback("✓ Spotlight feature created and live on the Spotlight page!");
    setTimeout(() => setStatusFeedback(null), 4000);
  };

  // Delete Spotlight Action
  const handleDeleteSpotlight = (id: string) => {
    const updated = spotlights.filter((s) => s.id !== id);
    setSpotlightsState(updated);
    saveSpotlights(updated);
    setStatusFeedback("✓ Spotlight removed.");
    setTimeout(() => setStatusFeedback(null), 3000);
  };

  // Submissions Handlers
  const handleDeleteSubmission = (id: string) => {
    const updated = deleteUserSubmission(id);
    setSubmissionsState(updated);
    setStatusFeedback("✓ User submission removed.");
    setTimeout(() => setStatusFeedback(null), 3000);
  };

  const handleClearAllSubmissions = () => {
    if (window.confirm("Are you sure you want to clear all user submissions? This cannot be undone.")) {
      clearAllUserSubmissions();
      setSubmissionsState([]);
      setStatusFeedback("✓ All user submissions cleared.");
      setTimeout(() => setStatusFeedback(null), 3000);
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Type", "Name", "Email", "Phone", "Program_or_Topic", "Domain", "Squad_Members", "Message_or_Details", "Submitted_At"];
    const rows = submissions.map((s) => [
      `"${s.id}"`,
      `"${s.type}"`,
      `"${(s.name || "").replace(/"/g, '""')}"`,
      `"${(s.email || "").replace(/"/g, '""')}"`,
      `"${(s.phone || "").replace(/"/g, '""')}"`,
      `"${(s.programTitle || "").replace(/"/g, '""')}"`,
      `"${(s.domain || "").replace(/"/g, '""')}"`,
      `"${(s.squadMembers || "").replace(/"/g, '""')}"`,
      `"${(s.message || "").replace(/"/g, '""')}"`,
      `"${s.timestamp}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `polaris_user_submissions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusFeedback("✓ Exported submissions to CSV!");
    setTimeout(() => setStatusFeedback(null), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(submissions, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `polaris_user_submissions_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusFeedback("✓ Exported submissions to JSON!");
    setTimeout(() => setStatusFeedback(null), 3000);
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (submissionFilter !== "all" && s.type !== submissionFilter) return false;
    if (submissionSearch) {
      const q = submissionSearch.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.programTitle && s.programTitle.toLowerCase().includes(q)) ||
        (s.message && s.message.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <>
      {/* ── 1. DASHBOARD HERO ── */}
      <section className="relative overflow-hidden pt-28 pb-14 md:pt-36 md:pb-16 border-b border-white/8">
        <div className="shell max-w-4xl mx-auto text-center space-y-4 font-sans">
          <ScrollReveal direction="up">
            <span className="text-xs font-sans text-primary uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block mb-2">
              Workspace & Control
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold font-display text-foreground tracking-tight">
              Polaris Portal
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Student workspace access and dynamic Admin CMS management.
            </p>
          </ScrollReveal>

          {/* Mode Switcher */}
          <div className="pt-4 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("student")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === "student"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/8"
              }`}
            >
              <User className="size-3.5" />
              <span>Student Workspace</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("admin")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === "admin"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/8"
              }`}
            >
              <ShieldCheck className="size-3.5" />
              <span>Admin CMS Control</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. STUDENT WORKSPACE TAB ── */}
      {activeTab === "student" && (
        <section className="section font-sans">
          <div className="shell max-w-4xl mx-auto space-y-8">
            {/* Quick Status Bar */}
            <div className="p-6 rounded-2xl border border-white/8 bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-base">
                  P
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-foreground">Welcome, Polaris Explorer</h3>
                  <p className="text-xs text-muted-foreground">Active Member • Cohort 2026</p>
                </div>
              </div>
              <Button asChild size="sm" className="h-8 px-4 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/projects">Launch AeroForge Lab ↗</Link>
              </Button>
            </div>

            {/* Registered & Available Programs */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-foreground">
                Your Masterclasses & Workshops
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-5 rounded-xl border border-primary/30 bg-card space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-semibold text-[10px]">
                      29 AUGUST 2026
                    </span>
                    <span className="text-emerald-400 font-mono text-[11px]">Active Registration</span>
                  </div>
                  <h4 className="text-base font-bold font-display text-foreground">
                    Exploring the Star Universe: A Journey into Wonders of Astronomy
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Speaker: Scientist Baldev Krishan Sharma (Cosmo-scientist & Author).
                  </p>
                  <div className="pt-2">
                    <Button asChild size="sm" variant="outline" className="w-full h-8 text-xs border-white/10 hover:border-white/20">
                      <a href="https://forms.gle/EaZUGjUd7spcQfoF7" target="_blank" rel="noreferrer">
                        Access Registration Link ↗
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-white/8 bg-card space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded bg-white/6 text-muted-foreground border border-white/10 font-semibold text-[10px]">
                      OPEN COHORT
                    </span>
                    <span className="text-primary font-mono text-[11px]">Volunteer Squad</span>
                  </div>
                  <h4 className="text-base font-bold font-display text-foreground">
                    Polaris Student Volunteer Program
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Engineering, Operations, Outreach & Research tracks.
                  </p>
                  <div className="pt-2">
                    <Button asChild size="sm" variant="outline" className="w-full h-8 text-xs border-white/10 hover:border-white/20">
                      <Link to="/get-involved">View Department Forms →</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 3. ADMIN CMS TAB ── */}
      {activeTab === "admin" && (
        <section className="section font-sans">
          <div className="shell max-w-4xl mx-auto space-y-6">
            {!adminAuthenticated ? (
              /* Admin Passcode Gate */
              <div className="max-w-md mx-auto p-7 rounded-2xl border border-white/10 bg-card text-center space-y-4">
                <div className="size-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto">
                  <Lock className="size-5" />
                </div>
                <h3 className="text-xl font-bold font-display text-foreground">Admin CMS Authentication</h3>
                <p className="text-xs text-muted-foreground">
                  Enter your team passcode to dynamically create, edit, and publish Programs, Articles, and Spotlight features.
                </p>

                <form onSubmit={handleAdminLogin} className="space-y-3 text-xs pt-2">
                  <input
                    type="password"
                    placeholder="Enter admin passcode (e.g. polaris2026)"
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-surface border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary/50 text-center"
                  />
                  {adminError && <p className="text-rose-400 text-[11px]">{adminError}</p>}
                  <Button type="submit" size="sm" className="w-full h-9 bg-primary text-primary-foreground font-semibold rounded-lg">
                    Authenticate as Admin
                  </Button>
                </form>
              </div>
            ) : (
              /* ── Authenticated Admin CMS Workspace ── */
              <div className="space-y-6">
                {statusFeedback && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                    {statusFeedback}
                  </div>
                )}

                {/* CMS Section Selector */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveCmsSection("programs")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        activeCmsSection === "programs"
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-2 text-muted-foreground border border-white/8"
                      }`}
                    >
                      Programs Manager ({programs.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCmsSection("articles")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        activeCmsSection === "articles"
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-2 text-muted-foreground border border-white/8"
                      }`}
                    >
                      Articles Manager ({articles.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCmsSection("spotlight")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        activeCmsSection === "spotlight"
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-2 text-muted-foreground border border-white/8"
                      }`}
                    >
                      Spotlight Manager ({spotlights.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCmsSection("submissions")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                        activeCmsSection === "submissions"
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-2 text-muted-foreground border border-white/8"
                      }`}
                    >
                      <Database className="size-3.5" />
                      <span>User Data & Submissions ({submissions.length})</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle className="size-3" />
                    <span>Admin Mode Active</span>
                  </span>
                </div>

                {/* ── A. PROGRAMS CMS ── */}
                {activeCmsSection === "programs" && (
                  <div className="space-y-6">
                    {/* Create Program Form */}
                    <div className="p-6 rounded-2xl border border-primary/20 bg-card space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase">
                        <Plus className="size-4" />
                        <span>Create Dynamic Program / Opportunity</span>
                      </div>

                      <form onSubmit={handleAddProgram} className="grid gap-3 sm:grid-cols-2 text-xs">
                        <div className="space-y-1">
                          <label className="text-muted-foreground">Program Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rocket Propulsion Masterclass"
                            value={newProgram.title}
                            onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground">Subtitle / Short One-Liner</label>
                          <input
                            type="text"
                            placeholder="e.g. Hands-on solid rocket motor physics"
                            value={newProgram.subtitle}
                            onChange={(e) => setNewProgram({ ...newProgram, subtitle: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground">Category</label>
                          <select
                            value={newProgram.category}
                            onChange={(e) => setNewProgram({ ...newProgram, category: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          >
                            <option value="workshop">Workshop</option>
                            <option value="course">Course</option>
                            <option value="bootcamp">Bootcamp</option>
                            <option value="initiative">Initiative</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground">Date / Schedule</label>
                          <input
                            type="text"
                            placeholder="e.g. 29 August 2026"
                            value={newProgram.date}
                            onChange={(e) => setNewProgram({ ...newProgram, date: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground">CTA Button Label</label>
                          <input
                            type="text"
                            placeholder="Register Now →"
                            value={newProgram.ctaText}
                            onChange={(e) => setNewProgram({ ...newProgram, ctaText: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground">CTA URL (Google Form / Link)</label>
                          <input
                            type="text"
                            placeholder="https://forms.gle/..."
                            value={newProgram.ctaUrl}
                            onChange={(e) => setNewProgram({ ...newProgram, ctaUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="sm:col-span-2 pt-2">
                          <Button type="submit" size="sm" className="h-9 px-6 bg-primary text-primary-foreground font-semibold rounded-lg">
                            Publish Program to Website
                          </Button>
                        </div>
                      </form>
                    </div>

                    {/* Active Programs List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Active Programs ({programs.length})
                      </h4>
                      {programs.map((p) => (
                        <div key={p.id} className="p-4 rounded-xl border border-white/8 bg-card flex items-center justify-between gap-4 text-xs">
                          <div>
                            <div className="font-bold text-foreground font-display">{p.title}</div>
                            <div className="text-[11px] text-muted-foreground">
                              {p.category} • {p.date} • {p.status}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteProgram(p.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── B. ARTICLES CMS ── */}
                {activeCmsSection === "articles" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-primary/20 bg-card space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase">
                        <Plus className="size-4" />
                        <span>Publish New Article / Newsletter Entry</span>
                      </div>

                      <form onSubmit={handleAddArticle} className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-muted-foreground">Article Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Supersonic Shockwaves in Transonic Airfoils"
                            value={newArticle.title}
                            onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-1">
                            <label className="text-muted-foreground">Category</label>
                            <select
                              value={newArticle.category}
                              onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value as any })}
                              className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                            >
                              <option value="Science & Astronomy">Science & Astronomy</option>
                              <option value="Technology & Innovation">Technology & Innovation</option>
                              <option value="Research">Research</option>
                              <option value="Education">Education</option>
                              <option value="Entrepreneurship">Entrepreneurship</option>
                              <option value="Student Perspectives">Student Perspectives</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-muted-foreground">Author Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Student Research Squad"
                              value={newArticle.author?.name}
                              onChange={(e) =>
                                setNewArticle({
                                  ...newArticle,
                                  author: { name: e.target.value, role: "Author" },
                                })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground">Short Excerpt (Summary)</label>
                          <textarea
                            rows={2}
                            placeholder="Brief summary of the article..."
                            value={newArticle.excerpt}
                            onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground">Full Article Content</label>
                          <textarea
                            rows={5}
                            placeholder="Complete markdown or text of the article..."
                            value={newArticle.content}
                            onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                          />
                        </div>

                        <Button type="submit" size="sm" className="h-9 px-6 bg-primary text-primary-foreground font-semibold rounded-lg">
                          Publish Article
                        </Button>
                      </form>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Published Articles ({articles.length})
                      </h4>
                      {articles.map((a) => (
                        <div key={a.id} className="p-4 rounded-xl border border-white/8 bg-card flex items-center justify-between gap-4 text-xs">
                          <div>
                            <div className="font-bold text-foreground font-display">{a.title}</div>
                            <div className="text-[11px] text-muted-foreground">
                              {a.category} • By {a.author.name} • {a.publishedAt}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteArticle(a.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── C. SPOTLIGHT CMS ── */}
                {activeCmsSection === "spotlight" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-primary/20 bg-card space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase">
                        <Plus className="size-4" />
                        <span>Create Spotlight Recognition</span>
                      </div>

                      <form onSubmit={handleAddSpotlight} className="space-y-3 text-xs">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-1">
                            <label className="text-muted-foreground">Name of Person / Project *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. AeroForge Simulation Lab"
                              value={newSpotlight.name}
                              onChange={(e) => setNewSpotlight({ ...newSpotlight, name: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-muted-foreground">Category</label>
                            <select
                              value={newSpotlight.category}
                              onChange={(e) => setNewSpotlight({ ...newSpotlight, category: e.target.value as any })}
                              className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                            >
                              <option value="Student Spotlight">Student Spotlight</option>
                              <option value="Project Spotlight">Project Spotlight</option>
                              <option value="Winner Spotlight">Winner Spotlight</option>
                              <option value="Team Spotlight">Team Spotlight</option>
                              <option value="Community Spotlight">Community Spotlight</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground">Headline</label>
                          <input
                            type="text"
                            placeholder="e.g. Built 40+ Numerical Physics Solvers"
                            value={newSpotlight.headline}
                            onChange={(e) => setNewSpotlight({ ...newSpotlight, headline: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground">Story & Accomplishment</label>
                          <textarea
                            rows={3}
                            placeholder="What made this contribution stand out..."
                            value={newSpotlight.story}
                            onChange={(e) => setNewSpotlight({ ...newSpotlight, story: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                          />
                        </div>

                        <Button type="submit" size="sm" className="h-9 px-6 bg-primary text-primary-foreground font-semibold rounded-lg">
                          Publish Spotlight Feature
                        </Button>
                      </form>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Featured Recognitions ({spotlights.length})
                      </h4>
                      {spotlights.map((s) => (
                        <div key={s.id} className="p-4 rounded-xl border border-white/8 bg-card flex items-center justify-between gap-4 text-xs">
                          <div>
                            <div className="font-bold text-foreground font-display">{s.name}</div>
                            <div className="text-[11px] text-muted-foreground">
                              {s.category} • {s.headline}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteSpotlight(s.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── D. USER DATA & SUBMISSIONS CENTER ── */}
                {activeCmsSection === "submissions" && (
                  <div className="space-y-6">
                    {/* Header & Export Actions */}
                    <div className="p-6 rounded-2xl border border-primary/25 bg-card space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase font-semibold mb-1">
                            <Database className="size-3.5 text-primary" />
                            <span>Live User Data & Form Submissions</span>
                          </div>
                          <h3 className="text-xl font-bold font-display text-foreground">
                            Submissions & Lead Center
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Real-time records from Waitlists, Sprint Squad applications, Contact inquiries, and Chapter Leads.
                          </p>
                        </div>

                        {/* Export Buttons */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleExportCSV}
                            className="h-9 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 flex items-center gap-1.5 shadow-sm"
                          >
                            <FileSpreadsheet className="size-3.5" />
                            <span>Export CSV (Excel)</span>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleExportJSON}
                            className="h-9 px-3.5 border-white/10 hover:border-white/20 text-foreground flex items-center gap-1.5"
                          >
                            <Download className="size-3.5" />
                            <span>Export JSON</span>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleClearAllSubmissions}
                            className="h-9 px-3 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                          >
                            <Trash2 className="size-3.5" />
                            <span>Clear All</span>
                          </Button>
                        </div>
                      </div>

                      {/* Summary Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
                        <div className="p-3.5 rounded-xl bg-surface-2 border border-white/6">
                          <div className="text-[10px] text-muted-foreground uppercase">Total Records</div>
                          <div className="text-xl font-bold text-foreground mt-1">{submissions.length}</div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-surface-2 border border-white/6">
                          <div className="text-[10px] text-muted-foreground uppercase">Waitlist Signups</div>
                          <div className="text-xl font-bold text-primary mt-1">
                            {submissions.filter((s) => s.type === "waitlist").length}
                          </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-surface-2 border border-white/6">
                          <div className="text-[10px] text-muted-foreground uppercase">Sprint Applications</div>
                          <div className="text-xl font-bold text-emerald-400 mt-1">
                            {submissions.filter((s) => s.type === "sprint_application").length}
                          </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-surface-2 border border-white/6">
                          <div className="text-[10px] text-muted-foreground uppercase">Direct Inquiries</div>
                          <div className="text-xl font-bold text-sky-400 mt-1">
                            {submissions.filter((s) => s.type === "contact_inquiry" || s.type === "chapter_lead").length}
                          </div>
                        </div>
                      </div>

                      {/* Filter & Search Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/6">
                        <div className="flex flex-wrap gap-1.5 text-xs">
                          {[
                            { label: "All Records", val: "all" },
                            { label: "Waitlists", val: "waitlist" },
                            { label: "Sprint Squads", val: "sprint_application" },
                            { label: "Contact Inquiries", val: "contact_inquiry" },
                            { label: "Chapter Leads", val: "chapter_lead" },
                          ].map((f) => (
                            <button
                              key={f.val}
                              type="button"
                              onClick={() => setSubmissionFilter(f.val)}
                              className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                                submissionFilter === f.val
                                  ? "bg-primary text-primary-foreground font-semibold"
                                  : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/8"
                              }`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>

                        <div className="relative w-full sm:w-64">
                          <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search name, email, topic..."
                            value={submissionSearch}
                            onChange={(e) => setSubmissionSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary/50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submissions Table / Cards */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                        <span>Showing {filteredSubmissions.length} submissions</span>
                        <button
                          type="button"
                          onClick={() => setSubmissionsState(getUserSubmissions())}
                          className="flex items-center gap-1 hover:text-foreground transition-colors"
                        >
                          <RefreshCw className="size-3" />
                          <span>Refresh Live Data</span>
                        </button>
                      </div>

                      {filteredSubmissions.length === 0 ? (
                        <div className="p-8 rounded-xl border border-white/8 bg-card text-center text-xs text-muted-foreground space-y-1">
                          <p className="font-semibold text-foreground">No submissions found</p>
                          <p>When users submit waitlist forms, sprint applications, or contact inquiries, they will appear here live.</p>
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {filteredSubmissions.map((s) => (
                            <div
                              key={s.id}
                              className="p-4 md:p-5 rounded-xl border border-white/8 bg-card flex flex-col md:flex-row md:items-start justify-between gap-4 text-xs hover:border-white/16 transition-colors"
                            >
                              <div className="space-y-2 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-semibold border ${
                                      s.type === "waitlist"
                                        ? "bg-primary/10 text-primary border-primary/20"
                                        : s.type === "sprint_application"
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        : s.type === "chapter_lead"
                                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                        : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                                    }`}
                                  >
                                    {s.type.replace("_", " ")}
                                  </span>

                                  <span className="text-[11px] text-muted-foreground font-mono">
                                    {new Date(s.timestamp).toLocaleString("en-IN", {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                    })}
                                  </span>
                                </div>

                                <div>
                                  <div className="text-sm font-bold font-display text-foreground">
                                    {s.name}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-0.5 font-mono">
                                    <a href={`mailto:${s.email}`} className="text-primary hover:underline flex items-center gap-1">
                                      <Mail className="size-3" />
                                      <span>{s.email}</span>
                                    </a>
                                    {s.phone && (
                                      <span className="flex items-center gap-1">
                                        <span>📞 {s.phone}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {s.programTitle && (
                                  <div className="text-xs text-foreground/90 font-medium pt-1">
                                    <span className="text-muted-foreground">Target Program:</span> {s.programTitle}
                                  </div>
                                )}

                                {s.squadMembers && (
                                  <div className="text-xs text-foreground/90 font-medium">
                                    <span className="text-muted-foreground">Squad Members:</span> {s.squadMembers}
                                  </div>
                                )}

                                {s.message && (
                                  <div className="p-3 rounded-lg bg-surface-2 border border-white/6 text-xs text-muted-foreground leading-relaxed mt-2">
                                    "{s.message}"
                                  </div>
                                )}
                              </div>

                              <div className="pt-2 md:pt-0 flex md:flex-col items-center justify-end gap-2 shrink-0">
                                <a
                                  href={`mailto:${s.email}?subject=Project Polaris: Regarding your ${s.programTitle || "inquiry"}`}
                                  className="h-8 px-3 rounded-lg bg-surface-2 hover:bg-surface border border-white/10 text-foreground text-xs flex items-center gap-1 font-medium transition-colors"
                                >
                                  <Mail className="size-3 text-primary" />
                                  <span>Reply</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSubmission(s.id)}
                                  className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                                  title="Delete record"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
