# CareerLens JavaScript + Razorpay setup

The frontend and backend source files have been converted to JavaScript. React component files use `.jsx`; other JavaScript modules use `.js`. Node.js remains the backend runtime and Express remains the HTTP framework.

## Install and run

Terminal 1:
```bash
cd backend
npm install
cp .env.example .env
# Fill DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID, GEMINI_API_KEY and Razorpay values in .env
npm run dev
```

Terminal 2:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Razorpay configuration

1. Use Razorpay Dashboard test mode first and set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `backend/.env`.
2. Create a **monthly subscription plan** for CareerLens Pro in the Razorpay Dashboard and set its ID as `RAZORPAY_PRO_PLAN_ID`. The plan should match the displayed ₹499/month price. The backend intentionally does not create a subscription plan automatically.
3. Credit packs use one-time Razorpay Orders: Starter ₹49 for 5 credits and Pro ₹149 for 20 credits. The backend validates the signature, order owner, amount, currency and captured payment before granting credits.
4. Keep `.env` files out of Git. Never expose `RAZORPAY_KEY_SECRET` in the frontend.
5. Configure a Razorpay webhook pointing to `https://YOUR_BACKEND_HOST/api/razorpay/webhook` and set the same webhook secret as `RAZORPAY_WEBHOOK_SECRET`. Subscribe to `subscription.charged`, `subscription.cancelled`, and `subscription.halted` events so monthly renewals grant credits and cancelled/halted subscriptions lose Pro access.

## Important

Run `npm run build` in both folders and test login, Google sign-in, resume upload/analysis, credits, Pro checkout and payment cancellation in Razorpay test mode before deploying. The code has been converted, but live payment verification requires your own Razorpay account credentials and plan ID.
