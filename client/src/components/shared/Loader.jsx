const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
        </div>
        {/* Text */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-semibold text-primary">PhishGuard</p>
          <p className="text-xs text-gray-400">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;