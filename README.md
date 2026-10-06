# 🛡️ PhishGuard — Intelligent Email Threat Detection Platform

PhishGuard is an intelligent phishing and scam detection platform that analyzes emails in real time and assigns them a calculated risk score, helping users identify malicious or suspicious emails before they fall victim to fraud.

---

## 📌 Problem Statement

- 🎯 Phishing is one of the most common and damaging cyber threats today
- 🔓 Deceptive emails trick users into revealing sensitive information such as passwords, OTPs, PINs, and banking details
- 🧐 Most users lack the technical knowledge to spot subtle red flags like spoofed sender domains, urgency-based manipulation, suspicious links, or requests for sensitive data
- ❌ Traditional spam filters often give a binary verdict without explaining *why* an email is dangerous
- 🔍 There is a need for a simple, transparent tool that evaluates emails and clearly communicates the level of risk involved

---

## 💡 Solution

- ⚙️ A rule-based, centralized scoring engine that evaluates the subject, sender, content, and links of an email across multiple threat dimensions
- 🧩 Breaks down *why* an email is risky instead of giving a black-box verdict
- 📊 Scores urgency language, domain legitimacy, suspicious content patterns, sensitive data requests, and sender trustworthiness
- ➕ Combines individual scores into a single, capped risk score with a clear recommendation (e.g., safe, suspicious, or likely phishing)
- 🌐 Built as a full-stack web application with secure user authentication and scan history tracking
- 💎 Offers a tiered access model — a free/simple usage plan and a premium plan with expanded capabilities

---

## ✨ Features

- **Multi-factor Risk Scoring** — Evaluates urgency cues, domain risk, content red flags, sensitive-data requests, and sender reputation
- **Risk Level Classification** — Categorizes emails (e.g., safe, suspicious, likely phishing) with a numeric score out of 100
- **Actionable Recommendations** — Clear guidance such as warnings to avoid clicking links or to delete the email
- **Sensitive Data Detection** — Flags requests for passwords, OTPs, PINs, card details, and bank account information
- **Suspicious Link & IP Detection** — Identifies raw IP-based links and other suspicious URL patterns
- **Scan History** — Stores and retrieves a user's past email scans
- **Secure Authentication** — JWT-based login/signup with password hashing
- **Rate Limiting** — Protects the API from abuse with request throttling
- **Simple & Premium Tiers** — Free/simple tier for basic scanning, with a premium tier (unlocked via an in-built payment system) offering enhanced features
- **In-built Payment System** — Custom-built payment/subscription handling for premium upgrades (no third-party payment gateway dependency)
- **Audit & Test Scripts** — Dedicated scripts to validate and audit the scoring engine's accuracy

---

## 🔄 Workflow of the Project

1. 🔐 **User Authentication** — User signs up or logs in; a JWT token is issued and used to authorize subsequent requests
2. 📨 **Email Submission** — User pastes or submits email details (subject, sender, content, links) through the client interface
3. 🧮 **Risk Analysis** — The backend's scoring engine analyzes the email across five categories:
   - ⏰ Urgency Score
   - 🌐 Domain Risk
   - 📝 Content Issues
   - 🔓 Sensitive Data Risk
   - 👤 Sender Risk
4. ➕ **Score Aggregation** — Individual scores are summed and capped to produce a final Risk Score (0–100)
5. 🏷️ **Risk Classification** — Based on the score, the email is labeled (e.g., safe, suspicious, likely phishing) along with a human-readable recommendation
6. 📊 **Result Display** — The frontend (React + Recharts) visualizes the risk score and breakdown for the user
7. 🗂️ **History Logging** — The scan and its result are stored against the user's account for future reference
8. 💎 **Tier Check** — Simple-tier users get core scanning; premium-tier users (upgraded via the in-built payment flow) get access to extended features

---

## 🛠️ Tech Stack

**🎨 Frontend**
- React 19
- Vite
- React Router DOM
- Zustand (state management)
- Recharts (data visualization)
- Tailwind CSS
- Axios

**🖥️ Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken) for authentication
- bcryptjs for password hashing
- express-rate-limit for API throttling
- dotenv for environment configuration
- In-built/custom payment module (no external payment gateway)

---

## ⚙️ Techniques Used

- ⚖️ **Rule-Based Risk Scoring** — Weighted, additive scoring logic across multiple threat indicators rather than a single binary classifier
- 🔎 **Pattern Matching** — Keyword and pattern detection for urgency language, sensitive-data requests, and suspicious links/IPs
- 🌐 **Domain Reputation Heuristics** — Evaluating sender domains against known risk indicators
- 📏 **Score Capping & Normalization** — Ensuring final scores remain within a consistent 0–100 scale
- 🔑 **Role/Tier-Based Access Control** — Differentiating feature access between simple and premium users
- 🔐 **Token-Based Authentication** — Stateless session handling via JWT
- ✅ **Automated Auditing** — Custom test and audit scripts (`quickTest.js`, `runScoringAudit.js`) to continuously validate scoring accuracy

---

## 🔗 Links Section

- 📦 **Repository:** https://github.com/agameraki/PhisGaurd-phishing-detection-platform
- 🚀 **Live Demo:** https://phis-gaurd-phishing-detection-platf.vercel.app

---

## 🚀 Future Enhancements

- 🤖 Integrate machine learning–based classification alongside the rule-based engine for improved accuracy
- 🧩 Add browser extension support for real-time inbox scanning
- 📥 Support email file uploads (.eml) and direct mailbox integration (Gmail/Outlook API)
- 📦 Expand premium tier with bulk scanning and team/organization dashboards
- 📈 Add detailed analytics and trend reports on phishing attempts over time
- 🌍 Multi-language support for email content analysis
- 🛠️ Admin dashboard for monitoring platform-wide threat statistics
- 🔔 Webhook/notification alerts for high-risk scan results
- 📱 Mobile application support

---

*PhishGuard — helping users spot deception before it costs them.*
