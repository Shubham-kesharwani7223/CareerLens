// // 




































// import { useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Upload,
//   FileSearch,
//   Briefcase,
//   MessageSquareQuote,
//   PenLine,
//   GitCompareArrows,
//   Bot,
//   Eye,
//   Rocket,
//   Mic,
//   User,
//   History,
//   X,
//   MessageSquareHeart,
//   Sparkles,
//   Crown,
//   CreditCard,
// } from "lucide-react";
// import { cn } from "@/utils/cn";
// import { FeedbackModal } from "@/components/FeedbackModal";
// import { useAuth } from "@/hooks/useAuth";

// const primaryNavSections = [
//   {
//     title: "Workspace",
//     items: [
//       { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
//       { to: "/upload", icon: Upload, label: "Upload Resume" },
//     ],
//   },
//   {
//     title: "Resume Insights",
//     items: [
//       { to: "/analysis", icon: FileSearch, label: "Resume Analysis" },
//       { to: "/visualize", icon: Eye, label: "Visualizations" },
//       { to: "/compare", icon: GitCompareArrows, label: "Compare Resumes" },
//       { to: "/history", icon: History, label: "Analysis History" },
//     ],
//   },
//   {
//     title: "Career Growth",
//     items: [
//       { to: "/job-match", icon: Briefcase, label: "Job Match" },
//       { to: "/content-generator", icon: PenLine, label: "Career Content" },
//       { to: "/career-hub", icon: Rocket, label: "Career Hub" },
//     ],
//   },
//   {
//     title: "Interview Practice",
//     items: [
//       { to: "/ai-chat", icon: Bot, label: "AI Career Assistant" },
//       { to: "/interview-prep", icon: MessageSquareQuote, label: "Interview Prep" },
//       { to: "/mock-interview", icon: Mic, label: "Mock Interview" },
//     ],
//   },
// ];

// export function Sidebar({ isOpen, onClose }) {
//   const [feedbackOpen, setFeedbackOpen] = useState(false);
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const isPro = user?.isPro === true;

//   const navSections = [
//     ...primaryNavSections,
//     {
//       title: "Plan & Billing",
//       items: [
//         {
//           to: "/pricing",
//           icon: Crown,
//           label: isPro ? "CareerLens Pro" : "Upgrade to Pro",
//         },
//         { to: "/purchase", icon: CreditCard, label: "Buy AI Credits" },
//       ],
//     },
//     {
//       title: "Account",
//       items: [{ to: "/profile", icon: User, label: "My Profile" }],
//     },
//   ];

//   return (
//     <>
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 z-40 bg-[#170d19]/55 backdrop-blur-sm lg:hidden"
//           />
//         )}
//       </AnimatePresence>

//       <aside
//         className={cn(
//           "fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col overflow-hidden",
//           "border-r border-[#e6d9df] bg-[#fffaf2] text-[#29182f]",
//           "shadow-[8px_0_28px_rgba(48,32,56,0.05)]",
//           "transition-[transform,background-color,border-color] duration-300 ease-in-out",
//           "dark:border-white/[0.08] dark:bg-[#100b16] dark:text-[#f7f1fa]",
//           "dark:shadow-[8px_0_28px_rgba(0,0,0,0.18)]",
//           "lg:translate-x-0 lg:static",
//           isOpen ? "translate-x-0" : "-translate-x-full",
//         )}
//       >
//         <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#e6d9df] px-5 dark:border-white/[0.08]">
//           <button
//             type="button"
//             onClick={() => {
//               onClose();
//               navigate("/");
//             }}
//             aria-label="CareerLens home"
//             className="flex min-w-0 items-center gap-3 rounded-xl text-left transition-opacity hover:opacity-85"
//           >
//             <img src="/logo.png" alt="CareerLens logo" className="h-10 w-10 shrink-0 object-contain" />
//             <span className="truncate text-xl font-bold tracking-tight text-[#29182f] dark:text-[#f7f1fa]">
//               Career<span className="bg-gradient-to-r from-[#A17B37] via-[#B779A8] to-[#A855F7] bg-clip-text text-transparent">Lens</span>
//             </span>
//           </button>
//           <button
//             type="button"
//             onClick={onClose}
//             aria-label="Close navigation"
//             className="rounded-xl p-2 text-[#806f82] transition hover:bg-[#f2e8ef] hover:text-[#29182f] lg:hidden dark:text-[#b7a5ba] dark:hover:bg-white/[0.08] dark:hover:text-white"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <nav className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-3 py-5">
//           {navSections.map((section, sectionIndex) => (
//             <div key={section.title} className={sectionIndex > 0 ? "mt-6" : ""}>
//               <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a879c] dark:text-[#8e7b94]">
//                 {section.title}
//               </p>
//               <div className="space-y-1">
//                 {section.items.map((item) => (
//                   <NavLink
//                     key={item.to}
//                     to={item.to}
//                     onClick={onClose}
//                     className={({ isActive }) =>
//                       cn(
//                         "group relative flex min-h-10 items-center gap-3 rounded-xl border px-3 py-2.5 text-[13px] font-medium",
//                         "transition-all duration-200",
//                         isActive
//                           ? "border-[#dfcbdc] bg-[#f1e6ef] text-[#4c3150] shadow-sm dark:border-[#76577c]/50 dark:bg-[#76577c]/20 dark:text-[#f5e8fa]"
//                           : "border-transparent text-[#655568] hover:border-[#eadde6] hover:bg-[#f7efe9] hover:text-[#29182f] dark:text-[#c1b4c7] dark:hover:border-white/[0.07] dark:hover:bg-white/[0.05] dark:hover:text-white",
//                       )
//                     }
//                   >
//                     {({ isActive }) => (
//                       <>
//                         {isActive && (
//                           <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-[#8a668d] dark:bg-[#c2a0ce]" />
//                         )}
//                         <item.icon
//                           className={cn(
//                             "h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-105",
//                             isActive
//                               ? "text-[#79557e] dark:text-[#d5b6df]"
//                               : "text-[#8a788e] group-hover:text-[#79557e] dark:text-[#a997b0] dark:group-hover:text-[#d5b6df]",
//                           )}
//                         />
//                         <span className="min-w-0 flex-1">{item.label}</span>
//                         {item.to === "/pricing" && !isPro && (
//                           <span className="rounded-full bg-[#694B68] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
//                             Pro
//                           </span>
//                         )}
//                       </>
//                     )}
//                   </NavLink>
//                 ))}

//                 {section.title === "Account" && (
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setFeedbackOpen(true);
//                       onClose();
//                     }}
//                     className="group flex min-h-10 w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left text-[13px] font-medium text-[#655568] transition-all duration-200 hover:border-[#eadde6] hover:bg-[#f7efe9] hover:text-[#29182f] dark:text-[#c1b4c7] dark:hover:border-white/[0.07] dark:hover:bg-white/[0.05] dark:hover:text-white"
//                   >
//                     <MessageSquareHeart className="h-[18px] w-[18px] shrink-0 text-[#8a668d] transition-transform duration-200 group-hover:scale-105 dark:text-[#c2a0ce]" />
//                     <span>Send feedback</span>
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </nav>

//         <div className="shrink-0 border-t border-[#e6d9df] p-3 dark:border-white/[0.08]">
//           <div className="rounded-2xl border border-[#e8dce6] bg-gradient-to-br from-[#f7eee7] to-[#f1e7f1] p-3.5 dark:border-white/[0.08] dark:from-[#211626] dark:to-[#19111f]">
//             <div className="mb-2 flex items-center gap-2">
//               {isPro ? (
//                 <Crown className="h-4 w-4 text-[#a17b37] dark:text-[#d5b56b]" />
//               ) : (
//                 <Sparkles className="h-4 w-4 text-[#a17b37] dark:text-[#d5b56b]" />
//               )}
//               <p className="text-xs font-bold text-[#4c3150] dark:text-[#e7d5ed]">
//                 {isPro ? "CareerLens Pro is active" : "Unlock CareerLens Pro"}
//               </p>
//             </div>
//             <p className="mb-3 text-[11px] leading-relaxed text-[#806f82] dark:text-[#b5a3ba]">
//               {isPro
//                 ? "Explore your plan or add more AI credits whenever you need them."
//                 : "Get more career tools with the ₹499/month Pro subscription."}
//             </p>
//             <Link
//               to={isPro ? "/purchase" : "/pricing"}
//               onClick={onClose}
//               className="flex min-h-9 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#694B68] to-[#8d688c] px-3 py-2 text-center text-xs font-bold text-white shadow-md transition hover:brightness-110"
//             >
//               {isPro ? <CreditCard className="h-4 w-4" /> : <Crown className="h-4 w-4" />}
//               {isPro ? "Buy AI Credits" : "Explore Pro Plan"}
//             </Link>
//           </div>
//           <p className="px-1 pt-3 text-center text-[10px] text-[#9a879c] dark:text-[#827187]">© 2026 CareerLens</p>
//         </div>
//       </aside>

//       <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
//     </>
//   );
// }

























































































import { useState } from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  NavLink,
  Link,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  FileUp,
  FileSearch,
  Briefcase,
  PenLine,
  Rocket,
  Bot,
  MessageSquareQuote,
  Mic,
  History,
  User,
  MessageSquareHeart,
  CreditCard,
  Crown,
  Sparkles,
  X,
  ChartNoAxesCombined,
} from "lucide-react";

import { cn } from "@/utils/cn";
import { useAuth } from "@/hooks/useAuth";
import { FeedbackModal } from "@/components/FeedbackModal";

const primaryNavSections = [
  {
    title: "Workspace",
    items: [
      { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/upload", icon: FileUp, label: "Upload Resume" },
      { to: "/analysis", icon: FileSearch, label: "Resume Analysis" },
      { to: "/compare", icon: ChartNoAxesCombined, label: "Resume Compare" },
      { to: "/visualize", icon: ChartNoAxesCombined, label: "Visualizations" },
      { to: "/history", icon: History, label: "Analysis History" },
    ],
  },
  {
    title: "Career Tools",
    items: [
      { to: "/job-match", icon: Briefcase, label: "Job Match" },
      { to: "/content-generator", icon: PenLine, label: "Career Content" },
      { to: "/career-hub", icon: Rocket, label: "Career Hub" },
    ],
  },
  {
    title: "Interview Practice",
    items: [
      { to: "/ai-chat", icon: Bot, label: "AI Career Assistant" },
      { to: "/interview-prep", icon: MessageSquareQuote, label: "Interview Prep" },
      { to: "/mock-interview", icon: Mic, label: "Mock Interview" },
    ],
  },
];

export function Sidebar({ isOpen, onClose }) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuth();
  const isPro = user?.isPro === true || user?.isAdmin === true;

  const navSections = [
    ...primaryNavSections,
    {
      title: "Plan & Billing",
      items: [
        {
          to: "/pricing",
          icon: Crown,
          label: isPro ? "CareerLens Pro" : "Upgrade to Pro",
        },
        {
          to: "/purchase",
          icon: CreditCard,
          label: "Buy AI Credits",
        },
      ],
    },
    {
      title: "Account",
      items: [
        { to: "/profile", icon: User, label: "My Profile" },
      ],
    },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-[#170d19]/55 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col overflow-hidden",
          "border-r border-[#e6d9df] bg-[#fffaf2] text-[#29182f]",
          "shadow-[8px_0_28px_rgba(48,32,56,0.05)]",
          "transition-[transform,background-color,border-color] duration-300 ease-in-out",
          "dark:border-white/[0.08] dark:bg-[#100b16] dark:text-[#f7f1fa]",
          "dark:shadow-[8px_0_28px_rgba(0,0,0,0.18)]",
          "lg:translate-x-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#e6d9df] px-5 dark:border-white/[0.08]">
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate("/");
            }}
            aria-label="CareerLens home"
            className="flex min-w-0 items-center gap-3 rounded-xl text-left transition-opacity hover:opacity-85"
          >
            <img
              src="/logo.png"
              alt="CareerLens logo"
              className="h-10 w-10 shrink-0 object-contain"
            />
            <span className="truncate text-xl font-bold tracking-tight text-[#29182f] dark:text-[#f7f1fa]">
              Career
              <span className="bg-gradient-to-r from-[#A17B37] via-[#B779A8] to-[#A855F7] bg-clip-text text-transparent">
                Lens
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-xl p-2 text-[#806f82] transition hover:bg-[#f2e8ef] hover:text-[#29182f] lg:hidden dark:text-[#b7a5ba] dark:hover:bg-white/[0.08] dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-3 py-5">
          {navSections.map((section, sectionIndex) => (
            <div
              key={section.title}
              className={sectionIndex > 0 ? "mt-6" : ""}
            >
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a879c] dark:text-[#8e7b94]">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "group relative flex min-h-10 items-center gap-3 rounded-xl border px-3 py-2.5 text-[13px] font-medium",
                        "transition-all duration-200",
                        isActive
                          ? "border-[#dfcbdc] bg-[#f1e6ef] text-[#4c3150] shadow-sm dark:border-[#76577c]/50 dark:bg-[#76577c]/20 dark:text-[#f5e8fa]"
                          : "border-transparent text-[#655568] hover:border-[#eadde6] hover:bg-[#f7efe9] hover:text-[#29182f] dark:text-[#c1b4c7] dark:hover:border-white/[0.07] dark:hover:bg-white/[0.05] dark:hover:text-white",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-[#8a668d] dark:bg-[#c2a0ce]" />
                        )}

                        <item.icon
                          className={cn(
                            "h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-105",
                            isActive
                              ? "text-[#79557e] dark:text-[#d5b6df]"
                              : "text-[#8a788e] group-hover:text-[#79557e] dark:text-[#a997b0] dark:group-hover:text-[#d5b6df]",
                          )}
                        />

                        <span className="min-w-0 flex-1">
                          {item.label}
                        </span>

                        {item.to === "/pricing" && !isPro && (
                          <span className="rounded-full bg-[#694B68] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                            Pro
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}

                {section.title === "Account" && (
                  <button
                    type="button"
                    onClick={() => {
                      setFeedbackOpen(true);
                      onClose();
                    }}
                    className="group flex min-h-10 w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left text-[13px] font-medium text-[#655568] transition-all duration-200 hover:border-[#eadde6] hover:bg-[#f7efe9] hover:text-[#29182f] dark:text-[#c1b4c7] dark:hover:border-white/[0.07] dark:hover:bg-white/[0.05] dark:hover:text-white"
                  >
                    <MessageSquareHeart className="h-[18px] w-[18px] shrink-0 text-[#8a668d] transition-transform duration-200 group-hover:scale-105 dark:text-[#c2a0ce]" />
                    <span>Send feedback</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-[#e6d9df] p-3 dark:border-white/[0.08]">
          <div className="rounded-2xl border border-[#e8dce6] bg-gradient-to-br from-[#f7eee7] to-[#f1e7f1] p-3.5 dark:border-white/[0.08] dark:from-[#211626] dark:to-[#19111f]">
            <div className="mb-2 flex items-center gap-2">
              {isPro ? (
                <Crown className="h-4 w-4 text-[#a17b37] dark:text-[#d5b56b]" />
              ) : (
                <Sparkles className="h-4 w-4 text-[#a17b37] dark:text-[#d5b56b]" />
              )}

              <p className="text-xs font-bold text-[#4c3150] dark:text-[#e7d5ed]">
                {isPro
                  ? "CareerLens Pro is active"
                  : "Unlock CareerLens Pro"}
              </p>
            </div>

            <p className="mb-3 text-[11px] leading-relaxed text-[#806f82] dark:text-[#b5a3ba]">
              {isPro
                ? "Explore your plan or add more AI credits whenever you need them."
                : "Get more career tools with the ₹499/month Pro subscription."}
            </p>

            <Link
              to={isPro ? "/purchase" : "/pricing"}
              onClick={onClose}
              className="flex min-h-9 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#694B68] to-[#8d688c] px-3 py-2 text-center text-xs font-bold text-white shadow-md transition hover:brightness-110"
            >
              {isPro ? (
                <CreditCard className="h-4 w-4" />
              ) : (
                <Crown className="h-4 w-4" />
              )}

              {isPro ? "Buy AI Credits" : "Explore Pro Plan"}
            </Link>
          </div>

          <p className="px-1 pt-3 text-center text-[10px] text-[#9a879c] dark:text-[#827187]">
            © 2026 CareerLens
          </p>
        </div>
      </aside>

      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </>
  );
}