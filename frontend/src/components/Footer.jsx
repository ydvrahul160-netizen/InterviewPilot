
import { BsRobot } from "react-icons/bs";
import { FiArrowUpRight, FiGithub, FiLinkedin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-12 pb-6">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 pb-10 border-b border-slate-200">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-black text-white">
                <BsRobot size={17} />
              </div>

              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                InterviewPilot<span className="text-blue-600">.AI</span>
              </h2>
            </div>

            <p className="text-sm leading-6 text-slate-500">
              AI-powered interview preparation platform designed to help you
              practice smarter, improve your answers, and build professional
              confidence.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:text-black hover:border-slate-300 transition"
                aria-label="GitHub"
              >
                <FiGithub size={17} />
              </a>

              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 transition"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={17} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-16">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Product
              </h3>

              <div className="flex flex-col gap-3">
                <a
                  href="#features"
                  className="text-sm text-slate-500 hover:text-slate-900 transition"
                >
                  Features
                </a>

                <a
                  href="#pricing"
                  className="text-sm text-slate-500 hover:text-slate-900 transition"
                >
                  Pricing
                </a>

                <a
                  href="#interview"
                  className="text-sm text-slate-500 hover:text-slate-900 transition"
                >
                  AI Interview
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Resources
              </h3>

              <div className="flex flex-col gap-3">
                <a
                  href="#how-it-works"
                  className="text-sm text-slate-500 hover:text-slate-900 transition"
                >
                  How It Works
                </a>

                <a
                  href="#practice"
                  className="text-sm text-slate-500 hover:text-slate-900 transition"
                >
                  Practice
                </a>

                <a
                  href="#history"
                  className="text-sm text-slate-500 hover:text-slate-900 transition"
                >
                  Interview History
                </a>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Get Started
              </h3>

              <div className="flex flex-col gap-3">
                <a
                  href="/login"
                  className="text-sm text-slate-500 hover:text-slate-900 transition"
                >
                  Sign In
                </a>

                <a
                  href="/signup"
                  className="text-sm text-slate-500 hover:text-slate-900 transition"
                >
                  Create Account
                </a>

                <a
                  href="#start"
                  className="inline-flex items-center gap-1 text-sm font-medium text-slate-900 hover:text-blue-600 transition"
                >
                  Start Interview
                  <FiArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} InterviewPilot.AI. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <a
              href="#privacy"
              className="hover:text-slate-700 transition"
            >
              Privacy
            </a>

            <a
              href="#terms"
              className="hover:text-slate-700 transition"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

