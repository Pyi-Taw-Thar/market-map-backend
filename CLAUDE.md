# Backend — CLAUDE.md

## Setup & Tech Stack

- **Runtime:** Node.js (ESM, `"type": "module"`)
- **Framework:** Express `^4.18`
- **Database:** MongoDB via Mongoose `^8.0` (URI from `MONGODB_URI`)
- **Deployment:** Vercel serverless — entry point `api/index.js` re-exports the Express `app`
  from `server.js`; routes in `vercel.json`.
- **Scripts:** `npm run dev` (nodemon), `npm start` (node)

## Backend File Structure

```
backend/
├── api/index.js           # Vercel serverless entry (exports app)
├── config/db.js           # connectDB() — Mongo connection
├── models/Shop.js         # Shop Mongoose schema
├── routes/shopRoutes.js   # Express router for /api/shops
├── server.js              # Express app, CORS, mounts router
└── vercel.json
```

## Rules & Patterns

1. **Models** — Define Mongoose schemas in `models/`. Use validation messages, `trim` on
   string fields, `timestamps: true`. Keep required-field rules at the schema level.
2. **Routes** — Group endpoints by resource in `routes/`. Each handler is `async`, wrapped in
   try/catch. Use proper HTTP status codes (`201` on create, `400` on validation, `500` on
   server error).
3. **Serverless-ready** — Keep `app.listen()` gated behind `if (!process.env.VERCEL)`, and
   always `export default app` so Vercel can mount it.
4. **CORS** — Only allow configured origins (`CORS_ORIGIN`, Vercel URL, localhost:5173).
5. **Environment** — Use `dotenv` + `.env.example`; never commit real credentials.
6. **Dates** — Birthday logic (e.g., `upcoming-birthdays`) computes in the route; keep
   timezone handling consistent (use local dates, set to start-of-day before comparing).

## Strict Workflow Rules (အတိအကျ လိုက်နာရမည်)

1. **Language Requirement (ဘာသာစကား):** All responses, status updates, and implementation
   plans **MUST be written in Myanmar Language (မြန်မာဘာသာ)**.

2. **Plan First Principle (ဦးစွာ စီမံချက်ဆွဲခြင်း):** Whenever asked to make a change, add a
   feature, or fix a bug, **NEVER write or modify code directly.** Draft a detailed
   Implementation Plan in Myanmar Language first.

3. **Auto-Save Plan Files (Plan ဖိုင်များ အလိုအလျောက် သိမ်းဆည်းခြင်း):** Auto-save every plan
   into `backend/plans/` as `YYYY-MM-DD-short-description-plan.md`
   (e.g., `2026-07-27-add-product-api-plan.md`).

4. **Wait for Explicit Approval (ခွင့်ပြုချက် စောင့်ဆိုင်းခြင်း):** Show the plan in Myanmar
   Language. **DO NOT touch any code or execute any file-modification commands** until the
   user explicitly says **"OK"**, **"Go ahead"**, or grants permission.
