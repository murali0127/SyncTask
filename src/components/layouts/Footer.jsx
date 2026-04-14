import { User } from "lucide-react";

export default function Footer() {
      return (
            <footer className="border-t border-neutral-800 bg-neutral-900">
                  <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6">

                        {/* Brand */}
                        <div className="text-rose-400 font-bold text-xl">SyncTask</div>

                        {/* Copyright */}
                        <p className="text-neutral-500 text-sm">
                              © {new Date().getFullYear()} SyncTask. All rights reserved.
                        </p>

                        {/* Links */}
                        <div className="flex items-center gap-6 text-neutral-400 text-sm">
                              <a
                                    href="https://github.com/murali0127/SyncTask"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:text-white transition-colors"
                              >
                                    <i className="bi bi-github" />
                                    GitHub
                              </a>

                              <a
                                    href="https://www.linkedin.com/in/murali-dharan-s/"
                                    className="flex items-center gap-2 hover:text-white transition-colors"
                              >
                                    <i className="bi bi-linkedin" />
                                    LinkedIn
                              </a>

                              <a
                                    href="#"
                                    className="flex items-center gap-1 hover:text-white transition-colors"
                              >
                                    <User className="w-4 h-4" />
                                    Contact
                              </a>
                        </div>

                  </div>
            </footer>
      );
}