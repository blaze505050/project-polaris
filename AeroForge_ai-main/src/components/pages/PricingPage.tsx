import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Zap,
  Shield,
  Cpu,
  Globe,
  Database,
  Lock,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Server,
  Key,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommandCenterSidebar from '@/components/CommandCenterSidebar';
import { useToastStore } from '@/stores/toastStore';
import { Link } from 'react-router-dom';

export default function PricingPage() {
  const { addToast } = useToastStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const handleSelectPlan = (planName: string) => {
    addToast({
      title: `${planName} Selected`,
      description: 'Redirecting to secure checkout portal...',
      type: 'info',
    });
  };

  const plans = [
    {
      name: 'Community & Academic',
      tagline: 'For students, researchers, and open-source aerospace projects.',
      priceMonthly: '$0',
      priceAnnual: '$0',
      badge: 'Free Forever',
      badgeColor: 'border-white/20 bg-white/5 text-white/70',
      buttonText: 'Get Started Free',
      buttonStyle: 'border border-white/20 hover:border-white/40 text-white',
      features: [
        'Full access to AstroLab, AeroLab & MechLab standard solvers',
        '50 HPC Compute Hours / month',
        'Local WebAssembly solver execution',
        '2 Active Engineering Projects',
        'Jupyter + Obsidian style Engineering Notebook',
        'Export STL, CSV & JSON data files',
        'Community Forum support',
      ],
    },
    {
      name: 'Professional Engineer',
      tagline: 'For R&D engineers, defense contractors, and drone/sat startups.',
      priceMonthly: '$99',
      priceAnnual: '$79',
      badge: 'Most Popular',
      badgeColor: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400 font-bold',
      buttonText: 'Start 14-Day Free Trial',
      buttonStyle: 'bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-lg shadow-cyan-500/20',
      popular: true,
      features: [
        'Everything in Academic, plus:',
        '500 HPC Compute Hours / month (64-Core A100 Nodes)',
        'Unlimited Active Engineering Projects',
        'Remote OpenFOAM, SU2 & CalculiX HPC Cluster Submission',
        'Contextual AI Engineering Copilot (Unlimited Queries)',
        'AS9100 Rev D Compliance Audit Trail Exporter',
        'STEP / IGES CAD & VTK Result Mesh Import/Export',
        'Priority GPU Job Queueing & 24/7 Dedicated Support',
      ],
    },
    {
      name: 'Enterprise Private Cloud',
      tagline: 'For aerospace prime contractors, space agencies, and airframers.',
      priceMonthly: 'Custom',
      priceAnnual: 'Custom',
      badge: 'Dedicated Infra',
      badgeColor: 'border-pink-500/40 bg-pink-500/10 text-pink-400',
      buttonText: 'Contact Sales / Request Demo',
      buttonStyle: 'border border-pink-500/40 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 font-bold',
      features: [
        'Everything in Professional, plus:',
        'On-Premise / Private AWS GovCloud Deployment',
        'Dedicated On-Demand HPC Clusters (Unlimited GPU Cores)',
        'SSO / SAML 2.0 & Active Directory Integration',
        'Custom WASM/C++ Physics Plugin Development',
        'ITAR & EAR Compliant Data Isolation & Encryption',
        'Dedicated Aerospace Solutions Engineer (SLA < 1 Hour)',
      ],
    },
  ];

  const premiumTools = [
    {
      name: 'Hypersonic Re-entry Corridor Solver',
      category: 'AstroLab Pro',
      desc: 'Sutton-Graves heat flux prediction & non-equilibrium shock dissociation.',
    },
    {
      name: 'Porkchop Interplanetary Trajectory Architect',
      category: 'AstroLab Pro',
      desc: 'Lambert solver with gravity assist delta-V optimization.',
    },
    {
      name: 'Transonic Airfoil Boundary Layer Optimizer',
      category: 'AeroLab Pro',
      desc: 'Multi-objective Genetic Algorithm for L/D maximization at Mach 0.85.',
    },
    {
      name: 'Rocket Nozzle CEA Equilibrium Solver',
      category: 'AeroLab Pro',
      desc: 'Specific impulse Isp, chamber pressure Pc, and nozzle expansion ratio.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050A16] flex flex-col font-mono text-white">
      <Header />
      <div className="flex flex-1">
        <CommandCenterSidebar />
        <main className="flex-1 lg:ml-64 p-4 md:p-8 space-y-10 max-w-7xl mx-auto">
          {/* Hero Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase">
              <Zap className="w-3.5 h-3.5" />
              <span>COMMERCIAL LICENSING & PRICING</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Engineering Power for Every Team
            </h1>
            <p className="text-sm text-white/60 font-sans max-w-2xl mx-auto leading-relaxed">
              Start free with local WASM physics solvers, or unlock cloud HPC clusters, OpenFOAM remote solvers, and AS9100 compliance logging.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="pt-4 flex items-center justify-center gap-3 text-xs">
              <span className={billingCycle === 'monthly' ? 'text-white font-bold' : 'text-white/40'}>
                Monthly Billing
              </span>
              <button
                onClick={() =>
                  setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')
                }
                className="w-12 h-6 bg-cyan-500/20 border border-cyan-500/40 rounded-full p-0.5 transition-colors relative"
              >
                <div
                  className={`w-4 h-4 bg-cyan-400 rounded-full transition-transform ${
                    billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={billingCycle === 'annual' ? 'text-cyan-400 font-bold' : 'text-white/40'}>
                Annual Billing <span className="text-[10px] text-emerald-400 font-bold ml-1">(Save 20%)</span>
              </span>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`bg-[#080E1C] border rounded-xl p-6 flex flex-col justify-between relative transition-all ${
                  plan.popular
                    ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/10 bg-[#0A1326]'
                    : 'border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded border uppercase ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-3">{plan.name}</h3>
                  <p className="text-xs text-white/50 font-sans mt-1 leading-relaxed min-h-[36px]">
                    {plan.tagline}
                  </p>

                  <div className="my-6 border-t border-b border-white/10 py-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">
                        {billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly}
                      </span>
                      {plan.priceAnnual !== 'Custom' && (
                        <span className="text-xs text-white/50">/ engineer / month</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs font-sans">
                    <div className="text-[10px] font-mono text-white/40 uppercase font-semibold">
                      INCLUDED CAPABILITIES:
                    </div>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-white/80">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => handleSelectPlan(plan.name)}
                    className={`w-full py-2.5 rounded-lg text-xs tracking-wide transition-all ${plan.buttonStyle}`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Premium Tools Add-On Showcase */}
          <div className="bg-[#080E1C] border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  PREMIUM ADVANCED TOOL SUITE
                </h3>
                <p className="text-xs text-white/50 font-sans mt-0.5">
                  Specialized aerospace & propulsion solvers available for Pro & Enterprise accounts.
                </p>
              </div>
              <Link
                to="/astrolab"
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
              >
                <span>Browse All Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {premiumTools.map((tool, i) => (
                <div key={i} className="bg-[#050914] border border-white/5 rounded-lg p-3.5 space-y-1.5">
                  <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase">
                    {tool.category}
                  </span>
                  <h4 className="text-xs font-bold text-white">{tool.name}</h4>
                  <p className="text-[11px] text-white/50 font-sans leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
