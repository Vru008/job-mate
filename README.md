# JobMate 🚀

An **AI-powered job marketplace** that connects job seekers and recruiters in one place. Seekers browse and apply to jobs with AI assistance; recruiters post openings and manage applicants through a hiring pipeline; admins oversee the whole platform.

Built as a full-stack project: **React** frontend, **Node/Express** API, **MongoDB** database, and **Google Gemini** for the AI features.

---

## ✨ Features

### Three roles, one platform (role-based access control)
- **Job Seeker** — browse and filter jobs, apply in one click with a cover letter, track every application's status, plus AI tools.
- **Recruiter** — post and manage jobs, review applicants, and move them through the pipeline (Applied → Interview → Offer → Rejected).
- **Admin** — platform-wide stats, plus manage (edit/delete) every user and job.

### AI features (Google Gemini)
- **Resume ↔ Job match score** — paste or upload a resume (PDF) and get a 0–100 fit score with strengths, gaps, and suggested edits.
- **AI cover-letter writer** — generate a tailored cover letter when applying.
- **AI job-description generator** — recruiters get a full posting written from just a title.
- **Career chatbot** — a floating assistant for resume, interview, and visa questions.

### Engineering
- JWT authentication with bcrypt-hashed passwords
- Role-based route protection (frontend + backend) and resource ownership checks
- Auto session-expiry handling, profiles with photo upload, live landing-page stats

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React, React Router, Axios, Framer Motion |
| Backend | Node.js, Express, JWT, bcrypt |
| Database | MongoDB (Mongoose) |
| AI | Google Gemini (`@google/generative-ai`) |

---

## 🚀 Run locally

### 1. Backend
```bash
cd server
npm install
# create server/.env (see server/.env.example) with:
#   MONGO_URI=...        (MongoDB Atlas connection string)
#   GEMINI_API_KEY=...   (free key from https://aistudio.google.com/)
#   JWT_SECRET=...        (any long random string)
node seed.js     # optional: creates demo accounts + sample jobs
npm run dev      # starts on http://localhost:5000
```

### 2. Frontend
```bash
# from the project root, in a second terminal
npm install
npm start        # starts on http://localhost:3000
```

### Demo accounts (after running `node seed.js`)
| Role | Email | Password |
|------|-------|----------|
| Seeker | `seeker@jobmate.com` | `Test@1234` |
| Recruiter | `recruiter@jobmate.com` | `Test@1234` |
| Admin | `admin@jobmate.com` | `Test@1234` |

---

## ☁️ Deployment
Free hosting: MongoDB Atlas + Render (backend) + Vercel (frontend). See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions.
