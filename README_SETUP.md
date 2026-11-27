# BlueTrail dashboard: local starter

Prerequisites: Node.js 20+ and npm, internet access for first npm install.

1. In a terminal run `cd INPUT_FILES/API && node server.mjs`.
2. In a second terminal run `cd INPUT_FILES/REACT_STARTER && npm install && npm run dev`.
3. Open `http://localhost:5173`.
4. Implement the unfinished KPI and transaction table behaviors in `src/App.jsx` and `src/components/TransactionTable.jsx`.
5. Run `npm run build` and actual browser tests. Log results in the acceptance matrix.

To verify the API: `cd INPUT_FILES/API && node smoke_test.mjs`.

The Vite `VITE_API_URL` defaults to `http://localhost:4177`; see `.env.example`. For a live HTTPS frontend, deploy the API separately to HTTPS or use same-origin proxying; localhost fetches will not work from a public Vercel/Netlify deployment. Publish no private tokens.

The source starter does not implement final KPI calculations, sorting, filtering, pagination or complete responsive UI. They are freelancer deliverables.
