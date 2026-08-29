import React, { useEffect, useRef } from "react";
import {
  Shield,
  BookOpen,
  Cpu,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  X,
  FileCheck2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransparencyModal({ isOpen, onClose }: TransparencyModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement | null;

      // Focus first focusable element inside modal
      const timer = setTimeout(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length > 0) {
            focusable[0].focus();
          }
        }
      }, 50);

      // Handle keyboard trap and ESC dismissal
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
          return;
        }

        if (e.key === "Tab" && modalRef.current) {
          const focusable = Array.from(
            modalRef.current.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
        // Restore focus sequentially to the element that triggered the modal
        if (previousActiveElement.current && typeof previousActiveElement.current.focus === "function") {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="transparency-modal-title"
      aria-describedby="transparency-modal-desc"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-primary/30 bg-card p-6 md:p-8 shadow-2xl text-foreground font-sans space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary font-ui">
              <Shield className="size-3.5" />
              <span>Project Polaris Governance Charter</span>
            </div>
            <h2 id="transparency-modal-title" className="text-xl md:text-2xl font-display font-bold text-foreground tracking-tight">
              AeroForge AI & Polaris Transparency Protocol
            </h2>
            <p id="transparency-modal-desc" className="text-xs text-slate-300">
              Clear commitments regarding institutional relationship, data sovereignty, solver veracity, and student safety.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close transparency modal"
            className="rounded-lg p-2 text-slate-300 hover:bg-surface hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* 4 Pillars of Transparency */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Pillar 1: Origin & Relationship */}
          <div className="rounded-xl border border-border bg-surface p-4 md:p-5 space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm font-ui">
              <Users className="size-4" />
              <span>1. Institutional Relationship</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              AeroForge AI is an official, non-commercial engineering research laboratory built and maintained by <strong className="text-white">Project Polaris</strong>. It is designed to close the engineering tools access gap for students and self-taught builders worldwide.
            </p>
          </div>

          {/* Pillar 2: Data Sovereignty */}
          <div className="rounded-xl border border-border bg-surface p-4 md:p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm font-ui">
              <Lock className="size-4" />
              <span>2. 100% Client-Side Sovereignty</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              All CAD geometries (<code className="text-emerald-300 bg-surface-2 px-1 rounded">.STL</code>, <code className="text-emerald-300 bg-surface-2 px-1 rounded">.STEP</code>), finite element meshes, and airfoil parameters execute entirely within your local browser sandbox. Zero telemetry or user engineering IP is sold or harvested.
            </p>
          </div>

          {/* Pillar 3: Mathematical Transparency */}
          <div className="rounded-xl border border-border bg-surface p-4 md:p-5 space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm font-ui">
              <Cpu className="size-4" />
              <span>3. Open Mathematical Models</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every formula (Prandtl-Glauert compressibility, Euler-Bernoulli beam deflections, Tsiolkovsky rocket equations, Keplerian two-body propagations) is explicitly documented with standard assumptions and scientific limits.
            </p>
          </div>

          {/* Pillar 4: Verification & Safety */}
          <div className="rounded-xl border border-border bg-surface p-4 md:p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm font-ui">
              <AlertTriangle className="size-4" />
              <span>4. Scientific Verification Notice</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              AeroForge outputs are preliminary reduced-order models for educational and conceptual research. They must be independently benchmarked with high-fidelity CFD or wind tunnel tests prior to manufacturing flight hardware.
            </p>
          </div>
        </div>

        {/* Security & Sandbox Audit Summary */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 md:p-5 space-y-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-bold">
            <FileCheck2 className="size-4 shrink-0" />
            <span>SECURITY AUDIT PROTOCOL COMPLIANCE:</span>
          </div>
          <ul className="grid sm:grid-cols-2 gap-2 text-slate-200 text-[11px] pt-1">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-300 shrink-0" />
              <span>Strict Origin postMessage Validation</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-300 shrink-0" />
              <span>Restricted Iframe Sandbox Flags</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-300 shrink-0" />
              <span>Deterministic Artifact Regex Sanitization</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-300 shrink-0" />
              <span>Zero Third-Party AI Model Training</span>
            </li>
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-border">
          <span className="text-xs text-slate-400 font-mono">
            Project Polaris Verification v1.0.0
          </span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-lg text-slate-200 hover:text-white"
            >
              Close Notice
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-lg bg-primary text-primary-foreground font-bold"
            >
              <a href="/privacy" target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                <span>View Full Privacy Policy</span>
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
