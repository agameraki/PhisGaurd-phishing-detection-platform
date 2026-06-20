import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="font-bold text-primary">PhishGuard</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm text-gray-400 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/scan"
              className="text-sm text-gray-400 hover:text-primary transition-colors"
            >
              Scan
            </Link>
            <Link
              to="/premium"
              className="text-sm text-gray-400 hover:text-primary transition-colors"
            >
              Premium
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} PhishGuard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;