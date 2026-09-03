import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SITE_URL } from "@/lib/site";
import {
  getPrograms,
  savePrograms,
  fetchProgramsFromSupabase,
  saveProgramToSupabase,
  deleteProgramFromSupabase,
  getPastSessions,
  savePastSessions,
  fetchPastSessionsFromSupabase,
  savePastSessionToSupabase,
  deletePastSessionFromSupabase,
  getArticles,
  saveArticles,
  fetchArticlesFromSupabase,
  saveArticleToSupabase,
  deleteArticleFromSupabase,
  getSpotlights,
  saveSpotlights,
  fetchSpotlightsFromSupabase,
  saveSpotlightToSupabase,
  deleteSpotlightFromSupabase,
  getUserSubmissions,
  deleteUserSubmission,
  clearAllUserSubmissions,
  exportAllCmsData,
  importAllCmsData,
  resetAllCmsData,
  getWhatsHappening,
  saveWhatsHappening,
  getUpcomingInitiatives,
  saveUpcomingInitiatives,
  getStudentReviews,
  saveStudentReviews,
  getTeamMembers,
  saveTeamMembers,
  getProjects,
  saveProjects,
  type ProgramEvent,
  type PastSession,
  type ArticleItem,
  type SpotlightEntry,
  type UserSubmission,
  type WhatsHappeningConfig,
  type UpcomingInitiative,
  type StudentReview,
  type TeamMemberNode,
  type ProjectItem,
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
  LogOut,
  Activity,
  Compass,
  MessageSquareQuote,
  Users,
  Cpu,
  CheckCircle2,
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
      { property: "og:url", content: `${SITE_URL}/dashboard` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/dashboard` }],
  }),
  component: DashboardPage,
});

// Master Admin Authentication
const MASTER_ADMIN_EMAIL = "project.polaris8@gmail.com";
// SHA-256 hash of "Polaris#Admin2026!"
const MASTER_ADMIN_HASH = "cfdf042333750e2b68c8b3e840fd7b05c428793bd1dae738b7bb1fd38f34996c";

async function computeSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"student" | "admin">("student");
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminAuthMode, setAdminAuthMode] = useState<"signin" | "setup" | "reset">("signin");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminSuccess, setAdminSuccess] = useState("");

  useEffect(() => {
    // Check local session first for seamless persistence across page reloads
    try {
      const isAuth = sessionStorage.getItem("polaris_admin_authenticated");
      const session = localStorage.getItem("polaris_admin_session");
      if (isAuth === "true" || session) {
        setAdminAuthenticated(true);
        return;
      }
    } catch {
      // Ignore storage errors in private browsing modes
    }

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        const user = data.user;
        const role = (user.app_metadata as Record<string, unknown> | undefined)?.["role"];
        const email = user.email || "";
        const isAdmin =
          role === "admin" || email.endsWith("@projectpolaris.in") || email === MASTER_ADMIN_EMAIL;
        if (isAdmin) {
          setAdminAuthenticated(true);
        }
      }
    });
  }, []);

  // Sync CMS state from Supabase when admin authenticates
  useEffect(() => {
    if (adminAuthenticated) {
      fetchProgramsFromSupabase().then(setProgramsState);
      fetchPastSessionsFromSupabase().then(setPastSessionsState);
      fetchArticlesFromSupabase().then(setArticlesState);
      fetchSpotlightsFromSupabase().then(setSpotlightsState);
    }
  }, [adminAuthenticated]);

  // CMS State
  const [programs, setProgramsState] = useState<ProgramEvent[]>(getPrograms());
  const [pastSessions, setPastSessionsState] = useState<PastSession[]>(getPastSessions());
  const [articles, setArticlesState] = useState<ArticleItem[]>(getArticles());
  const [spotlights, setSpotlightsState] = useState<SpotlightEntry[]>(getSpotlights());
  const [submissions, setSubmissionsState] = useState<UserSubmission[]>(getUserSubmissions());
  const [whatsHappening, setWhatsHappeningState] =
    useState<WhatsHappeningConfig>(getWhatsHappening());
  const [upcomingInitiatives, setUpcomingInitiativesState] =
    useState<UpcomingInitiative[]>(getUpcomingInitiatives());
  const [studentReviews, setStudentReviewsState] = useState<StudentReview[]>(getStudentReviews());
  const [teamMembers, setTeamMembersState] = useState<TeamMemberNode[]>(getTeamMembers());
  const [projects, setProjectsState] = useState<ProjectItem[]>(getProjects());

  const [activeCmsSection, setActiveCmsSection] = useState<
    | "whatsHappening"
    | "initiatives"
    | "reviews"
    | "pastSessions"
    | "team"
    | "projects"
    | "programs"
    | "articles"
    | "spotlight"
    | "submissions"
    | "database"
  >("whatsHappening");

  const [submissionFilter, setSubmissionFilter] = useState<string>("all");
  const [submissionSearch, setSubmissionSearch] = useState<string>("");
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // Edit Modals State
  const [editingProgram, setEditingProgram] = useState<ProgramEvent | null>(null);
  const [editingPastSession, setEditingPastSession] = useState<PastSession | null>(null);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [editingSpotlight, setEditingSpotlight] = useState<SpotlightEntry | null>(null);
  const [editingInitiative, setEditingInitiative] = useState<UpcomingInitiative | null>(null);
  const [editingReview, setEditingReview] = useState<StudentReview | null>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMemberNode | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
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

  // New Upcoming Initiative State
  const [newInitiative, setNewInitiative] = useState<Partial<UpcomingInitiative>>({
    title: "",
    desc: "",
    cta: "Explore →",
    to: "/programs",
    isDirectLink: true,
  });

  // New Student Review State
  const [newReview, setNewReview] = useState<Partial<StudentReview>>({
    name: "",
    role: "Community Member",
    quote: "",
  });

  // New Team Member State
  const [newTeamMember, setNewTeamMember] = useState<Partial<TeamMemberNode>>({
    name: "",
    role: "",
    department: "Simulation & Systems",
    intro: "",
    whatIBring: "",
    orbitRadius: 180,
    orbitAngle: 1.0,
    speed: 0.0005,
  });

  // New Project State
  const [newProject, setNewProject] = useState<Partial<ProjectItem>>({
    title: "",
    category: "Computational Lab",
    domain: "Aerospace & Rocketry",
    summary: "",
    status: "Active Lab",
    deliverables: [],
    link: "/projects",
    team: "Polaris Student Squad",
    featured: false,
  });
  const [newDeliverableInput, setNewDeliverableInput] = useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail) {
      setAdminError("Please enter your administrator email.");
      return;
    }
    if (adminAuthMode !== "reset" && !adminPassword) {
      setAdminError("Please enter your administrator password.");
      return;
    }

    const email = adminEmail.trim().toLowerCase();
    const isAuthorizedEmail = email === MASTER_ADMIN_EMAIL || email.endsWith("@projectpolaris.in");

    if (!isAuthorizedEmail) {
      setAdminError(
        `Access restricted: Only verified Project Polaris administrator email (${MASTER_ADMIN_EMAIL}) is authorized.`,
      );
      return;
    }

    setAdminLoading(true);
    setAdminError("");
    setAdminSuccess("");

    try {
      if (adminAuthMode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.href,
        });
        if (error) {
          setAdminError(error.message);
        } else {
          setAdminSuccess(
            "Password reset instructions have been sent to your administrator email.",
          );
        }
        setAdminLoading(false);
        return;
      }

      // Check Master Administrator Credentials
      if (email === MASTER_ADMIN_EMAIL) {
        const inputHash = await computeSha256(adminPassword.trim());
        if (inputHash === MASTER_ADMIN_HASH) {
          try {
            sessionStorage.setItem("polaris_admin_authenticated", "true");
            localStorage.setItem(
              "polaris_admin_session",
              JSON.stringify({ email: MASTER_ADMIN_EMAIL, at: Date.now() }),
            );
          } catch {
            // Ignore storage errors
          }
          setAdminAuthenticated(true);
          setAdminError("");
          setAdminSuccess("✓ Authenticated successfully as Master Administrator!");
          // Non-blocking background sync attempt with Supabase auth
          supabase.auth.signInWithPassword({ email, password: adminPassword }).catch(() => {});
          setAdminLoading(false);
          return;
        }
      }

      if (adminAuthMode === "setup") {
        if (adminPassword.length < 8) {
          setAdminError("Password must be at least 8 characters long.");
          setAdminLoading(false);
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password: adminPassword,
          options: {
            data: { role: "admin", full_name: "Polaris Administrator" },
          },
        });
        if (error) {
          setAdminError(error.message);
          setAdminLoading(false);
          return;
        }
        if (data.session) {
          try {
            sessionStorage.setItem("polaris_admin_authenticated", "true");
          } catch {
            // Ignore storage errors in private browsing
          }
          setAdminAuthenticated(true);
          setAdminSuccess("Admin credentials created and authenticated successfully!");
        } else {
          setAdminSuccess(
            "Admin account created! Please check your email inbox to verify your address, then sign in.",
          );
          setAdminAuthMode("signin");
        }
        setAdminLoading(false);
        return;
      }

      // Fallback: Check Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: adminPassword,
      });
      if (!error && data?.user) {
        const user = data.user;
        const role = (user?.app_metadata as Record<string, unknown> | undefined)?.["role"];
        const userEmail = user?.email || "";
        const isAdmin =
          role === "admin" ||
          userEmail.endsWith("@projectpolaris.in") ||
          userEmail === MASTER_ADMIN_EMAIL;
        if (isAdmin) {
          try {
            sessionStorage.setItem("polaris_admin_authenticated", "true");
          } catch {
            // Ignore storage errors in private browsing
          }
          setAdminAuthenticated(true);
          setAdminError("");
          setAdminLoading(false);
          return;
        }
      }

      setAdminError("Invalid administrator credentials. Please check your email and password.");
    } catch {
      setAdminError("Authentication request failed. Please check network connectivity.");
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAdminLogout = () => {
    try {
      sessionStorage.removeItem("polaris_admin_authenticated");
      localStorage.removeItem("polaris_admin_session");
      supabase.auth.signOut().catch(() => {});
    } catch {
      // Ignore storage errors in private browsing
    }
    setAdminAuthenticated(false);
    setAdminEmail("");
    setAdminPassword("");
    setStatusFeedback("✓ Logged out of Admin CMS.");
    setTimeout(() => setStatusFeedback(null), 2500);
  };

  // ── Programs CRUD Handlers ──
  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgram.title) return;
    const prog: ProgramEvent = {
      id: `prog-${Date.now()}`,
      title: newProgram.title || "New Program",
      subtitle: newProgram.subtitle || "",
      category: (newProgram.category as ProgramEvent["category"]) || "workshop",
      status: (newProgram.status as ProgramEvent["status"]) || "upcoming",
      date: newProgram.date || "Upcoming 2026",
      mode: (newProgram.mode as ProgramEvent["mode"]) || "Online",
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
      ...(newProgram.time ? { time: newProgram.time } : {}),
      ...(newProgram.speaker?.name
        ? {
            speaker: {
              name: newProgram.speaker.name,
              designation: newProgram.speaker.designation || "Speaker",
              ...(newProgram.speaker.bio ? { bio: newProgram.speaker.bio } : {}),
              ...(newProgram.speaker.photo ? { photo: newProgram.speaker.photo } : {}),
              ...(newProgram.speaker.linkedin ? { linkedin: newProgram.speaker.linkedin } : {}),
            },
          }
        : {}),
    };
    const updated = [prog, ...programs];
    setProgramsState(updated);
    savePrograms(updated);
    saveProgramToSupabase(prog).then((res) => {
      if (res.success) {
        setStatusFeedback("✓ Program published to Supabase database & live across website!");
      } else {
        setStatusFeedback(
          "✓ Program saved locally in draft sandbox (Supabase offline/unmigrated).",
        );
      }
      setTimeout(() => setStatusFeedback(null), 4000);
    });
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
    saveProgramToSupabase(editingProgram).then((res) => {
      if (res.success) {
        setStatusFeedback("✓ Program updated in Supabase database & live across website!");
      } else {
        setStatusFeedback("✓ Program updated in local browser cache.");
      }
      setTimeout(() => setStatusFeedback(null), 4000);
    });
    setEditingProgram(null);
  };

  const handleDeleteProgram = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this program?")) return;
    const updated = programs.filter((p) => p.id !== id);
    setProgramsState(updated);
    savePrograms(updated);
    deleteProgramFromSupabase(id).then(() => {
      setStatusFeedback("✓ Program removed from database.");
      setTimeout(() => setStatusFeedback(null), 3000);
    });
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
      ...(newPastSession.speakerLinkedin
        ? { speakerLinkedin: newPastSession.speakerLinkedin }
        : {}),
      topic: newPastSession.topic || "",
      participants: newPastSession.participants || "50+ Participants",
      summary: newPastSession.summary || "",
    };
    const updated = [session, ...pastSessions];
    setPastSessionsState(updated);
    savePastSessions(updated);
    savePastSessionToSupabase(session).then((res) => {
      if (res.success) {
        setStatusFeedback("✓ Past session published to Supabase & visible in Historical Archives!");
      } else {
        setStatusFeedback("✓ Past session saved locally in draft sandbox.");
      }
      setTimeout(() => setStatusFeedback(null), 4000);
    });
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
    savePastSessionToSupabase(editingPastSession).then((res) => {
      if (res.success) {
        setStatusFeedback("✓ Past session updated in Supabase database!");
      } else {
        setStatusFeedback("✓ Past session updated in local cache.");
      }
      setTimeout(() => setStatusFeedback(null), 4000);
    });
    setEditingPastSession(null);
  };

  const handleDeletePastSession = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this past session?")) return;
    const updated = pastSessions.filter((s) => s.id !== id);
    setPastSessionsState(updated);
    savePastSessions(updated);
    deletePastSessionFromSupabase(id).then(() => {
      setStatusFeedback("✓ Past session removed from database.");
      setTimeout(() => setStatusFeedback(null), 3000);
    });
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
      category: (newArticle.category as ArticleItem["category"]) || "Science & Astronomy",
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
    saveArticleToSupabase(art).then((res) => {
      if (res.success) {
        setStatusFeedback("✓ Article published to Supabase & live on the Articles page!");
      } else {
        setStatusFeedback("✓ Article saved locally in draft sandbox.");
      }
      setTimeout(() => setStatusFeedback(null), 4000);
    });
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
    saveArticleToSupabase(editingArticle).then((res) => {
      if (res.success) {
        setStatusFeedback("✓ Article updated in Supabase & live on Articles page!");
      } else {
        setStatusFeedback("✓ Article updated in local cache.");
      }
      setTimeout(() => setStatusFeedback(null), 4000);
    });
    setEditingArticle(null);
  };

  const handleDeleteArticle = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this article?")) return;
    const updated = articles.filter((a) => a.id !== id);
    setArticlesState(updated);
    saveArticles(updated);
    deleteArticleFromSupabase(id).then(() => {
      setStatusFeedback("✓ Article removed from database.");
      setTimeout(() => setStatusFeedback(null), 3000);
    });
  };

  // ── Spotlight CRUD Handlers ──
  const handleAddSpotlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpotlight.name) return;
    const spot: SpotlightEntry = {
      id: `spot-${Date.now()}`,
      name: newSpotlight.name || "Featured Builder",
      category: (newSpotlight.category as SpotlightEntry["category"]) || "Student Spotlight",
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
    saveSpotlightToSupabase(spot).then((res) => {
      if (res.success) {
        setStatusFeedback(
          "✓ Spotlight feature published to Supabase & live on the Spotlight page!",
        );
      } else {
        setStatusFeedback("✓ Spotlight feature saved locally in draft sandbox.");
      }
      setTimeout(() => setStatusFeedback(null), 4000);
    });
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
    saveSpotlightToSupabase(editingSpotlight).then((res) => {
      if (res.success) {
        setStatusFeedback("✓ Spotlight updated in Supabase & live across website!");
      } else {
        setStatusFeedback("✓ Spotlight updated in local cache.");
      }
      setTimeout(() => setStatusFeedback(null), 4000);
    });
    setEditingSpotlight(null);
  };

  const handleDeleteSpotlight = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this spotlight recognition?")) return;
    const updated = spotlights.filter((s) => s.id !== id);
    setSpotlightsState(updated);
    saveSpotlights(updated);
    deleteSpotlightFromSupabase(id).then(() => {
      setStatusFeedback("✓ Spotlight removed from database.");
      setTimeout(() => setStatusFeedback(null), 3000);
    });
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
      setWhatsHappeningState(getWhatsHappening());
      setUpcomingInitiativesState(getUpcomingInitiatives());
      setStudentReviewsState(getStudentReviews());
      setTeamMembersState(getTeamMembers());
      setProjectsState(getProjects());
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
      setWhatsHappeningState(getWhatsHappening());
      setUpcomingInitiativesState(getUpcomingInitiatives());
      setStudentReviewsState(getStudentReviews());
      setTeamMembersState(getTeamMembers());
      setProjectsState(getProjects());
      setStatusFeedback("✓ Website database reset to initial seed defaults.");
      setTimeout(() => setStatusFeedback(null), 4000);
    }
  };

  // ── What's Happening Now Handlers ──
  const handleSaveWhatsHappening = (e: React.FormEvent) => {
    e.preventDefault();
    saveWhatsHappening(whatsHappening);
    setStatusFeedback("✓ 'What's Happening Now' published live to home page!");
    setTimeout(() => setStatusFeedback(null), 4000);
  };

  // ── Upcoming Initiatives Handlers ──
  const handleAddInitiative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInitiative.title) return;
    const item: UpcomingInitiative = {
      id: `init-${Date.now()}`,
      title: newInitiative.title,
      desc: newInitiative.desc || "",
      cta: newInitiative.cta || "Explore →",
      to: newInitiative.to || "/programs",
      isDirectLink: Boolean(newInitiative.isDirectLink),
    };
    const updated = [...upcomingInitiatives, item];
    setUpcomingInitiativesState(updated);
    saveUpcomingInitiatives(updated);
    setStatusFeedback("✓ Upcoming initiative published to live website!");
    setTimeout(() => setStatusFeedback(null), 3000);
    setNewInitiative({
      title: "",
      desc: "",
      cta: "Explore →",
      to: "/programs",
      isDirectLink: true,
    });
  };

  const handleUpdateInitiative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInitiative) return;
    const updated = upcomingInitiatives.map((it) =>
      it.id === editingInitiative.id ? editingInitiative : it,
    );
    setUpcomingInitiativesState(updated);
    saveUpcomingInitiatives(updated);
    setStatusFeedback("✓ Upcoming initiative updated on live website!");
    setTimeout(() => setStatusFeedback(null), 3000);
    setEditingInitiative(null);
  };

  const handleDeleteInitiative = (id: string) => {
    if (!window.confirm("Remove this upcoming initiative?")) return;
    const updated = upcomingInitiatives.filter((it) => it.id !== id);
    setUpcomingInitiativesState(updated);
    saveUpcomingInitiatives(updated);
    setStatusFeedback("✓ Initiative removed.");
    setTimeout(() => setStatusFeedback(null), 2500);
  };

  // ── Student Reviews Handlers ──
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.quote) return;
    const rev: StudentReview = {
      id: `rev-${Date.now()}`,
      name: newReview.name,
      role: newReview.role || "Community Member",
      quote: newReview.quote,
    };
    const updated = [...studentReviews, rev];
    setStudentReviewsState(updated);
    saveStudentReviews(updated);
    setStatusFeedback("✓ Student review published live to testimonials!");
    setTimeout(() => setStatusFeedback(null), 3000);
    setNewReview({ name: "", role: "Community Member", quote: "" });
  };

  const handleUpdateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    const updated = studentReviews.map((r) => (r.id === editingReview.id ? editingReview : r));
    setStudentReviewsState(updated);
    saveStudentReviews(updated);
    setStatusFeedback("✓ Student review updated live!");
    setTimeout(() => setStatusFeedback(null), 3000);
    setEditingReview(null);
  };

  const handleDeleteReview = (id: string) => {
    if (!window.confirm("Remove this student review?")) return;
    const updated = studentReviews.filter((r) => r.id !== id);
    setStudentReviewsState(updated);
    saveStudentReviews(updated);
    setStatusFeedback("✓ Student review removed.");
    setTimeout(() => setStatusFeedback(null), 2500);
  };

  // ── Team Members (People Behind Polaris) Handlers ──
  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamMember.name || !newTeamMember.role) return;
    const member: TeamMemberNode = {
      id: `team-${Date.now()}`,
      name: newTeamMember.name,
      department: newTeamMember.department || "Operations",
      role: newTeamMember.role,
      intro: newTeamMember.intro || "",
      whatIBring: newTeamMember.whatIBring || "",
      orbitRadius: Number(newTeamMember.orbitRadius) || 180,
      orbitAngle: Number(newTeamMember.orbitAngle) || 1.2,
      speed: Number(newTeamMember.speed) || 0.0005,
    };
    const updated = [...teamMembers, member];
    setTeamMembersState(updated);
    saveTeamMembers(updated);
    setStatusFeedback("✓ Team member added to People Behind Polaris!");
    setTimeout(() => setStatusFeedback(null), 3000);
    setNewTeamMember({
      name: "",
      role: "",
      department: "Simulation & Systems",
      intro: "",
      whatIBring: "",
      orbitRadius: 180,
      orbitAngle: 1.0,
      speed: 0.0005,
    });
  };

  const handleUpdateTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeamMember) return;
    const updated = teamMembers.map((m) => (m.id === editingTeamMember.id ? editingTeamMember : m));
    setTeamMembersState(updated);
    saveTeamMembers(updated);
    setStatusFeedback("✓ Team member updated live in Constellation!");
    setTimeout(() => setStatusFeedback(null), 3000);
    setEditingTeamMember(null);
  };

  const handleDeleteTeamMember = (id: string) => {
    if (!window.confirm("Remove this team member from People Behind Polaris?")) return;
    const updated = teamMembers.filter((m) => m.id !== id);
    setTeamMembersState(updated);
    saveTeamMembers(updated);
    setStatusFeedback("✓ Team member removed.");
    setTimeout(() => setStatusFeedback(null), 2500);
  };

  // ── Projects Handlers ──
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;
    const proj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: newProject.title,
      category: (newProject.category as ProjectItem["category"]) || "Computational Lab",
      domain: newProject.domain || "Aerospace & Rocketry",
      summary: newProject.summary || "",
      status: (newProject.status as ProjectItem["status"]) || "Active Lab",
      deliverables: Array.isArray(newProject.deliverables) ? newProject.deliverables : [],
      link: newProject.link || "/projects",
      team: newProject.team || "Polaris Student Squad",
      featured: Boolean(newProject.featured),
    };
    const updated = [proj, ...projects];
    setProjectsState(updated);
    saveProjects(updated);
    setStatusFeedback("✓ Project published live to /projects and labs!");
    setTimeout(() => setStatusFeedback(null), 3000);
    setNewProject({
      title: "",
      category: "Computational Lab",
      domain: "Aerospace & Rocketry",
      summary: "",
      status: "Active Lab",
      deliverables: [],
      link: "/projects",
      team: "Polaris Student Squad",
      featured: false,
    });
  };

  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    const updated = projects.map((p) => (p.id === editingProject.id ? editingProject : p));
    setProjectsState(updated);
    saveProjects(updated);
    setStatusFeedback("✓ Project updated live across website!");
    setTimeout(() => setStatusFeedback(null), 3000);
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    if (!window.confirm("Remove this project from computational labs?")) return;
    const updated = projects.filter((p) => p.id !== id);
    setProjectsState(updated);
    saveProjects(updated);
    setStatusFeedback("✓ Project removed.");
    setTimeout(() => setStatusFeedback(null), 2500);
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
              /* Admin Authentication Gate */
              <div className="max-w-md mx-auto p-7 rounded-2xl border border-white/10 bg-card text-center space-y-4 shadow-xl">
                <div className="size-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto">
                  <Lock className="size-5" />
                </div>
                <h3 className="text-xl font-bold font-display text-foreground">
                  Admin CMS Authentication
                </h3>
                <p className="text-xs text-muted-foreground">
                  Sign in with your Project Polaris administrator credentials to manage live
                  programs, past sessions, articles, and spotlights.
                </p>

                {/* Mode Selector */}
                <div className="flex rounded-lg bg-surface-2 p-1 border border-white/8 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setAdminAuthMode("signin");
                      setAdminError("");
                      setAdminSuccess("");
                    }}
                    className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
                      adminAuthMode === "signin"
                        ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminAuthMode("setup");
                      setAdminError("");
                      setAdminSuccess("");
                    }}
                    className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
                      adminAuthMode === "setup"
                        ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Set Password / Setup
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminAuthMode("reset");
                      setAdminError("");
                      setAdminSuccess("");
                    }}
                    className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
                      adminAuthMode === "reset"
                        ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Reset
                  </button>
                </div>

                {/* Authorized Account Hint */}
                <div className="p-2.5 rounded-lg bg-surface/80 border border-white/6 text-left text-[11px] text-muted-foreground space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-primary font-semibold text-[10px] uppercase">
                      Authorized Admin Email:
                    </span>
                    <button
                      type="button"
                      onClick={() => setAdminEmail("project.polaris8@gmail.com")}
                      className="text-[10px] text-primary hover:underline font-mono"
                    >
                      Use Default
                    </button>
                  </div>
                  <code className="text-[11px] text-foreground font-mono block bg-black/30 px-2 py-1 rounded">
                    project.polaris8@gmail.com
                  </code>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-3 text-xs pt-1 text-left">
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">
                      Admin Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="project.polaris8@gmail.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-surface border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary/50 font-mono"
                    />
                  </div>

                  {adminAuthMode !== "reset" && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] text-muted-foreground">
                          {adminAuthMode === "setup"
                            ? "Create Password (min 8 chars) *"
                            : "Admin Password *"}
                        </label>
                        {adminAuthMode === "signin" && (
                          <button
                            type="button"
                            onClick={() => setAdminAuthMode("reset")}
                            className="text-[10px] text-primary hover:underline"
                          >
                            Forgot?
                          </button>
                        )}
                      </div>
                      <input
                        type="password"
                        required
                        placeholder={
                          adminAuthMode === "setup"
                            ? "Enter a secure new password"
                            : "Enter administrator password"
                        }
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-surface border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary/50 font-mono"
                      />
                    </div>
                  )}

                  {adminError && (
                    <p className="text-rose-400 text-[11px] bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg">
                      {adminError}
                    </p>
                  )}

                  {adminSuccess && (
                    <p className="text-emerald-400 text-[11px] bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">
                      {adminSuccess}
                    </p>
                  )}

                  <Button
                    type="submit"
                    size="sm"
                    disabled={adminLoading}
                    className="w-full h-9 bg-primary text-primary-foreground font-semibold rounded-lg active:scale-[0.97]"
                  >
                    {adminLoading
                      ? "Processing..."
                      : adminAuthMode === "setup"
                        ? "Save & Authenticate Admin"
                        : adminAuthMode === "reset"
                          ? "Send Password Reset Link"
                          : "Authenticate as Admin"}
                  </Button>
                </form>
              </div>
            ) : (
              /* ── Authenticated Admin CMS Workspace ── */
              <div className="space-y-6">
                {/* Supabase Live Sync & Cloud Persistence Banner */}
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold flex items-center gap-1.5 text-primary-200">
                      <ShieldCheck className="size-4 text-primary" />
                      <span>Supabase Live Database Sync</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Edits are securely synchronized with Supabase database tables via Row Level
                      Security (RLS) and backed up locally for offline performance.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAdminLogout}
                    className="h-7 text-[11px] border-amber-500/30 text-amber-200 hover:bg-amber-500/20 shrink-0 flex items-center gap-1.5"
                  >
                    <LogOut className="size-3" />
                    <span>Sign Out & Lock CMS</span>
                  </Button>
                </div>

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
                        id: "whatsHappening",
                        label: "What's Happening Now",
                        icon: Activity,
                      },
                      {
                        id: "initiatives",
                        label: `Upcoming Initiatives (${upcomingInitiatives.length})`,
                        icon: Compass,
                      },
                      {
                        id: "reviews",
                        label: `What Students Say (${studentReviews.length})`,
                        icon: MessageSquareQuote,
                      },
                      {
                        id: "pastSessions",
                        label: `Voices Behind Polaris (${pastSessions.length})`,
                        icon: History,
                      },
                      {
                        id: "team",
                        label: `People Behind Polaris (${teamMembers.length})`,
                        icon: Users,
                      },
                      {
                        id: "projects",
                        label: `Projects & Labs (${projects.length})`,
                        icon: Cpu,
                      },
                      {
                        id: "programs",
                        label: `Programs (${programs.length})`,
                        icon: Calendar,
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
                      { id: "database", label: "Backup & Restore", icon: Download },
                    ].map((sec) => {
                      const Icon = sec.icon;
                      return (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => setActiveCmsSection(sec.id as typeof activeCmsSection)}
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

                {/* ── 1. WHAT'S HAPPENING NOW CMS ── */}
                {activeCmsSection === "whatsHappening" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-primary/20 bg-card space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase font-mono">
                          <Activity className="size-4" />
                          <span>Manage "What's Happening Now?" Section</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground font-mono bg-surface-2 px-2.5 py-0.5 rounded-full border border-white/6">
                          Live on Home Page (Section 3)
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Control the featured live masterclass or active announcement shown on the
                        Project Polaris home page, including the real-time countdown timer, speaker
                        profile, and registration CTA.
                      </p>

                      <form
                        onSubmit={handleSaveWhatsHappening}
                        className="grid gap-4 sm:grid-cols-2 text-xs"
                      >
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-muted-foreground font-medium">
                            Session Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={whatsHappening.title}
                            onChange={(e) =>
                              setWhatsHappeningState({ ...whatsHappening, title: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-muted-foreground font-medium">
                            Full Description / Details *
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={whatsHappening.details}
                            onChange={(e) =>
                              setWhatsHappeningState({ ...whatsHappening, details: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground font-medium">
                            Date Display *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 29 August 2026"
                            value={whatsHappening.date}
                            onChange={(e) =>
                              setWhatsHappeningState({ ...whatsHappening, date: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground font-medium">Time *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 6:00 PM IST"
                            value={whatsHappening.time}
                            onChange={(e) =>
                              setWhatsHappeningState({ ...whatsHappening, time: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground font-medium">
                            Delivery Mode *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Online (Live) or Hybrid"
                            value={whatsHappening.mode}
                            onChange={(e) =>
                              setWhatsHappeningState({ ...whatsHappening, mode: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground font-medium">
                            Countdown Target (ISO format) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 2026-08-29T18:00:00+05:30"
                            value={whatsHappening.targetDate}
                            onChange={(e) =>
                              setWhatsHappeningState({
                                ...whatsHappening,
                                targetDate: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground font-mono text-xs"
                          />
                          <span className="text-[10px] text-muted-foreground">
                            Used by the real-time live countdown timer.
                          </span>
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground font-medium">
                            Speaker Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Dr. Baldev Krishna Sharma"
                            value={whatsHappening.speakerName}
                            onChange={(e) =>
                              setWhatsHappeningState({
                                ...whatsHappening,
                                speakerName: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground font-medium">
                            Speaker Designation *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Cosmologist & Astrophysicist"
                            value={whatsHappening.speakerDesignation}
                            onChange={(e) =>
                              setWhatsHappeningState({
                                ...whatsHappening,
                                speakerDesignation: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-muted-foreground font-medium">
                            Speaker LinkedIn Profile URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://www.linkedin.com/in/..."
                            value={whatsHappening.speakerLinkedin || ""}
                            onChange={(e) =>
                              setWhatsHappeningState({
                                ...whatsHappening,
                                speakerLinkedin: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground font-medium">
                            CTA Button Text *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Register Now (Free) or View Details"
                            value={whatsHappening.ctaText}
                            onChange={(e) =>
                              setWhatsHappeningState({ ...whatsHappening, ctaText: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground font-medium">
                            CTA Destination URL *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. /programs or Google Form link"
                            value={whatsHappening.ctaUrl}
                            onChange={(e) =>
                              setWhatsHappeningState({ ...whatsHappening, ctaUrl: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="sm:col-span-2 pt-2">
                          <Button
                            type="submit"
                            size="sm"
                            className="h-9 px-6 bg-primary text-primary-foreground font-semibold rounded-lg active:scale-[0.97]"
                          >
                            Save & Publish "What's Happening Now" Live
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* ── 2. UPCOMING INITIATIVES CMS ── */}
                {activeCmsSection === "initiatives" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-primary/20 bg-card space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase font-mono">
                        <Plus className="size-4" />
                        <span>Add New Upcoming Initiative</span>
                      </div>

                      <form
                        onSubmit={handleAddInitiative}
                        className="grid gap-3 sm:grid-cols-2 text-xs"
                      >
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-muted-foreground">Initiative Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Space Hardware Accelerator"
                            value={newInitiative.title}
                            onChange={(e) =>
                              setNewInitiative({ ...newInitiative, title: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-muted-foreground">Description *</label>
                          <textarea
                            rows={2}
                            required
                            placeholder="Brief description of the initiative and learning goals..."
                            value={newInitiative.desc}
                            onChange={(e) =>
                              setNewInitiative({ ...newInitiative, desc: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground">Button Text</label>
                          <input
                            type="text"
                            placeholder="e.g. Explore Initiative →"
                            value={newInitiative.cta}
                            onChange={(e) =>
                              setNewInitiative({ ...newInitiative, cta: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground">Target Route / Link</label>
                          <input
                            type="text"
                            placeholder="e.g. /programs or /chapters"
                            value={newInitiative.to}
                            onChange={(e) =>
                              setNewInitiative({ ...newInitiative, to: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                          <input
                            type="checkbox"
                            id="isDirectLink"
                            checked={newInitiative.isDirectLink}
                            onChange={(e) =>
                              setNewInitiative({ ...newInitiative, isDirectLink: e.target.checked })
                            }
                            className="rounded border-white/10 text-primary focus:ring-primary"
                          />
                          <label
                            htmlFor="isDirectLink"
                            className="text-xs text-muted-foreground cursor-pointer"
                          >
                            Direct Page Navigation (Uncheck to trigger Waitlist Notification Modal
                            instead)
                          </label>
                        </div>

                        <div className="sm:col-span-2 pt-2">
                          <Button
                            type="submit"
                            size="sm"
                            className="h-9 px-6 bg-primary text-primary-foreground font-semibold rounded-lg active:scale-[0.97]"
                          >
                            Add Initiative to Website
                          </Button>
                        </div>
                      </form>
                    </div>

                    {/* Active Initiatives List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                        Active Upcoming Initiatives ({upcomingInitiatives.length})
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {upcomingInitiatives.map((it) => (
                          <div
                            key={it.id}
                            className="p-5 rounded-xl border border-white/8 bg-card flex flex-col justify-between space-y-3"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h5 className="font-bold text-foreground font-display text-sm">
                                  {it.title}
                                </h5>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-white/6 text-primary font-mono shrink-0">
                                  {it.isDirectLink ? "Direct Link" : "Waitlist Modal"}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {it.desc}
                              </p>
                              <div className="text-[11px] text-primary/80 font-mono mt-2">
                                Button: "{it.cta}" → {it.to || "Waitlist Modal"}
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/6">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingInitiative(it)}
                                className="h-7 text-xs border-white/10"
                              >
                                <Edit2 className="size-3 mr-1" />
                                <span>Edit</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteInitiative(it.id)}
                                className="h-7 text-xs border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                              >
                                <Trash2 className="size-3 mr-1" />
                                <span>Remove</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── 3. WHAT STUDENTS SAY (REVIEWS) CMS ── */}
                {activeCmsSection === "reviews" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-primary/20 bg-card space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase font-mono">
                        <Plus className="size-4" />
                        <span>Add Student Testimonial / Review</span>
                      </div>

                      <form
                        onSubmit={handleAddReview}
                        className="grid gap-3 sm:grid-cols-2 text-xs"
                      >
                        <div className="space-y-1">
                          <label className="text-muted-foreground">Student Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Debolina Ghosh"
                            value={newReview.name}
                            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground">Role / Designation *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Community Member, Volunteer, Associate Member"
                            value={newReview.role}
                            onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-muted-foreground">Quote / Testimonial *</label>
                          <textarea
                            rows={3}
                            required
                            placeholder="What did the student say about Project Polaris workshops, community, or projects?"
                            value={newReview.quote}
                            onChange={(e) => setNewReview({ ...newReview, quote: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                          />
                        </div>

                        <div className="sm:col-span-2 pt-2">
                          <Button
                            type="submit"
                            size="sm"
                            className="h-9 px-6 bg-primary text-primary-foreground font-semibold rounded-lg active:scale-[0.97]"
                          >
                            Publish Testimonial to Website
                          </Button>
                        </div>
                      </form>
                    </div>

                    {/* Active Reviews Grid */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                        Student Reviews ({studentReviews.length})
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {studentReviews.map((r) => (
                          <div
                            key={r.id}
                            className="p-5 rounded-xl border border-white/8 bg-card flex flex-col justify-between space-y-3"
                          >
                            <p className="text-xs text-foreground/90 italic leading-relaxed">
                              "{r.quote}"
                            </p>

                            <div className="flex items-center justify-between pt-3 border-t border-white/6">
                              <div className="flex items-center gap-2.5">
                                <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                  {r.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-foreground text-xs font-display">
                                    {r.name}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground">{r.role}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingReview(r)}
                                  className="h-7 px-2 text-xs"
                                >
                                  <Edit2 className="size-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteReview(r.id)}
                                  className="h-7 px-2 text-xs text-rose-400 hover:text-rose-300"
                                >
                                  <Trash2 className="size-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── 4. PEOPLE BEHIND POLARIS (TEAM CONSTELLATION) CMS ── */}
                {activeCmsSection === "team" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-primary/20 bg-card space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase font-mono">
                        <Plus className="size-4" />
                        <span>Add Team Member to People Behind Polaris</span>
                      </div>

                      <form
                        onSubmit={handleAddTeamMember}
                        className="grid gap-3 sm:grid-cols-2 text-xs"
                      >
                        <div className="space-y-1">
                          <label className="text-muted-foreground">Full Name / Squad Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Engineering Squad or Student Name"
                            value={newTeamMember.name}
                            onChange={(e) =>
                              setNewTeamMember({ ...newTeamMember, name: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground">Role Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Aerospace & Systems Engineering"
                            value={newTeamMember.role}
                            onChange={(e) =>
                              setNewTeamMember({ ...newTeamMember, role: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground">Department *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Simulation & Systems, Operations, Research"
                            value={newTeamMember.department}
                            onChange={(e) =>
                              setNewTeamMember({ ...newTeamMember, department: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground">What I Bring (Quote) *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Architecting simulation engines and student workflows."
                            value={newTeamMember.whatIBring}
                            onChange={(e) =>
                              setNewTeamMember({ ...newTeamMember, whatIBring: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-muted-foreground">Intro / Bio *</label>
                          <textarea
                            rows={2}
                            required
                            placeholder="Tell visitors about this squad or team leader's contribution to Polaris..."
                            value={newTeamMember.intro}
                            onChange={(e) =>
                              setNewTeamMember({ ...newTeamMember, intro: e.target.value })
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
                            Add Team Member to Constellation
                          </Button>
                        </div>
                      </form>
                    </div>

                    {/* Team Members List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                        Current Team Members ({teamMembers.length})
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {teamMembers.map((m) => (
                          <div
                            key={m.id}
                            className="p-5 rounded-xl border border-white/8 bg-card flex flex-col justify-between space-y-3"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                  {m.name.charAt(0)}
                                </div>
                                <div>
                                  <h5 className="font-bold text-foreground font-display text-sm">
                                    {m.name}
                                  </h5>
                                  <p className="text-[11px] text-primary">{m.role}</p>
                                </div>
                              </div>
                              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">
                                {m.department}
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {m.intro}
                              </p>
                              <div className="text-[11px] text-foreground/80 italic font-sans border-l-2 border-primary/40 pl-2">
                                "{m.whatIBring}"
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/6">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingTeamMember(m)}
                                className="h-7 text-xs border-white/10"
                              >
                                <Edit2 className="size-3 mr-1" />
                                <span>Edit</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteTeamMember(m.id)}
                                className="h-7 text-xs border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                              >
                                <Trash2 className="size-3 mr-1" />
                                <span>Remove</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── 5. PROJECTS & COMPUTATIONAL LABS CMS ── */}
                {activeCmsSection === "projects" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-primary/20 bg-card space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase font-mono">
                        <Plus className="size-4" />
                        <span>Publish New Computational Lab / Project</span>
                      </div>

                      <form
                        onSubmit={handleAddProject}
                        className="grid gap-3 sm:grid-cols-2 text-xs"
                      >
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-muted-foreground">Project Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. AeroForge Aerodynamics Workstation"
                            value={newProject.title}
                            onChange={(e) =>
                              setNewProject({ ...newProject, title: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground">Category</label>
                          <select
                            value={newProject.category}
                            onChange={(e) =>
                              setNewProject({
                                ...newProject,
                                category: e.target.value as ProjectItem["category"],
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          >
                            <option value="Computational Lab">Computational Lab</option>
                            <option value="AeroForge Physics">AeroForge Physics</option>
                            <option value="Hardware Simulation">Hardware Simulation</option>
                            <option value="Research Project">Research Project</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground">Domain Area</label>
                          <input
                            type="text"
                            placeholder="e.g. Computational Fluid Dynamics or Orbital Mechanics"
                            value={newProject.domain}
                            onChange={(e) =>
                              setNewProject({ ...newProject, domain: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground">Development Status</label>
                          <select
                            value={newProject.status}
                            onChange={(e) =>
                              setNewProject({
                                ...newProject,
                                status: e.target.value as ProjectItem["status"],
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          >
                            <option value="Active Lab">Active Lab</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Open for Contributors">Open for Contributors</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-muted-foreground">Team / Squad Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Polaris Aerospace Simulation Squad"
                            value={newProject.team}
                            onChange={(e) => setNewProject({ ...newProject, team: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-muted-foreground">Project Link / Route</label>
                          <input
                            type="text"
                            placeholder="e.g. /projects#aeroforge-lab or GitHub URL"
                            value={newProject.link}
                            onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-muted-foreground">Summary / Mission Goal *</label>
                          <textarea
                            rows={3}
                            required
                            placeholder="What does this lab calculate, solve, or build?"
                            value={newProject.summary}
                            onChange={(e) =>
                              setNewProject({ ...newProject, summary: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-muted-foreground">
                            Key Deliverables (Add bullet points)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="e.g. Airfoil pressure solver script"
                              value={newDeliverableInput}
                              onChange={(e) => setNewDeliverableInput(e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (newDeliverableInput.trim()) {
                                  const list = newProject.deliverables || [];
                                  setNewProject({
                                    ...newProject,
                                    deliverables: [...list, newDeliverableInput.trim()],
                                  });
                                  setNewDeliverableInput("");
                                }
                              }}
                              className="h-8 text-xs shrink-0"
                            >
                              Add Chip
                            </Button>
                          </div>
                          {newProject.deliverables && newProject.deliverables.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {newProject.deliverables.map((d, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 rounded bg-surface-2 border border-white/10 text-foreground font-mono flex items-center gap-1"
                                >
                                  <span>{d}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...(newProject.deliverables || [])];
                                      updated.splice(i, 1);
                                      setNewProject({ ...newProject, deliverables: updated });
                                    }}
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="sm:col-span-2 pt-2">
                          <Button
                            type="submit"
                            size="sm"
                            className="h-9 px-6 bg-primary text-primary-foreground font-semibold rounded-lg active:scale-[0.97]"
                          >
                            Publish Project to /projects
                          </Button>
                        </div>
                      </form>
                    </div>

                    {/* Active Projects List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                        Active Projects & Labs ({projects.length})
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {projects.map((proj) => (
                          <div
                            key={proj.id}
                            className="p-5 rounded-xl border border-white/8 bg-card flex flex-col justify-between space-y-3"
                          >
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-1.5">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">
                                  {proj.category}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-white/8 text-muted-foreground">
                                  {proj.status}
                                </span>
                              </div>

                              <div>
                                <h5 className="font-bold text-foreground font-display text-sm">
                                  {proj.title}
                                </h5>
                                <p className="text-[11px] font-mono text-primary/80">
                                  {proj.domain}
                                </p>
                              </div>

                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {proj.summary}
                              </p>

                              {proj.deliverables && proj.deliverables.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {proj.deliverables.map((d) => (
                                    <span
                                      key={d}
                                      className="text-[9px] px-1.5 py-0.5 rounded bg-surface border border-white/6 text-foreground font-mono"
                                    >
                                      {d}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-white/6">
                              <span className="text-[11px] text-muted-foreground">{proj.team}</span>

                              <div className="flex items-center gap-1.5">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setNewDeliverableInput("");
                                    setEditingProject(proj);
                                  }}
                                  className="h-7 text-xs border-white/10"
                                >
                                  <Edit2 className="size-3 mr-1" />
                                  <span>Edit</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteProject(proj.id)}
                                  className="h-7 text-xs border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                                >
                                  <Trash2 className="size-3 mr-1" />
                                  <span>Remove</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

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
                              setNewProgram({
                                ...newProgram,
                                category: e.target.value as ProgramEvent["category"],
                              })
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
                                  name: newProgram.speaker?.name || "",
                                  designation: newProgram.speaker?.designation || "",
                                  linkedin: e.target.value,
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

                {/* ── B. VOICES BEHIND POLARIS (PAST SESSIONS CMS) ── */}
                {activeCmsSection === "pastSessions" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-primary/20 bg-card space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase font-mono">
                        <Plus className="size-4" />
                        <span>Add Session to "Voices Behind Polaris"</span>
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
                                setNewArticle({
                                  ...newArticle,
                                  category: e.target.value as ArticleItem["category"],
                                })
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
                                  category: e.target.value as SpotlightEntry["category"],
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
                    setEditingProgram({
                      ...editingProgram,
                      category: e.target.value as ProgramEvent["category"],
                    })
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
                    setEditingProgram({
                      ...editingProgram,
                      status: e.target.value as ProgramEvent["status"],
                    })
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
                        name: editingProgram.speaker?.name || "",
                        designation: editingProgram.speaker?.designation || "",
                        linkedin: e.target.value,
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
                      setEditingArticle({
                        ...editingArticle,
                        category: e.target.value as ArticleItem["category"],
                      })
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
                      setEditingSpotlight({
                        ...editingSpotlight,
                        category: e.target.value as SpotlightEntry["category"],
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

      {/* ── MODAL: EDIT UPCOMING INITIATIVE ── */}
      {editingInitiative && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md font-sans">
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-card max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-foreground">
                Edit Upcoming Initiative
              </h3>
              <button
                type="button"
                onClick={() => setEditingInitiative(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateInitiative} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground">Initiative Title</label>
                <input
                  type="text"
                  required
                  value={editingInitiative.title}
                  onChange={(e) =>
                    setEditingInitiative({ ...editingInitiative, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingInitiative.desc}
                  onChange={(e) =>
                    setEditingInitiative({ ...editingInitiative, desc: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-muted-foreground">Button Text</label>
                  <input
                    type="text"
                    value={editingInitiative.cta}
                    onChange={(e) =>
                      setEditingInitiative({ ...editingInitiative, cta: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted-foreground">Target Route / URL</label>
                  <input
                    type="text"
                    value={editingInitiative.to || ""}
                    onChange={(e) =>
                      setEditingInitiative({ ...editingInitiative, to: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editIsDirectLink"
                  checked={editingInitiative.isDirectLink}
                  onChange={(e) =>
                    setEditingInitiative({
                      ...editingInitiative,
                      isDirectLink: e.target.checked,
                    })
                  }
                  className="rounded border-white/10 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="editIsDirectLink"
                  className="text-xs text-muted-foreground cursor-pointer"
                >
                  Direct Page Navigation (Uncheck to trigger Waitlist modal)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingInitiative(null)}
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

      {/* ── MODAL: EDIT STUDENT REVIEW ── */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md font-sans">
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-card max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-foreground">
                Edit Student Review / Testimonial
              </h3>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateReview} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground">Student Name</label>
                <input
                  type="text"
                  required
                  value={editingReview.name}
                  onChange={(e) => setEditingReview({ ...editingReview, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Role / Designation</label>
                <input
                  type="text"
                  required
                  value={editingReview.role}
                  onChange={(e) => setEditingReview({ ...editingReview, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Quote / Review</label>
                <textarea
                  rows={4}
                  required
                  value={editingReview.quote}
                  onChange={(e) => setEditingReview({ ...editingReview, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingReview(null)}
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

      {/* ── MODAL: EDIT TEAM MEMBER (PEOPLE BEHIND POLARIS) ── */}
      {editingTeamMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md font-sans">
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-card max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-foreground">Edit Team Member</h3>
              <button
                type="button"
                onClick={() => setEditingTeamMember(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTeamMember} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground">Full Name / Squad Name</label>
                <input
                  type="text"
                  required
                  value={editingTeamMember.name}
                  onChange={(e) =>
                    setEditingTeamMember({ ...editingTeamMember, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-muted-foreground">Role Title</label>
                  <input
                    type="text"
                    required
                    value={editingTeamMember.role}
                    onChange={(e) =>
                      setEditingTeamMember({ ...editingTeamMember, role: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-muted-foreground">Department</label>
                  <input
                    type="text"
                    required
                    value={editingTeamMember.department}
                    onChange={(e) =>
                      setEditingTeamMember({ ...editingTeamMember, department: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">What I Bring (Quote)</label>
                <input
                  type="text"
                  required
                  value={editingTeamMember.whatIBring}
                  onChange={(e) =>
                    setEditingTeamMember({ ...editingTeamMember, whatIBring: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Intro / Bio</label>
                <textarea
                  rows={3}
                  required
                  value={editingTeamMember.intro}
                  onChange={(e) =>
                    setEditingTeamMember({ ...editingTeamMember, intro: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingTeamMember(null)}
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

      {/* ── MODAL: EDIT PROJECT ── */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md font-sans">
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-card max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-foreground">
                Edit Computational Lab / Project
              </h3>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProject} className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-muted-foreground">Project Title</label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Category</label>
                <select
                  value={editingProject.category}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      category: e.target.value as ProjectItem["category"],
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                >
                  <option value="Computational Lab">Computational Lab</option>
                  <option value="AeroForge Physics">AeroForge Physics</option>
                  <option value="Hardware Simulation">Hardware Simulation</option>
                  <option value="Research Project">Research Project</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Domain Area</label>
                <input
                  type="text"
                  value={editingProject.domain}
                  onChange={(e) => setEditingProject({ ...editingProject, domain: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Status</label>
                <select
                  value={editingProject.status}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      status: e.target.value as ProjectItem["status"],
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                >
                  <option value="Active Lab">Active Lab</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Open for Contributors">Open for Contributors</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Team / Squad</label>
                <input
                  type="text"
                  value={editingProject.team}
                  onChange={(e) => setEditingProject({ ...editingProject, team: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-muted-foreground">Project Link / Route</label>
                <input
                  type="text"
                  value={editingProject.link || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-muted-foreground">Summary / Mission Goal</label>
                <textarea
                  rows={3}
                  required
                  value={editingProject.summary}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, summary: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground resize-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-muted-foreground">Key Deliverables</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add deliverable chip..."
                    value={newDeliverableInput}
                    onChange={(e) => setNewDeliverableInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-surface border border-white/10 text-foreground"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (newDeliverableInput.trim()) {
                        const list = editingProject.deliverables || [];
                        setEditingProject({
                          ...editingProject,
                          deliverables: [...list, newDeliverableInput.trim()],
                        });
                        setNewDeliverableInput("");
                      }
                    }}
                    className="h-8 text-xs shrink-0"
                  >
                    Add
                  </Button>
                </div>
                {editingProject.deliverables && editingProject.deliverables.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {editingProject.deliverables.map((d, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-surface-2 border border-white/10 text-foreground font-mono flex items-center gap-1"
                      >
                        <span>{d}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(editingProject.deliverables || [])];
                            updated.splice(i, 1);
                            setEditingProject({ ...editingProject, deliverables: updated });
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingProject(null)}
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
