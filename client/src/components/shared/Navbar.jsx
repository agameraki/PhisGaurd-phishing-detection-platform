import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg
                width="16"
                height="16"
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
            <span className="font-bold text-primary text-lg">PhishGuard</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <Link
                  to="/scan"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/scan")
                      ? "bg-gray-100 text-primary"
                      : "text-gray-500 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  Scan
                </Link>
                <Link
                  to="/history"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/history")
                      ? "bg-gray-100 text-primary"
                      : "text-gray-500 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  History
                </Link>
                {user.plan === "free" && (
                  <Link
                    to="/premium"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors"
                  >
                    ⚡ Upgrade
                  </Link>
                )}
                {user.plan === "premium" && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black text-white">
                    Premium
                  </span>
                )}
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-100">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-medium text-primary">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-primary hover:bg-gray-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-primary hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-gray-800 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 flex flex-col gap-1">
            {user ? (
              <>
                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                  <p className="text-sm font-medium text-primary">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <Link
                  to="/scan"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Scan
                </Link>
                <Link
                  to="/history"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  History
                </Link>
                {user.plan === "free" && (
                  <Link
                    to="/premium"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50"
                  >
                    ⚡ Upgrade to Premium
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;