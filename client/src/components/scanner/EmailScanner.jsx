import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import RiskMeter from "../dashboard/RiskMeter";
import ThreatBreakdown from "../dashboard/ThreatBreakdown";
import LinkAnalysis from "../dashboard/LinkAnalysis";

const EmailScanner = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    subject: "",
    sender: "",
    content: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { subject, sender, content } = formData;

    if (!subject || !sender || !content) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      const res = await axios.post("/api/scan", { subject, sender, content });
      setResult(res.data.data);
      updateUser({ scanCount: (user.scanCount || 0) + 1 });
    } catch (err) {
      if (err.response?.data?.limitReached) {
        setError(
          "Daily scan limit reached. Upgrade to premium for unlimited scans."
        );
      } else {
        setError(err.response?.data?.message || "Scan failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({ subject: "", sender: "", content: "" });
    setResult(null);
    setError("");
  };

  const scansLeft =
    user?.plan === "premium" ? "∞" : Math.max(0, 3 - (user?.scanCount || 0));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">Email Scanner</h1>
          <p className="text-gray-400 text-sm mt-1">
            Paste email details below to analyze for phishing threats
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm self-start">
          <div
            className={`w-2 h-2 rounded-full ${
              user?.plan === "premium" ? "bg-green-500" : "bg-amber-400"
            }`}
          ></div>
          <span className="text-sm font-medium text-primary">
            {user?.plan === "premium" ? (
              "Unlimited scans"
            ) : (
              <>
                <span className="font-bold">{scansLeft}</span> scans left today
              </>
            )}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left — Input Form */}
        <div className="flex flex-col gap-4">
          <div className="card">
            <h2 className="font-semibold text-primary mb-4">Email Details</h2>

            {error && (
              <div
                className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
                style={{ backgroundColor: "#fee2e2", color: "#b91c1c" }}
              >
                {error}
                {error.includes("limit") && (
                  <Link
                    to="/premium"
                    className="underline ml-1 font-semibold"
                  >
                    Upgrade now
                  </Link>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-primary">
                  Email Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Urgent: Your account has been suspended"
                  className="input-field"
                />
              </div>

              {/* Sender */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-primary">
                  Sender Email
                </label>
                <input
                  type="text"
                  name="sender"
                  value={formData.sender}
                  onChange={handleChange}
                  placeholder="e.g. support@amaz0n-security.xyz"
                  className="input-field"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-primary">
                  Email Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Paste the full email content here..."
                  className="input-field resize-none"
                  rows={8}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    "Analyze Email"
                  )}
                </button>
                {(result || formData.subject) && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="btn-secondary"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Tip card */}
          {!result && !loading && (
            <div
              className="card border-l-4"
              style={{ borderLeftColor: "#0a0a0a" }}
            >
              <p className="section-label mb-2">Pro tip</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Include the full email content for the most accurate analysis.
                The more details you provide, the better the threat detection.
              </p>
            </div>
          )}
        </div>

        {/* Right — Results */}
        <div className="flex flex-col gap-4">
          {loading && (
            <div className="card flex flex-col items-center justify-center py-16 gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
              </div>
              <p className="text-sm text-gray-400 font-medium">
                Analyzing email threats...
              </p>
            </div>
          )}

          {!result && !loading && (
            <div className="card flex flex-col items-center justify-center py-16 gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#f3f4f6" }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-400">
                Results will appear here
              </p>
              <p className="text-xs text-gray-300 text-center max-w-xs">
                Fill in the email details on the left and click Analyze Email
              </p>
            </div>
          )}

          {result && !loading && (
            <>
              <RiskMeter
                score={result.riskScore}
                level={result.riskLevel}
                recommendation={result.recommendation}
              />
              <ThreatBreakdown
                threats={result.threats}
                urgencyScore={result.urgencyScore}
                domainRisk={result.domainRisk}
                grammarScore={result.grammarScore}
                patternAnalysis={result.patternAnalysis}
              />
              <LinkAnalysis
                links={result.links}
                totalLinks={result.totalLinks}
                suspiciousLinks={result.suspiciousLinks}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailScanner;