import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { ScrollToTop } from "@/lib/scroll-to-top";
import ErrorPage from "@/integrations/errorHandlers/ErrorPage";
import ErrorBoundary from "@/components/ErrorBoundary";
import { MemberProvider } from "@/integrations";

// ─── Page Components ──────────────────────────────────────────────────────────
import HomePage from "@/components/pages/HomePage";
import DashboardPage from "@/components/pages/DashboardPage";
import ProjectsPage from "@/components/pages/ProjectsPage";
import ProjectWorkspacePage from "@/components/pages/ProjectWorkspacePage";
import DocumentationPage from "@/components/pages/DocumentationPage";
import SettingsPage from "@/components/pages/SettingsPage";
import LegalPage from "@/components/pages/LegalPage";
import ChangelogPage from "@/components/pages/ChangelogPage";
import NotFoundPage from "@/components/pages/NotFoundPage";
import ThankYouPage from "@/components/pages/ThankYouPage";
import ContactPage from "@/components/pages/ContactPage";
import ValidationCenter from "@/components/pages/ValidationCenter";
import FlagshipWorkflowPage from "@/components/pages/FlagshipWorkflowPage";
import PublicArtifactPage from "@/components/pages/PublicArtifactPage";
import TrustCenter from "@/components/pages/TrustCenter";
import GuidedEngineeringDemo from "@/components/GuidedEngineeringDemo";
import BetaFeedbackPage from "@/components/pages/BetaFeedbackPage";
import EngineeringChallengesPage from "@/components/pages/EngineeringChallengesPage";
import MarketplacePage from "@/components/pages/MarketplacePage";

import { lazy, Suspense } from "react";

// ─── Lab Pages ────────────────────────────────────────────────────────────────
import AerodynamicsLabPage from "@/components/pages/AerodynamicsLabPage";
import VirtualLabPage from "@/components/pages/VirtualLabPage";
import AeroLabHub from "@/components/aerolab/AeroLabHub";
import MechLabHub from "@/components/mechlab/MechLabHub";
import PhysicsAiLabPage from "@/components/pages/PhysicsAiLabPage";

// ─── AstroLab Pages ───────────────────────────────────────────────────────────
import AstroLabMainPage from "@/components/pages/AstroLabMainPage";
import AstroLabHubPage from "@/components/pages/AstroLabHubPage";
import AstroLabAcademyPage from "@/components/pages/AstroLabAcademyPage";
import AstroLabSimulationsPage from "@/components/pages/AstroLabSimulationsPage";
import AstroLabReportsPage from "@/components/pages/AstroLabReportsPage";
import VirtualObservatoryPage from "@/components/pages/VirtualObservatoryPage";
import RadioAstronomyPage from "@/components/pages/RadioAstronomyPage";
import SpaceflightDynamicsPage from "@/components/pages/SpaceflightDynamicsPage";
import AstroLabExoplanetHabitabilityPage from "@/components/pages/AstroLabExoplanetHabitabilityPage";
import AstroLabOrbitalMechanicsEnhancedPage from "@/components/pages/AstroLabOrbitalMechanicsEnhancedPage";
import AstroLabStellarEvolutionPage from "@/components/pages/AstroLabStellarEvolutionPage";
import AstrobiologyLabPage from "@/components/pages/AstrobiologyLabPage";
import CosmologyExplorerPage from "@/components/pages/CosmologyExplorerPage";
import ExoplanetImagingPage from "@/components/pages/ExoplanetImagingPage";
import CelestialMechanicsPage from "@/components/pages/CelestialMechanicsPage";
import AtmosphericSciencePage from "@/components/pages/AtmosphericSciencePage";
import MissionControlPage from "@/components/pages/MissionControlPage";

// ─── Heavy AstroLab Tool Components (Lazy Loaded) ────────────────────────────
const SpatialGlobe = lazy(() => import("@/components/astrolab/SpatialGlobe"));
const DeepSpace = lazy(() => import("@/components/astrolab/DeepSpace"));
const PhotometrySuite = lazy(() => import("@/components/astrolab/PhotometrySuite"));
const AstrodynamicsSandbox = lazy(() => import("@/components/astrolab/AstrodynamicsSandbox"));

import DualMode from "@/components/astrolab/DualMode";
import Constellations from "@/components/astrolab/Constellations";
import Coordinates from "@/components/astrolab/Coordinates";
import OrbitalMechanics from "@/components/astrolab/OrbitalMechanics";
import PorkchopPlotGenerator from "@/components/astrolab/PorkchopPlotGenerator";
import HypersonicReentryCorridor from "@/components/astrolab/HypersonicReentryCorridor";
import SpectroscopicAnalyzer from "@/components/astrolab/SpectroscopicAnalyzer";
import AscentPayloadOptimizer from "@/components/astrolab/AscentPayloadOptimizer";
import SpaceEnvironmentHeliophysics from "@/components/astrolab/SpaceEnvironmentHeliophysics";
import ExoplanetDiscoveryEngine from "@/components/astrolab/ExoplanetDiscoveryEngine";

// ─── Global Components ────────────────────────────────────────────────────────
import CommandPalette from "@/components/CommandPalette";
import ToastNotification from "@/components/ui/ToastNotification";
import BetaDiagnosticOverlay from "@/components/ui/BetaDiagnosticOverlay";

// ─── Layout ───────────────────────────────────────────────────────────────────
function Layout() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <CommandPalette />
      <ToastNotification />
      <BetaDiagnosticOverlay />
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#060B18] flex flex-col items-center justify-center font-mono text-xs text-cyan-400 space-y-3">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>Loading AeroForge Engineering Module...</span>
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
}

// ─── Routes ───────────────────────────────────────────────────────────────────
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        // Core Pages
        { index: true, element: <HomePage /> },
        { path: "index.html", element: <HomePage /> },
        { path: "dashboard", element: <DashboardPage /> },
        { path: "projects", element: <ProjectsPage /> },
        { path: "projects/:projectId", element: <ProjectWorkspacePage /> },
        { path: "settings", element: <SettingsPage /> },
        { path: "documentation", element: <DocumentationPage /> },
        { path: "legal", element: <LegalPage /> },
        { path: "privacy", element: <LegalPage /> },
        { path: "terms", element: <LegalPage /> },
        { path: "thank-you", element: <ThankYouPage /> },
        { path: "contact", element: <ContactPage /> },
        { path: "validation", element: <ValidationCenter /> },
        { path: "flagship-workflow", element: <FlagshipWorkflowPage /> },
        { path: "share/:artifactId", element: <PublicArtifactPage /> },
        { path: "trust", element: <TrustCenter /> },
        { path: "demo", element: <GuidedEngineeringDemo /> },
        { path: "changelog", element: <ChangelogPage /> },
        { path: "virtual-lab", element: <VirtualLabPage /> },
        { path: "beta-dashboard", element: <BetaFeedbackPage /> },
        { path: "challenges", element: <EngineeringChallengesPage /> },
        { path: "marketplace", element: <MarketplacePage /> },

        // Lab Hubs
        { path: "labs/aerodynamics", element: <AerodynamicsLabPage /> },
        { path: "aerolab", element: <AeroLabHub /> },
        { path: "mechlab", element: <MechLabHub /> },
        { path: "physics-ai", element: <PhysicsAiLabPage /> },

        // AstroLab — Main
        { path: "astrolab", element: <AstroLabMainPage /> },
        { path: "astrolab/hub", element: <AstroLabHubPage /> },
        { path: "astrolab/academy", element: <AstroLabAcademyPage /> },
        { path: "astrolab/simulations", element: <AstroLabSimulationsPage /> },
        { path: "astrolab/reports", element: <AstroLabReportsPage /> },

        // AstroLab — Tools
        { path: "astrolab/spatial-globe", element: <SpatialGlobe /> },
        { path: "astrolab/deep-space", element: <DeepSpace /> },
        { path: "astrolab/photometry-suite", element: <PhotometrySuite /> },
        { path: "astrolab/astrodynamics-sandbox", element: <AstrodynamicsSandbox /> },
        { path: "astrolab/dual-mode", element: <DualMode /> },
        { path: "astrolab/constellations", element: <Constellations /> },
        { path: "astrolab/coordinates", element: <Coordinates /> },
        { path: "astrolab/orbital-mechanics", element: <OrbitalMechanics /> },
        { path: "astrolab/porkchop-plot", element: <PorkchopPlotGenerator /> },
        { path: "astrolab/hypersonic-reentry", element: <HypersonicReentryCorridor /> },
        { path: "astrolab/spectroscopic-analyzer", element: <SpectroscopicAnalyzer /> },
        { path: "astrolab/ascent-optimizer", element: <AscentPayloadOptimizer /> },
        { path: "astrolab/space-environment", element: <SpaceEnvironmentHeliophysics /> },
        { path: "astrolab/exoplanet-engine", element: <ExoplanetDiscoveryEngine /> },

        // AstroLab — Exploration Pages
        { path: "astrolab/virtual-observatory", element: <VirtualObservatoryPage /> },
        { path: "astrolab/radio-astronomy", element: <RadioAstronomyPage /> },
        { path: "astrolab/spaceflight-dynamics", element: <SpaceflightDynamicsPage /> },
        { path: "astrolab/exoplanet-habitability", element: <AstroLabExoplanetHabitabilityPage /> },
        {
          path: "astrolab/orbital-mechanics-enhanced",
          element: <AstroLabOrbitalMechanicsEnhancedPage />,
        },
        { path: "astrolab/stellar-evolution", element: <AstroLabStellarEvolutionPage /> },
        { path: "astrolab/astrobiology-lab", element: <AstrobiologyLabPage /> },
        { path: "astrolab/cosmology-explorer", element: <CosmologyExplorerPage /> },
        { path: "astrolab/exoplanet-imaging", element: <ExoplanetImagingPage /> },
        { path: "astrolab/celestial-mechanics", element: <CelestialMechanicsPage /> },
        { path: "astrolab/atmospheric-science", element: <AtmosphericSciencePage /> },
        { path: "astrolab/mission-control", element: <MissionControlPage /> },

        // Beta Feedback
        { path: "feedback", element: <BetaFeedbackPage /> },

        // Catch-all
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ] as any,
  {
    basename: import.meta.env.BASE_URL || "/aeroforge",
  },
);

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
