# BlueTrail Journeys | Dashboard specification

## Brand
Blue Travel Agency India operations product line: BlueTrail Journeys. Typography: Arial / system sans. Colors: {"navy": "#102C45", "blue": "#247BA0", "teal": "#18A999", "sky": "#EDF7FB", "ink": "#203647", "muted": "#64788A", "white": "#FFFFFF", "border": "#D8E7ED", "gold": "#F6C667"}. Logo: `BRAND_ASSETS/logo.svg`.

## Input data
- `DATA/transactions.json`: 160 booking transactions, INR amounts as integers, dates in ISO YYYY-MM-DD, transaction IDs unique.
- `DATA/packages.json`: 12 travel packages.
- `API/server.mjs`: local backend with `GET /api/transactions`, `GET /api/packages`, `GET /api/health`.
- All amounts are scenario booking values, not actual measured business revenue.

## Requested UI
Build responsive Sidebar, Header, MainContent, SummaryCard, TransactionTable. Match provided 1440px and 390px design references; adapt at widths 320, 390, 768, 1024 and 1440px. Use CSS Modules and CSS custom properties. Keep a skip-link and semantic `<header>`, `<nav>`, `<main>`, `<section>`, `<table>` structure.

## KPI definition
1. Gross paid revenue = sum amount_inr for `Paid` rows only.
2. Total bookings = count of all transactions (including refunds and cancellations); label clearly.
3. Pending payments = count rows with status `Pending`.
4. Average paid value = paid revenue divided by paid-row count, using ₹ currency formatting; display ₹0 when none.

## Transaction interactions
- Default sort: booked_at descending; tie-break transaction_id ascending. Date sorting toggle ascending/descending.
- Status filter: All, Paid, Pending, Refunded, Cancelled.
- Optional text search by transaction ID or package name; combine with filters.
- Show 10 rows per page on desktop, cards or horizontally scrollable accessible table on mobile (no page-wide horizontal overflow).
- Show explicit 'No matching transactions' state when filter yields zero records.
- Do not mutate the fetched data array. Use `useMemo` for derived filters/sorts and avoid unnecessary rerenders.
- Provide labeled controls, keyboard focus indicators, sensible empty/loading/error states.

## Submission
Repository: GitHub URL. Deployment: live HTTPS Vercel/Netlify link. README: commands, API usage, component props, limitations and actual browser test results. Do not make claims about environments not tested.
