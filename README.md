# 💼 AI-Powered Job Board (Next.js + Clerk + Inngest)

<img width="1344" height="768" alt="Generated Image October 07, 2025 - 3_57PM" src="https://github.com/user-attachments/assets/0837df1a-784f-410a-b80d-ae7e55a9bc69" />

> A modern, AI-enhanced job board web application built with Next.js, featuring authentication, payments, AI-powered resume analysis, and organization permissions.

---

## 📖 Overview

This is a **personal project** where I built a fully functional **AI-powered Job Board**.  
Employers can post jobs, manage applicants, and leverage AI features to rank and summarize resumes.  
Job seekers can apply for listings, upload resumes, and explore personalized insights powered by AI.

The project demonstrates advanced Next.js features and integrations:
- Authentication and user management with **Clerk**  
- Background jobs and automation with **Inngest**  
- AI resume summaries and applicant ranking  
- Organization-level permissions and role management  
- Payments integration for job listings  
- Server-side rendering, caching, and SEO optimization  

---

## ⚙️ Tech Stack

| Category | Tools |
|-----------|--------|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS |
| **Authentication** | Clerk |
| **Background Jobs** | Inngest |
| **Database** | PostgreSQL + Prisma |
| **AI Features** | OpenAI GPT-4 (Resume Summary, Ranking, Search) |
| **Payments** | Stripe |
| **Deployment** | Vercel |

---

## 🧩 Key Features

✅ Employer & Applicant dashboards  
✅ Authentication & Role-based Permissions  
✅ AI-generated resume summaries  
✅ AI applicant ranking  
✅ Semantic AI-powered job search  
✅ Automated email notifications  
✅ Billing system for employers  
✅ Clean and responsive UI with Tailwind CSS  

---

## 🗂️ Project Structure

```bash
src/
 ├── app/              # Next.js App Router
 ├── components/       # UI Components
 ├── hooks/            # Custom React Hooks
 ├── lib/              # Utilities and helpers
 ├── actions/          # API & server-side logic
 ├── inngest/          # Background job definitions
 └── prisma/           # Database schema
```

🚀 Getting Started

1️⃣ Clone the Repository

```bash
git clone https://github.com/Rites23/your-job-board.git
cd your-job-board
```

2️⃣ Install Dependencies

```bash
npm install
```

3️⃣ Setup Environment Variables

Create a .env file with the following keys:

```bash
DATABASE_URL="your_database_connection"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_key"
CLERK_SECRET_KEY="your_clerk_secret"
INNGEST_EVENT_KEY="your_inngest_key"
OPENAI_API_KEY="your_openai_key"
STRIPE_SECRET_KEY="your_stripe_key"
```

4️⃣ Run the App

```bash
npm run dev
```

Open http://localhost:5173 to view the app.

🧠 AI Features

- Resume Summarization – Automatically generates concise, insightful CV summaries using GPT-4.

- Applicant Ranking – Intelligently scores candidates based on job relevance and skill alignment.

- AI-Powered Search – Uses semantic understanding to match users with the most suitable job listings.

👨‍💻 Developer

Ritesh Balu

💼 MERN Stack Web Developer

🚀 Passionate about building scalable, elegant, and client-focused digital products that deliver real impact.

🪪 License

This is a personal project created for learning, experimentation, and portfolio development.
All technologies — including AI (OpenAI GPT-4), Clerk, Inngest, and Next.js — are used in accordance with their respective licenses.
