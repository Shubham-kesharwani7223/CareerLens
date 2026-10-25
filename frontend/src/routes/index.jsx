
// import {
//   createBrowserRouter,
//   useRouteError,
//   Link,
// } from "react-router-dom";

// import { AuthLayout } from "@/components/layout/AuthLayout";
// import { DashboardLayout } from "@/components/layout/DashboardLayout";
// import { AdminLayout } from "@/components/layout/AdminLayout";

// import { ProtectedRoute } from "./ProtectedRoute";
// import { AdminRoute } from "./AdminRoute";
// import { ProGate } from "@/components/ProGate";

// import { HomePage } from "@/pages/Home";
// import { LoginPage } from "@/pages/auth/Login";
// import { RegisterPage } from "@/pages/auth/Register";

// import { DashboardPage } from "@/pages/dashboard/Dashboard";
// import { UploadResumePage } from "@/pages/dashboard/UploadResume";
// import { ResumeAnalysisPage } from "@/pages/dashboard/ResumeAnalysis";
// import { JobMatchPage } from "@/pages/dashboard/JobMatch";
// import { InterviewPrepPage } from "@/pages/dashboard/InterviewPrep";
// import { ContentGeneratorPage } from "@/pages/dashboard/ContentGenerator";
// import { ResumeComparePage } from "@/pages/dashboard/ResumeCompare";
// import { AiChatPage } from "@/pages/dashboard/AiChat";
// import { VisualizationsPage } from "@/pages/dashboard/Visualizations";
// import { CareerHubPage } from "@/pages/dashboard/CareerHub";
// import { MockInterviewPage } from "@/pages/dashboard/MockInterview";
// import { HistoryPage } from "@/pages/dashboard/History";
// import { ProfilePage } from "@/pages/dashboard/Profile";

// import { AdminDashboardPage } from "@/pages/dashboard/AdminDashboard";
// import { NotFoundPage } from "@/pages/NotFound";
// import { PricingPage } from "@/pages/Pricing";
// import { PurchasePage } from "@/pages/Purchase";

// function RouteErrorBoundary() {
//   const error = useRouteError();

//   return (
//     <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
//       <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
//         <h2 className="mb-2 text-xl font-bold text-red-600 dark:text-red-400">
//           Something went wrong
//         </h2>

//         <p className="mb-4 text-sm text-red-500 dark:text-red-300">
//           {error?.message || "An unexpected error occurred"}
//         </p>

//         <pre className="mb-4 max-h-40 overflow-auto rounded-lg bg-red-100 p-3 text-left text-xs text-red-700 dark:bg-red-900/30 dark:text-red-300">
//           {error?.stack || String(error)}
//         </pre>

//         <Link
//           to="/dashboard"
//           onClick={() => window.location.reload()}
//           className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
//         >
//           Reload Page
//         </Link>
//       </div>
//     </div>
//   );
// }

// export const router = createBrowserRouter([
//   // Public home page
//   {
//     path: "/",
//     element: <HomePage />,
//   },

//   // Pricing and payments
//   {
//     path: "/pricing",
//     element: <PricingPage />,
//   },
//   {
//     path: "/purchase",
//     element: <PurchasePage />,
//   },

//   // Authentication pages
//   {
//     element: <AuthLayout />,
//     children: [
//       {
//         path: "/login",
//         element: <LoginPage />,
//       },
//       {
//         path: "/register",
//         element: <RegisterPage />,
//       },
//     ],
//   },

//   // Normal user dashboard and workspace
//   {
//     element: (
//       <ProtectedRoute>
//         <DashboardLayout />
//       </ProtectedRoute>
//     ),
//     errorElement: <RouteErrorBoundary />,
//     children: [
//       {
//         path: "/dashboard",
//         element: <DashboardPage />,
//         errorElement: <RouteErrorBoundary />,
//       },
//       {
//         path: "/upload",
//         element: <UploadResumePage />,
//         errorElement: <RouteErrorBoundary />,
//       },
//       {
//         path: "/analysis",
//         element: <ResumeAnalysisPage />,
//         errorElement: <RouteErrorBoundary />,
//       },
//       {
//         path: "/job-match",
//         element: (
//           <ProGate feature="Job Matching & Skill Gap" requirePro>
//             <JobMatchPage />
//           </ProGate>
//         ),
//         errorElement: <RouteErrorBoundary />,
//       },
//       {
//         path: "/interview-prep",
//         element: (
//           <ProGate feature="Interview Preparation" requirePro>
//             <InterviewPrepPage />
//           </ProGate>
//         ),
//         errorElement: <RouteErrorBoundary />,
//       },
//       {
//         path: "/content-generator",
//         element: (
//           <ProGate feature="AI Content Generator" requirePro>
//             <ContentGeneratorPage />
//           </ProGate>
//         ),
//         errorElement: <RouteErrorBoundary />,
//       },
//       {
//         path: "/compare",
//         element: <ResumeComparePage />,
//         errorElement: <RouteErrorBoundary />,
//       },
//       {
//         path: "/ai-chat",
//         element: (
//           <ProGate feature="AI Career Assistant" requirePro>
//             <AiChatPage />
//           </ProGate>
//         ),
//         errorElement: <RouteErrorBoundary />,
//       },
//       {
//         path: "/visualize",
//         element: <VisualizationsPage />,
//         errorElement: <RouteErrorBoundary />,
//       },
//       {
//         path: "/career-hub",
//         element: (
//           <ProGate feature="Career Growth Hub" requirePro>
//             <CareerHubPage />
//           </ProGate>
//         ),
//         errorElement: <RouteErrorBoundary />,
//       },
//       {
//         path: "/mock-interview",
//         element: (
//           <ProGate feature="Mock Interview" requirePro>
//             <MockInterviewPage />
//           </ProGate>
//         ),
//         errorElement: <RouteErrorBoundary />,
//       },
//       {
//         path: "/history",
//         element: <HistoryPage />,
//         errorElement: <RouteErrorBoundary />,
//       },
//       {
//         path: "/profile",
//         element: <ProfilePage />,
//         errorElement: <RouteErrorBoundary />,
//       },
//     ],
//   },

//   // Separate admin panel — outside DashboardLayout
//   {
//     path: "/admin",
//     element: (
//       <AdminRoute>
//         <AdminLayout>
//           <AdminDashboardPage />
//         </AdminLayout>
//       </AdminRoute>
//     ),
//     errorElement: <RouteErrorBoundary />,
//   },

//   // Page not found
//   {
//     path: "*",
//     element: <NotFoundPage />,
//   },
// ]);
































// import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import { createBrowserRouter, useRouteError, Link } from "react-router-dom";
// import { AuthLayout } from "@/components/layout/AuthLayout";
// import { DashboardLayout } from "@/components/layout/DashboardLayout";
// import { ProtectedRoute } from "./ProtectedRoute";
// // Pages
// import { HomePage } from "@/pages/Home";
// import { LoginPage } from "@/pages/auth/Login";
// import { RegisterPage } from "@/pages/auth/Register";
// import { DashboardPage } from "@/pages/dashboard/Dashboard";
// import { UploadResumePage } from "@/pages/dashboard/UploadResume";
// import { ResumeAnalysisPage } from "@/pages/dashboard/ResumeAnalysis";
// import { JobMatchPage } from "@/pages/dashboard/JobMatch";
// import { InterviewPrepPage } from "@/pages/dashboard/InterviewPrep";
// import { ContentGeneratorPage } from "@/pages/dashboard/ContentGenerator";
// import { ResumeComparePage } from "@/pages/dashboard/ResumeCompare";
// import { AiChatPage } from "@/pages/dashboard/AiChat";
// import { VisualizationsPage } from "@/pages/dashboard/Visualizations";
// import { CareerHubPage } from "@/pages/dashboard/CareerHub";
// import { MockInterviewPage } from "@/pages/dashboard/MockInterview";
// import { HistoryPage } from "@/pages/dashboard/History";
// import { ProfilePage } from "@/pages/dashboard/Profile";
// import { NotFoundPage } from "@/pages/NotFound";
// import { PricingPage } from "@/pages/Pricing";
// import { PurchasePage } from "@/pages/Purchase";
// import { AdminDashboardPage } from "@/pages/dashboard/AdminDashboard";
// import { GamifiedHubPage } from "@/pages/dashboard/GamifiedHub";
// import { AdminGamificationPage } from "@/pages/dashboard/AdminGamification";
// import { ProGate } from "@/components/ProGate";
// function RouteErrorBoundary() {
//     const error = useRouteError();
//     return (_jsx("div", { className: "flex min-h-[60vh] flex-col items-center justify-center p-8", children: _jsxs("div", { className: "mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20", children: [_jsx("h2", { className: "mb-2 text-xl font-bold text-red-600 dark:text-red-400", children: "Something went wrong" }), _jsx("p", { className: "mb-4 text-sm text-red-500 dark:text-red-300", children: error?.message || "An unexpected error occurred" }), _jsx("pre", { className: "mb-4 max-h-40 overflow-auto rounded-lg bg-red-100 p-3 text-left text-xs text-red-700 dark:bg-red-900/30 dark:text-red-300", children: error?.stack || String(error) }), _jsx(Link, { to: "/dashboard", onClick: () => window.location.reload(), className: "inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700", children: "Reload Page" })] }) }));
// }
// export const router = createBrowserRouter([
//     {
//         path: "/",
//         element: _jsx(HomePage, {}),
//     },
//     {
//         path: "/pricing",
//         element: _jsx(PricingPage, {}),
//     },
//     {
//         path: "/purchase",
//         element: _jsx(PurchasePage, {}),
//     },
//     {
//         element: _jsx(AuthLayout, {}),
//         children: [
//             { path: "/login", element: _jsx(LoginPage, {}) },
//             { path: "/register", element: _jsx(RegisterPage, {}) },
//         ],
//     },
//     {
//         element: (_jsx(ProtectedRoute, { children: _jsx(DashboardLayout, {}) })),
//         errorElement: _jsx(RouteErrorBoundary, {}),
//         children: [
//             { path: "/dashboard", element: _jsx(DashboardPage, {}), errorElement: _jsx(RouteErrorBoundary, {}) },
//             { path: "/learn", element: _jsx(GamifiedHubPage, {}), errorElement: _jsx(RouteErrorBoundary, {}) },
//             { path: "/admin/gamification", element: _jsx(AdminGamificationPage, {}), errorElement: _jsx(RouteErrorBoundary, {}) },
//             { path: "/upload", element: _jsx(UploadResumePage, {}), errorElement: _jsx(RouteErrorBoundary, {}) },
//             { path: "/analysis", element: _jsx(ResumeAnalysisPage, {}), errorElement: _jsx(RouteErrorBoundary, {}) },
//             { path: "/job-match", element: _jsx(ProGate, { feature: "Job Matching & Skill Gap", requirePro: true, children: _jsx(JobMatchPage, {}) }), errorElement: _jsx(RouteErrorBoundary, {}) },
//             { path: "/interview-prep", element: _jsx(ProGate, { feature: "Interview Preparation", requirePro: true, children: _jsx(InterviewPrepPage, {}) }), errorElement: _jsx(RouteErrorBoundary, {}) },
//             { path: "/content-generator", element: _jsx(ProGate, { feature: "AI Content Generator", requirePro: true, children: _jsx(ContentGeneratorPage, {}) }), errorElement: _jsx(RouteErrorBoundary, {}) },
//             { path: "/compare", element: _jsx(ResumeComparePage, {}), errorElement: _jsx(RouteErrorBoundary, {}) },
//             { path: "/ai-chat", element: _jsx(ProGate, { feature: "AI Career Assistant", requirePro: true, children: _jsx(AiChatPage, {}) }), errorElement: _jsx(RouteErrorBoundary, {}) },
//             { path: "/visualize", element: _jsx(VisualizationsPage, {}), errorElement: _jsx(RouteErrorBoundary, {}) },
//             { path: "/career-hub", element: _jsx(ProGate, { feature: "Career Growth Hub", requirePro: true, children: _jsx(CareerHubPage, {}) }), errorElement: _jsx(RouteErrorBoundary, {}) },
//             { path: "/mock-interview", element: _jsx(ProGate, { feature: "Mock Interview", requirePro: true, children: _jsx(MockInterviewPage, {}) }), errorElement: _jsx(RouteErrorBoundary, {}) },
//             { path: "/history", element: _jsx(HistoryPage, {}), errorElement: _jsx(RouteErrorBoundary, {}) },
//             { path: "/profile", element: _jsx(ProfilePage, {}), errorElement: _jsx(RouteErrorBoundary, {}) },
//             { path: "/admin", element: _jsx(AdminDashboardPage, {}), errorElement: _jsx(RouteErrorBoundary, {}) },
//         ],
//     },
//     {
//         path: "*",
//         element: _jsx(NotFoundPage, {}),
//     },
// ]);























































import { createBrowserRouter, useRouteError, Link } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";

import { HomePage } from "@/pages/Home";
import { LoginPage } from "@/pages/auth/Login";
import { RegisterPage } from "@/pages/auth/Register";
import { DashboardPage } from "@/pages/dashboard/Dashboard";
import { UploadResumePage } from "@/pages/dashboard/UploadResume";
import { ResumeAnalysisPage } from "@/pages/dashboard/ResumeAnalysis";
import { JobMatchPage } from "@/pages/dashboard/JobMatch";
import { InterviewPrepPage } from "@/pages/dashboard/InterviewPrep";
import { ContentGeneratorPage } from "@/pages/dashboard/ContentGenerator";
import { ResumeComparePage } from "@/pages/dashboard/ResumeCompare";
import { AiChatPage } from "@/pages/dashboard/AiChat";
import { VisualizationsPage } from "@/pages/dashboard/Visualizations";
import { CareerHubPage } from "@/pages/dashboard/CareerHub";
import { MockInterviewPage } from "@/pages/dashboard/MockInterview";
import { HistoryPage } from "@/pages/dashboard/History";
import { ProfilePage } from "@/pages/dashboard/Profile";
import { NotFoundPage } from "@/pages/NotFound";
import { PricingPage } from "@/pages/Pricing";
import { PurchasePage } from "@/pages/Purchase";
import { AdminDashboardPage } from "@/pages/dashboard/AdminDashboard";
import { GamifiedHubPage } from "@/pages/dashboard/GamifiedHub";
import { AdminGamificationPage } from "@/pages/dashboard/AdminGamification";
import { ReferralsPage } from "@/pages/dashboard/Referrals";
import { ProGate } from "@/components/ProGate";

function RouteErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
      <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
        <h2 className="mb-2 text-xl font-bold text-red-600 dark:text-red-400">
          Something went wrong
        </h2>

        <p className="mb-4 text-sm text-red-500 dark:text-red-300">
          {error?.message || "An unexpected error occurred"}
        </p>

        <pre className="mb-4 max-h-40 overflow-auto rounded-lg bg-red-100 p-3 text-left text-xs text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {error?.stack || String(error)}
        </pre>

        <Link
          to="/dashboard"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Reload Page
        </Link>
      </div>
    </div>
  );
}

const adminElement = (page) => (
  <AdminRoute>
    <AdminLayout>{page}</AdminLayout>
  </AdminRoute>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/pricing",
    element: <PricingPage />,
  },
  {
    path: "/purchase",
    element: <PurchasePage />,
  },

  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },

  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/learn",
        element: <GamifiedHubPage initialTab="quizzes" />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/gaming-zone",
        element: <GamifiedHubPage initialTab="games" />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/quizzes",
        element: <GamifiedHubPage initialTab="quizzes" />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/leaderboard",
        element: <GamifiedHubPage initialTab="leaderboard" />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/rewards",
        element: <GamifiedHubPage initialTab="wallet" />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/referrals",
        element: <ReferralsPage />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/upload",
        element: <UploadResumePage />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/analysis",
        element: <ResumeAnalysisPage />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/job-match",
        element: (
          <ProGate feature="Job Matching & Skill Gap" requirePro>
            <JobMatchPage />
          </ProGate>
        ),
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/interview-prep",
        element: (
          <ProGate feature="Interview Preparation" requirePro>
            <InterviewPrepPage />
          </ProGate>
        ),
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/content-generator",
        element: (
          <ProGate feature="AI Content Generator" requirePro>
            <ContentGeneratorPage />
          </ProGate>
        ),
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/compare",
        element: <ResumeComparePage />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/ai-chat",
        element: (
          <ProGate feature="AI Career Assistant" requirePro>
            <AiChatPage />
          </ProGate>
        ),
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/visualize",
        element: <VisualizationsPage />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/career-hub",
        element: (
          <ProGate feature="Career Growth Hub" requirePro>
            <CareerHubPage />
          </ProGate>
        ),
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/mock-interview",
        element: (
          <ProGate feature="Mock Interview" requirePro>
            <MockInterviewPage />
          </ProGate>
        ),
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/history",
        element: <HistoryPage />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
        errorElement: <RouteErrorBoundary />,
      },
    ],
  },

  // Admin pages are outside DashboardLayout.
  {
    path: "/admin",
    element: adminElement(<AdminDashboardPage />),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin/gamification",
    element: adminElement(<AdminGamificationPage />),
    errorElement: <RouteErrorBoundary />,
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
