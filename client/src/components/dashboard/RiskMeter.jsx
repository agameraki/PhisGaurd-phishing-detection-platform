import React from 'react';

const RiskMeter = ({ score, level, recommendation }) => {
  const getLabel = () => {
    if (level === "safe") return "Safe";
    if (level === "suspicious") return "Suspicious";
    if (level === "high risk") return "High Risk";
    if (level === "likely phishing") return "Likely Phishing";
    return "Dangerous";
  };

  const getColor = () => {
    if (level === "safe") return "#10B981";
    if (level === "suspicious") return "#F59E0B";
    if (level === "high risk") return "#DC2626";
    if (level === "likely phishing") return "#991B1B";
    return "#EF4444";
  };

  const getBgColor = () => {
    if (level === "safe") return "#D1FAE5";
    if (level === "suspicious") return "#FEF3C7";
    if (level === "high risk") return "#FECACA";
    if (level === "likely phishing") return "#FEE2E2";
    return "#FEE2E2";
  };

  const getTextColor = () => {
    if (level === "safe") return "#065F46";
    if (level === "suspicious") return "#B45309";
    if (level === "high risk") return "#991B1B";
    if (level === "likely phishing") return "#B91C1C";
    return "#B91C1C";
  };

  // Calculate arc for circular meter
  const radius = 54;
  const circumference = Math.PI * radius; // half circle
  const progress = (score / 100) * circumference;
  const strokeDashoffset = circumference - progress;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-primary">Risk Score</h2>
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{ backgroundColor: getBgColor(), color: getTextColor() }}
        >
          {getLabel()}
        </span>
      </div>

      {/* Circular meter */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-36 h-20 overflow-hidden">
          <svg
            width="144"
            height="80"
            viewBox="0 0 144 80"
            className="absolute top-0 left-0"
          >
            {/* Background arc */}
            <path
              d="M 12 72 A 60 60 0 0 1 132 72"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d="M 12 72 A 60 60 0 0 1 132 72"
              fill="none"
              stroke={getColor()}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={`${strokeDashoffset}`}
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          {/* Score text */}
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
            <span
              className="text-3xl font-bold"
              style={{ color: getColor() }}
            >
              {score}
            </span>
            <span className="text-xs text-gray-400">/100</span>
          </div>
        </div>

        {/* Scale labels */}
        <div className="flex justify-between w-full text-xs text-gray-400 px-1">
          <span>0 Safe</span>
          <span>50 Suspicious</span>
          <span>100 Danger</span>
        </div>

        {/* Score bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${score}%`,
              backgroundColor: getColor(),
            }}
          />
        </div>
      </div>

      {/* Recommendation */}
      <div
        className="mt-4 p-4 rounded-xl text-sm leading-relaxed"
        style={{ backgroundColor: getBgColor(), color: getTextColor() }}
      >
        <p className="font-medium mb-1">Recommendation</p>
        <p className="opacity-80">{recommendation}</p>
      </div>
    </div>
  );
};

export default RiskMeter;