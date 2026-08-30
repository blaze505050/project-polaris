import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FeedbackItem {
  id: string;
  category: "bug" | "ux" | "feature" | "accuracy" | "general";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  contactEmail?: string;
  route: string;
  timestamp: string;
}

interface FeedbackState {
  feedbackList: FeedbackItem[];
  addFeedback: (item: Omit<FeedbackItem, "id" | "timestamp">) => void;
  clearFeedback: () => void;
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set) => ({
      feedbackList: [],
      addFeedback: (item) =>
        set((state) => ({
          feedbackList: [
            {
              ...item,
              id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              timestamp: new Date().toISOString(),
            },
            ...state.feedbackList,
          ],
        })),
      clearFeedback: () => set({ feedbackList: [] }),
    }),
    {
      name: "aeroforge-feedback-v1",
    },
  ),
);
