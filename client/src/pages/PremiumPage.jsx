import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const PremiumPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const handleCardChange = (e) => {
    let { name, value } = e.target;

    if (name === "cardNumber") {
      value = value.replace(/\D/g, "").slice(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    }
    if (name === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 3);
    }

    setCardData({ ...cardData, [name]: value });
    setError("");
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setError("");
    setSuccess(false);
  };

  const handleCloseModal = () => {
    if (loading) return;
    setShowModal(false);
    setCardData({ cardNumber: "", expiry: "", cvv: "", name: "" });
    setError("");
  };

  const handlePay = async (e) => {
    e.preventDefault();

    if (!cardData.cardNumber || !cardData.expiry || !cardData.cvv || !cardData.name) {
      setError("Please fill in all card details");
      return;
    }

    if (cardData.cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Please enter a valid 16-digit card number");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1800));

      // Call backend to upgrade user
      const res = await axios.post("/api/payment/upgrade");

      if (res.data.success) {
        setSuccess(true);
        updateUser({ plan: "premium" });

        setTimeout(() => {
          navigate("/scan");
        }, 1800);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  // Already premium
  if (user?.plan === "premium") {
    return (
      <div className="bg-secondary min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#D1FAE5" }}
          >
            <svg
              width="24"
              height="24"
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
          <h2 className="text-xl font-bold text-primary mb-2">
            You're already Premium!
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            You have access to all premium features including unlimited scans
            and advanced threat analysis.
          </p>
          <button
            onClick={() => navigate("/scan")}
            className="btn-primary w-full"
          >
            Go to Scanner
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ backgroundColor: "#FEF3C7", color: "#B45309" }}
          >
            ⚡ Upgrade to Premium
          </span>
          <h1 className="text-3xl font-bold text-primary mb-3">
            Unlock the full power of PhishGuard
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Get unlimited scans, advanced threat analysis, and complete scan
            history. One-time payment, lifetime access.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Free plan */}
          <div className="card border-2 border-gray-100">
            <div className="mb-4">
              <p className="font-semibold text-primary text-lg">Free</p>
              <p className="text-3xl font-bold text-primary mt-1">
                ₹0
                <span className="text-sm font-normal text-gray-400">
                  /forever
                </span>
              </p>
            </div>
            <div className="divider" />
            <ul className="flex flex-col gap-3">
              {[
                { text: "3 scans per day", included: true },
                { text: "Basic risk score", included: true },
                { text: "Pattern detection", included: true },
                { text: "Unlimited scans", included: false },
                { text: "Advanced threat breakdown", included: false },
                { text: "Full scan history", included: false },
                { text: "Link analysis", included: false },
                { text: "Priority support", included: false },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: item.included ? "#D1FAE5" : "#F3F4F6",
                    }}
                  >
                    {item.included ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-sm"
                    style={{ color: item.included ? "#374151" : "#9CA3AF" }}
                  >
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <button disabled className="btn-secondary w-full opacity-60 cursor-not-allowed">
                Current Plan
              </button>
            </div>
          </div>

          {/* Premium plan */}
          <div className="card border-2 border-primary relative">
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: "#0A0A0A" }}
            >
              Most Popular
            </div>
            <div className="mb-4">
              <p className="font-semibold text-primary text-lg">Premium</p>
              <p className="text-3xl font-bold text-primary mt-1">
                ₹499
                <span className="text-sm font-normal text-gray-400">
                  /one-time
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Lifetime access — no renewals
              </p>
            </div>
            <div className="divider" />
            <ul className="flex flex-col gap-3">
              {[
                { text: "Unlimited scans", included: true },
                { text: "Advanced risk scoring", included: true },
                { text: "Full pattern detection", included: true },
                { text: "Complete link analysis", included: true },
                { text: "Full scan history", included: true },
                { text: "Threat breakdown dashboard", included: true },
                { text: "Domain reputation checks", included: true },
                { text: "Priority support", included: true },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#D1FAE5" }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">{item.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <button onClick={handleOpenModal} className="btn-primary w-full">
                Upgrade Now — ₹499
              </button>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure payment
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Instant activation
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            One-time payment
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {success ? (
              <div className="flex flex-col items-center text-center py-6 gap-3">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#D1FAE5" }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-bold text-primary text-lg">Payment Successful!</h3>
                <p className="text-sm text-gray-400">
                  Welcome to PhishGuard Premium. Redirecting...
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                    </div>
                    <span className="font-semibold text-primary">Card Payment</span>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-1.5 rounded-lg hover:bg-gray-100"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Amount */}
                <div
                  className="rounded-xl p-4 mb-5 text-center"
                  style={{ backgroundColor: "#F8F9FA" }}
                >
                  <p className="text-xs text-gray-400">Amount to pay</p>
                  <p className="text-2xl font-bold text-primary">₹499</p>
                </div>

                {error && (
                  <div
                    className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
                    style={{ backgroundColor: "#FEE2E2", color: "#B91C1C" }}
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handlePay} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={cardData.name}
                      onChange={handleCardChange}
                      placeholder="John Doe"
                      className="input-field"
                      disabled={loading}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardChange}
                      placeholder="1234 5678 9012 3456"
                      className="input-field"
                      disabled={loading}
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-xs font-medium text-gray-500">
                        Expiry
                      </label>
                      <input
                        type="text"
                        name="expiry"
                        value={cardData.expiry}
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                        className="input-field"
                        disabled={loading}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-xs font-medium text-gray-500">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleCardChange}
                        placeholder="123"
                        className="input-field"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full mt-2"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Processing payment...
                      </span>
                    ) : (
                      "Pay ₹499"
                    )}
                  </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-4">
                  🔒 This is a demo payment. No real card details are stored.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumPage;