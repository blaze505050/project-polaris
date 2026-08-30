/**
 * AEROFORGE BETA FEEDBACK & DIAGNOSTICS STORE
 * Manages lightweight, privacy-conscious beta feedback submissions and non-sensitive diagnostic logs.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FeedbackCategory =
  "bug" | "wrong_result" | "confusing_ux" | "missing_feature" | "scientific_concern" | "general";

export interface FeedbackItem {
  id: string;
  category: FeedbackCategory;
  message: string;
  contactEmail?: string;
  timestamp: number;
  diagnostics: {
    pageUrl: string;
    toolId?: string;
    solverClassification?: string;
    appVersion: string;
    userAgent: string;
    viewport: string;
  };
}

interface FeedbackState {
  feedbackItems: FeedbackItem[];
  submitFeedback: (item: Omit<FeedbackItem, "id" | "timestamp">) => void;
  clearFeedback: () => void;
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set) => ({
      feedbackItems: [
        {
          id: "fb-initial-01",
          category: "general",
          message:
            "Morphing UAV workflow is very smooth. Thin airfoil lift curve slope matches NACA 0012 experimental data.",
          timestamp: Date.now() - 86400000,
          diagnostics: {
            pageUrl: "/flagship-workflow",
            toolId: "flagship-morphing-uav",
            solverClassification: "Reduced-order",
            appVersion: "v1.0.0-beta",
            userAgent: "Mozilla/5.0 (Windows NT 10.0)",
            viewport: "1920x1080",
          },
        },
      ],
      submitFeedback: (item) =>
        set((state) => ({
          feedbackItems: [
            ...state.feedbackItems,
            {
              ...item,
              id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
              timestamp: Date.now(),
            },
          ],
        })),
      clearFeedback: () => set({ feedbackItems: [] }),
    }),
    {
      name: "aeroforge-feedback-store",
    },
  ),
);
