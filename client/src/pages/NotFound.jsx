import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-secondary flex items-center justify-center px-4">
      <div className="text-center flex flex-col items-center gap-4">
        {/* 404 */}
        <div className="text-8xl font-bold text-gray-100">404</div>

        {/* Icon */}
        <div className="w-16 h-16 bg-white rounded-2xl shadow-card flex items-center justify-center -mt-6">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-primary">Page not found</h1>
          <p className="text-gray-400 text-sm max-w-xs">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Button */}
        <Link to="/" className="btn-primary mt-2">
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;