# Altezza : AI Agent for Internship and Opportunity Discovery

Hackathon — [DEV ARENA]
Welcome to the official hackathon repository by [GDG,UCE-OU].

## Team Details
- **Team Name**: TEAM GANDEEVAM
- **Team Members**:
  - Member 1: CHRIS PREETHAM
  - Member 2: JITHIN ROKKAM
  - Member 3: MEENAKSHI THUMMA

## Problem Statement
Internships, hackathons, research openings, and scholarships are scattered across a dozen platforms and notice boards. Students either find out too late, apply for things they are underqualified for, or miss opportunities entirely because no one pointed them in the right direction.

## Description
Build an AI agent that maintains a profile for each student covering skills, CGPA, year, branch, and goals, and scans opportunity platforms in the background. It filters and ranks results against the student profile and delivers a daily shortlist tailored to them. When a student opens a listing, the agent audits their resume against it and drafts a cover letter or cold email. Over time it learns what the student actually engages with and adjusts accordingly.

## Local setup

```bash
npm install
npm run dev
```

## Configure AI (for deployed chatbot)

This project calls an **OpenAI-compatible** chat API from the browser using Vite env vars.

- Copy `.env.example` to `.env.local` and fill in your values.
- In your hosting provider (Vercel/Netlify/etc.), set the same env vars.

Required:
- `VITE_AI_API_KEY`

Optional:
- `VITE_AI_BASE_URL` (default: `https://api.openai.com/v1`)
- `VITE_AI_MODEL` (default: `gpt-4o-mini`)
- `VITE_AI_MAX_TOKENS` (default: `2048`)
- `VITE_AI_TEMPERATURE` (default: `0.7`)
- `VITE_AI_TOP_P` (default: `0.95`)
- `VITE_AI_ENABLE_THINKING` (default: `false`, useful for NVIDIA)

## Submission Guidelines

- All code must be pushed to your **forked repository**
- Your repository must be **public**
- **Submission Deadline:** [17th april 3:59pm]

## 📋 Rules & Regulations

- Use of AI is permitted
- Use of open source libraries is permitted
- Plagiarism will lead to immediate disqualification
- The decision of the judges will be final

## Contact

For any queries, reach out to us at:
- **contact number** : [7981972900]

> Good luck to all participating teams!
