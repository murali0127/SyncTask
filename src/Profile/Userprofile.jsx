
// import { useAppState } from "../providers/AppProvider"; import { useState } from "react"; import NavBar from '../components/NavBar'; import { EnhancedAuthBackground } from "../components/ui/FloatingUIElements"; import '../styles/auth-floating-ui.css'; // ─── Fonts: add to your index.html or g
import { Pencil } from "lucide-react";

import { useAppState } from "../providers/AppProvider";
import { useEffect, useState } from "react";
import NavBar from '../components/NavBar';
import { EnhancedAuthBackground } from "../components/ui/FloatingUIElements";
import '../styles/auth-floating-ui.css';

import { MapPinned, CalendarDays } from "lucide-react";
import { Navigate, Link, replace } from "react-router-dom";
import EditProfileEditForm from "./ProfileEditForm";

// ─── Inject global keyframe animations ─────────────────────────────────────
const STYLES = `
  @keyframes spin-orbit   { to { transform: rotate(360deg); } }
  @keyframes pulse-dot    { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes card-in      { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer      { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes avatar-ring  { 0%,100%{box-shadow:0 0 0 2px rgba(239,68,68,0.4),0 0 18px rgba(239,68,68,0.15)} 50%{box-shadow:0 0 0 3px rgba(239,68,68,0.7),0 0 28px rgba(239,68,68,0.25)} }
  @keyframes badge-pulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
  @keyframes float-slow   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  @keyframes progress-fill{ from{width:0} to{width:var(--w)} }
  @keyframes dot-blink    { 0%,100%{opacity:1} 40%{opacity:0.2} }
`;

if (typeof document !== "undefined" && !document.getElementById("up-styles-v2")) {
      const el = document.createElement("style");
      el.id = "up-styles-v2";
      el.textContent = STYLES;
      document.head.appendChild(el);
}

// ─── Design tokens ──────────────────────────────────────────────────────────
const C = {
      text: "#EEEEEE",
      textSecondary: "rgba(238,238,238,0.75)",
      textMuted: "rgba(105,105,105)",
      bg: "rgb(28, 27, 27)", // neutral-900
      bgLight: "rgb(33, 30,  30)", // neutral-800
      border: "rgba(255,255,255,0.04)",
      borderLight: "rgba(255,255,255,0.06)",
      borderHover: "rgba(255,255,255,0.08)",

      // Primary accent palette
      accent1: "#8E1616",      // Deep burgundy
      accent2: "#D84040",      // Medium red
      accent1Soft: "rgba(142,22,22,0.15)",
      accent1Border: "rgba(142,22,22,0.30)",
      accent2Soft: "rgba(216,64,64,0.15)",
      accent2Border: "rgba(216,64,64,0.30)",

      // Supporting colors
      purple: "#a5b4fc",
      purpleSoft: "rgba(165,180,252,0.12)",
      green: "#4ade80",
      greenSoft: "rgba(74,222,128,0.12)",
      amber: "#fbbf24",
      amberSoft: "rgba(251,191,36,0.12)",
      sky: "#38bdf8",
      skySoft: "rgba(56,189,248,0.1)",

      mono: "'DM Mono', monospace",
      sans: "'Syne', sans-serif",
};



function shimmerLine(color = "rgba(216,64,64,0.3)") {
      return (
            <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 1.5,
                  background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            }} />
      );
}

function Card({ children, delay = 0, accentColor = "rgba(0,0,0)", style = {}, className = "" }) {
      return (
            <div
                  className={className}
                  style={{
                        background: "rgb(33, 30, 30)",
                        border: `1px solid ${C.border}`,
                        borderRadius: 12,
                        padding: "20px 22px",
                        position: "relative",
                        overflow: "hidden",
                        animation: `card-in 0.5s ease both`,
                        animationDelay: `${delay}ms`,
                        transition: "border-color 0.3s ease, background 0.3s ease",
                        ...style,
                  }}
            >
                  {shimmerLine(accentColor)}
                  {children}
            </div>
      );
}

function SectionLabel({ children, color = "#EEEEEE" }) {
      return (
            <p style={{
                  fontFamily: C.mono,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "1.6px",
                  textTransform: "uppercase",
                  color,
                  marginBottom: 14,
                  margin: "0 0 14px 0",
                  opacity: 0.9,
            }}>
                  {children}
            </p>
      );
}

function Toggle({ on, onChange }) {
      return (
            <button
                  onClick={onChange}
                  style={{
                        width: 40, height: 22, borderRadius: 99,
                        background: on ? C.accent2 : C.bgLight,
                        border: on ? `1px solid ${C.accent2Border}` : `1px solid ${C.border}`,
                        position: "relative", cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        flexShrink: 0, outline: "none",
                  }}
                  aria-pressed={on}
            >
                  <span style={{
                        position: "absolute", top: 2.5,
                        left: on ? 21 : 3,
                        width: 16, height: 16, borderRadius: "50%",
                        background: "#fff",
                        transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        display: "block",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }} />
            </button>
      );
}

function StatusDot({ online = true }) {
      return (
            <span style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: online ? C.green : C.textMuted,
                  display: "inline-block",
                  boxShadow: online ? `0 0 8px ${C.green}` : "none",
                  animation: online ? "dot-blink 2.5s infinite" : "none",
                  flexShrink: 0,
            }} />
      );
}

function StatPill({ label, value, color, bg }) {
      return (
            <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 6, padding: "14px 16px",
                  background: bg || C.bgLight,
                  borderRadius: 10,
                  border: `1px solid ${C.border}`,
                  flex: 1,
                  transition: "border-color 0.3s ease, background 0.3s ease",
            }}>
                  <span style={{ fontFamily: C.mono, fontSize: 20, fontWeight: 600, color: color || C.text }}>{value}</span>
                  <span style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.6px" }}>{label}</span>
            </div>
      );
}

function ProgressBar({ value, max, color = C.accent2, delay = 0 }) {
      const pct = max === 0 ? 0 : Math.round((value / max) * 100);
      return (
            <div style={{ width: "100%" }}>
                  <div style={{
                        display: "flex", justifyContent: "space-between",
                        marginBottom: 8, fontSize: 11,
                  }}>
                        <span style={{ color: C.textMuted }}>Completion</span>
                        <span style={{ fontFamily: C.mono, color, fontWeight: 600 }}>{pct}%</span>
                  </div>
                  <div style={{
                        height: 6, borderRadius: 99,
                        background: C.bgLight,
                        border: `1px solid ${C.border}`,
                        overflow: "hidden",
                  }}>
                        <div style={{
                              height: "100%", borderRadius: 99,
                              background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                              width: `${pct}%`,
                              transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
                              boxShadow: `inset 0 0 8px ${color}44`,
                        }} />
                  </div>
            </div>
      );
}

function TaskChip({ label, count, color, bg, borderColor }) {
      return (
            <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "11px 14px",
                  background: bg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 10,
                  gap: 8,
                  transition: "all 0.3s ease",
            }}>
                  <span style={{ fontSize: 12.5, color: C.textSecondary }}>{label}</span>
                  <span style={{
                        fontFamily: C.mono, fontSize: 16, fontWeight: 600, color,
                        minWidth: 24, textAlign: "right",
                  }}>{count}</span>
            </div>
      );
}

function WorkspaceBadge({ name, role, members, color, delay = 0 }) {
      return (
            <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px",
                  background: C.bgLight,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  animation: `card-in 0.4s ease both`,
                  animationDelay: `${delay}ms`,
                  cursor: "pointer",
                  transition: "background 0.3s ease, border-color 0.3s ease",
            }}
                  onMouseEnter={e => {
                        e.currentTarget.style.background = C.bgLight;
                        e.currentTarget.style.borderColor = C.borderLight;
                  }}
                  onMouseLeave={e => {
                        e.currentTarget.style.background = C.bgLight;
                        e.currentTarget.style.borderColor = C.border;
                  }}
            >
                  <div style={{
                        width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                        background: color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 600,
                  }}>
                        {name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, color: C.text, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
                        <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{role} · {members} members</div>
                  </div>
                  <div style={{
                        fontSize: 9, fontFamily: C.mono, color: C.textMuted,
                        padding: "4px 8px", borderRadius: 4,
                        border: `1px solid ${C.border}`,
                  }}>
                        →
                  </div>
            </div>
      );
}

function SocialLink({ icon, label, href }) {
      return (
            <a
                  href={href || "#"}
                  style={{
                        display: "flex", alignItems: "center", gap: 7,
                        padding: "8px 12px",
                        background: C.bgLight,
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        textDecoration: "none",
                        color: C.textSecondary,
                        fontSize: 12,
                        transition: "all 0.3s ease",
                        flex: 1,
                        justifyContent: "center",
                  }}
                  onMouseEnter={e => {
                        e.currentTarget.style.background = C.bgLight;
                        e.currentTarget.style.color = "white";
                        e.currentTarget.style.borderColor = "white";
                  }}
                  onMouseLeave={e => {
                        e.currentTarget.style.background = C.bgLight;
                        e.currentTarget.style.color = C.textMuted;
                        e.currentTarget.style.borderColor = C.border;
                  }}
            >
                  <span style={{ fontSize: 13 }}>{icon}</span>

                  <span>{label}</span>
            </a>
      );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function UserProfile() {
      const { user: userData, profile, currentListTodos, userStats } = useAppState();

      useEffect(() => {
            // console.log('User data : ', userData);
            // console.log('Profile information : ', profile);
            console.log('User Stats : ', userStats);
      }, []);

      // const { user: useData, profile, loading: profileLoading, error: profileError } = useAppState();

      // derive display fields from app state
      const displayName = profile?.full_name || userData?.user_metadata?.name || "User";
      const email = userData?.email || profile?.email || "";
      const roleLabel = profile?.user_role || userData?.role || "Member";
      const bioText = profile?.bio || userData?.user_metadata?.bio || "";
      const countryVal = profile?.country || userData?.country || "-";
      const joined = profile?.created_at || userData?.created_at || "";
      const online = profile?.online ?? true;
      const githubUrl = profile?.github_url || userData?.github_url || "#";
      const twitterUrl = profile?.twitter_url || userData?.twitter_url || "#";

      const completedTasks = currentListTodos.filter((t) => t.completed).length;
      const pendingTasks = currentListTodos.filter((t) => !t.completed).length;
      const totalTasks = currentListTodos.length;
      const totalLists = 4; // replace with real list count

      // Workspaces (future: from API)
      // const workspaces = [
      //       { name: "Design System Team", role: "Admin", members: 8, color: "rgba(165,180,252,0.2)" },
      //       { name: "Q3 Sprint Squad", role: "Member", members: 5, color: "rgba(239,68,68,0.2)" },
      //       { name: "Open Source Collab", role: "Contributor", members: 23, color: "rgba(74,222,128,0.15)" },
      // ];

      // Preferences state
      const [prefs, setPrefs] = useState({
            darkMode: true,
            aiSuggestions: true,
            emailNotifications: false,
            desktopAlerts: true,
            compactView: false,
            workspaceInvites: true,
      });
      const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

      const [activeTab, setActiveTab] = useState("overview");

      // ── Layout ──────────────────────────────────────────────────────────────
      const wrapStyle = {
            fontFamily: C.sans,
            color: C.text,
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
      };

      const contentStyle = {
            flex: 1,
            padding: "28px 28px 40px",
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: 20,
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
            boxSizing: "border-box",
      };

      const [formData, setFormData] = useState({ name: "", bio: "", avatar_url: "", country: "", role: "", github_link: "", x_link: "" })

      return (
            <>
                  <div>
                        <NavBar homePage={false} />
                  </div>
                  <EnhancedAuthBackground>
                        <div style={wrapStyle}>
                              <div style={contentStyle}>

                                    {/* ══════════════════ LEFT PANEL ══════════════════ */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                                          {/* Avatar + Identity */}
                                          <Card delay={0} accentColor="rgba(0,0,0)">
                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, paddingTop: 8 }}>
                                                      {/* Avatar */}
                                                      <div style={{ position: "relative", animation: "float-slow 4s ease-in-out infinite" }}>
                                                            <div style={{
                                                                  width: 84, height: 84, borderRadius: "50%",
                                                                  background: `linear-gradient(135deg, ${C.accent1}33, ${C.accent2}33)`,
                                                                  display: "flex", alignItems: "center", justifyContent: "center",
                                                                  fontSize: 36, fontWeight: 700,
                                                                  animation: "avatar-ring 3s ease-in-out infinite",
                                                                  border: `2px solid ${C.accent2Border}`,
                                                                  color: C.text,
                                                            }}>
                                                                  {userData?.user_metadata?.name?.[0] || ":)"}
                                                            </div>
                                                            {/* Online dot */}
                                                            <div style={{
                                                                  position: "absolute", bottom: 0, right: 0,
                                                                  width: 16, height: 16, borderRadius: "50%",
                                                                  background: online ? C.green : C.textMuted,
                                                                  border: `3px solid ${C.bg}`,
                                                                  boxShadow: online ? `0 0 10px ${C.green}66` : "none",
                                                            }} />
                                                      </div>

                                                      {/* Name & Role */}
                                                      <div style={{ textAlign: "center", width: "100%" }}>
                                                            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.3px", color: C.text }}>{displayName}</h2>
                                                            <p style={{ margin: "4px 0 0", fontFamily: C.mono, fontSize: 11, color: C.textSecondary }}>{email}</p>
                                                            <div style={{
                                                                  marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6,
                                                                  padding: "6px 12px", borderRadius: 8,
                                                                  background: C.accent2Soft, border: `1px solid ${C.accent2Border}`,
                                                                  fontSize: 11, color: C.accent2, fontWeight: 600,
                                                            }}>
                                                                  <span>{roleLabel}</span>
                                                            </div>
                                                      </div>

                                                      {/* Bio */}
                                                      <p style={{
                                                            margin: 0, fontSize: 12.5, color: C.text,
                                                            textAlign: "center", lineHeight: 1.6,
                                                            borderTop: `1px solid ${C.border}`,
                                                            paddingTop: 14, width: "100%",
                                                      }}>
                                                            {bioText}
                                                      </p>

                                                      {/* Meta info */}
                                                      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
                                                            {[
                                                                  { icon: MapPinned, val: countryVal },
                                                                  { icon: CalendarDays, val: joined ? `Joined ${joined}` : "-" },
                                                            ].map((m, i) => {
                                                                  const Icon = m.icon;
                                                                  return (
                                                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.textSecondary }}>
                                                                              <Icon size="15px" color="white" />
                                                                              <span>{m.val}</span>
                                                                        </div>
                                                                  )
                                                            })}
                                                      </div>

                                                      {/* Social links */}
                                                      <div style={{ width: "100%", display: "flex", gap: 8 }}>
                                                            <SocialLink icon={<i className="bi bi-github"></i>} label="GitHub" href={githubUrl} />
                                                            <SocialLink icon={<i className="bi bi-twitter-x"></i>} label="Twitter" href={twitterUrl} />
                                                      </div>

                                                      {/* Edit profile button */}
                                                      <button
                                                            className="mt-2 w-full text-md font-mono font-semibold text-white hover:text-neutral-300 py-1 hover:bg-rose-700 rounded-lg transition-colors border border-neutral-800"
                                                            onClick={() => <Navigate to="/profile/editProfile" />}>
                                                            Edit Profile
                                                      </button>
                                                </div>
                                          </Card>

                                          {/* Theme & Preferences */}
                                          <Card delay={80} accentColor="rgba(165,180,252,0.3)">
                                                <SectionLabel color="rgba(165,180,252,0.8)">Preferences</SectionLabel>
                                                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                                                      {[
                                                            { key: "darkMode", label: "Dark Mode" },
                                                            { key: "aiSuggestions", label: "AI Suggestions" },
                                                            { key: "emailNotifications", label: "Email Notifications" },
                                                            { key: "desktopAlerts", label: "Desktop Alerts" },
                                                            { key: "compactView", label: "Compact View" },
                                                            { key: "workspaceInvites", label: "Workspace Invites", last: true },
                                                      ].map(({ key, label, last }) => (
                                                            <div key={key} style={{
                                                                  display: "flex", justifyContent: "space-between", alignItems: "center",
                                                                  padding: "11px 0",
                                                                  borderBottom: last ? "none" : `1px solid ${C.border}`,
                                                                  fontSize: 12.5, color: C.textSecondary,
                                                            }}>
                                                                  <span>{label}</span>
                                                                  <Toggle on={prefs[key]} onChange={() => toggle(key)} />
                                                            </div>
                                                      ))}
                                                </div>
                                          </Card>

                                          {/* Account Settings */}
                                          <Card delay={140} accentColor="rgba(216,64,64,0.2)" style={{ border: `1px solid ${C.accent2Border}` }}>
                                                <SectionLabel color={C.accent2}>Account</SectionLabel>
                                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                      <button style={{
                                                            width: "100%", padding: "10px 0",
                                                            background: "transparent",
                                                            border: `1px solid ${C.border}`,
                                                            borderRadius: 8, color: C.textMuted,
                                                            fontSize: 12.5, fontFamily: C.sans, cursor: "pointer", fontWeight: 500,
                                                            transition: "all 0.3s ease",
                                                      }}
                                                            onMouseEnter={e => {
                                                                  e.currentTarget.style.color = C.text;
                                                                  e.currentTarget.style.borderColor = C.accent2;
                                                                  e.currentTarget.style.background = C.accent2Soft;
                                                            }}
                                                            onMouseLeave={e => {
                                                                  e.currentTarget.style.color = C.textMuted;
                                                                  e.currentTarget.style.borderColor = C.border;
                                                                  e.currentTarget.style.background = "transparent";
                                                            }}
                                                      >
                                                            Change Password
                                                      </button>
                                                      <button style={{
                                                            width: "100%", padding: "10px 0",
                                                            background: C.accent2Soft,
                                                            border: `1px solid ${C.accent2Border}`,
                                                            borderRadius: 8, color: C.accent2,
                                                            fontSize: 12.5, fontFamily: C.sans, cursor: "pointer", fontWeight: 500,
                                                            transition: "all 0.3s ease",
                                                      }}
                                                            onMouseEnter={e => {
                                                                  e.currentTarget.style.background = C.accent2;
                                                                  e.currentTarget.style.color = C.text;
                                                                  e.currentTarget.style.transform = "translateY(-2px)";
                                                                  e.currentTarget.style.boxShadow = `0 4px 12px ${C.accent2}40`;
                                                            }}
                                                            onMouseLeave={e => {
                                                                  e.currentTarget.style.background = C.accent2Soft;
                                                                  e.currentTarget.style.color = C.accent2;
                                                                  e.currentTarget.style.transform = "translateY(0)";
                                                                  e.currentTarget.style.boxShadow = "none";
                                                            }}
                                                      >
                                                            Sign Out
                                                      </button>
                                                </div>
                                          </Card>
                                    </div>

                                    {/* ══════════════════ RIGHT PANEL ══════════════════ */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                                          {/* Stats Row */}
                                          <Card delay={40} accentColor="rgba(56,189,248,0.25)">
                                                <SectionLabel>Overview</SectionLabel>
                                                <div style={{ display: "flex", gap: 12 }}>
                                                      <StatPill label="Lists" value={userStats?.currentList} color={C.sky} bg={C.skySoft} />
                                                      <StatPill label="Tasks" value={userStats?.totalTodos} color={C.purple} bg={C.purpleSoft} />
                                                      <StatPill label="Done" value={userStats?.completedTodos} color={C.green} bg={C.greenSoft} />
                                                      <StatPill label="Pending" value={userStats?.totalTodos - userStats?.completedTodos} color={C.amber} bg={C.amberSoft} />
                                                </div>
                                                <div style={{ marginTop: 18 }}>
                                                      <ProgressBar value={userStats?.completedTodos || 0} max={userStats?.totalTodos || 0} color={C.green} />
                                                </div>
                                          </Card>

                                          {/* Task Breakdown & Activity */}
                                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                                <Card delay={100} accentColor="rgba(74,222,128,0.2)">
                                                      <SectionLabel color="rgba(74,222,128,0.7)">Task Breakdown</SectionLabel>
                                                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                                            <TaskChip icon="" label="Completed" count={userStats?.completedTodos} color={C.green} bg={C.greenSoft} borderColor="rgba(74,222,128,0.25)" />
                                                            <TaskChip icon="" label="In Progress" count={Math.floor((userStats?.totalTodos - userStats?.completedTodos))} color={C.amber} bg={C.amberSoft} borderColor="rgba(251,191,36,0.25)" />
                                                            <TaskChip icon="" label="Backlog" count={Math.ceil(0)} color={C.textMuted} bg={C.bgLight} borderColor={C.border} />
                                                            <TaskChip icon="" label="Total Active" count={userStats?.totalTodos} color={C.purple} bg={C.purpleSoft} borderColor="rgba(165,180,252,0.25)" />
                                                      </div>
                                                </Card>

                                                {/* Activity */}
                                                <Card delay={100} accentColor="rgba(251,191,36,0.2)">
                                                      <SectionLabel color="rgba(251,191,36,0.7)">Recent Activity</SectionLabel>
                                                      <div style={{ display: "flex", flexDirection: "column" }}>

                                                            {[
                                                                  { icon: "✓", label: `Completed`, time: "2m ago", bg: "rgba(74,222,128,0.12)" },
                                                                  { icon: "+", label: "Created 'Sprint Review' list", time: "1h ago", bg: "rgba(56,189,248,0.12)" },
                                                                  { icon: "→", label: "Moved task to Done", time: "3h ago", bg: "rgba(165,180,252,0.12)" },
                                                                  { icon: "✎", label: "Edited 'Auth flow' task", time: "1d ago", bg: "rgba(251,191,36,0.12)" },
                                                                  { icon: "⊕", label: "Joined Q3 Sprint Squad", time: "2d ago", bg: C.accent2Soft },
                                                            ].map((a, i, arr) => (
                                                                  <div key={i} style={{
                                                                        display: "flex", alignItems: "center", gap: 10,
                                                                        padding: "10px 0",
                                                                        borderBottom: i === arr.length - 1 ? "none" : `1px solid ${C.border}`,
                                                                  }}>
                                                                        <div style={{
                                                                              width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                                                                              background: a.bg,
                                                                              display: "flex", alignItems: "center", justifyContent: "center",
                                                                              fontSize: 12, color: C.text, fontWeight: 600,
                                                                        }}>{a.icon}</div>
                                                                        <span style={{ flex: 1, fontSize: 12, color: C.textSecondary, lineHeight: 1.4 }}>{a.label}</span>
                                                                        <span style={{ fontFamily: C.mono, fontSize: 10, color: C.textMuted, flexShrink: 0 }}>{a.time}</span>
                                                                  </div>
                                                            ))}
                                                      </div>
                                                </Card>
                                          </div>

                                    </div>
                              </div>
                        </div >
                  </EnhancedAuthBackground >
            </>
      );
}

