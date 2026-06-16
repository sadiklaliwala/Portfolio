"use client";

import { useState, useRef, useEffect } from "react";
import { FiAward, FiCheck, FiLock } from "react-icons/fi";
import { useAchievements } from "@/context/AchievementContext";

export default function TrophyWidget() {
  const [open, setOpen] = useState(false);
  const { achievements } = useAchievements();
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dashboardRef.current && !dashboardRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const percentCompleted = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <div className="trophy-widget-container" ref={dashboardRef}>
      <button
        type="button"
        className={`trophy-widget-btn ${open ? "active" : ""} ${unlockedCount > 0 ? "has-unlocks" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="View Achievements"
      >
        <FiAward size={18} />
        {unlockedCount > 0 && <span className="trophy-badge-count">{unlockedCount}</span>}
      </button>

      {open && (
        <div className="trophy-dashboard">
          <div className="trophy-dashboard-header">
            <span>Trophy Room</span>
            <span className="trophy-progress-ratio">
              {unlockedCount} / {totalCount}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="trophy-progress-container">
            <div 
              className="trophy-progress-bar" 
              style={{ width: `${percentCompleted}%` }} 
            />
          </div>

          {/* Trophy List */}
          <div className="trophy-list">
            {achievements.map((item) => (
              <div 
                key={item.id} 
                className={`trophy-item ${item.unlocked ? "unlocked" : "locked"}`}
              >
                <div className="trophy-item-icon">
                  {item.unlocked ? item.icon : <FiLock size={14} />}
                </div>
                <div className="trophy-item-details">
                  <div className="trophy-item-name">
                    <span>{item.name}</span>
                    {item.unlocked && <FiCheck className="unlocked-check" size={12} />}
                  </div>
                  <div className="trophy-item-desc">{item.description}</div>
                  
                  {/* Progress Indicator */}
                  {!item.unlocked && item.maxProgress > 1 && (
                    <div className="trophy-item-progress-wrapper">
                      <div className="trophy-item-progress-track">
                        <div 
                          className="trophy-item-progress-fill" 
                          style={{ width: `${(item.progress / item.maxProgress) * 100}%` }}
                        />
                      </div>
                      <span className="trophy-item-progress-text">
                        {item.progress}/{item.maxProgress}
                      </span>
                    </div>
                  )}
                  {item.unlocked && item.unlockDate && (
                    <div className="trophy-unlock-date">
                      Unlocked on {item.unlockDate}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
