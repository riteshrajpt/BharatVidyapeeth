# BharatVidyapeeth

A learning platform for curious minds. Explore practical courses, learn at your own pace, and manage your teaching or learning in one place.

## The experience

- A responsive homepage with real course recommendations and topic discovery.
- A searchable course library with category filters, shareable search URLs, and price/name/date sorting.
- Course details with expandable lesson outlines, instructor profiles, enrollment, and a learning bag.
- Accessible login, signup, email verification, and password recovery.
- Learner profiles, enrolled courses, saved progress, and a focused video lesson player.
- Instructor insights, draft/published course management, and a three-step course builder.
- Account settings and a contact form with submission feedback.

The design uses a shared light, green-accented visual system, responsive navigation, keyboard-operable controls, loading states, and actionable error and empty states. Route-based code splitting keeps authoring and chart tools out of the initial homepage bundle.

## Run locally

The current setup has been verified with Node.js 24.22.3. The project uses React 18, Create React App, Tailwind CSS, Express, and MongoDB.

1. Install frontend and backend dependencies:

   ```sh
   npm install
   npm install --prefix server
   ```

2. Copy `.env.example` to `.env` and `server/.env.example` to `server/.env`. On PowerShell:

   ```powershell
   Copy-Item .env.example .env
   Copy-Item server/.env.example server/.env
   ```

3. Add your development credentials. Generate a JWT secret with:

   ```sh
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

   Put the result in `JWT_SECRET` in `server/.env`. See [backend configuration](server/README.md) for MongoDB, Gmail SMTP, Cloudinary, Razorpay, and password-reset URL settings. Keep secrets in your local environment files; they are ignored by Git. Only the public Razorpay key ID belongs in the frontend configuration.

4. Start both services:

   ```sh
   npm run dev
   ```

   Frontend: <http://localhost:3000>

   Backend health: <http://localhost:4000>

   To run each separately, use `npm start` and `npm run dev --prefix server` in separate terminals. Backend changes, including `server/.env`, reload automatically. Restart the frontend after changing its `.env`.

The backend can start before third-party services are configured. Its health endpoint reports the MongoDB connection state; database routes return HTTP 503 until connected. The course library shows a retry state when the API is unavailable.

## Verify changes

```sh
npm test -- --watchAll=false --runInBand
npm run build
```

The interaction tests cover mobile navigation, course search/sorting/filtering, empty/error states, invalid course links, password visibility, enrolled-course navigation, dashboard permissions, and confirmation dialogs. Tests use fictional local fixtures and do not send email, create payments, or modify the database.

## Project structure

- `src/pages` — public pages, account flows, and workspace shells.
- `src/components/Common` — branding, navigation, cards, dialogs, and page feedback.
- `src/components/core` — authentication, course details, instructor/learner workflows, and lessons.
- `src/styles` — shared visual system, workspace styles, and responsive rules.
- `src/hooks/useCourseCatalog.js` — shared catalog loading and request deduplication.
- `server` — Express routes, controllers, MongoDB models, and service integrations.

## Deployment configuration

Set `REACT_APP_BASE_URL` to the deployed backend's `/api/v1` address and set backend `FRONTEND_URL` to the deployed frontend origin. Password-reset emails use that origin. Configure your static host to serve `index.html` for client-side routes such as `/courses` and `/update-password/:token`. Deploying the frontend does not deploy the Express backend.
