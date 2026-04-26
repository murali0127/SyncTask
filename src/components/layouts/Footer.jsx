import { User } from "lucide-react";

const ExternalLink = ({ href, children, className }) => {
      return (
            <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
            > {children}</a >
      )
}
export default function Footer() {

      return (
            <footer className="border-t border-neutral-800 bg-black-900">
                  <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6">

                        {/* Brand */}
                        <div className="text-rose-400 font-bold text-xl">SyncTask</div>

                        {/* Copyright */}
                        <p className="text-neutral-500 text-sm">
                              © {new Date().getFullYear()} SyncTask. All rights reserved.
                        </p>

                        {/* Links */}
                        <div className="flex items-center gap-6 text-neutral-200 text-sm">

                              <ExternalLink href="https://github.com/murali0127" className="flex items-center gap-2 hover:text-neutral-400 transition-colors"><i className="bi bi-github" />
                                    GitHub</ExternalLink>

                              <ExternalLink href="https://www.linkedin.com/in/murali-dharan-s/" className="flex items-center gap-1 hover:text-neutral-400 transition-colors" ><i className="bi bi-linkedin mr-1" />LinkedIn</ExternalLink>

                              <a
                                    href="#"
                                    className="flex items-center gap-1 hover:text-neutral-400 transition-colors"
                              >
                                    <User className="w-4 h-4" />
                                    Contact
                              </a>
                        </div>

                  </div>
            </footer>
      );
}