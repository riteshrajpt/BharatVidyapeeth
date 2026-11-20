# Local development

The frontend runs at http://localhost:3000 and the backend at http://localhost:4000.
From the repository root, install dependencies with `npm install`, then run
`npm install --prefix server`. Start both with `npm run dev`.

The root `.env` and `server/.env` have been created for this local setup. For a
fresh checkout, copy the corresponding `.env.example` files and generate a long,
random `JWT_SECRET` for the backend. Real `.env` files are ignored by Git.

| File          | Variables                                            | Purpose                                                                                                                   |
| ------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `server/.env` | `MONGODB_URL`                                        | Required for accounts, courses, and other stored data. Use a development database URI.                                    |
| `server/.env` | `JWT_SECRET`                                         | Signs login tokens. A random local value has already been generated.                                                      |
| `server/.env` | `FRONTEND_URL`                                       | Address used in password-reset emails. Defaults to `http://localhost:3000`; set the deployed frontend URL for production. |
| `server/.env` | `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS`                | SMTP service for signup OTPs, password resets, contact messages, and notifications. Use an SMTP password or app password. |
| `server/.env` | `CLOUD_NAME`, `API_KEY`, `API_SECRET`, `FOLDER_NAME` | Cloudinary image and video uploads. The folder defaults to `BharatVidyapeeth`.                                            |
| `server/.env` | `RAZORPAY_KEY`, `RAZORPAY_SECRET`                    | Razorpay payments. Use test credentials for development.                                                                  |
| `.env`        | `REACT_APP_BASE_URL`                                 | Already set to `http://localhost:4000/api/v1`.                                                                            |
| `.env`        | `REACT_APP_RAZORPAY_KEY`                             | The same public key ID as backend `RAZORPAY_KEY`. Never place a secret key in frontend configuration.                     |

The backend health endpoint at `/` reports the database connection state. Without
MongoDB, the backend starts and database routes return HTTP 503. Without Razorpay
credentials, checkout returns HTTP 503 once the database is connected.

The backend development process reloads when `server/.env` changes. Restart the
frontend after changing the root `.env`.

Password-reset emails use `FRONTEND_URL` and contain a clickable link that expires
after one hour. Request a fresh email from `/forgot-password` after changing this
setting; emails already received keep their original links.
