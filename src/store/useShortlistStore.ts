import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, UserProfileSummary } from "@/types";

export interface ShortlistEntry {
  profile: UserProfileSummary;
  platform: Platform;
  addedAt: number;
}

interface ShortlistState {
  entries: ShortlistEntry[];
  /** Add a profile to the shortlist. No-op if already present (deduped by user_id). */
  addProfile: (profile: UserProfileSummary, platform: Platform) => void;
  /** Remove a profile from the shortlist by user_id. */
  removeProfile: (userId: string) => void;
  /** Toggle add/remove in one call — handy for the card button. */
  toggleProfile: (profile: UserProfileSummary, platform: Platform) => void;
  /** Reorder the list, e.g. after a drag-and-drop. */
  reorder: (startIndex: number, endIndex: number) => void;
  isShortlisted: (userId: string) => boolean;
  clear: () => void;
}

export const useShortlistStore = create<ShortlistState>()(
  persist(
    (set, get) => ({
      entries: [],

      addProfile: (profile, platform) => {
        const exists = get().entries.some(
          (e) => e.profile.user_id === profile.user_id
        );
        if (exists) return;
        set((state) => ({
          entries: [...state.entries, { profile, platform, addedAt: Date.now() }],
        }));
      },

      removeProfile: (userId) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.profile.user_id !== userId),
        }));
      },

      toggleProfile: (profile, platform) => {
        const exists = get().entries.some(
          (e) => e.profile.user_id === profile.user_id
        );
        if (exists) {
          get().removeProfile(profile.user_id);
        } else {
          get().addProfile(profile, platform);
        }
      },

      reorder: (startIndex, endIndex) => {
        set((state) => {
          const next = [...state.entries];
          const [moved] = next.splice(startIndex, 1);
          next.splice(endIndex, 0, moved);
          return { entries: next };
        });
      },

      isShortlisted: (userId) =>
        get().entries.some((e) => e.profile.user_id === userId),

      clear: () => set({ entries: [] }),
    }),
    {
      name: "wobb-shortlist", // localStorage key — keeps the list across page refreshes
    }
  )
);
