# 🚀 SkillProof — Autonomous Technical Career Readiness & Verification Engine

[![React 19](https://img.shields.io/badge/React-19.0.0-blue.svg?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3.4-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-TF--IDF-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-12%20Passed-brightgreen)](file:///src/smoke.test.ts)

**SkillProof** is a modern, evidence-first technical career acceleration platform designed to eliminate credential inflation and fake resumes. Rather than relying on unverified claims, SkillProof establishes a multi-tier evidence hierarchy verified through **live machine learning parsing**, **hands-on algorithmic challenges**, **code-backed project audits**, and an **interactive Gemini Explanation Engine**.

---

## 🏛 Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Client["Client Application (React 19 + TypeScript)"]
        UI["Modern Glassmorphism UI\n(Tailwind CSS 4)"]
        Nav["Floating Nav & Gemini API Key Modal"]
        Views["Roadmaps, Gap Analysis & Interview Studio"]
    end

    subgraph Vite["Vite 8 Development Proxy (:3000)"]
        Proxy["/api Reverse Proxy"]
    end

    subgraph MLService["Python ML Microservice (FastAPI :8000)"]
        Parser["Document Extraction\n(PyMuPDF & python-docx)"]
        TFIDF["TF-IDF Vectorizer & Cosine Similarity\n(job_dataset.csv 600KB)"]
        JDAnalyzer["JD Requirement Extractor & Matcher"]
    end

    subgraph AIService["AI Explanation Engine"]
        GeminiSDK["Google Gemini 2.5 Flash API\n(@google/genai & Direct REST)"]
        SmartRubric["Deterministic Smart Rubric Fallback"]
    end

    subgraph Verification["Verification & Credential Engine"]
        RubricAudit["Multi-Layer Rubric Evaluation"]
        Badging["Cryptographic Credential Badges & QR Code"]
    end

    UI --> Proxy
    Proxy --> Parser
    Proxy --> JDAnalyzer
    Parser --> TFIDF
    UI --> GeminiSDK
    GeminiSDK -.-> SmartRubric
    UI --> RubricAudit
    RubricAudit --> Badging
```

---

## 🔍 Multi-Tier Evidence Hierarchy

Recruiters don't trust self-reported skills. SkillProof mathematically weights competency evidence across four progressive tiers:

```mermaid
flowchart LR
    Tier1["Tier 1: Claimed\nSelf-reported on resume\nEvidence Weight: 0.10"] --> Tier2["Tier 2: Tested\nAlgorithmic & quiz pass\nEvidence Weight: 0.35"]
    Tier2 --> Tier3["Tier 3: Project-Verified\nPublic git repo + trade-off audit\nEvidence Weight: 0.70"]
    Tier3 --> Tier4["Tier 4: Mentor-Verified\nPeer defense & production code review\nEvidence Weight: 1.00"]

    classDef claimed fill:#f4f4f5,stroke:#71717a,stroke-width:1px,color:#18181b;
    classDef tested fill:#eff6ff,stroke:#3b82f6,stroke-width:1.5px,color:#1e3a8a;
    classDef verified fill:#ecfdf5,stroke:#10b981,stroke-width:2px,color:#064e3b;
    classDef mentor fill:#f5f3ff,stroke:#8b5cf6,stroke-width:2px,color:#4c1d95;

    class Tier1 claimed;
    class Tier2 tested;
    class Tier3 verified;
    class Tier4 mentor;
```

---

## 🔄 End-to-End User Verification Journey

```mermaid
sequenceDiagram
    autonumber
    actor User as Candidate
    participant App as React Frontend (:3000)
    participant ML as FastAPI ML Service (:8000)
    participant Gemini as Gemini 2.5 Flash API

    User->>App: 1. Upload Resume (.pdf / .docx)
    App->>ML: POST /api/analyze-resume (Multipart Form)
    ML->>ML: Extract Text (PyMuPDF / docx)
    ML->>ML: Match TF-IDF Vectors vs job_dataset.csv
    ML-->>App: Extracted Skills & Cosine Similarity Recommendations
    App-->>User: Populated Profile & Role Match %

    User->>App: 2. Select Roadmap Task & Submit Code Solution
    App->>Gemini: POST Task Spec + Submitted Code + Architecture Notes
    Gemini-->>App: Structured Rubric Feedback (Score, Edge Cases, Fixes)
    App-->>User: Interactive Feedback Card & Unlocked Milestone

    User->>App: 3. Submit Project Defense Interview Answer
    App->>Gemini: POST Defense Question & Candidate Answer
    Gemini-->>App: Accuracy & System Reasoning Critique
    App-->>User: Verified Credential Badge (Project-Verified)
```

---

## ⚡ Key Highlights

### 1. Zero-Simulation Guarantee & Real ML Microservice
- **Zero Mock Buttons**: Replaced dummy timeouts with actual Python FastAPI backend calls.
- **Real Resume Parsing**: Native extraction of text from `.pdf` and `.docx` using **PyMuPDF** and **python-docx**.
- **TF-IDF Dataset Cosine Similarity**: Evaluates candidate resumes against a 600KB `job_dataset.csv` with 50,000 sublinear TF n-gram features.
- **Real-Time Job Description Intelligence**: Paste any job description to parse matching skills, highlight gaps, and target roadmap actions via `/api/analyze-jd`.

### 2. Multi-Role Adaptive Roadmaps
Six specialized career tracks featuring interactive code editors, progressive hint reveals, and rubric constraints:
- **Full-Stack Developer**: Advanced TypeScript generics, React concurrent filtering, PostgreSQL composite B-tree tuning, atomic inventory reservation, Redis sliding-window rate limiting.
- **Frontend Developer**: Optimistic UI updates with rollback, Core Web Vitals (CLS/LCP) image optimization, WCAG 2.1 AA accessible focus trap dialogs.
- **Backend Developer**: Idempotent payment APIs, asynchronous job queues with jittered exponential backoff and Dead Letter Queue routing.
- **AI / ML Engineer**: Cosine similarity math from scratch, Reciprocal Rank Fusion (RRF) for hybrid RAG search.
- **Data Scientist**: Two-sample proportion z-test and statistical significance testing.
- **DevOps & Cloud Engineer**: Production multi-stage Dockerfile optimization with non-root security.

### 3. Gemini Explanation Engine
- Configurable with Google Gemini 2.5 Flash via `@google/genai` or direct REST API fallback.
- Grades solutions on **Concept Mastery**, **Code Quality**, **Edge Case Resilience**, and provides tailored refactoring snippets.
- Includes a deterministic **Smart Rubric Engine** so students can learn and practice even before configuring their API key.

### 4. Recruiter Verification Portfolio & Scannable QR Badges
- Cryptographic credential IDs generated upon completing project audits.
- Recruiter-ready public portfolio featuring verifiable badge links and high-fidelity SVG QR code.

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript 5.8, Tailwind CSS 4, Lucide React, Canvas Confetti |
| **Bundler & Dev Server** | Vite 8.3 with `/api` reverse proxy |
| **ML Microservice** | Python 3.14, FastAPI, Uvicorn, Scikit-Learn, Pandas, PyMuPDF, python-docx |
| **AI Engine** | Google Gemini 2.5 Flash SDK (`@google/genai`), REST API |
| **Test Runner** | Node.js native test runner (`tsx --test`) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ (v20+ recommended)
- **Python**: v3.10+ (v3.12+ recommended)
- **Git**

---

### Step 1: Clone Repository
```bash
git clone https://github.com/snigdhaaX/ed-tech.git
cd ed-tech
```

### Step 2: Set Up Python ML Microservice
```bash
cd ml-service

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.\.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

# Install ML dependencies
pip install fastapi uvicorn pandas scikit-learn pymupdf python-docx python-multipart

# Start FastAPI server on port 8000
python -m uvicorn main:app --port 8000 --host 127.0.0.1 --reload
```

### Step 3: Set Up & Run Frontend
In a new terminal window at the project root (`ed-tech`):

```bash
# Install NPM dependencies
npm install

# Configure environment (optional: add your Gemini API key)
cp .env.example .env
# Edit .env and enter GEMINI_API_KEY="..."

# Start Vite dev server on port 3000
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 🔑 Environment Configuration

Create a `.env` file in the project root:

```env
# Google Gemini API Key (get from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY="your-gemini-api-key-here"

# Optional Vite alias
VITE_GEMINI_API_KEY="your-gemini-api-key-here"

# App URL
APP_URL="http://localhost:3000"
```

> **Note**: You can also enter or update your Gemini API Key directly inside the app UI by clicking the **Gemini Key** button in the floating navigation bar. The key is securely persisted to browser `localStorage` and never committed to version control.

---

## 🧪 Testing & Verification

Run the comprehensive unit and smoke test suite:

```bash
# Run all 12 unit and smoke tests
npm test

# Run TypeScript typecheck / linter
npm run lint

# Build production bundle
npm run build
```

### Test Suite Overview
- `src/smoke.test.ts`: Verifies initial profile, learning path population, explanation grading, and evidence tier scoring.
- `src/services/explanationEngine.test.ts`: Verifies Gemini review fallback, edge-case generation, and interview defense evaluations.
- `src/data/roadmaps.test.ts`: Asserts complete coverage across all 6 engineering career tracks.
- `src/utils/scoring.test.ts`: Mathematical validation of ordered evidence weights and role readiness math.

---

## 📡 API Reference (ML Microservice)

| Method | Endpoint | Description | Payload / Parameters |
|---|---|---|---|
| `GET` | `/api/health` | Health check & dataset validation | None |
| `POST` | `/api/analyze-resume` | Full text extraction, TF-IDF cosine similarity, role recommendations | Multipart `file` (`.pdf` or `.docx`), `top_k` |
| `POST` | `/api/analyze-jd` | Technical keyword parsing & gap matching against user skills | JSON `{ "jd_text": string, "user_skills": string[] }` |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.