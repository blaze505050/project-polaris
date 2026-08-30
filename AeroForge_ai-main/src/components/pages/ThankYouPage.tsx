import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Home, Compass } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function ThankYouPage() {
  usePageMeta(
    "Transmission Confirmed",
    "Your message or inquiry has been received by the AeroForge team.",
  );

  return (
    <div className="min-h-screen bg-[#060B18] flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md bg-[#0A1020] border border-white/10 p-8 rounded-2xl shadow-2xl relative"
        >
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-cyan-400" />
          </div>

          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 inline-block mb-3">
            TRANSMISSION RECEIVED
          </span>

          <h1 className="text-2xl font-bold text-white mb-2">Thank You</h1>
          <p className="text-xs text-white/60 mb-8 leading-relaxed">
            Your telemetry log or inquiry has been recorded. Our research engineering team will
            review the dispatch and follow up if required.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold font-mono transition-all">
                <Home className="w-4 h-4" />
                Home
              </button>
            </Link>
            <Link to="/aerolab">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 text-xs font-mono transition-all">
                <Compass className="w-4 h-4" />
                Explore AeroLab
              </button>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
