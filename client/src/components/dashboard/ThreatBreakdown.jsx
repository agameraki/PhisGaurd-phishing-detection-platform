import React from 'react';

const categoryColors = {
  Urgency: { bg: "#FEF3C7", text: "#B45309", dot: "#F59E0B" },
  "Suspicious Offer": { bg: "#FEE2E2", text: "#B91C1C", dot: "#EF4444" },
  "Fear Trigger": { bg: "#FEE2E2", text: "#B91C1C", dot: "#EF4444" },
  "Domain Risk": { bg: "#EDE9FE", text: "#5B21B6", dot: "#7C3AED" },
  "Content Quality": { bg: "#E0F2FE", text: "#0369A1", dot: "#0EA5E9" },
  "Combined Risk": { bg: "#FCE7F3", text: "#9D174D", dot: "#EC4899" },
};

const defaultColor = { bg: "#F3F4F6", text: "#374151", dot: "#6B7280" };

const ScoreBar = ({ label, score, maxScore = 40, color }) => {
  const percentage = Math.min((score / maxScore) * 100, 100);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-primary">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>
          {score}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

const ThreatBreakdown = ({
  threats,
  urgencyScore,
  domainRisk,
  grammarScore,
  patternAnalysis,
}) => {
  const hasScoreData =
    (urgencyScore || 0) + (domainRisk || 0) + (grammarScore || 0) > 0;

  if ((!threats || threats.length === 0) && !hasScoreData) {
    return (
      <div className="card">
        <h2 className="font-semibold text-primary mb-4">Threat Breakdown</h2>
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
            No threats detected
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-primary">Threat Breakdown</h2>
        <span className="text-xs font-medium text-gray-400">
          {threats.length} threat{threats.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Score bars */}
      <div className="flex flex-col gap-3 mb-5">
        <ScoreBar
          label="Urgency Score"
          score={urgencyScore || 0}
          maxScore={40}
          color="#F59E0B"
        />
        <ScoreBar
          label="Domain Risk"
          score={domainRisk || 0}
          maxScore={40}
          color="#7C3AED"
        />
        <ScoreBar
          label="Content Issues"
          score={grammarScore || 0}
          maxScore={15}
          color="#0EA5E9"
        />
      </div>

      <div className="divider" />

      {/* Threat list */}
      <div className="flex flex-col gap-2">
        <p className="section-label mb-1">Detected Threats</p>
        {threats.map((threat, index) => {
          const colors = categoryColors[threat.category] || defaultColor;
          return (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{ backgroundColor: colors.bg }}
            >
              <div
                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: colors.dot }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: colors.text }}
                  >
                    {threat.category}
                  </span>
                  <span
                    className="text-xs font-bold flex-shrink-0"
                    style={{ color: colors.text }}
                  >
                    +{threat.score}
                  </span>
                </div>
                <p
                  className="text-xs mt-0.5 leading-relaxed"
                  style={{ color: colors.text, opacity: 0.8 }}
                >
                  {threat.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pattern summary */}
      {patternAnalysis?.patternCount > 0 && (
        <>
          <div className="divider" />
          <div>
            <p className="section-label mb-2">Pattern Summary</p>
            <div className="flex flex-wrap gap-2">
              {patternAnalysis.grouped?.urgency?.length > 0 && (
                <span
                  className="px-2 py-1 rounded-lg text-xs font-medium"
                  style={{ backgroundColor: "#FEF3C7", color: "#B45309" }}
                >
                  {patternAnalysis.grouped.urgency.length} urgency pattern(s)
                </span>
              )}
              {patternAnalysis.grouped?.greed?.length > 0 && (
                <span
                  className="px-2 py-1 rounded-lg text-xs font-medium"
                  style={{ backgroundColor: "#FEE2E2", color: "#B91C1C" }}
                >
                  {patternAnalysis.grouped.greed.length} greed pattern(s)
                </span>
              )}
              {patternAnalysis.grouped?.fear?.length > 0 && (
                <span
                  className="px-2 py-1 rounded-lg text-xs font-medium"
                  style={{ backgroundColor: "#FEE2E2", color: "#B91C1C" }}
                >
                  {patternAnalysis.grouped.fear.length} fear pattern(s)
                </span>
              )}
              {patternAnalysis.grouped?.impersonation?.length > 0 && (
                <span
                  className="px-2 py-1 rounded-lg text-xs font-medium"
                  style={{ backgroundColor: "#EDE9FE", color: "#5B21B6" }}
                >
                  {patternAnalysis.grouped.impersonation.length} impersonation pattern(s)
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThreatBreakdown;