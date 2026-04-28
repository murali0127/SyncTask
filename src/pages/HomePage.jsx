import { Link, useLocation, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar';
import Footer from '../components/layouts/Footer'
import { motion } from 'motion/react';
import { CheckCircle2, Clock, Users, Zap, ArrowRight, ListTodo } from 'lucide-react'
import { useEffect, useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const features = [
      { icon: <Zap className="w-5 h-5" />, title: "Lightning Fast", description: "Create, organize, and complete tasks in seconds. No clutter, no distractions." },
      { icon: <Users className="w-5 h-5" />, title: "Team Collaboration", description: "Share lists, assign tasks, and stay in sync with your team effortlessly." },
      { icon: <Clock className="w-5 h-5" />, title: "Smart Reminders", description: "Never miss a deadline with intelligent notifications and due date tracking." },
      { icon: <CheckCircle2 className="w-5 h-5" />, title: "Track Progress", description: "Visualize productivity with beautiful analytics and progress insights." }
]

const steps = [
      { num: "01", title: "Create your workspace", desc: "Sign up and set up your first project in under a minute." },
      { num: "02", title: "Add your tasks", desc: "Break down your goals into actionable tasks and subtasks." },
      { num: "03", title: "Get things done", desc: "Focus on what matters and celebrate your achievements." }
]

const containerVariants = {
      hidden: {},
      show: { transition: { staggerChildren: 0.1 } }
}

const fadeUp = {
      hidden: { opacity: 0, y: 24 },
      show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}

export default function HomePage() {
      const navigate = useNavigate();
      const location = useLocation();


      const isLoggedOut = useRef(false);

      useEffect(() => {
            if (location?.state?.loggedOut && !isLoggedOut.current) {
                  toast.success('Logged out successfully.', { icon: '👏' })
            }
            isLoggedOut.current = true;
      }, [])

      return (
            <div className="min-h-screen max-w-screen bg-[#141111] text-neutral-200">
                  <Toaster
                        position="top-center"
                        toastOptions={{
                              duration: 2000,
                              style: { background: '#1a1a1e', color: '#e8e8e8', border: '0.5px solid rgba(255,255,255,0.1)' }
                        }}
                  />
                  <NavBar homePage={true} />

                  {/* ── Hero ── */}
                  <section className="relative flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center overflow-hidden">
                        {/* Subtle radial glow behind headline */}
                        <div className="pointer-events-none absolute inset-0">
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[510px] rounded-full bg-rose-500/[0.07] blur-3xl" />
                              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full bg-purple-500/[0.06] blur-2xl" />
                        </div>

                        <motion.div
                              variants={containerVariants}
                              initial="hidden"
                              animate="show"
                              className="relative z-10 max-w-3xl"
                        >
                              {/* Badge */}
                              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-neutral-500 mb-7">
                                    <ListTodo className="w-3.5 h-3.5 text-rose-400" />
                                    AI-Powered Task Management
                              </motion.div>

                              {/* Headline — use a display weight, italic accent */}
                              <motion.h1
                                    variants={fadeUp}
                                    className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-5 leading-[1.12]"
                                    style={{ fontFamily: "'Fraunces', serif" }}   // swap for any display font in your project
                              >
                                    <span className="text-white">Organize your work,</span><br />
                                    <span className="bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent italic">
                                          amplify your focus
                                    </span>
                              </motion.h1>

                              <motion.p variants={fadeUp} className="text-base md:text-lg text-neutral-500 max-w-xl mx-auto mb-10 leading-relaxed">
                                    SyncTask helps you capture ideas, organize projects, and accomplish more —
                                    the modern way to stay on top of your work.
                              </motion.p>

                              {/* CTAs */}
                              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <Link
                                          to="/dashboard"
                                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white text-sm font-semibold shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 hover:from-rose-400 hover:to-rose-500 transition-all duration-200"
                                    >
                                          Get Started Free
                                          <ArrowRight className="w-4 h-4" />
                                    </Link>

                                    <a
                                          href="#features"
                                          className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm text-neutral-400 border border-white/[0.08] hover:border-white/[0.15] hover:text-neutral-200 transition-all duration-200"
                                    >
                                          See Features
                                    </a>
                              </motion.div>
                        </motion.div>
                  </section>

                  {/* Thin separator */}
                  <div className="mx-8 bg-white/[0.05]" />

                  {/* ── Features ── */}
                  <section id="features" className="py-20 px-6">
                        <div className="max-w-5xl mx-auto">
                              <motion.div
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }} viewport={{ once: true }}
                                    className="mb-12"
                              >
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400 mb-3">Features</p>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-snug">
                                          Everything you need<br className="hidden md:block" /> to stay organized
                                    </h2>
                                    <p className="text-neutral-500 text-base max-w-lg">
                                          Powerful features designed to help you work smarter, not harder.
                                    </p>
                              </motion.div>

                              <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true }}
                                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
                              >
                                    {features.map((f) => (
                                          <motion.div
                                                key={f.title}
                                                variants={fadeUp}
                                                className="group p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-rose-500/30 hover:bg-white/[0.04] transition-all duration-300 cursor-default"
                                          >
                                                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                                      {f.icon}
                                                </div>
                                                <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
                                                <p className="text-neutral-500 text-xs leading-relaxed">{f.description}</p>
                                          </motion.div>
                                    ))}
                              </motion.div>
                        </div>
                  </section>

                  <div className="mx-8 h-px bg-white/[0.05]" />

                  {/* ── How it works ── */}
                  <section className="py-20 px-6">
                        <div className="max-w-5xl mx-auto">
                              <motion.div
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }} viewport={{ once: true }}
                                    className="mb-12"
                              >
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400 mb-3">How it works</p>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-snug">
                                          Get started in 3 easy steps
                                    </h2>
                                    <p className="text-neutral-500 text-base">No complicated setup. No learning curve. Just results.</p>
                              </motion.div>

                              <div className="flex flex-col divide-y divide-white/[0.05]">
                                    {steps.map((step, i) => (
                                          <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -16 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                                viewport={{ once: true }}
                                                className="flex items-start gap-6 py-6"
                                          >
                                                <span
                                                      className="text-5xl font-bold text-white/[0.3] leading-none select-none shrink-0"
                                                      style={{ fontFamily: "'Fraunces', serif" }}
                                                >
                                                      {step.num}
                                                </span>
                                                <div className="pt-1">
                                                      <h3 className="text-base font-semibold text-white mb-1.5">{step.title}</h3>
                                                      <p className="text-sm text-neutral-500 leading-relaxed">{step.desc}</p>
                                                </div>
                                          </motion.div>
                                    ))}
                              </div>
                        </div>
                  </section>

                  {/* ── CTA Band ── */}
                  <section className="px-6 pb-20">
                        <div className="max-w-5xl mx-auto">
                              <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                    className="relative overflow-hidden rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-500/[0.08] via-purple-500/[0.06] to-transparent px-8 py-12 text-center"
                              >
                                    {/* Soft glow inside card */}
                                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                          <div className="w-64 h-32 rounded-full bg-rose-500/[0.12] blur-2xl" />
                                    </div>
                                    <div className="relative z-10">
                                          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-snug">
                                                Ready to boost your productivity?
                                          </h2>
                                          <p className="text-neutral-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                                                Connect with friends, family, and peers — be productive together.
                                          </p>
                                          <Link
                                                to="/dashboard"
                                                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white text-sm font-semibold shadow-lg shadow-rose-500/20 hover:shadow-rose-500/35 hover:from-rose-400 hover:to-rose-500 transition-all duration-200"
                                          >
                                                Start Free Today
                                                <ArrowRight className="w-4 h-4" />
                                          </Link>
                                    </div>
                              </motion.div>
                        </div>
                  </section>

                  <Footer />
            </div >
      )
}