import React from 'react';

const LinkAnalysis = ({ links, totalLinks, suspiciousLinks }) => {
  if (!links || links.length === 0) {
    return (
      <div className="card">
        <h2 className="font-semibold text-primary mb-4">Link Analysis</h2>
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#D1FAE5" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">
            No links found in email
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-primary">Link Analysis</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">
            {totalLinks} link{totalLinks !== 1 ? "s" : ""} found
          </span>
          {suspiciousLinks > 0 && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "#FEE2E2", color: "#B91C1C" }}
            >
              {suspiciousLinks} suspicious
            </span>
          )}
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div
          className="p-3 rounded-xl text-center"
          style={{ backgroundColor: "#F3F4F6" }}
        >
          <p className="text-2xl font-bold text-primary">{totalLinks}</p>
          <p className="text-xs text-gray-400 mt-0.5">Total Links</p>
        </div>
        <div
          className="p-3 rounded-xl text-center"
          style={{
            backgroundColor: suspiciousLinks > 0 ? "#FEE2E2" : "#D1FAE5",
          }}
        >
          <p
            className="text-2xl font-bold"
            style={{ color: suspiciousLinks > 0 ? "#B91C1C" : "#065F46" }}
          >
            {suspiciousLinks}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: suspiciousLinks > 0 ? "#B91C1C" : "#065F46" }}
          >
            Suspicious
          </p>
        </div>
      </div>

      <div className="divider" />

      {/* Link list */}
      <div className="flex flex-col gap-2">
        <p className="section-label mb-1">Extracted Links</p>
        {links.map((link, index) => (
          <div
            key={index}
            className="p-3 rounded-xl border"
            style={{
              borderColor: link.isSuspicious ? "#FCA5A5" : "#E5E7EB",
              backgroundColor: link.isSuspicious ? "#FFF5F5" : "#FAFAFA",
            }}
          >
            {/* URL */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <p
                className="text-xs font-mono break-all leading-relaxed"
                style={{ color: link.isSuspicious ? "#B91C1C" : "#374151" }}
              >
                {link.url}
              </p>
              {link.isSuspicious ? (
                <span
                  className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: "#FEE2E2", color: "#B91C1C" }}
                >
                  Risk
                </span>
              ) : (
                <span
                  className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}
                >
                  OK
                </span>
              )}
            </div>

            {/* Reasons */}
            {link.reasons && link.reasons.length > 0 && (
              <div className="flex flex-col gap-1 mt-2">
                {link.reasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: "#EF4444" }}
                    />
                    <p className="text-xs" style={{ color: "#B91C1C" }}>
                      {reason}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkAnalysis;