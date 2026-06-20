import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-secondary">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-32">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-600">
                Intelligent Phishing Detection
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-primary max-w-3xl leading-tight">
            Detect phishing emails{" "}
            <span className="relative">
              <span className="relative z-10">instantly</span>
              <span
                className="absolute bottom-1 left-0 w-full h-3 opacity-20 rounded"
                style={{ backgroundColor: "#0a0a0a" }}
              ></span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
            Paste any suspicious email and get an instant risk score, threat
            breakdown, and actionable recommendations. Stay safe online.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            <Link
              to={user ? "/scan" : "/register"}
              className="btn-primary px-8 py-3.5 text-base"
            >
              {user ? "Go to Scanner" : "Start for free"}
            </Link>
            {!user && (
              <Link
                to="/login"
                className="btn-secondary px-8 py-3.5 text-base"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Free tier note */}
          {!user && (
            <p className="text-xs text-gray-400">
              Free plan · 3 scans/day · No credit card required
            </p>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Threat Patterns", value: "50+" },
              { label: "Risk Categories", value: "5" },
              { label: "Link Checks", value: "10+" },
              { label: "Test Coverage", value: "13/15"  },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold text-primary">
                  {stat.value}
                </span>
                <span className="text-sm text-gray-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-3">
            Everything you need to stay safe
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            PhishGuard analyzes every aspect of suspicious emails to give you
            complete threat intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ),
              title: "Risk Scoring Engine",
              description:
                "Get an instant 0-100 risk score based on weighted analysis of urgency, fear tactics, domain anomalies, and more.",
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              ),
              title: "Pattern Detection",
              description:
                "Identifies urgency triggers, greed tactics, fear language, and impersonation patterns used by scammers.",
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              ),
              title: "Link Analysis",
              description:
                "Extracts and analyzes all URLs for shortened links, suspicious TLDs, IP-based URLs, and brand impersonation.",
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              ),
              title: "Threat Dashboard",
              description:
                "Visual breakdown of all detected threats by category with detailed explanations for each risk factor.",
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              ),
              title: "Scan History",
              description:
                "Track all your previous scans, compare risk trends, and revisit detailed threat reports anytime.",
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              ),
              title: "Instant Results",
              description:
                "Get complete threat analysis in seconds. No waiting, no setup, no technical knowledge required.",
            },
          ].map((feature) => (
            <div key={feature.title} className="card hover:shadow-card-hover transition-shadow">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "#f3f4f6" }}
              >
                {feature.icon}
              </div>
              <h3 className="font-semibold text-primary mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            Don't fall for phishing scams
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Join thousands of users who use PhishGuard to stay safe from email
            threats every day.
          </p>
          <Link
            to={user ? "/scan" : "/register"}
            className="inline-block px-8 py-3.5 rounded-xl font-medium text-primary bg-white hover:bg-gray-100 transition-colors"
          >
            {user ? "Scan an email" : "Get started free"}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;