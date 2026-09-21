# Licenses in Florida — Admin Console

Next.js operations console for client licensing, inspections, documents, payments, and renewals.

**Live:** https://licencesinflorida.com/admin/login

## Local development

```bash
cd admin
npm install
npm run dev
```

Open http://localhost:3000/admin/login (basePath `/admin`)

Demo login credentials are shown on the login screen. Do not commit real passwords or `.env.local`.

## What you can do

- **Customers** — add/edit/delete; manage businesses, licenses, and payments on the customer page
- **Licenses / Payments / Tasks / Documents** — full create & edit
- Mobile-friendly left navigation

## Coming next

- QuickBooks invoicing API
- Client documentation portal

## Deploy

```bash
cd admin
npx vercel --prod --yes
```

Data persists in browser localStorage (demo). Replace with a database for production multi-user use.
