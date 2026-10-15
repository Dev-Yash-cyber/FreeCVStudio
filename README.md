# FreeCV Studio 📄✨
> A production-grade, FlowCV-inspired Resume Builder, Cover Letter Creator, and Career Management Platform. **100% Free Forever.** Zero subscriptions, zero paywalls, zero watermarks, and unlimited documents.

---

## 🌟 Highlights & Global Free-Feature Policy

- 🚫 **No Paywalls or Subscriptions:** Every single template, design control, export format, and tool is completely free.
- 🚫 **No Watermarks:** PDF and DOCX downloads are 100% clean and unbranded.
- ♾️ **Unlimited Resumes & Versions:** Create as many resumes and cover letters as you need with complete point-in-time version history and 1-click restore.
- ⚡ **ATS Optimization Engine:** Built-in explainable ATS scanner that scores resumes (0–100), detects action verbs, quantifies impact metrics, checks formatting, and evaluates job-description keyword match.
- 🤖 **Zero-Cost AI Writing Assistant:** Works right out of the box with an intelligent built-in rule-based NLP engine (no API key required), with optional support for OpenAI, Google Gemini, and local Ollama models.
- 🖨️ **True Multi-Format Export:**
  - **Vector PDF:** High-resolution multi-page PDF generation via Puppeteer.
  - **Editable Word (.docx):** Native DOCX output generated server-side.
  - **Clean Print:** Native CSS `@media print` optimized formatting.
- 📥 **Document Import:** Parse structured data from existing PDF and Word (.docx) resumes.
- 📋 **Job Application Tracker:** Built-in Kanban pipeline (Saved, Applied, Interviewing, Offer, Rejected) with interview notes and CSV export.
- 🧰 **Career Utilities:** STAR technique worksheet, Power Verbs dictionary, and AI interview prep question generator.
- 🔒 **Privacy-First Data Ownership:** GDPR-compliant single-click JSON data export and account deletion.

---

## 🎨 15 Original Resume Templates

FreeCV Studio includes 15 genuinely distinct, professionally engineered templates:

1. **ATS Professional** — Engineered for 100% pass rates across Taleo, Workday, Greenhouse, and Lever.
2. **Minimal Clean** — Understated elegance with generous whitespace and refined typographic balance.
3. **Modern Corporate** — Polished executive presence with balanced color accents and structured date stamps.
4. **Executive Leadership** — Commanding serif typography and board-ready layout for senior leadership.
5. **Software Developer** — Optimized for tech stacks, GitHub links, algorithmic achievements, and tech badges.
6. **Technology Professional** — Structured layout emphasizing systems architecture, cloud certifications, and infrastructure scale.
7. **Student and Fresher** — Highlights university education, academic coursework, and projects for early-career wins.
8. **Graduate Scholar** — Refined transitional layout tailored for Masters, PhDs, and specialized postgraduate researchers.
9. **Academic and Research** — Multi-page layout for grant histories, peer-reviewed publications, and conference talks.
10. **Creative Professional** — Visual sidebar layout with modern accent styling for design and marketing roles.
11. **Compact One-Page** — Dense grid system engineered to fit comprehensive experience onto exactly one sheet.
12. **Two-Column Professional** — Balanced split with experience in the main column and skills/credentials in the sidebar.
13. **Traditional Business** — Time-tested classic layout suited for law, accounting, government, and banking.
14. **International Professional** — Accommodates multi-lingual proficiencies, international addresses, and phone formats.
15. **Elegant Contemporary** — Editorial-grade typography with soft neutral accents for architecture and premium brands.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Zustand, React Hook Form, Zod, Canvas Confetti.
- **Backend:** Node.js, Express (ESM), TypeScript, Mongoose, Puppeteer, `docx`, `pdf-parse`, `mammoth`.
- **Database:** MongoDB Atlas / Local MongoDB.
- **Architecture:** Decoupled RESTful API with proxy integration.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB connection (pre-configured with MongoDB Atlas)

### Quick Start

1. **Install dependencies:**
   ```bash
   # In server/
   cd server && npm install

   # In client/
   cd ../client && npm install
   ```

2. **Start Backend Server:**
   ```bash
   npm --prefix server run dev
   # Server runs on http://localhost:5000
   ```

3. **Start Frontend Development Server:**
   ```bash
   npm --prefix client run dev
   # Client runs on http://localhost:5173
   ```

4. **Access the App:**
   - Open [http://localhost:5173](http://localhost:5173) in your browser.
   - Click **"Explore Demo"** or **"Demo Mode"** on the login page for instant 1-click access with seeded demo data.

---

## 📁 Repository Structure

```text
FreeCV Studio/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── editor/         # Form editors, design drawers, ATS modal, version history
│   │   │   ├── layout/         # Navbar, footer, protected routes
│   │   │   ├── templates/      # 15 distinct resume template components
│   │   │   └── ui/             # Reusable UI widgets
│   │   ├── pages/              # 18 full application pages
│   │   ├── services/           # API fetch client
│   │   ├── store/              # Zustand auth and resume state management
│   │   └── types/              # TypeScript interface definitions
│   └── vite.config.ts          # Vite config with API proxy
│
└── server/                     # Backend API & Services
    ├── src/
    │   ├── config/             # Database connection & env config
    │   ├── controllers/        # Route controllers
    │   ├── middleware/         # Auth, validation, rate limiting
    │   ├── models/             # Mongoose schemas (User, Resume, Version, etc.)
    │   ├── routes/             # REST API routes
    │   └── services/           # PDF, DOCX, ATS, AI, and parser services
    └── package.json
```

---

## 🔒 Security & Privacy

- Passwords hashed with `bcryptjs`.
- JWT access token authentication.
- API rate limiting on authentication and sensitive endpoints.
- Isolated user workspaces — users only access their own documents.
- 100% GDPR compliant: single-click full account export and permanent deletion.
