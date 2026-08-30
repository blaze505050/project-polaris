import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import {
  getPrograms,
  savePrograms,
  getPastSessions,
  savePastSessions,
  getArticles,
  saveArticles,
  getSpotlights,
  saveSpotlights,
  getUserSubmissions,
  deleteUserSubmission,
  clearAllUserSubmissions,
  exportAllCmsData,
  importAllCmsData,
  resetAllCmsData,
  type ProgramEvent,
  type PastSession,
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
  Upload,
  Database,
  Mail,
  FileSpreadsheet,
  RefreshCw,
  Search,
  Linkedin,
  Clock,
  MapPin,
  Mic,
  X,
  History,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Student Dashboard & Admin Portal — Project Polaris" },
      {
        name: "description",
        content:
          "Student workspace and full dynamic Admin CMS management for Project Polaris programs, past sessions, articles, spotlight features, and user data.",
      },
      { name: "robots", content: "noindex, nofollow" },
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
  const [pastSessions, setPastSessionsState] = useState<PastSession[]>(getPastSessions());
  const [articles, setArticlesState] = useState<ArticleItem[]>(getArticles());
  const [spotlights, setSpotlightsState] = useState<SpotlightEntry[]>(getSpotlights());
  const [submissions, setSubmissionsState] = useState<UserSubmission[]>(getUserSubmissions());
  const [activeCmsSection, setActiveCmsSection] = useState<
    "programs" | "pastSessions" | "articles" | "spotlight" | "submissions" | "database"
  >("programs");
  const [submissionFilter, setSubmissionFilter] = useState<string>("all");
  const [submissionSearch, setSubmissionSearch] = useState<string>("");
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // Edit Modals State
  const [editingProgram, setEditingProgram] = useState<ProgramEvent | null>(null);
  const [editingPastSession, setEditingPastSession] = useState<PastSession | null>(null);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [editingSpotlight, setEditingSpotlight] = useState<SpotlightEntry | null>(null);
  const [importJsonText, setImportJsonText] = useState("");

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
    speaker: {
      name: "",
      designation: "",
      bio: "",
      linkedin: "",
    },
  });

  // New Past Session Form State
  const [newPastSession, setNewPastSession] = useState<Partial<PastSession>>({
    title: "",
    date: "",
    speaker: "",
    designation: "",
    speakerLinkedin: "",
    topic: "",
    participants: "60+ Participants",
    summary: "",
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
    contributionToPolaris: "",
    featured: false,
    date: "August 2026",
  });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      adminPasscode === "polaris2026" ||
      adminPasscode === "admin" ||
      adminPasscode === "polaris"
    ) {
      setAdminAuthenticated(true);
      setAdminError("");
    } else {
      setAdminError("Invalid admin access key. Please check your credentials.");
    }
  };

  // ── Programs CRUD Handlers ──
  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgram.title) return;
    const prog: ProgramEvent = {
      id: `prog-${Date.now()}`,
      title: newProgram.title || "New Program",
      subtitle: newProgram.subtitle || "",
      category: (newProgram.category as any) || "workshop",
      status: (newProgram.status as any) || "upcoming",
      date: newProgram.date || "Upcoming 2026",
      time: newProgram.time,
      mode: (newProgram.mode as any) || "Online",
      details: newProgram.details || "",
      benefits: [
        "Interactive Session with Scientist",
        "Certificate of Participation",
        "Community Access",
      ],
      ctaText: newProgram.ctaText || "Register Now →",
      ctaUrl: newProgram.ctaUrl || "#",
      price: newProgram.price || "Free",
      featured: Boolean(newProgram.featured),
      visibility: true,
      speaker: newProgram.speaker?.name
        ? {
            name: newProgram.speaker.name,
            designation: newProgram.speaker.designation || "",
            bio: newProgram.speaker.bio || "",
            linkedin: newProgram.speaker.linkedin || "",
          }
        : undefined,
    };
    const updated = [prog, ...programs];
    setProgramsState(updated);
    savePrograms(updated);
    setStatusFeedback("✓ Program created successfully and live across the website!");
    setTimeout(() => setStatusFeedback(null), 4000);
    // Reset
    setNewProgram({
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
      speaker: { name: "", designation: "", bio: "", linkedin: "" },
    });
  };

  const handleUpdateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;
    const updated = programs.map((p) => (p.id === editingProgram.id ? editingProgram : p));
    setProgramsState(updated);
    savePrograms(updated);
    setEditingProgram(null);
    setStatusFeedback("✓ Program updated successfully!");
    setTimeout(() => setStatusFeedback(null), 4000);
  };

  const handleDeleteProgram = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this program?")) return;
    const updated = programs.filter((p) => p.id !== id);
    setProgramsState(updated);
    savePrograms(updated);
    setStatusFeedback("✓ Program removed.");
    setTimeout(() => setStatusFeedback(null), 3000);
  };

  // ── Past Sessions CRUD Handlers ──
  const handleAddPastSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPastSession.title) return;
    const session: PastSession = {
      id: `session-${Date.now()}`,
      title: newPastSession.title,
      date: newPastSession.date || "2026",
      speaker: newPastSession.speaker || "Guest Speaker",
      designation: newPastSession.designation || "Researcher",
      speakerLinkedin: newPastSession.speakerLinkedin || undefined,
      topic: newPastSession.topic || "",
      participants: newPastSession.participants || "50+ Participants",
      summary: newPastSession.summary || "",
    };
    const updated = [session, ...pastSessions];
    setPastSessionsState(updated);
    savePastSessions(updated);
    setStatusFeedback("✓ Past session added and visible in Historical Archives!");
    setTimeout(() => setStatusFeedback(null), 4000);
    setNewPastSession({
      title: "",
      date: "",
      speaker: "",
      designation: "",
      speakerLinkedin: "",
      topic: "",
      participants: "60+ Participants",
      summary: "",
    });
  };

  const handleUpdatePastSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPastSession) return;
    const updated = pastSessions.map((s) =>
      s.id === editingPastSession.id ? editingPastSession : s,
    );
    setPastSessionsState(updated);
    savePastSessions(updated);
    setEditingPastSession(null);
    setStatusFeedback("✓ Past session updated successfully!");
    setTimeout(() => setStatusFeedback(null), 4000);
  };

  const handleDeletePastSession = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this past session?")) return;
    const updated = pastSessions.filter((s) => s.id !== id);
    setPastSessionsState(updated);
    savePastSessions(updated);
    setStatusFeedback("✓ Past session removed.");
    setTimeout(() => setStatusFeedback(null), 3000);
  };

  // ── Articles CRUD Handlers ──
  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title) return;
    const art: ArticleItem = {
      id: `art-${Date.now()}`,
      title: newArticle.title || "Untitled Article",
      slug: (newArticle.title || "article").toLowerCase().replace(/\s+/g, "-"),
      author: newArticle.author || { name: "Polaris Student", role: "Contributor" },
      category: (newArticle.category as any) || "Science & Astronomy",
      publishedAt: new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
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
    setNewArticle({
      title: "",
      category: "Science & Astronomy",
      excerpt: "",
      content: "",
      author: { name: "Polaris Student Lead", role: "Contributor" },
      readTime: "5 min read",
      featured: false,
    });
  };

  const handleUpdateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    const updated = articles.map((a) => (a.id === editingArticle.id ? editingArticle : a));
    setArticlesState(updated);
    saveArticles(updated);
    setEditingArticle(null);
    setStatusFeedback("✓ Article updated successfully!");
    setTimeout(() => setStatusFeedback(null), 4000);
  };

  const handleDeleteArticle = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this article?")) return;
    const updated = articles.filter((a) => a.id !== id);
    setArticlesState(updated);
    saveArticles(updated);
    setStatusFeedback("✓ Article removed.");
    setTimeout(() => setStatusFeedback(null), 3000);
  };

  // ── Spotlight CRUD Handlers ──
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
      contributionToPolaris: newSpotlight.contributionToPolaris || "",
      image: "/media/polaris-student.jpg",
      featured: Boolean(newSpotlight.featured),
      date: newSpotlight.date || "August 2026",
    };
    const updated = [spot, ...spotlights];
    setSpotlightsState(updated);
    saveSpotlights(updated);
    setStatusFeedback("✓ Spotlight feature created and live on the Spotlight page!");
    setTimeout(() => setStatusFeedback(null), 4000);
    setNewSpotlight({
      name: "",
      category: "Student Spotlight",
      headline: "",
      story: "",
      accomplishment: "",
      contributionToPolaris: "",
      featured: false,
      date: "August 2026",
    });
  };

  const handleUpdateSpotlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpotlight) return;
    const updated = spotlights.map((s) => (s.id === editingSpotlight.id ? editingSpotlight : s));
    setSpotlightsState(updated);
    saveSpotlights(updated);
    setEditingSpotlight(null);
    setStatusFeedback("✓ Spotlight updated successfully!");
    setTimeout(() => setStatusFeedback(null), 4000);
  };

  const handleDeleteSpotlight = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this spotlight recognition?")) return;
    const updated = spotlights.filter((s) => s.id !== id);
    setSpotlightsState(updated);
    saveSpotlights(updated);
    setStatusFeedback("✓ Spotlight removed.");
    setTimeout(() => setStatusFeedback(null), 3000);
  };

  // ── Submissions & Data Center Handlers ──
  const handleDeleteSubmission = (id: string) => {
    const updated = deleteUserSubmission(id);
    setSubmissionsState(updated);
    setStatusFeedback("✓ User submission removed.");
    setTimeout(() => setStatusFeedback(null), 3000);
  };

  const handleClearAllSubmissions = () => {
    if (
      window.confirm("Are you sure you want to clear all user submissions? This cannot be undone.")
    ) {
      clearAllUserSubmissions();
      setSubmissionsState([]);
      setStatusFeedback("✓ All user submissions cleared.");
      setTimeout(() => setStatusFeedback(null), 3000);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Type",
      "Name",
      "Email",
      "Phone",
      "Program_or_Topic",
      "Domain",
      "Squad_Members",
      "Message_or_Details",
      "Submitted_At",
    ];
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

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `polaris_user_submissions_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusFeedback("✓ Exported submissions to CSV!");
    setTimeout(() => setStatusFeedback(null), 3000);
  };

  // Full Database Backup JSON
  const handleFullBackupDownload = () => {
    const jsonString = exportAllCmsData();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute(
      "download",
      `polaris_full_backup_${new Date().toISOString().split("T")[0]}.json`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusFeedback("✓ Full Website Database exported to JSON!");
    setTimeout(() => setStatusFeedback(null), 3000);
  };

  const handleFullRestoreImport = () => {
    if (!importJsonText.trim()) return;
    const ok = importAllCmsData(importJsonText);
    if (ok) {
      setProgramsState(getPrograms());
      setPastSessionsState(getPastSessions());
      setArticlesState(getArticles());
      setSpotlightsState(getSpotlights());
      setSubmissionsState(getUserSubmissions());
      setImportJsonText("");
      setStatusFeedback("✓ Complete website database successfully restored from JSON!");
    } else {
      alert("Invalid JSON format. Please verify the backup file.");
    }
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        "WARNING: This will reset all Programs, Past Sessions, Articles, Spotlights, and Submissions to factory defaults. Continue?",
      )
    ) {
      resetAllCmsData();
      setProgramsState(getPrograms());
      setPastSessionsState(getPastSessions());
      setArticlesState(getArticles());
      setSpotlightsState(getSpotlights());
      setSubmissionsState(getUserSubmissions());
      setStatusFeedback("✓ Website database reset to initial seed defaults.");
      setTimeout(() => setStatusFeedback(null), 4000);
    }
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
        <div className="shell max-w-4xl space-y-4 font-sans text-left">
          <ScrollReveal direction="up">
            <h1 className="text-4xl sm:text-6xl font-bold font-display text-foreground tracking-tight">
              Polaris Portal
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              Student workspace access and dynamic Admin CMS management across all website pages.
            </p>
          </ScrollReveal>

          {/* Mode Switcher */}
          <div className="pt-4 flex justify-start gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("student")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 active:scale-[0.97] ${
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
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 active:scale-[0.97] ${
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
                  <h3 className="text-base font-bold font-display text-foreground">
                    Welcome, Polaris Explorer
                  </h3>
                  <p className="text-xs text-muted-foreground">Active Member • Cohort 2026</p>
                </div>
              </div>
              <Button
                asChild
                size="sm"
                className="h-8 px-4 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97]"
              >
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
                    <span className="px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-semibold text-[10px]">
                      29 AUGUST 2026
                    </span>
                    <span className="text-emerald-400 font-mono text-[11px]">
                      Active Registration
                    </span>
                  </div>
                  <h4 className="text-base font-bold font-display text-foreground">
                    Exploring the Star Universe: A Journey into Wonders of Astronomy
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Speaker: Scientist Baldev Krishan Sharma (Cosmo-scientist & Author).
                  </p>
                  <div className="pt-2">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="w-full h-8 text-xs border-white/10 hover:border-white/20 active:scale-[0.97]"
                    >
                      <a
                        href="https://forms.gle/EaZUGjUd7spcQfoF7"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Access Registration Link ↗
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-white/8 bg-card space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded bg-white/6 text-muted-foreground border border-white/10 font-semibold text-[10px]">
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
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="w-full h-8 text-xs border-white/10 hover:border-white/20 active:scale-[0.97]"
                    >
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
          <div className="shell max-w-5xl mx-auto space-y-6">
            {!adminAuthenticated ? (
              /* Admin Passcode Gate */
              <div className="max-w-md mx-auto p-7 rounded-2xl border border-white/10 bg-card text-center space-y-4 shadow-xl">
                <div className="size-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto">
                  <Lock className="size-5" />
                </div>
                <h3 className="text-xl font-bold font-display text-foreground">
                  Admin CMS Authentication
                </h3>
                <p className="text-xs text-muted-foreground">
                  Enter your team passcode to dynamically create, edit, remove, and manage all
                  website data in real time.
                </p>

                <form onSubmit={handleAdminLogin} className="space-y-3 text-xs pt-2">
                  <input
                    type="password"
                    placeholder="Enter admin passcode"
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-surface border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary/50 text-center font-mono"
                  />
                  {adminError && <p className="text-rose-400 text-[11px]">{adminError}</p>}
                  <Button
                    type="submit"
                    size="sm"
                    className="w-full h-9 bg-primary text-primary-foreground font-semibold rounded-lg active:scale-[0.97]"
                  >
                    Authenticate as Admin
                  </Button>
                </form>
              </div>
            ) : (
              /* ── Authenticated Admin CMS Workspace ── */
              <div className="space-y-6">
                {statusFeedback && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
                    <CheckCircle className="size-4 shrink-0" />
                    <span>{statusFeedback}</span>
                  </div>
                )}

                {/* CMS Section Navigation Pills */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-card border border-white/8">
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {[
                      {
                        id: "programs",
                        label: `Live Programs (${programs.length})`,
                        icon: Calendar,
                      },
                      {
                        id: "pastSessions",
                        label: `Past Sessions (${pastSessions.length})`,
                        icon: History,
                      },
                      { id: "articles", label: `Articles (${articles.length})`, icon: BookOpen },
                      {
                        id: "spotlight",
                        label: `Spotlight (${spotlights.length})`,
                        icon: Sparkles,
                      },
                      {
                        id: "submissions",
                        label: `Submissions (${submissions.length})`,
                        icon: Database,
                      },
                      { id: "database", label: "Full Database / Backup", icon: Download },
                    ].map((sec) => {
                      const Icon = sec.icon;
                      return (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => setActiveCmsSection(sec.id as any)}
                          className={`px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 active:scale-[0.97] ${
                            activeCmsSection === sec.id
                              ? "bg-primary text-primary-foreground font-semibold"
                              : "bg-surface-2 text-muted-foreground hover:text-foreground border border-white/8"
                          }`}
                        >
                          <Icon className="size-3.5" />
                          <span>{sec.label}</span>
                        </button>
                      );
                    })}
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
                      <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase font-mono">
                        <Plus className="size-4" />
                        <span>Create Live Masterclass / Workshop</span>
                      </div>

                      <form
                        onSubmit={handleAddProgram}
                        className="grid gap-3 sm:grid-cols-2 text-xs"
                      >
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-muted-foreground">Program Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Exploring the Star Universe"
                            value={newProgram.title}
                            onChange={(e) =>
                              setNewProgram({ ...newProgram, title: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-muted-foreground">
                            Subtitle / Short One-Liner
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Join us for an engaging astronomy masterclass"
                            value={newProgram.subtitle}
                            onChange={(e) =>
                              setNewProgram({ ...newProgram, subtitle: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground">Category</label>
                          <select
                            value={newProgram.category}
                            onChange={(e) =>
                              setNewProgram({ ...newProgram, category: e.target.value as any })
                            }
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
                          <label className="text-muted-foreground">Speaker Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Scientist Baldev Krishan Sharma"
                            value={newProgram.speaker?.name || ""}
                            onChange={(e) =>
                              setNewProgram({
                                ...newProgram,
                                speaker: {
                                  ...newProgram.speaker,
                                  name: e.target.value,
                                  designation: newProgram.speaker?.designation || "",
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground">Speaker Designation / Org</label>
                          <input
                            type="text"
                            placeholder="e.g. Cosmo-scientist & Author"
                            value={newProgram.speaker?.designation || ""}
                            onChange={(e) =>
                              setNewProgram({
                                ...newProgram,
                                speaker: {
                                  ...newProgram.speaker,
                                  designation: e.target.value,
                                  name: newProgram.speaker?.name || "",
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-muted-foreground flex items-center gap-1.5">
                            <Linkedin className="size-3 text-primary" />
                            <span>Speaker LinkedIn Profile URL</span>
                          </label>
                          <input
                            type="url"
                            placeholder="https://www.linkedin.com/in/speaker-profile"
                            value={newProgram.speaker?.linkedin || ""}
                            onChange={(e) =>
                              setNewProgram({
                                ...newProgram,
                                speaker: {
                                  ...newProgram.speaker,
                                  linkedin: e.target.value,
                                  name: newProgram.speaker?.name || "",
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground">CTA Button Label</label>
                          <input
                            type="text"
                            placeholder="Register Now →"
                            value={newProgram.ctaText}
                            onChange={(e) =>
                              setNewProgram({ ...newProgram, ctaText: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground">
                            CTA Registration URL (Google Form)
                          </label>
                          <input
                            type="text"
                            placeholder="https://forms.gle/..."
                            value={newProgram.ctaUrl}
                            onChange={(e) =>
                              setNewProgram({ ...newProgram, ctaUrl: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-muted-foreground">Session Details</label>
                          <textarea
                            rows={3}
                            placeholder="Description of the masterclass and what students will learn..."
                            value={newProgram.details}
                            onChange={(e) =>
                              setNewProgram({ ...newProgram, details: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                          />
                        </div>

                        <div className="sm:col-span-2 pt-2">
                          <Button
                            type="submit"
                            size="sm"
                            className="h-9 px-6 bg-primary text-primary-foreground font-semibold rounded-lg active:scale-[0.97]"
                          >
                            Publish Program to Website
                          </Button>
                        </div>
                      </form>
                    </div>

                    {/* Active Programs List with Edit & Delete */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                        Active Programs ({programs.length})
                      </h4>
                      {programs.map((p) => (
                        <div
                          key={p.id}
                          className="p-4 rounded-xl border border-white/8 bg-card flex items-center justify-between gap-4 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="font-bold text-foreground font-display text-sm">
                              {p.title}
                            </div>
                            <div className="text-[11px] text-muted-foreground flex flex-wrap items-center gap-2 font-mono">
                              <span>{p.category}</span>
                              <span>•</span>
                              <span>{p.date}</span>
                              <span>•</span>
                              <span className="text-emerald-400">{p.status}</span>
                              {p.speaker && (
                                <>
                                  <span>•</span>
                                  <span className="text-primary font-sans">{p.speaker.name}</span>
                                  {p.speaker.linkedin && (
                                    <a
                                      href={p.speaker.linkedin}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-primary hover:underline"
                                    >
                                      [LinkedIn]
                                    </a>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingProgram(p)}
                              className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                              title="Edit Program"
                            >
                              <Edit2 className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProgram(p.id)}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete Program"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── B. PAST SESSIONS CMS ── */}
                {activeCmsSection === "pastSessions" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-primary/20 bg-card space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase font-mono">
                        <Plus className="size-4" />
                        <span>Add Past Conducted Session Archive</span>
                      </div>

                      <form
                        onSubmit={handleAddPastSession}
                        className="grid gap-3 sm:grid-cols-2 text-xs"
                      >
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-muted-foreground">Session Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Fundamentals of Rocket Development"
                            value={newPastSession.title}
                            onChange={(e) =>
                              setNewPastSession({ ...newPastSession, title: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground">Date Conducted</label>
                          <input
                            type="text"
                            placeholder="e.g. 9 August 2026"
                            value={newPastSession.date}
                            onChange={(e) =>
                              setNewPastSession({ ...newPastSession, date: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground">Participants Count</label>
                          <input
                            type="text"
                            placeholder="e.g. 60+ Participants"
                            value={newPastSession.participants}
                            onChange={(e) =>
                              setNewPastSession({ ...newPastSession, participants: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground">Speaker Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ms. Vranda Gupta"
                            value={newPastSession.speaker}
                            onChange={(e) =>
                              setNewPastSession({ ...newPastSession, speaker: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground">
                            Speaker Designation / Role
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Founder, Stellar Freaks"
                            value={newPastSession.designation}
                            onChange={(e) =>
                              setNewPastSession({ ...newPastSession, designation: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-muted-foreground flex items-center gap-1.5">
                            <Linkedin className="size-3 text-primary" />
                            <span>Speaker LinkedIn Profile URL</span>
                          </label>
                          <input
                            type="url"
                            placeholder="https://www.linkedin.com/in/speaker-profile"
                            value={newPastSession.speakerLinkedin}
                            onChange={(e) =>
                              setNewPastSession({
                                ...newPastSession,
                                speakerLinkedin: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground font-mono"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-muted-foreground">Topic Covered</label>
                          <input
                            type="text"
                            placeholder="e.g. Deep space astrophysics, interstellar nebulae classification, and galactic dynamics."
                            value={newPastSession.topic}
                            onChange={(e) =>
                              setNewPastSession({ ...newPastSession, topic: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-muted-foreground">
                            Summary / Milestone Description
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Brief summary of how the session went and key topics discussed..."
                            value={newPastSession.summary}
                            onChange={(e) =>
                              setNewPastSession({ ...newPastSession, summary: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                          />
                        </div>

                        <div className="sm:col-span-2 pt-2">
                          <Button
                            type="submit"
                            size="sm"
                            className="h-9 px-6 bg-primary text-primary-foreground font-semibold rounded-lg active:scale-[0.97]"
                          >
                            Add Past Session Archive
                          </Button>
                        </div>
                      </form>
                    </div>

                    {/* Past Sessions List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                        Archived Past Sessions ({pastSessions.length})
                      </h4>
                      {pastSessions.map((s) => (
                        <div
                          key={s.id}
                          className="p-4 rounded-xl border border-white/8 bg-card flex items-center justify-between gap-4 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="font-bold text-foreground font-display text-sm">
                              {s.title}
                            </div>
                            <div className="text-[11px] text-muted-foreground flex flex-wrap items-center gap-2">
                              <span className="font-mono">{s.date}</span>
                              <span>•</span>
                              <span className="text-primary font-medium">{s.speaker}</span>
                              <span className="text-muted-foreground font-mono">
                                ({s.designation})
                              </span>
                              {s.speakerLinkedin && (
                                <a
                                  href={s.speakerLinkedin}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-primary hover:underline font-mono"
                                >
                                  [LinkedIn]
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingPastSession(s)}
                              className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                              title="Edit Session"
                            >
                              <Edit2 className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePastSession(s.id)}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete Session"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── C. ARTICLES CMS ── */}
                {activeCmsSection === "articles" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-primary/20 bg-card space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase font-mono">
                        <Plus className="size-4" />
                        <span>Publish New Article / Newsletter Entry</span>
                      </div>

                      <form onSubmit={handleAddArticle} className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-muted-foreground">Article Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Understanding Transonic Compressibility: Why Airfoils Shock"
                            value={newArticle.title}
                            onChange={(e) =>
                              setNewArticle({ ...newArticle, title: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-1">
                            <label className="text-muted-foreground">Category</label>
                            <select
                              value={newArticle.category}
                              onChange={(e) =>
                                setNewArticle({ ...newArticle, category: e.target.value as any })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                            >
                              <option value="Science & Astronomy">Science & Astronomy</option>
                              <option value="Technology & Innovation">
                                Technology & Innovation
                              </option>
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
                            onChange={(e) =>
                              setNewArticle({ ...newArticle, excerpt: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground">Full Article Content</label>
                          <textarea
                            rows={5}
                            placeholder="Complete text of the article..."
                            value={newArticle.content}
                            onChange={(e) =>
                              setNewArticle({ ...newArticle, content: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                          />
                        </div>

                        <Button
                          type="submit"
                          size="sm"
                          className="h-9 px-6 bg-primary text-primary-foreground font-semibold rounded-lg active:scale-[0.97]"
                        >
                          Publish Article
                        </Button>
                      </form>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                        Published Articles ({articles.length})
                      </h4>
                      {articles.map((a) => (
                        <div
                          key={a.id}
                          className="p-4 rounded-xl border border-white/8 bg-card flex items-center justify-between gap-4 text-xs"
                        >
                          <div>
                            <div className="font-bold text-foreground font-display text-sm">
                              {a.title}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {a.category} • By {a.author.name} • {a.publishedAt}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingArticle(a)}
                              className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                              title="Edit Article"
                            >
                              <Edit2 className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteArticle(a.id)}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete Article"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── D. SPOTLIGHT CMS ── */}
                {activeCmsSection === "spotlight" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-primary/20 bg-card space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase font-mono">
                        <Plus className="size-4" />
                        <span>Create Spotlight Recognition</span>
                      </div>

                      <form onSubmit={handleAddSpotlight} className="space-y-3 text-xs">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-1">
                            <label className="text-muted-foreground">
                              Name of Person / Project *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. AeroForge Simulation Lab"
                              value={newSpotlight.name}
                              onChange={(e) =>
                                setNewSpotlight({ ...newSpotlight, name: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-muted-foreground">Category</label>
                            <select
                              value={newSpotlight.category}
                              onChange={(e) =>
                                setNewSpotlight({
                                  ...newSpotlight,
                                  category: e.target.value as any,
                                })
                              }
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
                            placeholder="e.g. Building 40+ Browser-Based Numerical Physics Solvers"
                            value={newSpotlight.headline}
                            onChange={(e) =>
                              setNewSpotlight({ ...newSpotlight, headline: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground">
                            Accomplishment / What Was Built
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Created Navier-Stokes, FEA, and orbital transfer simulations"
                            value={newSpotlight.accomplishment}
                            onChange={(e) =>
                              setNewSpotlight({ ...newSpotlight, accomplishment: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground">Story & Background</label>
                          <textarea
                            rows={3}
                            placeholder="Detailed story of the project or builder..."
                            value={newSpotlight.story}
                            onChange={(e) =>
                              setNewSpotlight({ ...newSpotlight, story: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                          />
                        </div>

                        <Button
                          type="submit"
                          size="sm"
                          className="h-9 px-6 bg-primary text-primary-foreground font-semibold rounded-lg active:scale-[0.97]"
                        >
                          Publish Spotlight Feature
                        </Button>
                      </form>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                        Featured Recognitions ({spotlights.length})
                      </h4>
                      {spotlights.map((s) => (
                        <div
                          key={s.id}
                          className="p-4 rounded-xl border border-white/8 bg-card flex items-center justify-between gap-4 text-xs"
                        >
                          <div>
                            <div className="font-bold text-foreground font-display text-sm">
                              {s.name}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {s.category} • {s.headline}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingSpotlight(s)}
                              className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                              title="Edit Spotlight"
                            >
                              <Edit2 className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSpotlight(s.id)}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete Spotlight"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── E. USER DATA & SUBMISSIONS CENTER ── */}
                {activeCmsSection === "submissions" && (
                  <div className="space-y-6">
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
                            Real-time records from Waitlists, Sprint Squad applications, Contact
                            inquiries, and Chapter Leads.
                          </p>
                        </div>

                        {/* Export Buttons */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleExportCSV}
                            className="h-9 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 flex items-center gap-1.5 shadow-sm active:scale-[0.97]"
                          >
                            <FileSpreadsheet className="size-3.5" />
                            <span>Export CSV (Excel)</span>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleExportCSV}
                            className="h-9 px-3.5 border-white/10 hover:border-white/20 text-foreground flex items-center gap-1.5 active:scale-[0.97]"
                          >
                            <Download className="size-3.5" />
                            <span>Export CSV</span>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleClearAllSubmissions}
                            className="h-9 px-3 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 active:scale-[0.97]"
                          >
                            <Trash2 className="size-3.5" />
                            <span>Clear All</span>
                          </Button>
                        </div>
                      </div>

                      {/* Summary Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
                        <div className="p-3.5 rounded-xl bg-surface-2 border border-white/6">
                          <div className="text-[10px] text-muted-foreground uppercase">
                            Total Records
                          </div>
                          <div className="text-xl font-bold text-foreground mt-1">
                            {submissions.length}
                          </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-surface-2 border border-white/6">
                          <div className="text-[10px] text-muted-foreground uppercase">
                            Waitlist Signups
                          </div>
                          <div className="text-xl font-bold text-primary mt-1">
                            {submissions.filter((s) => s.type === "waitlist").length}
                          </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-surface-2 border border-white/6">
                          <div className="text-[10px] text-muted-foreground uppercase">
                            Sprint Applications
                          </div>
                          <div className="text-xl font-bold text-emerald-400 mt-1">
                            {submissions.filter((s) => s.type === "sprint_application").length}
                          </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-surface-2 border border-white/6">
                          <div className="text-[10px] text-muted-foreground uppercase">
                            Direct Inquiries
                          </div>
                          <div className="text-xl font-bold text-primary mt-1">
                            {
                              submissions.filter(
                                (s) => s.type === "contact_inquiry" || s.type === "chapter_lead",
                              ).length
                            }
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

                    {/* Submissions List */}
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
                          <p>
                            When users submit waitlist forms, sprint applications, or contact
                            inquiries, they will appear here live.
                          </p>
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
                                            : "bg-primary/10 text-primary border-primary/20"
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
                                    <a
                                      href={`mailto:${s.email}`}
                                      className="text-primary hover:underline flex items-center gap-1"
                                    >
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
                                    <span className="text-muted-foreground">Target Program:</span>{" "}
                                    {s.programTitle}
                                  </div>
                                )}

                                {s.squadMembers && (
                                  <div className="text-xs text-foreground/90 font-medium">
                                    <span className="text-muted-foreground">Squad Members:</span>{" "}
                                    {s.squadMembers}
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

                {/* ── F. FULL DATABASE CENTER ── */}
                {activeCmsSection === "database" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-primary/25 bg-card space-y-6">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase font-semibold mb-1">
                          <Database className="size-3.5 text-primary" />
                          <span>Complete Website Database & Backup Center</span>
                        </div>
                        <h3 className="text-xl font-bold font-display text-foreground">
                          Full CMS Data Access & Portability
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Download a complete JSON snapshot of all Programs, Past Sessions (with
                          Speaker LinkedIn accounts), Articles, Spotlights, and User Submissions.
                          You can also restore or reset everything at any time.
                        </p>
                      </div>

                      {/* Action 1: Export Complete JSON */}
                      <div className="p-4 rounded-xl bg-surface-2 border border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <div className="text-sm font-bold font-display text-foreground">
                            1. Download Complete Backup (JSON)
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Exports all website records, speaker links, and user entries into a
                            single backup file.
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={handleFullBackupDownload}
                          size="sm"
                          className="h-9 px-5 bg-primary text-primary-foreground font-semibold rounded-lg flex items-center gap-2 shrink-0 active:scale-[0.97]"
                        >
                          <Download className="size-4" />
                          <span>Download JSON Backup</span>
                        </Button>
                      </div>

                      {/* Action 2: Restore JSON Backup */}
                      <div className="p-4 rounded-xl bg-surface-2 border border-white/8 space-y-3">
                        <div>
                          <div className="text-sm font-bold font-display text-foreground">
                            2. Restore Database from JSON Backup
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Paste a backup JSON payload to restore all website content instantly.
                          </div>
                        </div>
                        <textarea
                          rows={4}
                          placeholder="Paste JSON backup payload here..."
                          value={importJsonText}
                          onChange={(e) => setImportJsonText(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground text-xs font-mono resize-none"
                        />
                        <Button
                          type="button"
                          onClick={handleFullRestoreImport}
                          size="sm"
                          variant="outline"
                          className="h-9 px-5 border-primary/30 hover:border-primary text-primary font-semibold rounded-lg flex items-center gap-2 active:scale-[0.97]"
                        >
                          <Upload className="size-4" />
                          <span>Restore Database from JSON</span>
                        </Button>
                      </div>

                      {/* Action 3: Reset to Factory Defaults */}
                      <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <div className="text-sm font-bold font-display text-rose-400">
                            3. Factory Reset Database
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Resets all website programs, past sessions, articles, and spotlight
                            features to default system seeds.
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={handleResetDefaults}
                          size="sm"
                          variant="ghost"
                          className="h-9 px-4 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-semibold rounded-lg shrink-0 active:scale-[0.97]"
                        >
                          <RefreshCw className="size-4 mr-1.5" />
                          <span>Reset to Defaults</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── MODAL: EDIT PROGRAM ── */}
      {editingProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md font-sans">
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-card max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-foreground">Edit Program</h3>
              <button
                type="button"
                onClick={() => setEditingProgram(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProgram} className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-muted-foreground">Program Title *</label>
                <input
                  type="text"
                  required
                  value={editingProgram.title}
                  onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-muted-foreground">Subtitle</label>
                <input
                  type="text"
                  value={editingProgram.subtitle}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, subtitle: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">Category</label>
                <select
                  value={editingProgram.category}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, category: e.target.value as any })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                >
                  <option value="workshop">Workshop</option>
                  <option value="course">Course</option>
                  <option value="bootcamp">Bootcamp</option>
                  <option value="initiative">Initiative</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">Status</label>
                <select
                  value={editingProgram.status}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, status: e.target.value as any })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="coming-soon">Coming Soon</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">Date / Schedule</label>
                <input
                  type="text"
                  value={editingProgram.date}
                  onChange={(e) => setEditingProgram({ ...editingProgram, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">Speaker Name</label>
                <input
                  type="text"
                  value={editingProgram.speaker?.name || ""}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      speaker: {
                        ...editingProgram.speaker,
                        name: e.target.value,
                        designation: editingProgram.speaker?.designation || "",
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-muted-foreground">Speaker Designation</label>
                <input
                  type="text"
                  value={editingProgram.speaker?.designation || ""}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      speaker: {
                        ...editingProgram.speaker,
                        designation: e.target.value,
                        name: editingProgram.speaker?.name || "",
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-muted-foreground flex items-center gap-1.5">
                  <Linkedin className="size-3 text-primary" />
                  <span>Speaker LinkedIn Profile URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/in/speaker-profile"
                  value={editingProgram.speaker?.linkedin || ""}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      speaker: {
                        ...editingProgram.speaker,
                        linkedin: e.target.value,
                        name: editingProgram.speaker?.name || "",
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">CTA Text</label>
                <input
                  type="text"
                  value={editingProgram.ctaText}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, ctaText: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">CTA URL</label>
                <input
                  type="text"
                  value={editingProgram.ctaUrl}
                  onChange={(e) => setEditingProgram({ ...editingProgram, ctaUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-muted-foreground">Details</label>
                <textarea
                  rows={3}
                  value={editingProgram.details}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, details: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingProgram(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary text-primary-foreground font-semibold"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT PAST SESSION ── */}
      {editingPastSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md font-sans">
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-card max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-foreground">Edit Past Session</h3>
              <button
                type="button"
                onClick={() => setEditingPastSession(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePastSession} className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-muted-foreground">Session Title *</label>
                <input
                  type="text"
                  required
                  value={editingPastSession.title}
                  onChange={(e) =>
                    setEditingPastSession({ ...editingPastSession, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">Date</label>
                <input
                  type="text"
                  value={editingPastSession.date}
                  onChange={(e) =>
                    setEditingPastSession({ ...editingPastSession, date: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">Participants</label>
                <input
                  type="text"
                  value={editingPastSession.participants}
                  onChange={(e) =>
                    setEditingPastSession({ ...editingPastSession, participants: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">Speaker Name</label>
                <input
                  type="text"
                  value={editingPastSession.speaker}
                  onChange={(e) =>
                    setEditingPastSession({ ...editingPastSession, speaker: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">Speaker Designation</label>
                <input
                  type="text"
                  value={editingPastSession.designation}
                  onChange={(e) =>
                    setEditingPastSession({ ...editingPastSession, designation: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-muted-foreground flex items-center gap-1.5">
                  <Linkedin className="size-3 text-primary" />
                  <span>Speaker LinkedIn Profile URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/in/speaker-profile"
                  value={editingPastSession.speakerLinkedin || ""}
                  onChange={(e) =>
                    setEditingPastSession({
                      ...editingPastSession,
                      speakerLinkedin: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground font-mono"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-muted-foreground">Topic</label>
                <input
                  type="text"
                  value={editingPastSession.topic}
                  onChange={(e) =>
                    setEditingPastSession({ ...editingPastSession, topic: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-muted-foreground">Summary</label>
                <textarea
                  rows={3}
                  value={editingPastSession.summary}
                  onChange={(e) =>
                    setEditingPastSession({ ...editingPastSession, summary: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingPastSession(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary text-primary-foreground font-semibold"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT ARTICLE ── */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md font-sans">
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-card max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-foreground">Edit Article</h3>
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateArticle} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground">Article Title *</label>
                <input
                  type="text"
                  required
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-muted-foreground">Category</label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, category: e.target.value as any })
                    }
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
                    value={editingArticle.author.name}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        author: { ...editingArticle.author, name: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Short Excerpt</label>
                <textarea
                  rows={2}
                  value={editingArticle.excerpt}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, excerpt: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Full Article Content</label>
                <textarea
                  rows={6}
                  value={editingArticle.content}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, content: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingArticle(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary text-primary-foreground font-semibold"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT SPOTLIGHT ── */}
      {editingSpotlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md font-sans">
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-card max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-foreground">
                Edit Spotlight Recognition
              </h3>
              <button
                type="button"
                onClick={() => setEditingSpotlight(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSpotlight} className="space-y-3 text-xs">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-muted-foreground">Name of Person / Project *</label>
                  <input
                    type="text"
                    required
                    value={editingSpotlight.name}
                    onChange={(e) =>
                      setEditingSpotlight({ ...editingSpotlight, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted-foreground">Category</label>
                  <select
                    value={editingSpotlight.category}
                    onChange={(e) =>
                      setEditingSpotlight({ ...editingSpotlight, category: e.target.value as any })
                    }
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
                  value={editingSpotlight.headline}
                  onChange={(e) =>
                    setEditingSpotlight({ ...editingSpotlight, headline: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Accomplishment</label>
                <input
                  type="text"
                  value={editingSpotlight.accomplishment}
                  onChange={(e) =>
                    setEditingSpotlight({ ...editingSpotlight, accomplishment: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Story</label>
                <textarea
                  rows={3}
                  value={editingSpotlight.story}
                  onChange={(e) =>
                    setEditingSpotlight({ ...editingSpotlight, story: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingSpotlight(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary text-primary-foreground font-semibold"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
