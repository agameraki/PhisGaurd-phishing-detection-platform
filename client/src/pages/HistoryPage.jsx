import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const getRiskColor = (level) => {
  if (level === "safe") return { bg: "#D1FAE5", text: "#065F46" };
  if (level === "suspicious") return { bg: "#FEF3C7", text: "#B45309" };
  return { bg: "#FEE2E2", text: "#B91C1C" };
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const HistoryPage = () => {
  const [scans, setScans] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, [page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/history?page=${page}&limit=10`);
      setScans(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError("Failed to load scan history");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/history/stats");
      setStats(res.data.data);
    } catch (err) {
      console.error("Failed to load stats");
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(id);
      await axios.delete(`/api/history/${id}`);
      setScans(scans.filter((s) => s._id !== id));
      fetchStats();
    } catch (err) {
      setError("Failed to delete scan");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="bg-secondary min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary">Scan History</h1>
            <p className="text-gray-400 text-sm mt-1">
              View and manage your previous email scans
            </p>
          </div>
          <Link to="/scan" className="btn-primary self-start">
            New Scan
          </Link>
        </div>

        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <p className="section-label mb-1">Total Scans</p>
              <p className="text-2xl font-bold text-primary">
                {stats.totalScans}
              </p>
            </div>
            <div className="card">
              <p className="section-label mb-1">Avg Risk Score</p>
              <p className="text-2xl font-bold text-primary">
                {stats.avgRiskScore}
              </p>
            </div>
            {stats.riskBreakdown?.map((item) => (
              <div key={item._id} className="card">
                <p className="section-label mb-1">{item._id}</p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: getRiskColor(item._id).text }}
                >
                  {item.count}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ backgroundColor: "#FEE2E2", color: "#B91C1C" }}
          >
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="card flex items-center justify-center py-16">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && scans.length === 0 && (
          <div className="card flex flex-col items-center justify-center py-16 gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "#F3F4F6" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-medium text-primary">No scans yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Start by scanning your first suspicious email
              </p>
            </div>
            <Link to="/scan" className="btn-primary">
              Scan an email
            </Link>
          </div>
        )}

        {/* Scan list */}
        {!loading && scans.length > 0 && (
          <div className="flex flex-col gap-3">
            {scans.map((scan) => {
              const colors = getRiskColor(scan.riskLevel);
              return (
                <div
                  key={scan._id}
                  className="card hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                          }}
                        >
                          {scan.riskLevel}
                        </span>
                        <span className="text-xs text-gray-400">
                          Score: {scan.riskScore}/100
                        </span>
                      </div>
                      <p className="font-medium text-primary truncate">
                        {scan.emailData.subject}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        From: {scan.emailData.sender}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <p className="text-xs text-gray-400">
                        {formatDate(scan.createdAt)}
                      </p>
                      <button
                        onClick={() => handleDelete(scan._id)}
                        disabled={deleting === scan._id}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        {deleting === scan._id ? (
                          <svg
                            className="animate-spin h-4 w-4 text-gray-400"
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
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#EF4444"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M9 6V4h6v2" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-400">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.pages}
                  className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;