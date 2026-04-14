import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar';
import Footer from '../components/layouts/Footer'
import { CheckCircle2, Clock, User, Users, Zap, ArrowRight, ListTodo } from 'lucide-react'

const features = [
      {
            icon: <Zap className="w-6 h-6" />,
            title: "Lightning Fast",
            description: "Create, organize, and complete tasks in seconds. No clutter, no distractions."
      },
      {
            icon: <Users className="w-6 h-6" />,
            title: "Team Collaboration",
            description: "Share lists, assign tasks, and stay in sync with your team effortlessly."
      },
      {
            icon: <Clock className="w-6 h-6" />,
            title: "Smart Reminders",
            description: "Never miss a deadline with intelligent notifications and due date tracking."
      },
      {
            icon: <CheckCircle2 className="w-6 h-6" />,
            title: "Track Progress",
            description: "Visualize your productivity with beautiful analytics and progress insights."
      }
]

const steps = [
      { num: "01", title: "Create your workspace", desc: "Sign up and set up your first project in under a minute." },
      { num: "02", title: "Add your tasks", desc: "Break down your goals into actionable tasks and subtasks." },
      { num: "03", title: "Get things done", desc: "Focus on what matters and celebrate your achievements." }
]

export default function HomePage() {
      return (
            <div className="items-center min-h-screen max-w-screen bg-neutral-950">
                  <NavBar homePage={true} />

                  {/* Hero Section */}
                  <section className="flex relative overflow-hidden justify-center h-112 ">
                        {/* Background gradients */}
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-purple-500/10 pointer-events-none" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

                        <div className="max-w-7xl mx-auto px-6 sm:px-5 lg:px-7 pt-5 pb-10 md:pt-5 md:pb-2 text-center">
                              {/* Badge */}
                              <div className="inline-flex items-center gap-2 px-2 py-2 rounded-full bg-neutral-800/50 border border-neutral-700/50 text-sm text-neutral-400 mb-2">
                                    <ListTodo className="w-4 h-4 text-rose-400" />
                                    <span>Ai-Powered Task Management</span>
                              </div>

                              {/* Headline */}
                              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                                    <span className="text-white">Organize your work,</span>
                                    <br />
                                    <span className="bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
                                          amplify your focus
                                    </span>
                              </h1>

                              {/* Subheadline */}
                              <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                                    SyncTask helps you capture ideas, organize projects, and accomplish more.
                                    The simple yet powerful way to manage your tasks and boost productivity.
                              </p>

                              {/* CTA Buttons */}
                              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                                    <Link
                                          to="/dashboard"
                                          className="group inline-flex items-center gap-2 px-6 py-3 md:px-6 md:py-4 w-fit h-8 bg-gradient-to-br text-white hover:bg-pink-500/80 hover:text-black font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-rose-500/25"
                                    >
                                          Get Started
                                          <span>
                                                <i class="bi bi-arrow-right"></i>
                                          </span>

                                    </Link>
                                    <a
                                          href="#features"
                                          className="px-6 py-3 md:px-8 md:py-4 text-neutral-300 hover:text-white font-medium  hover:border-neutral-600 hover:text-neutral-700/50 transition-all"
                                    >
                                          See Features
                                    </a>
                              </div>


                        </div>
                  </section>

                  {/* Features Section */}
                  <section id="features" className="h-fit flex py-16 md:py-8 bg-neutral-900/50 justify-center">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center mb-12">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                          Everything you need to stay organized
                                    </h2>
                                    <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
                                          Powerful features designed to help you work smarter, not harder.
                                    </p>
                              </div>

                              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
                                    {features.map((feature) => (
                                          <div
                                                key={feature.title}
                                                className="group p-4 lg:p-4 rounded-2xl bg-neutral-800/30 border border-neutral-800 hover:border-rose-500/50 hover:bg-neutral-800/50 transition-all duration-300"
                                          >
                                                <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                                      {feature.icon}
                                                </div>
                                                <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                                                <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </section>

                  {/* How to Get Started */}
                  <section className="h-fit flex justify-center py-10 md:py-10">
                        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                              <div className="text-center mb-16">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                          Get started in 3 easy steps
                                    </h2>
                                    <p className="text-neutral-400 text-lg">
                                          No complicated setup. No learning curve. Just results.
                                    </p>
                              </div>

                              <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
                                    {steps.map((step, index) => (
                                          <div key={index} className="relative text-center md:text-left">
                                                {index < steps.length - 1 && (
                                                      <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-neutral-700 to-transparent" style={{ transform: 'translateX(50%)' }} />
                                                )}
                                                <div className="text-5xl md:text-6xl font-bold text-neutral-800 mb-4">{step.num}</div>
                                                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                                                <p className="text-neutral-400 leading-relaxed">{step.desc}</p>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </section>

                  {/* CTA Section */}
                  <section className="h-fit flex justify-center py-8 md:py-12 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-rose-500/10">
                        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
                              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    Ready to boost your productivity?
                              </h2>
                              <p className="mt-6 text-neutral-400 mb-10 text-lg ">
                                    Connect with friends, family, fellow members and peers and be productive together.
                              </p>
                              <Link
                                    to="/dashboard"
                                    className="inline-flex inline-flex items-center gap-2 px-10 py-3 md:px-8 md:py-4 
  text-white font-semibold rounded-xl 
  shadow-lg transition-all duration-300 
  hover:text-pink-500 hover:translate-x-2" >
                                    Start Free Today
                                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                              </Link>
                        </div>
                  </section>

                  {/* Footer */}
                  <Footer />
            </div>
      )
}