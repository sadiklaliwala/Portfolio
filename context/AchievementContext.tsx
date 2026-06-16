"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxProgress: number;
  unlocked: boolean;
  progress: number;
  unlockDate?: string;
}

interface AchievementContextType {
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  incrementProgress: (id: string, amount?: number) => void;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "terminal_hacker",
    name: "Terminal Hacker",
    description: "Run 3 or more commands in the visual terminal",
    icon: "💻",
    maxProgress: 3,
    unlocked: false,
    progress: 0,
  },
  {
    id: "time_traveler",
    name: "Time Traveler",
    description: "Initialize the Matrix digital rain simulation",
    icon: "⚡",
    maxProgress: 1,
    unlocked: false,
    progress: 0,
  },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Explore the portfolio during the late night (12 AM - 5 AM)",
    icon: "🦉",
    maxProgress: 1,
    unlocked: false,
    progress: 0,
  },
  {
    id: "curious_mind",
    name: "Curious Mind",
    description: "Expand project technology stacks or view details 3 times",
    icon: "🔍",
    maxProgress: 3,
    unlocked: false,
    progress: 0,
  },
];

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error("useAchievements must be used within an AchievementProvider");
  }
  return context;
}

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  const [activeToast, setActiveToast] = useState<Achievement | null>(null);
  const isLoadedRef = useRef(false);

  const loadFromStorageSync = (): Achievement[] => {
    try {
      const stored = localStorage.getItem("portfolio-achievements");
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, Partial<Achievement>>;
        return DEFAULT_ACHIEVEMENTS.map((def) => {
          const item = parsed[def.id];
          if (item) {
            return {
              ...def,
              unlocked: !!item.unlocked,
              progress: typeof item.progress === "number" ? item.progress : def.progress,
              unlockDate: item.unlockDate || undefined,
            };
          }
          return def;
        });
      }
    } catch (e) {}
    return DEFAULT_ACHIEVEMENTS;
  };

  const saveToStorage = (updated: Achievement[]) => {
    try {
      const simplified = updated.reduce((acc, item) => {
        acc[item.id] = {
          unlocked: item.unlocked,
          progress: item.progress,
          unlockDate: item.unlockDate,
        };
        return acc;
      }, {} as Record<string, Partial<Achievement>>);
      localStorage.setItem("portfolio-achievements", JSON.stringify(simplified));
    } catch (e) {}
  };

  // Load state on mount
  useEffect(() => {
    if (!isLoadedRef.current) {
      const loaded = loadFromStorageSync();
      setAchievements(loaded);
      isLoadedRef.current = true;
    }
  }, []);

  const showToast = (achievement: Achievement) => {
    setActiveToast(achievement);
    // Auto hide after 4 seconds
    setTimeout(() => {
      setActiveToast((prev) => (prev?.id === achievement.id ? null : prev));
    }, 4000);
  };

  const unlockAchievement = (id: string) => {
    setAchievements((currentAchievements) => {
      let baseAchievements = currentAchievements;
      if (!isLoadedRef.current) {
        baseAchievements = loadFromStorageSync();
        isLoadedRef.current = true;
      }

      let unlockedItem: Achievement | null = null;
      const updated = baseAchievements.map((item) => {
        if (item.id === id && !item.unlocked) {
          unlockedItem = {
            ...item,
            unlocked: true,
            progress: item.maxProgress,
            unlockDate: new Date().toLocaleDateString(),
          };
          return unlockedItem;
        }
        return item;
      });

      if (unlockedItem) {
        saveToStorage(updated);
        const itemToShow = unlockedItem;
        setTimeout(() => {
          showToast(itemToShow);
        }, 0);
      }
      return updated;
    });
  };

  const incrementProgress = (id: string, amount: number = 1) => {
    setAchievements((currentAchievements) => {
      let baseAchievements = currentAchievements;
      if (!isLoadedRef.current) {
        baseAchievements = loadFromStorageSync();
        isLoadedRef.current = true;
      }

      let unlockedItem: Achievement | null = null;
      const updated = baseAchievements.map((item) => {
        if (item.id === id && !item.unlocked) {
          const newProgress = Math.min(item.maxProgress, item.progress + amount);
          const willUnlock = newProgress >= item.maxProgress;
          
          const updatedItem = {
            ...item,
            progress: newProgress,
            unlocked: willUnlock,
            unlockDate: willUnlock ? new Date().toLocaleDateString() : undefined,
          };
          if (willUnlock) {
            unlockedItem = updatedItem;
          }
          return updatedItem;
        }
        return item;
      });

      saveToStorage(updated);
      if (unlockedItem) {
        const itemToShow = unlockedItem;
        setTimeout(() => {
          showToast(itemToShow);
        }, 0);
      }
      return updated;
    });
  };

  return (
    <AchievementContext.Provider value={{ achievements, unlockAchievement, incrementProgress }}>
      {children}
      
      {/* Achievement Unlocked Toast popup */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            className="achievement-toast"
            initial={{ opacity: 0, y: -50, scale: 0.9, x: "-50%" }}
            animate={{ opacity: 1, y: 24, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: -20, scale: 0.9, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              position: "fixed",
              top: 0,
              left: "50%",
              zIndex: 9999,
              pointerEvents: "auto",
            }}
          >
            <span className="toast-icon">{activeToast.icon}</span>
            <div className="toast-content">
              <div className="toast-label">ACHIEVEMENT UNLOCKED!</div>
              <div className="toast-title">{activeToast.name}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AchievementContext.Provider>
  );
}
