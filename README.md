🚀 CareerLens
AI-Powered Resume Analysis & Career Readiness
Understand your resume. Improve your ATS readiness. Take the next step in your career.

🌐 Live Project
🚀 Try CareerLens here: https://careerlens-1-dhit.onrender.com/
🌟 Overview
CareerLens is a full-stack web application that helps job seekers evaluate and improve their resumes. It combines resume parsing, structured scoring, keyword analysis, and AI-assisted feedback to turn a resume into actionable improvement steps.

Users can create an account, upload a resume, review analysis results, and track resume-related insights. The platform also includes account credits, Pro/payment integration, referrals, feedback, and gamification-related backend services.
💡 Note: An analysis score is an estimate to guide improvement, not a guarantee of passing an Applicant Tracking System (ATS) or getting an interview.

✨ Features
- 📄 Resume upload and parsing — processes supported PDF and DOCX resumes.
- 🎯 ATS-oriented analysis — evaluates resume dimensions and generates an overall score.
- 💡 Actionable feedback — surfaces suggestions, keywords, and missing keywords.
- 📊 Resume reports — presents analysis results in the interface, with PDF report support in the frontend.
- 🔐 Authentication — account registration/login with JWT-based authentication and Google sign-in integration.
- 🕘 Resume history — stores uploaded resume records and associated analysis data.
- 💳 Credits and Pro support — includes AI credit handling and Razorpay payment/subscription integration.
- 🎁 Referrals and gamification — backend routes and services support referral and reward workflows.
- 🛡️ Feedback and administration — feedback collection, administrative routes, and audit logging.
- 📱 Responsive modern UI — React, Tailwind CSS, charts, icons, and motion components.


🧰 Tech Stack
Area	Technologies
Frontend	React 19, Vite, React Router
Styling & UI	Tailwind CSS 4, Framer Motion, Lucide React
State & requests	Zustand, Axios
Charts & reports	Recharts, jsPDF, jsPDF AutoTable
Backend	Node.js 20, Express
Database	MongoDB with Prisma ORM; PostgreSQL for gamification SQL services; MySQL as a potential alternative (requires integration)
AI	Google Gemini SDKs
Authentication	JWT, bcryptjs, Google OAuth
Resume processing	pdf-parse, Mammoth
Payments	Razorpay
Security & middleware	Helmet, CORS, cookie-parser
Validation	Zod


🗂️ Repository Structure
CareerLens-main/
├── app.js
├── assets/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   └── ...
│   ├── .env.example
│   └── package.json
└── backend/
    ├── prisma/
    │   └── schema.prisma
    ├── public/
    ├── scripts/
    ├── sql/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── helpers/
    │   ├── middlewares/
    │   ├── routes/
    │   ├── services/
    │   └── validators/
    ├── package.json
    └── Dockerfile


📋 Prerequisites
Install the following before running the project:
- Node.js 20.x and npm
- A MongoDB database (local or hosted, such as MongoDB Atlas)
- PostgreSQL for the current gamification SQL features
- MySQL is not wired into the current codebase; to use it instead of PostgreSQL, add a MySQL driver and connection/configuration, then adapt and test the SQL schema and queries. The primary Prisma data store is MongoDB.
- A Google Gemini API key for AI-powered analysis
- Google OAuth credentials if you want to enable Google sign-in
- Razorpay credentials if you want to test payment/Pro workflows


🚀 Getting Started
1. 📥 Clone or extract the repository
git clone <https://github.com/Shubham-kesharwani7223/CareerLens.git>
cd CareerLens-main
If you downloaded the ZIP, extract it and open the CareerLens-main directory in your terminal.


2. ⚙️ Configure the backend
cd backend
npm install
Create a .env file inside backend/. Do not commit this file.

Example configuration:
NODE_ENV=development
PORT=5000

DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority"
GAMIFICATION_DATABASE_URL="postgresql://<username>:<password>@<host>:5432/<database>"

JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN=3d

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

GEMINI_API_KEY="your-gemini-api-key"
GEMINI_TEXT_MODEL="gemini-3.8-flash"
GEMINI_DOC_MODEL="gemini-3.8-flash"

GOOGLE_CLIENT_ID="your-google-oauth-client-id.apps.googleusercontent.com"

RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
RAZORPAY_PRO_PLAN_ID="your-razorpay-plan-id"
RAZORPAY_WEBHOOK_SECRET="your-razorpay-webhook-secret"

ADMIN_EMAIL="admin@example.com"
Set values for the services you intend to use. The names above reflect the backend configuration; payment, email, AI, and OAuth features need their respective valid credentials. Use a strong, unique JWT_SECRET outside local development.

Generate Prisma Client and synchronize the schema with your MongoDB database:
npm run prisma:generate
npm run prisma:migrate
Start the backend development server:
npm run dev
The API should be available at http://localhost:5000 unless you configure a different port.


3. 🎨 Configure the frontend
Open a second terminal:
cd frontend
npm install
Create frontend/.env using the example file:
cp .env.example .env
On Windows Command Prompt, you can copy the file with:
copy .env.example .env
Set the environment values:
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
The Google OAuth client ID used by the frontend should match the one configured in the backend. Add your local frontend origin to the authorized JavaScript origins in Google Cloud Console.

Start the frontend:
npm run dev
Open the local URL printed by Vite in your terminal (commonly http://localhost:5173).


4. ▶️ Run both services
Keep the backend and frontend running in separate terminals:
Service	Directory	Command
Backend API	backend/	npm run dev
Frontend	frontend/	npm run dev


🗄️ Database Notes: MongoDB, PostgreSQL, and MySQL
- MongoDB is the primary application database and is configured through Prisma using DATABASE_URL.
- PostgreSQL is used by the existing gamification SQL connection (pg package), configured through GAMIFICATION_DATABASE_URL. The SQL schema currently lives in backend/sql/gamification_schema.sql.
- MySQL is not currently connected by the project source code. If you specifically want MySQL instead of PostgreSQL for the SQL/gamification portion, the backend needs a MySQL driver (for example, mysql2), a MySQL connection pool, and any required SQL schema/query adjustments. Simply adding MySQL to the README does not enable the application to connect to it.
🔑 Environment Variables


🌐 Frontend
Variable	Purpose
VITE_API_URL	Backend API base URL, including /api
VITE_GOOGLE_CLIENT_ID	Google OAuth client ID for sign-in


🖥️ Backend
Variable	Purpose
PORT	Port used by the Express server
DATABASE_URL	MongoDB connection string used by Prisma for the primary application data
GAMIFICATION_DATABASE_URL	PostgreSQL connection string for the current gamification SQL features; this is not a MySQL URL
JWT_SECRET	Secret used to sign authentication tokens
JWT_EXPIRES_IN	Authentication token lifetime
UPLOAD_DIR	Directory used for uploaded files
MAX_FILE_SIZE	Maximum upload size in bytes; default is 5 MB
GEMINI_API_KEY	API key for Gemini-powered features
GEMINI_TEXT_MODEL	Gemini model used for text tasks
GEMINI_DOC_MODEL	Gemini model used for document tasks
GOOGLE_CLIENT_ID	Google OAuth client ID validated by the backend
FRONTEND_URL	Frontend origin used in application configuration
CORS_ORIGIN	Allowed frontend origin(s), comma-separated if needed
RAZORPAY_KEY_ID	Razorpay public key ID
RAZORPAY_KEY_SECRET	Razorpay secret key
RAZORPAY_PRO_PLAN_ID	Razorpay Pro plan identifier
RAZORPAY_WEBHOOK_SECRET	Secret used to validate payment webhooks
ADMIN_EMAIL	Email configured for administrative access


Never expose backend secrets in frontend variables. Variables prefixed with VITE_ are bundled into client-side code and must not contain private keys.
📜 Available Scripts

🖥️ Backend (backend/)
Command	Description
npm run dev	Start the server with Node watch mode
npm start	Start the server
npm run build	Generate Prisma Client and run the JavaScript check
npm run prisma:generate	Generate Prisma Client
npm run prisma:migrate	Push the Prisma schema to the configured database
npm run prisma:studio	Open Prisma Studio


🌐 Frontend (frontend/)
Command	Description
npm run dev	Start the Vite development server
npm run build	Create a production build
npm run preview	Preview the production build locally
npm run lint	Run ESLint


🔄 How It Works
1. 👤 Create an account or sign in.
2. 📤 Upload a resume using the available upload flow.
3. 📝 Extract resume content from the uploaded document.
4. 🤖 Analyze the resume to calculate category scores and identify keywords or potential gaps.
5. 💡 Review recommendations and update the resume based on the feedback.
6. 📈 Re-analyze when needed to compare progress and continue improving.
The analysis pipeline includes text extraction and normalization, NLP-based processing, and Gemini-backed AI services. Actual results depend on document quality, resume content, configuration, and availability of external services.


🔌 API
The Express API is organized into route modules under backend/src/routes/. These cover areas such as:
- Authentication
- Resume management
- Resume analysis
- Feedback
- Platform statistics
- Referrals and gamification
- Payments and administrative functions
The API is mounted by the backend route index. Check backend/src/routes/ and backend/src/server.js for the current endpoint definitions and middleware configuration.


🗄️ Database
Prisma is configured to use MongoDB. The schema includes models for users, resumes, analysis results, feedback, payments, administrative audit logs, and credit grants.

After changing the Prisma schema, regenerate the client and apply the schema changes to your development database:
cd backend
npm run prisma:generate
npm run prisma:migrate
Use a non-production database while developing and testing schema changes.


🛠️ Troubleshooting
- Frontend cannot reach the API: confirm the backend is running, check VITE_API_URL, and verify CORS_ORIGIN / FRONTEND_URL.
- Database connection fails: validate DATABASE_URL, database network access, and MongoDB credentials.
- AI analysis fails: verify GEMINI_API_KEY, model configuration, and API access.
- Google sign-in fails: confirm the client ID matches in both applications and the frontend origin is authorized.
- Uploads fail: check MAX_FILE_SIZE, UPLOAD_DIR, file type, and server write permissions.
- Payment features fail: configure the Razorpay credentials and webhook settings; use test credentials for local development.
- Prisma errors occur: run npm run prisma:generate and check that the configured MongoDB connection is reachable.


🔐 Security Notes
- Keep .env files and API secrets out of version control.
- Use a strong JWT_SECRET; do not rely on development defaults in production.
- Restrict CORS to trusted frontend origins in production.
- Use HTTPS in deployed environments.
- Validate upload types and size limits, and protect uploaded resumes as private user data.
- Test payments with provider test mode before enabling live transactions.
- Review authentication, authorization, rate limits, and error logging before production deployment.


🤝 Contributing
Contributions and improvements are welcome. 🙌
1. Fork the repository.
2. Create a feature branch: git checkout -b feature/your-feature.
3. Make and test your changes.
4. Run the relevant lint/build checks.
5. Submit a pull request describing the change.
Please avoid committing secrets, personal resume data, build output, or uploaded files.
📄 License
No project-level license was identified in the supplied repository. Add a LICENSE file and update this section before distributing the project if you intend to publish it as open source.

🚀 CareerLens — Make every resume revision count. ✨
