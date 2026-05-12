
import { useAppState } from "../providers/AppProvider";
import { useEffect, useState, useRef } from "react";
import NavBar from "../components/NavBar";
import { EnhancedAuthBackground } from "../components/ui/FloatingUIElements";
import "../styles/auth-floating-ui.css";
import { supabase } from "../lib/supabase-client";
import './profile.css';
import {
      MapPin,
      CalendarDays,

      Settings,
      Users,
      LayoutGrid,
      Activity,
      User,
      Edit3,
      Save,
      X,
      ChevronRight,
      Plus,
      CheckCircle2,
      Clock,
      TrendingUp,
      Zap,
      Bell,
      Shield,
      Palette,
      LogOut,
      UserPlus,
      Building2,
      Star,
      Lock,
} from "lucide-react";

// // ─── CSS injected once ───────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap');

  @keyframes avatarPulse {
    0%,100% { box-shadow: 0 0 0 3px rgba(220,38,38,0.25), 0 0 24px rgba(220,38,38,0.1); }
    50%      { box-shadow: 0 0 0 5px rgba(220,38,38,0.4),  0 0 40px rgba(220,38,38,0.2); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes tabSlide {
    from { opacity:0; transform:translateX(-6px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes counterUp {
    from { opacity:0; transform:translateY(6px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes dotBlink {
    0%,100% { opacity:1; }
    50%     { opacity:0.3; }
  }
  @keyframes shimmer {
    0%   { background-position:-400px 0; }
    100% { background-position:400px 0; }
  }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes meshFloat {
    0%,100% { transform:translateY(0) scale(1); }
    50%     { transform:translateY(-12px) scale(1.03); }
  }

  .up-card {
    background: rgba(15,15,17,0.8);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 16px;
    position: relative;
    overflow: hidden;
    animation: fadeUp 0.4s ease both;
    backdrop-filter: blur(12px);
    transition: border-color 0.25s;
  }
  .up-card:hover { border-color: rgba(255,255,255,0.09); }

  .up-card::before {
    content:'';
    position:absolute; top:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent,rgba(220,38,38,0.4),transparent);
    pointer-events:none;
  }

  .up-tab-btn {
    position: relative;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 10px 16px;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: color 0.2s;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .up-tab-btn.active { color: #f87171; }
  .up-tab-btn:not(.active) { color: rgba(160,160,170,0.7); }
  .up-tab-btn:not(.active):hover { color: rgba(220,220,230,0.9); }

  .up-tab-indicator {
    position:absolute; bottom:0; left:16px; right:16px; height:2px;
    background:linear-gradient(90deg,#dc2626,#f87171);
    border-radius:2px;
    transform:scaleX(0);
    transition:transform 0.25s cubic-bezier(.4,0,.2,1);
    transform-origin:left;
  }
  .up-tab-btn.active .up-tab-indicator { transform:scaleX(1); }

  .up-stat-card {
    flex:1; min-width:0;
    padding: 18px 16px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.05);
    background: rgba(255,255,255,0.02);
    display:flex; flex-direction:column; gap:4px;
    animation: counterUp 0.5s ease both;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
    cursor:default;
  }
  .up-stat-card:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.08);
    transform: translateY(-2px);
  }

  .up-input {
    width:100%; padding:10px 14px;
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:10px;
    color:#e8e8e8;
    font-family:'DM Mono',monospace;
    font-size:13px;
    outline:none;
    transition:border-color 0.2s, background 0.2s;
  }
  .up-input:focus {
    border-color:rgba(220,38,38,0.5);
    background:rgba(220,38,38,0.04);
  }

  .up-input-label {
    font-family:'DM Mono',monospace;
    font-size:10px;
    letter-spacing:0.12em;
    text-transform:uppercase;
    color:rgba(160,160,170,0.6);
    margin-bottom:6px;
    display:block;
  }

  .up-future-pill {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 10px;
    border-radius:99px;
    background:rgba(99,102,241,0.12);
    border:1px solid rgba(99,102,241,0.2);
    font-family:'DM Mono',monospace;
    font-size:9px;
    letter-spacing:0.1em;
    text-transform:uppercase;
    color:rgba(165,180,252,0.8);
  }

  .up-empty-illustration {
    display:flex; flex-direction:column; align-items:center; gap:12px;
    padding:48px 24px;
    opacity:0.7;
  }

  .up-toggle {
    width:38px; height:20px; border-radius:99px;
    position:relative; cursor:pointer; border:none; outline:none;
    transition: background 0.3s;
    flex-shrink:0;
  }
  .up-toggle-thumb {
    position:absolute; top:2px; width:16px; height:16px;
    border-radius:50%; background:#fff;
    box-shadow:0 1px 4px rgba(0,0,0,0.3);
    transition: left 0.3s cubic-bezier(.4,0,.2,1);
  }

  .up-section-label {
    font-family:'DM Mono',monospace;
    font-size:9px; font-weight:700;
    letter-spacing:0.18em;
    text-transform:uppercase;
    color:rgba(160,160,170,0.5);
    margin-bottom:16px;
  }

  .up-connection-card {
    display:flex; align-items:center; gap:12px;
    padding:12px 14px;
    border-radius:12px;
    border:1px solid rgba(255,255,255,0.05);
    background:rgba(255,255,255,0.02);
    transition: background 0.2s, border-color 0.2s;
  }
  .up-connection-card:hover {
    background:rgba(255,255,255,0.05);
    border-color:rgba(255,255,255,0.09);
  }

  .up-workspace-card {
    display:flex; align-items:center; gap:14px;
    padding:14px 16px;
    border-radius:12px;
    border:1px solid rgba(255,255,255,0.06);
    background:rgba(255,255,255,0.02);
    cursor:pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
  }
  .up-workspace-card:hover {
    background:rgba(255,255,255,0.05);
    border-color:rgba(255,255,255,0.1);
    transform:translateY(-1px);
  }

  .up-activity-item {
    display:flex; gap:12px; align-items:flex-start;
    padding:10px 0;
    border-bottom:1px solid rgba(255,255,255,0.04);
    animation: fadeUp 0.3s ease both;
  }
  .up-activity-item:last-child { border-bottom:none; }

  .shimmer-line {
    height:14px; border-radius:4px;
    background:linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%);
    background-size:400px 100%;
    animation:shimmer 1.8s infinite;
  }

  .up-btn-primary {
    display:inline-flex; align-items:center; justify-content:center; gap:7px;
    padding:9px 20px;
    border-radius:10px;
    background:rgba(220,38,38,0.15);
    border:1px solid rgba(220,38,38,0.3);
    color:#f87171;
    font-family:'DM Mono',monospace;
    font-size:12px; font-weight:500;
    letter-spacing:0.06em;
    cursor:pointer;
    transition: all 0.2s;
  }
  .up-btn-primary:hover {
    background:rgba(220,38,38,0.25);
    border-color:rgba(220,38,38,0.5);
    color:#fca5a5;
    transform:translateY(-1px);
  }
  .up-btn-ghost {
    display:inline-flex; align-items:center; justify-content:center; gap:7px;
    padding:9px 16px;
    border-radius:10px;
    background:transparent;
    border:1px solid rgba(255,255,255,0.07);
    color:rgba(200,200,210,0.7);
    font-family:'DM Mono',monospace;
    font-size:12px;
    cursor:pointer;
    transition: all 0.2s;
  }
  .up-btn-ghost:hover {
    background:rgba(255,255,255,0.05);
    border-color:rgba(255,255,255,0.12);
    color:#e8e8e8;
  }

  .up-progress-track {
    height:5px; border-radius:99px;
    background:rgba(255,255,255,0.06);
    overflow:hidden;
  }
  .up-progress-fill {
    height:100%; border-radius:99px;
    transition:width 1.2s cubic-bezier(.4,0,.2,1);
  }

  .up-badge {
    display:inline-flex; align-items:center;
    padding:3px 10px; border-radius:6px;
    font-family:'DM Mono',monospace;
    font-size:10px; font-weight:600;
    letter-spacing:0.08em;
  }

  .mesh-bg {
    position:absolute; border-radius:50%; filter:blur(80px);
    pointer-events:none; animation:meshFloat 8s ease-in-out infinite;
  }
`;

if (typeof document !== "undefined" && !document.getElementById("up-css-v3")) {
      const s = document.createElement("style");
      s.id = "up-css-v3";
      s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
}

// ─── Tiny primitives ─────────────────────────────────────────────────────────

function Toggle({ on, onChange }) {
      return (
            <button
                  className="up-toggle"
                  onClick={onChange}
                  style={{ background: on ? "#dc2626" : "rgba(255,255,255,0.1)" }}
                  aria-pressed={on}
            >
                  <span
                        className="up-toggle-thumb"
                        style={{ left: on ? 20 : 2 }}
                  />
            </button>
      );
}

function Avatar({ user_avatar, name, size = 72 }) {
      const initial = name?.[0]?.toUpperCase() || "?";
      return (
            <div
                  style={{
                        width: size,
                        height: size,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,rgba(139,0,0,0.4),rgba(220,38,38,0.25))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: size * 0.42,
                        fontWeight: 700,
                        fontFamily: "'Syne', sans-serif",
                        color: "#fca5a5",
                        animation: "avatarPulse 3.5s ease-in-out infinite",
                        flexShrink: 0,
                  }}
            >
                  {user_avatar ? user_avatar : initial}
            </div>
      );
}

function StatusDot({ online }) {
      return (
            <span
                  style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: online ? "#4ade80" : "rgba(255,255,255,0.2)",
                        display: "inline-block",
                        boxShadow: online ? "0 0 8px rgba(74,222,128,0.6)" : "none",
                        animation: online ? "dotBlink 2.5s infinite" : "none",
                  }}
            />
      );
}

function StatCard({ label, value, accent, icon: Icon, delay = 0 }) {
      return (
            <div className="up-stat-card" style={{ animationDelay: `${delay}ms` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span
                              style={{
                                    fontFamily: "'DM Mono', monospace",
                                    fontSize: 22,
                                    fontWeight: 600,
                                    color: accent,
                              }}
                        >
                              {value ?? "—"}
                        </span>
                        {Icon && (
                              <Icon size={14} style={{ color: accent, opacity: 0.7 }} />
                        )}
                  </div>
                  <span
                        style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: 9,
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                              color: "rgba(160,160,170,0.55)",
                        }}
                  >
                        {label}
                  </span>
            </div>
      );
}

function ShimmerBlock({ width = "100%", height = 14, style = {} }) {
      return (
            <div
                  className="shimmer-line"
                  style={{ width, height, borderRadius: 6, ...style }}
            />
      );
}

// ─── Tab panels ──────────────────────────────────────────────────────────────

function OverviewPanel({ userStats, prefs, setPrefs }) {
      const pct =
            userStats?.totalTodos > 0
                  ? Math.round((userStats.completedTodos / userStats.totalTodos) * 100)
                  : 0;

      const taskBreakdown = [
            {
                  label: "Completed",
                  count: userStats?.completedTodos ?? 0,
                  color: "#4ade80",
                  border: "rgba(74,222,128,0.2)",
            },
            {
                  label: "In Progress",
                  count: (userStats?.totalTodos ?? 0) - (userStats?.completedTodos ?? 0),
                  color: "#fbbf24",
                  border: "rgba(251,191,36,0.2)",
            },
            {
                  label: "Total Tasks",
                  count: userStats?.totalTodos ?? 0,
                  color: "#a5b4fc",
                  border: "rgba(165,180,252,0.2)",
            },
            {
                  label: "Active Lists",
                  count: userStats?.currentList ?? 0,
                  color: "#38bdf8",
                  border: "rgba(56,189,248,0.2)",
            },
      ];

      return (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Completion progress */}
                  <div className="up-card" style={{ padding: "22px 24px" }}>
                        <p className="up-section-label">Productivity</p>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                              <span style={{ fontSize: 13, color: "rgba(200,200,210,0.75)" }}>
                                    Overall completion rate
                              </span>
                              <span
                                    style={{
                                          fontFamily: "'DM Mono', monospace",
                                          fontSize: 13,
                                          fontWeight: 600,
                                          color: "#4ade80",
                                    }}
                              >
                                    {pct}%
                              </span>
                        </div>
                        <div className="up-progress-track">
                              <div
                                    className="up-progress-fill"
                                    style={{
                                          width: `${pct}%`,
                                          background: "linear-gradient(90deg,#16a34a,#4ade80)",
                                          boxShadow: "0 0 12px rgba(74,222,128,0.3)",
                                    }}
                              />
                        </div>
                        <div
                              style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(4,1fr)",
                                    gap: 12,
                                    marginTop: 20,
                              }}
                        >
                              {taskBreakdown.map((item, i) => (
                                    <div
                                          key={item.label}
                                          style={{
                                                padding: "14px 12px",
                                                borderRadius: 10,
                                                background: item.bg,
                                                border: `1px solid ${item.border}`,
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 4,
                                                animation: `counterUp 0.4s ease both`,
                                                animationDelay: `${i * 60}ms`,
                                          }}
                                    >
                                          <span
                                                style={{
                                                      fontFamily: "'DM Mono', monospace",
                                                      fontSize: 20,
                                                      fontWeight: 600,
                                                      color: item.color,
                                                }}
                                          >
                                                {item.count}
                                          </span>
                                          <span
                                                style={{
                                                      fontFamily: "'DM Mono', monospace",
                                                      fontSize: 9,
                                                      letterSpacing: "0.12em",
                                                      textTransform: "uppercase",
                                                      color: "rgba(160,160,170,0.5)",
                                                }}
                                          >
                                                {item.label}
                                          </span>
                                    </div>
                              ))}
                        </div>
                  </div>

                  {/* Preferences */}
                  <div className="up-card" style={{ padding: "22px 24px" }}>
                        <p className="up-section-label">Preferences</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                              {[
                                    { key: "darkMode", label: "Dark Mode", icon: Palette },
                                    { key: "aiSuggestions", label: "AI Suggestions", icon: Zap },
                                    { key: "emailNotifications", label: "Email Notifications", icon: Bell },
                                    { key: "desktopAlerts", label: "Desktop Alerts", icon: Bell },
                                    { key: "compactView", label: "Compact View", icon: LayoutGrid },
                              ].map(({ key, label, icon: Icon }, i, arr) => (
                                    <div
                                          key={key}
                                          style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "13px 0",
                                                borderBottom:
                                                      i < arr.length - 1
                                                            ? "1px solid rgba(255,255,255,0.04)"
                                                            : "none",
                                          }}
                                    >
                                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <Icon size={14} style={{ color: "rgba(160,160,170,0.5)" }} />
                                                <span style={{ fontSize: 13, color: "rgba(200,200,210,0.8)" }}>
                                                      {label}
                                                </span>
                                          </div>
                                          <Toggle
                                                on={prefs[key]}
                                                onChange={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
                                          />
                                    </div>
                              ))}
                        </div>
                  </div>
            </div>
      );
}

function ActivityPanel() {
      // Skeleton activity — replace with real data feed later
      const skeletonItems = [
            {
                  type: "task_complete",
                  icon: CheckCircle2,
                  color: "#4ade80",
                  text: "Marked 'Review Q4 roadmap' as complete",
                  time: "2h ago",
            },
            {
                  type: "task_add",
                  icon: Plus,
                  color: "#38bdf8",
                  text: "Added 3 new tasks to Work list",
                  time: "5h ago",
            },
            {
                  type: "list_create",
                  icon: LayoutGrid,
                  color: "#a5b4fc",
                  text: "Created list 'Health & Fitness'",
                  time: "Yesterday",
            },
            {
                  type: "task_complete",
                  icon: CheckCircle2,
                  color: "#4ade80",
                  text: "Completed 5 tasks today — best streak this week!",
                  time: "Yesterday",
            },
      ];

      return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="up-card" style={{ padding: "22px 24px" }}>
                        <div
                              style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 20,
                              }}
                        >
                              <p className="up-section-label" style={{ margin: 0 }}>
                                    Recent Activity
                              </p>
                              <span className="up-future-pill">
                                    <Lock size={8} />
                                    Live feed coming soon
                              </span>
                        </div>
                        <div>
                              {skeletonItems.map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                          <div
                                                className="up-activity-item"
                                                key={i}
                                                style={{ animationDelay: `${i * 60}ms` }}
                                          >
                                                <div
                                                      style={{
                                                            width: 30,
                                                            height: 30,
                                                            borderRadius: "50%",
                                                            background: `${item.color}18`,
                                                            border: `1px solid ${item.color}30`,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            flexShrink: 0,
                                                      }}
                                                >
                                                      <Icon size={13} style={{ color: item.color }} />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                      <p
                                                            style={{
                                                                  fontSize: 13,
                                                                  color: "rgba(200,200,210,0.8)",
                                                                  margin: 0,
                                                                  lineHeight: 1.4,
                                                            }}
                                                      >
                                                            {item.text}
                                                      </p>
                                                      <span
                                                            style={{
                                                                  fontFamily: "'DM Mono', monospace",
                                                                  fontSize: 10,
                                                                  color: "rgba(160,160,170,0.45)",
                                                            }}
                                                      >
                                                            {item.time}
                                                      </span>
                                                </div>
                                          </div>
                                    );
                              })}
                        </div>
                  </div>

                  {/* Weekly chart placeholder */}
                  <div className="up-card" style={{ padding: "22px 24px" }}>
                        <div
                              style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 20,
                              }}
                        >
                              <p className="up-section-label" style={{ margin: 0 }}>
                                    Weekly Output
                              </p>
                              <span className="up-future-pill">
                                    <Lock size={8} />
                                    Analytics coming soon
                              </span>
                        </div>
                        <div
                              style={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    gap: 8,
                                    height: 80,
                              }}
                        >
                              {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
                                    <div
                                          key={i}
                                          style={{
                                                flex: 1,
                                                height: `${h}%`,
                                                borderRadius: "4px 4px 0 0",
                                                background:
                                                      i === 5
                                                            ? "linear-gradient(180deg,#f87171,rgba(248,113,113,0.3))"
                                                            : "rgba(255,255,255,0.06)",
                                                transition: "height 0.8s cubic-bezier(.4,0,.2,1)",
                                                animationDelay: `${i * 60}ms`,
                                          }}
                                    />
                              ))}
                        </div>
                        <div
                              style={{
                                    display: "flex",
                                    gap: 8,
                                    marginTop: 8,
                              }}
                        >
                              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                                    <div
                                          key={i}
                                          style={{
                                                flex: 1,
                                                textAlign: "center",
                                                fontFamily: "'DM Mono', monospace",
                                                fontSize: 9,
                                                color:
                                                      i === 5
                                                            ? "#f87171"
                                                            : "rgba(160,160,170,0.35)",
                                          }}
                                    >
                                          {d}
                                    </div>
                              ))}
                        </div>
                  </div>
            </div>
      );
}

function ConnectionsPanel() {
      return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Search & invite bar */}
                  <div className="up-card" style={{ padding: "22px 24px" }}>
                        <div
                              style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 20,
                              }}
                        >
                              <div>
                                    <p className="up-section-label" style={{ margin: "0 0 4px" }}>
                                          Connections
                                    </p>
                                    <span className="up-future-pill">
                                          <Lock size={8} />
                                          Coming in next release
                                    </span>
                              </div>
                              <button className="up-btn-primary" disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                                    <UserPlus size={13} />
                                    Invite People
                              </button>
                        </div>

                        {/* Mock connections */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                              <h4 className="ml-auto mr-auto">Commin Soon...</h4>
                        </div>

                        {/* Empty state CTA */}
                        <div
                              style={{
                                    marginTop: 24,
                                    padding: "20px",
                                    borderRadius: 12,
                                    border: "1px dashed rgba(255,255,255,0.08)",
                                    textAlign: "center",
                              }}
                        >
                              <Users size={28} style={{ color: "rgba(160,160,170,0.3)", margin: "0 auto 10px" }} />
                              <p style={{ fontSize: 13, color: "rgba(160,160,170,0.5)", margin: "0 0 4px" }}>
                                    Collaborate with your team
                              </p>
                              <p style={{ fontSize: 11, color: "rgba(160,160,170,0.3)", margin: 0, lineHeight: 1.5 }}>
                                    Connect with peers, follow their progress,<br />and share lists across accounts.
                              </p>
                        </div>
                  </div>

                  {/* Follower stats */}
                  <div
                        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
                  >
                        {[
                              { label: "Following", value: "—", color: "#a5b4fc" },
                              { label: "Followers", value: "—", color: "#f87171" },
                        ].map((s) => (
                              <div
                                    key={s.label}
                                    className="up-card"
                                    style={{
                                          padding: "20px",
                                          textAlign: "center",
                                          opacity: 0.5,
                                    }}
                              >
                                    <div
                                          style={{
                                                fontFamily: "'DM Mono', monospace",
                                                fontSize: 26,
                                                fontWeight: 700,
                                                color: s.color,
                                          }}
                                    >
                                          {s.value}
                                    </div>
                                    <div
                                          style={{
                                                fontFamily: "'DM Mono', monospace",
                                                fontSize: 10,
                                                letterSpacing: "0.12em",
                                                textTransform: "uppercase",
                                                color: "rgba(160,160,170,0.45)",
                                                marginTop: 4,
                                          }}
                                    >
                                          {s.label}
                                    </div>
                              </div>
                        ))}
                  </div>
            </div>
      );
}

function WorkspacesPanel() {
      const mockWorkspaces = [
            {
                  name: "Design System Team",
                  role: "Admin",
                  members: 8,
                  tasks: 42,
                  color: "rgba(165,180,252,0.2)",
                  accent: "#a5b4fc",
            },
            {
                  name: "Q3 Sprint Squad",
                  role: "Member",
                  members: 5,
                  tasks: 18,
                  color: "rgba(248,113,113,0.2)",
                  accent: "#f87171",
            },
            {
                  name: "Open Source Collab",
                  role: "Contributor",
                  members: 23,
                  tasks: 91,
                  color: "rgba(74,222,128,0.15)",
                  accent: "#4ade80",
            },
      ];

      return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="up-card" style={{ padding: "22px 24px" }}>
                        <div
                              style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 20,
                              }}
                        >
                              <div>
                                    <p className="up-section-label" style={{ margin: "0 0 4px" }}>
                                          Workspaces
                                    </p>
                                    <span className="up-future-pill">
                                          <Lock size={8} />
                                          Coming in next release
                                    </span>
                              </div>
                              <button className="up-btn-primary" disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                                    <Plus size={13} />
                                    New Workspace
                              </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                              {mockWorkspaces.map((ws, i) => (
                                    <div
                                          className="up-workspace-card"
                                          key={i}
                                          style={{ opacity: 0.55, pointerEvents: "none" }}
                                    >
                                          <div
                                                style={{
                                                      width: 40,
                                                      height: 40,
                                                      borderRadius: 10,
                                                      background: ws.color,
                                                      display: "flex",
                                                      alignItems: "center",
                                                      justifyContent: "center",
                                                      fontSize: 16,
                                                      fontWeight: 700,
                                                      fontFamily: "'Syne',sans-serif",
                                                      color: ws.accent,
                                                      flexShrink: 0,
                                                }}
                                          >
                                                {ws.name[0]}
                                          </div>
                                          <div style={{ flex: 1, minWidth: 0 }}>
                                                <div
                                                      style={{
                                                            fontSize: 13,
                                                            fontWeight: 600,
                                                            color: "rgba(220,220,230,0.9)",
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                      }}
                                                >
                                                      {ws.name}
                                                </div>
                                                <div
                                                      style={{
                                                            fontFamily: "'DM Mono', monospace",
                                                            fontSize: 10,
                                                            color: "rgba(160,160,170,0.5)",
                                                            marginTop: 3,
                                                      }}
                                                >
                                                      {ws.role} · {ws.members} members · {ws.tasks} tasks
                                                </div>
                                          </div>
                                          <ChevronRight
                                                size={14}
                                                style={{ color: "rgba(160,160,170,0.3)", flexShrink: 0 }}
                                          />
                                    </div>
                              ))}
                        </div>

                        <div
                              style={{
                                    marginTop: 20,
                                    padding: "20px",
                                    borderRadius: 12,
                                    border: "1px dashed rgba(255,255,255,0.08)",
                                    textAlign: "center",
                              }}
                        >
                              <Building2
                                    size={28}
                                    style={{ color: "rgba(160,160,170,0.3)", margin: "0 auto 10px" }}
                              />
                              <p style={{ fontSize: 13, color: "rgba(160,160,170,0.5)", margin: "0 0 4px" }}>
                                    Shared team workspaces
                              </p>
                              <p
                                    style={{
                                          fontSize: 11,
                                          color: "rgba(160,160,170,0.3)",
                                          margin: 0,
                                          lineHeight: 1.5,
                                    }}
                              >
                                    Organize tasks across teams, assign roles,<br />and track project progress together.
                              </p>
                        </div>
                  </div>
            </div>
      );
}

function SettingsPanel({ signout }) {
      const [prefs, setPrefs] = useState({
            twoFactor: false,
            publicProfile: true,
            analyticsOptIn: true,
      });

      return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Danger zone */}
                  <div className="up-card" style={{ padding: "22px 24px" }}>
                        <p className="up-section-label">Security</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                              {[
                                    { key: "twoFactor", label: "Two-Factor Authentication", icon: Shield },
                                    { key: "publicProfile", label: "Public Profile", icon: User },
                                    { key: "analyticsOptIn", label: "Anonymous Analytics", icon: TrendingUp },
                              ].map(({ key, label, icon: Icon }) => (
                                    <div
                                          key={key}
                                          style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "12px 14px",
                                                borderRadius: 10,
                                                background: "rgba(255,255,255,0.02)",
                                                border: "1px solid rgba(255,255,255,0.04)",
                                          }}
                                    >
                                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <Icon size={14} style={{ color: "rgba(160,160,170,0.5)" }} />
                                                <span style={{ fontSize: 13, color: "rgba(200,200,210,0.8)" }}>
                                                      {label}
                                                </span>
                                          </div>
                                          <Toggle
                                                on={prefs[key]}
                                                onChange={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
                                          />
                                    </div>
                              ))}
                        </div>
                  </div>

                  {/* Account actions */}
                  <div className="up-card" style={{ padding: "22px 24px" }}>
                        <p className="up-section-label">Account</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                              <button className="up-btn-ghost" style={{ justifyContent: "flex-start" }}>
                                    <Shield size={13} />
                                    Change Password
                              </button>
                              <button
                                    className="up-btn-primary"
                                    style={{ justifyContent: "flex-start" }}
                                    onClick={signout}
                              >
                                    <LogOut size={13} />
                                    Sign Out
                              </button>
                              <div
                                    style={{
                                          marginTop: 8,
                                          padding: "14px",
                                          borderRadius: 10,
                                          background: "rgba(239,68,68,0.05)",
                                          border: "1px solid rgba(239,68,68,0.12)",
                                    }}
                              >
                                    <div
                                          style={{
                                                fontFamily: "'DM Mono', monospace",
                                                fontSize: 10,
                                                letterSpacing: "0.12em",
                                                textTransform: "uppercase",
                                                color: "rgba(239,68,68,0.6)",
                                                marginBottom: 8,
                                          }}
                                    >
                                          Danger Zone
                                    </div>
                                    <button
                                          className="up-btn-ghost"
                                          style={{
                                                color: "rgba(239,68,68,0.7)",
                                                borderColor: "rgba(239,68,68,0.15)",
                                                fontSize: 12,
                                                width: "100%",
                                                justifyContent: "flex-start",
                                          }}
                                    >
                                          Delete Account
                                    </button>
                              </div>
                        </div>
                  </div>
            </div>
      );
}

// ─── Edit Profile Form ────────────────────────────────────────────────────────

function EditProfileModal({ isOpen, onClose, profile, userData, onSave }) {
      const [form, setForm] = useState({
            name: profile?.name || userData?.user_metadata?.name || "",
            bio: profile?.bio || "",
            country: profile?.country || "",
            github_url: profile?.github_url || "",
            twitter_url: profile?.twitter_url || "",
      });
      const [saving, setSaving] = useState(false);

      if (!isOpen) return null;

      const fields = [
            { key: "name", label: "Display Name", icon: <i class="bi bi-person-fill"></i>, placeholder: "Your name" },
            { key: "bio", label: "Bio", icon: '', placeholder: "A short bio…", multiline: true },
            { key: "country", label: "Location", icon: <i class="bi bi-geo-alt-fill"></i>, placeholder: "City, Country" },
            { key: "github_url", label: "GitHub URL", icon: <i class="bi bi-github"></i>, placeholder: "https://github.com/…" },
            { key: "twitter_url", label: "Twitter / X URL", icon: <i class="bi bi-twitter-x"></i>, placeholder: "https://x.com/…" },
            { key: "personal_url", label: "portfolio / website URL", icon: <i class="bi bi-globe2"></i>, placeholder: "https://x.com/…" }
      ];

      const handleSave = async () => {
            setSaving(true);
            await onSave(form);
            setSaving(false);
            onClose();
      };

      return (
            <div
                  style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.7)",
                        backdropFilter: "blur(8px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 999,
                        padding: 24,
                  }}
                  onClick={onClose}
            >
                  <div
                        className="up-card"
                        style={{
                              width: "100%",
                              maxWidth: 480,
                              padding: 28,
                              animation: "fadeUp 0.3s ease",
                        }}
                        onClick={(e) => e.stopPropagation()}
                  >
                        <div
                              style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 24,
                              }}
                        >
                              <h2
                                    style={{
                                          margin: 0,
                                          fontFamily: "'Syne',sans-serif",
                                          fontSize: 18,
                                          fontWeight: 700,
                                          color: "#e8e8e8",
                                    }}
                              >
                                    Edit Profile
                              </h2>
                              <button
                                    className="up-btn-ghost"
                                    style={{ padding: "6px 10px", borderRadius: 8 }}
                                    onClick={onClose}
                              >
                                    <X size={14} />
                              </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                              {fields.map(({ key, label, icon, placeholder, multiline }) => (
                                    <div key={key}>
                                          <label className="up-input-label"><span className="mr-2">{icon}</span>{label}</label>
                                          {multiline ? (
                                                <textarea
                                                      className="up-input"
                                                      style={{ resize: "none", height: 72, paddingTop: 10 }}
                                                      value={form[key]}
                                                      onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                                                      placeholder={placeholder}
                                                />
                                          ) : (
                                                <input
                                                      className="up-input"
                                                      value={form[key]}
                                                      onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                                                      placeholder={placeholder}
                                                />
                                          )}
                                    </div>
                              ))}
                        </div>

                        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                              <button className="up-btn-ghost" style={{ flex: 1 }} onClick={onClose}>
                                    Cancel
                              </button>
                              <button
                                    className="up-btn-primary"
                                    style={{ flex: 2 }}
                                    onClick={handleSave}
                                    disabled={saving}
                              >
                                    {saving ? (
                                          <svg
                                                className="animate-spin"
                                                width="13"
                                                height="13"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                          >
                                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                          </svg>
                                    ) : (
                                          <Save size={13} />
                                    )}
                                    {saving ? "Saving…" : "Save Changes"}
                              </button>
                        </div>
                  </div>
            </div>
      );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

const TABS = [
      { id: "overview", label: "Overview", icon: User },
      { id: "activity", label: "Activity", icon: Activity },
      { id: "connections", label: "Connections", icon: Users },
      { id: "workspaces", label: "Workspaces", icon: Building2 },
      { id: "settings", label: "Settings", icon: Settings },
];

export default function UserProfile() {
      const { user: userData, profile, userStats, signout } = useAppState();

      const [activeTab, setActiveTab] = useState("overview");
      const [editOpen, setEditOpen] = useState(false);
      const [prefs, setPrefs] = useState({
            darkMode: true,
            aiSuggestions: true,
            emailNotifications: false,
            desktopAlerts: true,
            compactView: false,
      });
      const [localProfile, setLocalProfile] = useState(null);

      const displayName =
            localProfile?.name ||
            profile?.name ||
            userData?.user_metadata?.name ||
            "User";
      const email = userData?.email || profile?.email || "";
      const roleLabel = profile?.role || "Member";
      const bioText = localProfile?.bio || profile?.bio || userData?.user_metadata?.bio || "";
      const countryVal = localProfile?.country || profile?.country || "—";
      const joinedRaw = profile?.created_at || userData?.created_at || "";
      const joinedDate = joinedRaw
            ? new Date(joinedRaw).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
            })
            : "—";
      const online = true;
      const githubUrl = localProfile?.github_url || profile?.github_url || "#";
      const twitterUrl = localProfile?.twitter_url || profile?.twitter_url || "#";

      const handleSaveProfile = async (form) => {
            // Optimistic local update
            setLocalProfile(form);
            // Persist to Supabase profiles table
            if (userData?.id) {
                  await supabase
                        .from("profiles")
                        .update({
                              name: form.name,
                              bio: form.bio,
                              country: form.country,
                              github_url: form.github_url,
                              twitter_url: form.twitter_url,
                        })
                        .eq("id", userData.id);
            }
      };

      const handleSignOut = async () => {
            await signout();
            window.location.href = "/";
      };

      return (
            <>
                  <NavBar homePage={false} />
                  {/* <EnhancedAuthBackground> */}

                  <div className="bg-black">

                        <div
                              style={{
                                    minHeight: "100vh",
                                    fontFamily: "'Syne', sans-serif",
                                    color: "#e8e8e8",
                                    paddingTop: 72, // below fixed navbar
                              }}
                        >
                              {/* ── HERO BAND ── */}
                              <div
                                    style={{
                                          position: "relative",
                                          padding: "40px 0 0",
                                          overflow: "hidden",
                                    }}
                              >
                                    {/* Mesh background blobs */}
                                    <div
                                          className="mesh-bg"
                                          style={{
                                                width: 600,
                                                height: 300,
                                                background: "rgba(139,0,0,0.12)",
                                                top: -80,
                                                left: "20%",
                                                animationDelay: "0s",
                                          }}
                                    />
                                    <div
                                          className="mesh-bg"
                                          style={{
                                                width: 400,
                                                height: 200,
                                                background: "rgba(56,189,248,0.06)",
                                                top: -40,
                                                right: "10%",
                                                animationDelay: "3s",
                                          }}
                                    />

                                    <div
                                          style={{
                                                maxWidth: 960,
                                                margin: "0 auto",
                                                padding: "0 28px 32px",
                                                position: "relative",
                                                zIndex: 1,
                                          }}
                                    >
                                          {/* Identity row */}
                                          <div
                                                style={{
                                                      display: "flex",
                                                      alignItems: "flex-end",
                                                      gap: 20,
                                                      flexWrap: "wrap",
                                                }}
                                          >
                                                <div style={{ position: "relative" }}>
                                                      <Avatar user_avatar={userData?.avatar_url} name={displayName} size={76} />
                                                      <div
                                                            style={{
                                                                  position: "absolute",
                                                                  bottom: 2,
                                                                  right: 2,
                                                                  background: "#0f0f11",
                                                                  borderRadius: "50%",
                                                                  padding: 3,
                                                            }}
                                                      >
                                                            <StatusDot online={online} />
                                                      </div>
                                                </div>

                                                <div style={{ flex: 1, minWidth: 180 }}>
                                                      <div
                                                            style={{
                                                                  display: "flex",
                                                                  alignItems: "center",
                                                                  gap: 10,
                                                                  flexWrap: "wrap",
                                                            }}
                                                      >
                                                            <h1
                                                                  style={{
                                                                        margin: 0,
                                                                        fontSize: 26,
                                                                        fontWeight: 800,
                                                                        letterSpacing: "-0.03em",
                                                                        color: "#f1f1f1",
                                                                  }}
                                                            >
                                                                  {displayName}
                                                            </h1>
                                                            <span
                                                                  className="up-badge"
                                                                  style={{
                                                                        background: "rgba(220,38,38,0.12)",
                                                                        border: "1px solid rgba(220,38,38,0.25)",
                                                                        color: "#f87171",
                                                                  }}
                                                            >
                                                                  {roleLabel}
                                                            </span>
                                                            {online && (
                                                                  <span
                                                                        className="up-badge"
                                                                        style={{
                                                                              background: "rgba(74,222,128,0.1)",
                                                                              border: "1px solid rgba(74,222,128,0.2)",
                                                                              color: "#4ade80",
                                                                        }}
                                                                  >
                                                                        Online
                                                                  </span>
                                                            )}
                                                      </div>
                                                      <p
                                                            style={{
                                                                  margin: "5px 0 0",
                                                                  fontFamily: "'DM Mono', monospace",
                                                                  fontSize: 12,
                                                                  color: "rgba(160,160,170,0.6)",
                                                            }}
                                                      >
                                                            {email}
                                                      </p>
                                                      {bioText && (
                                                            <p
                                                                  style={{
                                                                        margin: "8px 0 0",
                                                                        fontSize: 13,
                                                                        color: "rgba(200,200,210,0.65)",
                                                                        maxWidth: 440,
                                                                        lineHeight: 1.5,
                                                                  }}
                                                            >
                                                                  {bioText}
                                                            </p>
                                                      )}

                                                      <div
                                                            style={{
                                                                  display: "flex",
                                                                  alignItems: "center",
                                                                  gap: 14,
                                                                  marginTop: 12,
                                                                  flexWrap: "wrap",
                                                            }}
                                                      >
                                                            {[
                                                                  { icon: MapPin, val: countryVal },
                                                                  { icon: CalendarDays, val: `Joined ${joinedDate}` },
                                                            ].map((m, i) => {
                                                                  const Icon = m.icon;
                                                                  return (
                                                                        <div
                                                                              key={i}
                                                                              style={{
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                    gap: 5,
                                                                                    fontFamily: "'DM Mono', monospace",
                                                                                    fontSize: 11,
                                                                                    color: "rgba(160,160,170,0.5)",
                                                                              }}
                                                                        >
                                                                              <Icon size={11} />
                                                                              {m.val}
                                                                        </div>
                                                                  );
                                                            })}

                                                            {/* Social links */}
                                                            {githubUrl !== "#" && (
                                                                  <a
                                                                        href={githubUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style={{
                                                                              display: "flex",
                                                                              alignItems: "center",
                                                                              gap: 5,
                                                                              fontFamily: "'DM Mono', monospace",
                                                                              fontSize: 11,
                                                                              color: "rgba(160,160,170,0.5)",
                                                                              textDecoration: "none",
                                                                              transition: "color 0.2s",
                                                                        }}
                                                                        onMouseEnter={(e) =>
                                                                              (e.currentTarget.style.color = "#e8e8e8")
                                                                        }
                                                                        onMouseLeave={(e) =>
                                                                        (e.currentTarget.style.color =
                                                                              "rgba(160,160,170,0.5)")
                                                                        }
                                                                  >
                                                                        {/* <Github size={11} /> */}
                                                                        GitHub
                                                                  </a>
                                                            )}
                                                            {twitterUrl !== "#" && (
                                                                  <a
                                                                        href={twitterUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style={{
                                                                              display: "flex",
                                                                              alignItems: "center",
                                                                              gap: 5,
                                                                              fontFamily: "'DM Mono', monospace",
                                                                              fontSize: 11,
                                                                              color: "rgba(160,160,170,0.5)",
                                                                              textDecoration: "none",
                                                                              transition: "color 0.2s",
                                                                        }}
                                                                        onMouseEnter={(e) =>
                                                                              (e.currentTarget.style.color = "#e8e8e8")
                                                                        }
                                                                        onMouseLeave={(e) =>
                                                                        (e.currentTarget.style.color =
                                                                              "rgba(160,160,170,0.5)")
                                                                        }
                                                                  >
                                                                        {/* <Twitter size={11} /> */}
                                                                        Twitter
                                                                  </a>
                                                            )}
                                                      </div>
                                                </div>

                                                {/* Edit button */}
                                                <button
                                                      className="up-btn-ghost border"
                                                      onClick={() => setEditOpen(true)}
                                                      style={{ alignSelf: "flex-start" }}
                                                >
                                                      <Edit3 size={13} />
                                                      Edit Profile
                                                </button>
                                          </div>

                                          {/* Quick stats strip */}
                                          <div
                                                style={{
                                                      display: "flex",
                                                      gap: 10,
                                                      marginTop: 28,
                                                      flexWrap: "wrap",
                                                }}
                                          >
                                                <StatCard
                                                      label="Active Lists"
                                                      value={userStats?.currentList}
                                                      accent="#38bdf8"
                                                      icon={LayoutGrid}
                                                      delay={0}
                                                />
                                                <StatCard
                                                      label="Total Tasks"
                                                      value={userStats?.totalTodos}
                                                      accent="#a5b4fc"
                                                      icon={CheckCircle2}
                                                      delay={60}
                                                />
                                                <StatCard
                                                      label="Completed"
                                                      value={userStats?.completedTodos}
                                                      accent="#4ade80"
                                                      icon={TrendingUp}
                                                      delay={120}
                                                />
                                                <StatCard
                                                      label="Pending"
                                                      value={
                                                            (userStats?.totalTodos ?? 0) -
                                                            (userStats?.completedTodos ?? 0)
                                                      }
                                                      accent="#fbbf24"
                                                      icon={Clock}
                                                      delay={180}
                                                />
                                                <StatCard
                                                      label="Done Today"
                                                      value={userStats?.completedToday}
                                                      accent="#f87171"
                                                      icon={Zap}
                                                      delay={240}
                                                />
                                          </div>
                                    </div>

                                    {/* Bottom separator */}
                                    <div
                                          style={{
                                                height: 1,
                                                background:
                                                      "linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)",
                                          }}
                                    />
                              </div>

                              {/* ── TAB STRIP ── */}
                              <div
                                    style={{
                                          position: "sticky",
                                          top: 64,
                                          zIndex: 40,
                                          background: "rgba(10,10,12,0.85)",
                                          backdropFilter: "blur(16px)",
                                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                                    }}
                              >
                                    <div
                                          style={{
                                                maxWidth: 960,
                                                margin: "0 auto",
                                                padding: "0 28px",
                                                display: "flex",
                                                gap: 2,
                                                overflowX: "auto",
                                          }}
                                    >
                                          {TABS.map(({ id, label, icon: Icon }) => (
                                                <button
                                                      key={id}
                                                      className={`up-tab-btn ${activeTab === id ? "active" : ""}`}
                                                      onClick={() => setActiveTab(id)}
                                                >
                                                      <Icon size={13} />
                                                      {label}
                                                      <span className="up-tab-indicator" />
                                                </button>
                                          ))}
                                    </div>
                              </div>

                              {/* ── TAB CONTENT ── */}
                              <div
                                    style={{
                                          maxWidth: 960,
                                          margin: "0 auto",
                                          padding: "28px 28px 60px",
                                          animation: "tabSlide 0.25s ease",
                                          key: activeTab, // re-triggers animation on tab change
                                    }}
                              >
                                    {activeTab === "overview" && (
                                          <OverviewPanel
                                                userStats={userStats}
                                                prefs={prefs}
                                                setPrefs={setPrefs}
                                          />
                                    )}
                                    {activeTab === "activity" && <ActivityPanel />}
                                    {activeTab === "connections" && <ConnectionsPanel />}
                                    {activeTab === "workspaces" && <WorkspacesPanel />}
                                    {activeTab === "settings" && (
                                          <SettingsPanel signout={handleSignOut} />
                                    )}
                              </div>
                        </div>
                  </div>
                  {/* </EnhancedAuthBackground > */}


                  {/* Edit Profile Modal */}
                  < EditProfileModal
                        isOpen={editOpen}
                        onClose={() => setEditOpen(false)
                        }
                        profile={localProfile || profile}
                        userData={userData}
                        onSave={handleSaveProfile}
                  />
            </>
      );
}

