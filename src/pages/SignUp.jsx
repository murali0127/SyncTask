import { useState, useEffect } from "react";
import { useAuth } from '../lib/context/AuthContext'
import { useNavigate } from "react-router-dom";
import { EnhancedAuthBackground, AuthCardWrapper } from "../components/ui/FloatingUIElements";
import "../styles/auth-floating-ui.css";
import toast from "react-hot-toast";
const cls = (...a) => a.filter(Boolean).join(" ");

function FloatingInput({ id, label, type = "text", value, onChange, error }) {
      const [focused, setFocused] = useState(false);
      const active = focused || value.length > 0;
      const [showPw, setShowPw] = useState(false);
      const inputType = type === "password" ? (showPw ? "text" : "password") : type;

      return (
            <div className="relative">
                  {/* glow ring on focus */}
                  <div
                        className="absolute -inset-px rounded-xl pointer-events-none transition-opacity duration-300"
                        style={{
                              opacity: focused ? 1 : 0,
                              background: "linear-gradient(135deg, #f43f5e, #a855f7)",
                              WebkitMask:
                                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                              WebkitMaskComposite: "xor",
                              maskComposite: "exclude",
                              padding: "1px",
                        }}
                  />
                  <div
                        className="relative rounded-xl overflow-hidden"
                        style={{
                              background: focused
                                    ? "rgba(244,63,94,0.06)"
                                    : "rgba(255,255,255,0.03)",
                              border: error
                                    ? "1px solid rgba(244,63,94,0.5)"
                                    : "1px solid rgba(255,255,255,0.08)",
                              transition: "background 0.2s",
                        }}
                  >
                        <label
                              htmlFor={id}
                              className="absolute left-4 transition-all duration-200 pointer-events-none select-none"
                              style={{
                                    top: active ? "8px" : "50%",
                                    transform: active ? "translateY(0)" : "translateY(-50%)",
                                    fontSize: active ? "10px" : "14px",
                                    color: active ? (focused ? "#fb7185" : "rgb(255, 211, 213)") : "rgb(255, 211, 213)",
                                    fontFamily: "'DM Mono', monospace",
                                    letterSpacing: active ? "0.1em" : "0",
                                    textTransform: active ? "uppercase" : "none",
                              }}
                        >
                              {label}
                        </label>
                        <input
                              name={id}
                              id={id}
                              type={inputType}
                              value={value}
                              onChange={onChange}
                              onFocus={() => setFocused(true)}
                              onBlur={() => setFocused(false)}
                              className="w-fit h-10 bg-transparent outline-none text-sm text-white pr-2"
                              style={{
                                    paddingLeft: "1rem",
                                    paddingRight: type === "password" ? "3rem" : "1rem",
                                    paddingTop: active ? "1.5rem" : "1rem",
                                    paddingBottom: active ? "0.5rem" : "1rem",
                                    fontFamily: "'DM Mono', monospace",
                              }}
                              autoComplete={id === "password" ? "current-password" : id === "email" ? "email" : "name"}
                        />
                        {type === "password" && (
                              <button
                                    type="button"
                                    onClick={() => setShowPw((p) => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                                    tabIndex={-1}
                              >
                                    {showPw ? (
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                          </svg>
                                    ) : (
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                          </svg>
                                    )}
                              </button>
                        )}
                  </div>
                  {
                        error && (
                              <p className="mt-1 text-xs text-rose-400 font-mono pl-1">{error}</p>
                        )
                  }
            </div >
      );
}

function SocialBtn({ icon, label }) {
      const [hovered, setHovered] = useState(false);
      return (
            <button
                  type="button"
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-mono uppercase tracking-widest transition-all duration-200"
                  style={{
                        background: hovered ? "55,255rgba(2,255,0.06)" : "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: hovered ? "#e2e8f0" : "rgb(255, 211, 213)",
                  }}
            >
                  {icon}
                  <span>{label}</span>
            </button>
      );
}

/* ── Orbiting particle ring decoration ── */
function ParticleRing() {
      return (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                  {[...Array(6)].map((_, i) => (
                        <div
                              key={i}
                              className="absolute w-1 h-1 rounded-full"
                              style={{
                                    background: i % 2 === 0 ? "#0a0a0a" : "#f5f5f5",
                                    opacity: 0.4,
                                    animation: `orbit-${i} ${8 + i * 1.5}s linear infinite`,
                                    top: "50%",
                                    left: "50%",
                              }}
                        />
                  ))}
                  <style>{`
        ${[...Array(6)].map((_, i) => {
                        const r = 180 + i * 22;
                        const delay = i * -2.5;
                        return `
            @keyframes orbit-${i} {
              from { transform: rotate(${i * 60}deg) translateX(${r}px) rotate(-${i * 60}deg); }
              to   { transform: rotate(${i * 60 + 360}deg) translateX(${r}px) rotate(-${i * 60 + 360}deg); }
            }
            div[style*="orbit-${i}"] { animation-delay: ${delay}s; }
          `;
                  }).join("")}
      `}</style>
            </div>
      );
}


export default function SignInForm() {
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [name, setName] = useState("");
      const [errors, setErrors] = useState({});
      const [loading, setLoading] = useState(false);
      const [success, setSuccess] = useState(false);
      const [mounted, setMounted] = useState(false);

      const { signup } = useAuth();
      const navigate = useNavigate();

      useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

      const validate = () => {
            const e = {};
            if (name.trim().length < 2) e.name = "name should greater then 5 characters";
            if (!email.includes("@")) e.email = "Enter a valid email address";
            if (password.length < 6) e.password = "Password must be 6+ characters";
            return e;
      };

      function showMessage(msg) {
            alert(`${msg}`);
      }


      const handleSubmit = async (ev) => {
            ev.preventDefault();
            const e = validate();
            if (Object.keys(e).length) { setErrors(e); return; }
            setErrors({});
            setLoading(true);

            try {

                  const { data, error } = await signup(
                        email,
                        password,
                        name
                  )

                  if (error) {
                        console.log(error)
                        setErrors({ general: error?.message || "Something went wrong, can't sign-up" });
                        setLoading(false)
                        return;
                  }
                  if (!data?.user && !data?.session) {   //data.user -> returns , Even if User doesn't exists. So, additional Check on session exists or not?.
                        setErrors({
                              general: "Signup didn't return a user. Possibly email confirmation required."
                        });
                        setLoading(false);
                        return;
                  }
                  showMessage("Please check your e-mail for confirmation.")
                  console.log('Please Check Your Mail.')
                  setSuccess(true);
                  setTimeout(() => navigate('/login'), 1000);

            } catch (error) {
                  console.error('Unexpected Error : ', error.message);
                  setErrors({ general: "Something Wrong happended during Signing Up user." })
                  setLoading(false);
            }
      };

      return (
            <EnhancedAuthBackground>
                  <div
                        className="min-h-screen flex gap-4 items-center justify-center px-6 py-5"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                        {/* Floating background elements now managed by EnhancedAuthBackground */}

                        <div
                              className="relative w-full max-w-sm"
                              style={{
                                    opacity: mounted ? 1 : 0,
                                    transform: mounted ? "translateY(0)" : "translateY(24px)",
                                    transition: "opacity 0.6s ease, transform 0.6s ease",
                              }}
                        >
                              {/* Card */}
                              <div
                                    className="h-fit relative rounded-2xl overflow-hidden"
                                    style={{
                                          background: "linear-gradient(160deg, #1e293b 0%, #581c87 100%)",
                                          border: "1px solid rgba(255,255,255,0.06)",
                                          boxShadow:
                                                "0 0 0 1px rgba(255,255,255,0.03), 0 40px 100px -20px rgba(0,0,0,0.9), 0 0 80px -20px rgba(244,63,94,0.12)",
                                    }}
                              >
                                    <ParticleRing />
                                    <ParticleRing />

                                    {/* top glare */}
                                    <div
                                          className="absolute top-0 left-0 right-0 h-px"
                                          style={{
                                                background:
                                                      "linear-gradient(90deg,transparent,rgba(244,63,94,0.5), rgba(196,181,253,0.3),transparent)",
                                          }}
                                    />

                                    <div className="relative p-8 space-y-8">
                                          {/* Logo / brand mark */}
                                          <div className="flex flex-col items-center gap-2 pb-4">
                                                <div
                                                      className="mt-2 w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-rose-500 via-transparent to-purple-500"
                                                      style={{
                                                            // background: "linear-gradient(135deg,#6366f1,#22d3ee)",
                                                            boxShadow: "0 0 30px rgba(244,63,94,0.4)",
                                                      }}
                                                >
                                                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                                                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                                      </svg>
                                                </div>
                                                <div className="text-center">
                                                      <h1
                                                            className="text-xl font-bold text-white"
                                                            style={{
                                                                  fontFamily: "'Syne', sans-serif",
                                                                  letterSpacing: "-0.03em",
                                                            }}
                                                      >
                                                            Welcome To SyncTask!
                                                      </h1>
                                                      <p className="text-xs text-slate-500 mt-0.5 tracking-widest uppercase" style={{ color: 'rgb(255, 211, 213)' }}>
                                                            Sign Up to continue
                                                      </p>
                                                </div>
                                          </div>

                                          {/* Social buttons */}
                                          <div className="flex gap-2">
                                                <SocialBtn
                                                      label="Google"
                                                      icon={
                                                            <svg width="15" height="15" viewBox="0 0 24 24">
                                                                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                            </svg>
                                                      }
                                                />
                                                <SocialBtn
                                                      label="GitHub"
                                                      icon={
                                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="#94a3b8">
                                                                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                                            </svg>
                                                      }
                                                />
                                          </div>

                                          {/* Divider */}
                                          <div className="flex items-center gap-5">
                                                <div className="flex-1 h-px" style={{ background: "rgba(255, 211, 213, 0.6)" }} />
                                                <span className="text-xs text-slate-600 tracking-widest uppercase" style={{ color: 'rgb(255, 211, 213)' }}>or</span>
                                                <div className="flex-1 h-px" style={{ background: "rgba(255, 211, 213, 0.6)" }} />
                                          </div>

                                          {/* Form */}
                                          {!success ? (
                                                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                                      <div
                                                            style={{
                                                                  opacity: mounted ? 1 : 0,
                                                                  transform: mounted ? "translateY(0)" : "translateY(12px)",
                                                                  transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
                                                            }}
                                                      >
                                                            <FloatingInput
                                                                  id="name"
                                                                  label="Enter your name"
                                                                  type="name"
                                                                  value={name}
                                                                  onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                                                                  error={errors.name}
                                                            />
                                                      </div>
                                                      <div
                                                            style={{
                                                                  opacity: mounted ? 1 : 0,
                                                                  transform: mounted ? "translateY(0)" : "translateY(12px)",
                                                                  transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
                                                            }}
                                                      >
                                                            <FloatingInput
                                                                  id="email"
                                                                  label="Email address"
                                                                  type="email"
                                                                  value={email}
                                                                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                                                                  error={errors.email}
                                                            />
                                                      </div>
                                                      <div
                                                            style={{
                                                                  opacity: mounted ? 1 : 0,
                                                                  transform: mounted ? "translateY(0)" : "translateY(12px)",
                                                                  transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
                                                            }}
                                                      >
                                                            <FloatingInput
                                                                  id="password"
                                                                  label="Password"
                                                                  type="password"
                                                                  value={password}
                                                                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                                                                  error={errors.password}
                                                            />
                                                      </div>

                                                      {/* Forgot */}
                                                      <div className="flex justify-end">
                                                            <button type="button" className="text-xs text-neutral-200 hover:text-neutral transition-colors font-mono tracking-wide">
                                                                  Forgot password?
                                                            </button>
                                                      </div>

                                                      {/* Submit */}
                                                      <button
                                                            type="submit"
                                                            disabled={loading}
                                                            className="relative w-full py-3 rounded-xl text-sm font-mono tracking-widest uppercase text-black transition-all duration-200 active:scale-[0.98] overflow-hidden"
                                                            style={{
                                                                  // background: loading
                                                                  //       ? "rgba(239,68,68,0.5)"
                                                                  //       : "linear-gradient(135deg, #0000f, #7f1d1d 50%, #0a0a0a)",
                                                                  background: loading ? "rgba(255, 211, 213, 0.85)" : "rgba(255, 211, 213, 0.75)",
                                                                  border: "1px solid rgba(255,255,255,0.08)",
                                                                  boxShadow: loading ? "none" : "0 0 30px rgba(93, 28, 106, 0.85), 0 0 60px rgba(255, 133, 187, 0.6)",
                                                                  backgroundSize: "200% 100%",
                                                            }}
                                                      >
                                                            {/* shimmer */}
                                                            {!loading && (
                                                                  <div
                                                                        className="absolute inset-0 pointer-events-none"
                                                                        style={{

                                                                              background: "rgba(255, 255, 255, 0.03)",
                                                                              animation: "shimmer 2.5s infinite",
                                                                        }}
                                                                  />
                                                            )}
                                                            {loading ? (
                                                                  <span className="flex items-center justify-center gap-2">
                                                                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                                              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                                                        </svg>
                                                                        Signing up…
                                                                  </span>
                                                            ) : (
                                                                  <span className="flex items-center justify-center gap-2">
                                                                        Sign Up
                                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                                              <path d="M5 12h14M12 5l7 7-7 7" />
                                                                        </svg>
                                                                  </span>
                                                            )}
                                                      </button>
                                                </form>
                                          ) : (
                                                /* Success state */
                                                <div className="flex flex-col items-center gap-4 py-4">
                                                      <div
                                                            className="w-14 h-14 rounded-full flex items-center justify-center"
                                                            style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)" }}
                                                      >
                                                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                                                                  <polyline points="20 6 9 17 4 12" />
                                                            </svg>
                                                      </div>
                                                      <div className="text-center">
                                                            <p className="text-sm font-bold text-white" style={{ fontFamily: "'Syne',sans-serif" }}>
                                                                  You're in!
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-1">Redirecting to dashboard…</p>
                                                      </div>
                                                </div>
                                          )}


                                    </div>

                                    {/* bottom glare */}
                                    <div
                                          className="h-px"
                                          style={{
                                                background:
                                                      "linear-gradient(90deg,transparent,rgba(168,85,247,0.3),rgba(244,63,94,0.4),transparent)",
                                          }}
                                    />
                              </div>

                              {/* reflection / shadow card */}
                              <div
                                    className="absolute -bottom-4 left-6 right-6 h-8 rounded-2xl -z-10 blur-xl opacity-30"
                                    style={{ background: "linear-gradient(135deg, #f43f5e, #a855f7)" }}
                              />
                        </div>

                  </div>
            </EnhancedAuthBackground>
      );
}