// // import { useEffect, useState } from "react";
// // import { Link } from "react-router-dom";
// // import {
// //   AlertCircle,
// //   ArrowLeft,
// //   CreditCard,
// //   FileText,
// //   LoaderCircle,
// //   MessageSquare,
// //   RefreshCw,
// //   Search,
// //   ShieldCheck,
// //   Users,
// // } from "lucide-react";

// // import { useAuth } from "@/hooks/useAuth";
// // import { API_URL, TOKEN_KEY } from "@/utils/constants";

// // const TABS = [
// //   { id: "overview", label: "Overview" },
// //   { id: "users", label: "Users" },
// //   { id: "payments", label: "Payments" },
// //   { id: "feedback", label: "Feedback" },
// // ];

// // function moneyFromPaise(value) {
// //   return new Intl.NumberFormat("en-IN", {
// //     style: "currency",
// //     currency: "INR",
// //     maximumFractionDigits: 2,
// //   }).format((Number(value) || 0) / 100);
// // }

// // function formatDate(value) {
// //   if (!value) return "—";

// //   const date = new Date(value);

// //   return Number.isNaN(date.getTime())
// //     ? "—"
// //     : date.toLocaleString("en-IN", {
// //         dateStyle: "medium",
// //         timeStyle: "short",
// //       });
// // }

// // async function adminFetch(path) {
// //   const token = localStorage.getItem(TOKEN_KEY);

// //   const response = await fetch(`${API_URL}${path}`, {
// //     headers: {
// //       Accept: "application/json",
// //       ...(token ? { Authorization: `Bearer ${token}` } : {}),
// //     },
// //   });

// //   const body = await response.json().catch(() => ({}));

// //   if (!response.ok) {
// //     throw new Error(
// //       body.message ||
// //         body.error ||
// //         `Request failed (${response.status})`
// //     );
// //   }

// //   return body.data;
// // }

// // function MetricCard({ title, value, description, icon: Icon }) {
// //   return (
// //     <div className="rounded-2xl border border-[#e6d9df] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#15101b]">
// //       <div className="flex items-start justify-between gap-3">
// //         <div>
// //           <p className="text-sm text-[#806f82] dark:text-[#b7a5ba]">
// //             {title}
// //           </p>
// //           <p className="mt-2 break-words text-2xl font-black text-[#29182f] dark:text-[#f7f1fa]">
// //             {value}
// //           </p>
// //           <p className="mt-1 text-xs text-[#948399]">
// //             {description}
// //           </p>
// //         </div>

// //         <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f1e6ef] text-[#76516f] dark:bg-[#76577c]/20 dark:text-[#d5b6df]">
// //           <Icon className="h-5 w-5" />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function EmptyRow({ columns, message }) {
// //   return (
// //     <tr>
// //       <td
// //         colSpan={columns}
// //         className="px-4 py-12 text-center text-sm text-[#806f82]"
// //       >
// //         {message}
// //       </td>
// //     </tr>
// //   );
// // }

// // export function AdminDashboardPage() {
// //   const {
// //     user,
// //     isAuthenticated,
// //     isLoading: authLoading,
// //     loadUser,
// //   } = useAuth();

// //   const [authChecked, setAuthChecked] = useState(false);
// //   const [tab, setTab] = useState("overview");
// //   const [overview, setOverview] = useState(null);
// //   const [items, setItems] = useState([]);
// //   const [total, setTotal] = useState(0);
// //   const [page, setPage] = useState(1);
// //   const [searchInput, setSearchInput] = useState("");
// //   const [search, setSearch] = useState("");
// //   const [refreshCounter, setRefreshCounter] = useState(0);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     let mounted = true;

// //     Promise.resolve(loadUser()).finally(() => {
// //       if (mounted) setAuthChecked(true);
// //     });

// //     return () => {
// //       mounted = false;
// //     };
// //   }, [loadUser]);

// //   useEffect(() => {
// //     if (
// //       !authChecked ||
// //       !isAuthenticated ||
// //       user?.isAdmin !== true
// //     ) {
// //       return;
// //     }

// //     let cancelled = false;

// //     async function loadPanel() {
// //       setLoading(true);
// //       setError("");

// //       try {
// //         if (tab === "overview") {
// //           const result = await adminFetch("/admin/overview");

// //           if (!cancelled) {
// //             setOverview(result);
// //           }
// //         } else {
// //           const params = new URLSearchParams({
// //             page: String(page),
// //             limit: "25",
// //           });

// //           if (tab === "users" && search.trim()) {
// //             params.set("search", search.trim());
// //           }

// //           const result = await adminFetch(
// //             `/admin/${tab}?${params.toString()}`
// //           );

// //           if (!cancelled) {
// //             setItems(Array.isArray(result.items) ? result.items : []);
// //             setTotal(Number(result.total) || 0);
// //           }
// //         }
// //       } catch (err) {
// //         if (!cancelled) {
// //           setError(err.message || "Unable to load admin data.");
// //         }
// //       } finally {
// //         if (!cancelled) setLoading(false);
// //       }
// //     }

// //     void loadPanel();

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [
// //     authChecked,
// //     isAuthenticated,
// //     user?.isAdmin,
// //     tab,
// //     page,
// //     search,
// //     refreshCounter,
// //   ]);

// //   const totalPages = Math.max(1, Math.ceil(total / 25));

// //   if (!authChecked || authLoading) {
// //     return (
// //       <div className="flex min-h-[50vh] items-center justify-center text-[#76516f]">
// //         <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
// //         Checking admin access…
// //       </div>
// //     );
// //   }

// //   if (!isAuthenticated) {
// //     return (
// //       <div className="mx-auto max-w-xl rounded-2xl border border-[#e6d9df] bg-white p-8 text-center dark:border-white/10 dark:bg-[#15101b]">
// //         <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-[#76516f]" />
// //         <h1 className="text-xl font-bold">Admin sign-in required</h1>
// //         <p className="mt-2 text-sm text-[#806f82]">
// //           Sign in using the configured administrator account.
// //         </p>
// //         <Link
// //           className="mt-5 inline-flex rounded-xl bg-[#694B68] px-4 py-2 text-sm font-bold text-white"
// //           to="/login"
// //         >
// //           Sign in
// //         </Link>
// //       </div>
// //     );
// //   }

// //   if (user?.isAdmin !== true) {
// //     return (
// //       <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-8 text-center dark:border-red-900/50 dark:bg-[#15101b]">
// //         <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
// //         <h1 className="text-xl font-bold">Access denied</h1>
// //         <p className="mt-2 text-sm text-[#806f82]">
// //           This account is not the configured administrator.
// //           Set ADMIN_EMAIL in backend/.env to the same email as
// //           the account you use to sign in, restart the backend,
// //           and sign in again.
// //         </p>
// //         <Link
// //           className="mt-5 inline-flex items-center rounded-xl border border-[#e6d9df] px-4 py-2 text-sm font-bold dark:border-white/10"
// //           to="/dashboard"
// //         >
// //           <ArrowLeft className="mr-2 h-4 w-4" />
// //           Back to dashboard
// //         </Link>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="mx-auto w-full max-w-[1500px] space-y-6">
// //       <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// //         <div>
// //           <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#76516f]/20 bg-[#76516f]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#694B68] dark:text-[#dfc3e5]">
// //             <ShieldCheck className="h-3.5 w-3.5" />
// //             Admin Console
// //           </div>

// //           <h1 className="text-2xl font-black tracking-tight text-[#29182f] dark:text-[#f7f1fa] sm:text-3xl">
// //             CareerLens Administration
// //           </h1>

// //           <p className="mt-1 text-sm text-[#806f82] dark:text-[#b7a5ba]">
// //             Signed in as {user.email}. This panel is read-only.
// //           </p>
// //         </div>

// //         <button
// //           type="button"
// //           onClick={() => setRefreshCounter((value) => value + 1)}
// //           className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e6d9df] bg-white px-4 text-sm font-semibold text-[#60455f] hover:bg-[#f7eff6] dark:border-white/10 dark:bg-[#15101b] dark:text-[#e8d9eb]"
// //         >
// //           <RefreshCw
// //             className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
// //           />
// //           Refresh
// //         </button>
// //       </header>

// //       <div className="flex flex-wrap gap-2 border-b border-[#e6d9df] pb-3 dark:border-white/10">
// //         {TABS.map((item) => (
// //           <button
// //             key={item.id}
// //             type="button"
// //             onClick={() => {
// //               setTab(item.id);
// //               setPage(1);
// //               setError("");
// //             }}
// //             className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
// //               tab === item.id
// //                 ? "bg-[#694B68] text-white shadow-sm"
// //                 : "text-[#806f82] hover:bg-white hover:text-[#29182f] dark:text-[#b7a5ba] dark:hover:bg-white/[0.05] dark:hover:text-white"
// //             }`}
// //           >
// //             {item.label}
// //           </button>
// //         ))}
// //       </div>

// //       {tab !== "overview" && tab === "users" && (
// //         <form
// //           onSubmit={(event) => {
// //             event.preventDefault();
// //             setSearch(searchInput.trim());
// //             setPage(1);
// //           }}
// //           className="flex w-full gap-2 sm:max-w-md"
// //         >
// //           <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#e6d9df] bg-white px-3 dark:border-white/10 dark:bg-[#15101b]">
// //             <Search className="h-4 w-4 shrink-0 text-[#948399]" />
// //             <input
// //               value={searchInput}
// //               onChange={(event) => setSearchInput(event.target.value)}
// //               placeholder="Search name or email"
// //               className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none"
// //             />
// //           </div>
// //           <button
// //             type="submit"
// //             className="rounded-xl bg-[#694B68] px-4 py-2 text-sm font-bold text-white"
// //           >
// //             Search
// //           </button>
// //         </form>
// //       )}

// //       {error && (
// //         <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
// //           <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
// //           {error}
// //         </div>
// //       )}

// //       {loading && (
// //         <div className="flex items-center gap-2 py-8 text-sm text-[#806f82]">
// //           <LoaderCircle className="h-4 w-4 animate-spin" />
// //           Loading admin data…
// //         </div>
// //       )}

// //       {!loading && tab === "overview" && overview && (
// //         <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
// //           <MetricCard
// //             title="Registered users"
// //             value={overview.totalUsers ?? 0}
// //             description="All CareerLens accounts"
// //             icon={Users}
// //           />
// //           <MetricCard
// //             title="Pro users"
// //             value={overview.proUsers ?? 0}
// //             description="Accounts currently flagged as Pro"
// //             icon={ShieldCheck}
// //           />
// //           <MetricCard
// //             title="Free users"
// //             value={overview.freeUsers ?? 0}
// //             description="Accounts not flagged as Pro"
// //             icon={Users}
// //           />
// //           <MetricCard
// //             title="Resume records"
// //             value={overview.totalResumes ?? 0}
// //             description="Uploaded resume records"
// //             icon={FileText}
// //           />
// //           <MetricCard
// //             title="Payment records"
// //             value={overview.verifiedPayments ?? 0}
// //             description="Payment records stored by CareerLens"
// //             icon={CreditCard}
// //           />
// //           <MetricCard
// //             title="Payment total"
// //             value={moneyFromPaise(overview.verifiedPaymentAmountPaise)}
// //             description="Stored records; not a settlement report"
// //             icon={CreditCard}
// //           />
// //           <MetricCard
// //             title="Feedback entries"
// //             value={overview.totalFeedback ?? 0}
// //             description="Saved feedback submissions"
// //             icon={MessageSquare}
// //           />
// //         </div>
// //       )}

// //       {!loading && tab === "users" && (
// //         <div className="overflow-x-auto rounded-2xl border border-[#e6d9df] bg-white dark:border-white/10 dark:bg-[#15101b]">
// //           <table className="min-w-full text-left text-sm">
// //             <thead className="bg-[#f7eff6] text-xs uppercase tracking-wide text-[#806f82] dark:bg-white/[0.04] dark:text-[#b7a5ba]">
// //               <tr>
// //                 <th className="px-4 py-3">User</th>
// //                 <th className="px-4 py-3">Role</th>
// //                 <th className="px-4 py-3">Plan</th>
// //                 <th className="px-4 py-3">AI Credits</th>
// //                 <th className="px-4 py-3">Created</th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-[#eee4eb] dark:divide-white/[0.06]">
// //               {items.map((item) => (
// //                 <tr key={item.id}>
// //                   <td className="px-4 py-4">
// //                     <p className="font-semibold">{item.name}</p>
// //                     <p className="text-xs text-[#88758B]">{item.email}</p>
// //                   </td>
// //                   <td className="px-4 py-4 capitalize">
// //                     {String(item.role || "member").replace(/_/g, " ")}
// //                   </td>
// //                   <td className="px-4 py-4">
// //                     <span
// //                       className={`rounded-full px-2.5 py-1 text-xs font-bold ${
// //                         item.isPro
// //                           ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
// //                           : "bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-gray-300"
// //                       }`}
// //                     >
// //                       {item.isPro ? "Pro" : "Free"}
// //                     </span>
// //                   </td>
// //                   <td className="px-4 py-4">{item.aiCredits ?? 0}</td>
// //                   <td className="whitespace-nowrap px-4 py-4 text-xs text-[#806f82]">
// //                     {formatDate(item.createdAt)}
// //                   </td>
// //                 </tr>
// //               ))}
// //               {!items.length && (
// //                 <EmptyRow columns={5} message="No users found." />
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}

// //       {!loading && tab === "payments" && (
// //         <div className="overflow-x-auto rounded-2xl border border-[#e6d9df] bg-white dark:border-white/10 dark:bg-[#15101b]">
// //           <table className="min-w-full text-left text-sm">
// //             <thead className="bg-[#f7eff6] text-xs uppercase tracking-wide text-[#806f82] dark:bg-white/[0.04] dark:text-[#b7a5ba]">
// //               <tr>
// //                 <th className="px-4 py-3">Payment ID</th>
// //                 <th className="px-4 py-3">Customer</th>
// //                 <th className="px-4 py-3">Plan/Pack</th>
// //                 <th className="px-4 py-3">Amount</th>
// //                 <th className="px-4 py-3">Credits</th>
// //                 <th className="px-4 py-3">Created</th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-[#eee4eb] dark:divide-white/[0.06]">
// //               {items.map((item) => (
// //                 <tr key={item.id}>
// //                   <td className="whitespace-nowrap px-4 py-4 font-mono text-xs">
// //                     {item.paymentId}
// //                   </td>
// //                   <td className="px-4 py-4">
// //                     <p>{item.user?.name || "Unknown user"}</p>
// //                     <p className="text-xs text-[#88758B]">
// //                       {item.user?.email || item.userId}
// //                     </p>
// //                   </td>
// //                   <td className="px-4 py-4">{item.planId}</td>
// //                   <td className="whitespace-nowrap px-4 py-4 font-semibold">
// //                     {moneyFromPaise(item.amount)}
// //                   </td>
// //                   <td className="px-4 py-4">{item.credits}</td>
// //                   <td className="whitespace-nowrap px-4 py-4 text-xs text-[#806f82]">
// //                     {formatDate(item.createdAt)}
// //                   </td>
// //                 </tr>
// //               ))}
// //               {!items.length && (
// //                 <EmptyRow columns={6} message="No payment records found." />
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}

// //       {!loading && tab === "feedback" && (
// //         <div className="overflow-x-auto rounded-2xl border border-[#e6d9df] bg-white dark:border-white/10 dark:bg-[#15101b]">
// //           <table className="min-w-full text-left text-sm">
// //             <thead className="bg-[#f7eff6] text-xs uppercase tracking-wide text-[#806f82] dark:bg-white/[0.04] dark:text-[#b7a5ba]">
// //               <tr>
// //                 <th className="px-4 py-3">Rating</th>
// //                 <th className="px-4 py-3">User</th>
// //                 <th className="px-4 py-3">Comment</th>
// //                 <th className="px-4 py-3">Submitted</th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-[#eee4eb] dark:divide-white/[0.06]">
// //               {items.map((item) => (
// //                 <tr key={item.id}>
// //                   <td className="whitespace-nowrap px-4 py-4 font-bold text-[#a17b37]">
// //                     {item.rating}/5 ★
// //                   </td>
// //                   <td className="px-4 py-4">
// //                     <p>{item.user?.name || "Unknown user"}</p>
// //                     <p className="text-xs text-[#88758B]">
// //                       {item.user?.email || item.userId}
// //                     </p>
// //                   </td>
// //                   <td className="max-w-xl whitespace-pre-wrap px-4 py-4">
// //                     {item.comment || "(No comment)"}
// //                   </td>
// //                   <td className="whitespace-nowrap px-4 py-4 text-xs text-[#806f82]">
// //                     {formatDate(item.createdAt)}
// //                   </td>
// //                 </tr>
// //               ))}
// //               {!items.length && (
// //                 <EmptyRow columns={4} message="No feedback entries found." />
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}

// //       {!loading && tab !== "overview" && total > 0 && (
// //         <div className="flex items-center justify-between gap-3">
// //           <p className="text-xs text-[#88758B]">
// //             Showing {Math.min((page - 1) * 25 + 1, total)}–
// //             {Math.min(page * 25, total)} of {total}
// //           </p>
// //           <div className="flex gap-2">
// //             <button
// //               type="button"
// //               disabled={page <= 1}
// //               onClick={() => setPage((value) => Math.max(1, value - 1))}
// //               className="rounded-xl border border-[#e6d9df] px-3 py-2 text-sm disabled:opacity-40 dark:border-white/10"
// //             >
// //               Previous
// //             </button>
// //             <button
// //               type="button"
// //               disabled={page >= totalPages}
// //               onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
// //               className="rounded-xl border border-[#e6d9df] px-3 py-2 text-sm disabled:opacity-40 dark:border-white/10"
// //             >
// //               Next
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       <p className="text-xs leading-5 text-[#948399] dark:text-[#9c8da2]">
// //         Read-only admin console. Payment totals include records saved
// //         by CareerLens; they do not show settlements, refunds or
// //         chargebacks from Razorpay.
// //       </p>
// //     </div>
// //   );
// // }



































// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Activity,
//   AlertTriangle,
//   Ban,
//   ChevronLeft,
//   ChevronRight,
//   CircleDollarSign,
//   Clock3,
//   Coins,
//   CreditCard,
//   Crown,
//   FileText,
//   History,
//   LayoutDashboard,
//   LifeBuoy,
//   LoaderCircle,
//   LockKeyhole,
//   LogOut,
//   MessageSquare,
//   RefreshCw,
//   RotateCcw,
//   Search,
//   ShieldCheck,
//   Users,
//   Wallet,
//   X,
// } from "lucide-react";
// import { toast } from "sonner";

// import { useAuth } from "@/hooks/useAuth";
// import { API_URL, TOKEN_KEY } from "@/utils/constants";

// const PAGE_SIZE = 25;

// const NAV = [
//   { id: "overview", label: "Overview", icon: LayoutDashboard },
//   { id: "users", label: "Users", icon: Users },
//   { id: "payments", label: "Payments & refunds", icon: Wallet },
//   { id: "feedback", label: "Feedback inbox", icon: MessageSquare },
//   { id: "audit", label: "Audit log", icon: History },
// ];

// const money = (paise) =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 2,
//   }).format((Number(paise) || 0) / 100);

// const dateText = (value) => {
//   if (!value) return "—";
//   const date = new Date(value);
//   return Number.isNaN(date.getTime())
//     ? "—"
//     : date.toLocaleString("en-IN", {
//         dateStyle: "medium",
//         timeStyle: "short",
//       });
// };

// const humanize = (value) =>
//   String(value || "—")
//     .replace(/[._]/g, " ")
//     .replace(/\b\w/g, (letter) => letter.toUpperCase());

// async function adminRequest(path, options = {}) {
//   const token = localStorage.getItem(TOKEN_KEY);

//   const response = await fetch(`${API_URL}${path}`, {
//     method: options.method || "GET",
//     headers: {
//       Accept: "application/json",
//       ...(options.body !== undefined
//         ? { "Content-Type": "application/json" }
//         : {}),
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//     ...(options.body !== undefined
//       ? { body: JSON.stringify(options.body) }
//       : {}),
//   });

//   const result = await response.json().catch(() => ({}));

//   if (!response.ok) {
//     throw new Error(
//       result.message || `Request failed (${response.status})`
//     );
//   }

//   return result.data;
// }

// function Panel({ children, className = "" }) {
//   return (
//     <section
//       className={`rounded-2xl border border-[#e8dce5] bg-white shadow-sm dark:border-white/10 dark:bg-[#15101b] ${className}`}
//     >
//       {children}
//     </section>
//   );
// }

// function Pill({ children, tone = "neutral" }) {
//   const colors = {
//     neutral:
//       "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200",
//     green:
//       "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
//     amber:
//       "bg-amber-50 text-amber-800 dark:bg-amber-900/25 dark:text-amber-200",
//     red:
//       "bg-rose-50 text-rose-700 dark:bg-rose-900/25 dark:text-rose-200",
//     plum:
//       "bg-[#f3e9f2] text-[#76516f] dark:bg-[#76516f]/20 dark:text-[#e1c6e5]",
//     blue:
//       "bg-blue-50 text-blue-700 dark:bg-blue-900/25 dark:text-blue-200",
//   };

//   return (
//     <span
//       className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${colors[tone] || colors.neutral}`}
//     >
//       {children}
//     </span>
//   );
// }

// function DataTable({ children }) {
//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full text-left text-sm">{children}</table>
//     </div>
//   );
// }

// function HeadCell({ children }) {
//   return (
//     <th className="whitespace-nowrap bg-[#faf5fa] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#88778c] dark:bg-white/[0.035] dark:text-[#b8a8bd]">
//       {children}
//     </th>
//   );
// }

// function Cell({ children, className = "" }) {
//   return (
//     <td className={`px-4 py-3.5 align-middle ${className}`}>
//       {children}
//     </td>
//   );
// }

// function Empty({ title, detail }) {
//   return (
//     <div className="px-5 py-10 text-center">
//       <p className="font-bold text-[#47344c] dark:text-white">{title}</p>
//       {detail && (
//         <p className="mt-1 text-xs text-[#928297] dark:text-[#a99aad]">
//           {detail}
//         </p>
//       )}
//     </div>
//   );
// }

// function Metric({ title, value, detail, icon: Icon, tone = "plum" }) {
//   const tones = {
//     plum: "bg-[#f3e9f2] text-[#76516f] dark:bg-[#76516f]/20 dark:text-[#e1c6e5]",
//     gold: "bg-[#fbf1d8] text-[#a47a2d] dark:bg-[#a47a2d]/15 dark:text-[#e7c77f]",
//     green: "bg-[#e0f5eb] text-[#16805b] dark:bg-[#16805b]/15 dark:text-[#8ce0bb]",
//     blue: "bg-[#e6efff] text-[#3767b0] dark:bg-[#3767b0]/15 dark:text-[#a7c7ff]",
//     rose: "bg-[#ffeaec] text-[#aa4051] dark:bg-[#aa4051]/15 dark:text-[#f4a8b2]",
//   };

//   return (
//     <Panel className="p-4 sm:p-5">
//       <div className="flex items-start justify-between gap-3">
//         <div className="min-w-0">
//           <p className="text-sm text-[#88778c] dark:text-[#b8a8bd]">
//             {title}
//           </p>
//           <p className="mt-2 break-words text-2xl font-black text-[#29182f] dark:text-white">
//             {value}
//           </p>
//           <p className="mt-1 text-xs text-[#96869a] dark:text-[#a99aad]">
//             {detail}
//           </p>
//         </div>
//         <span
//           className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[tone] || tones.plum}`}
//         >
//           <Icon className="h-5 w-5" />
//         </span>
//       </div>
//     </Panel>
//   );
// }

// function Pagination({ page, total, totalPages, onPage }) {
//   if (!total) return null;

//   const start = (page - 1) * PAGE_SIZE + 1;
//   const end = Math.min(page * PAGE_SIZE, total);

//   return (
//     <div className="flex items-center justify-between gap-3 border-t border-[#eee4eb] px-4 py-3 dark:border-white/10">
//       <p className="text-xs text-[#938397]">
//         Showing {start}–{end} of {total}
//       </p>
//       <div className="flex gap-2">
//         <button
//           disabled={page <= 1}
//           onClick={() => onPage((value) => Math.max(1, value - 1))}
//           className="inline-flex items-center gap-1 rounded-lg border border-[#e8dce5] px-3 py-2 text-xs font-bold disabled:opacity-40 dark:border-white/10"
//         >
//           <ChevronLeft className="h-3.5 w-3.5" /> Previous
//         </button>
//         <button
//           disabled={page >= totalPages}
//           onClick={() => onPage((value) => Math.min(totalPages, value + 1))}
//           className="inline-flex items-center gap-1 rounded-lg border border-[#e8dce5] px-3 py-2 text-xs font-bold disabled:opacity-40 dark:border-white/10"
//         >
//           Next <ChevronRight className="h-3.5 w-3.5" />
//         </button>
//       </div>
//     </div>
//   );
// }

// export function AdminDashboardPage() {
//   const {
//     user,
//     isAuthenticated,
//     isLoading: authLoading,
//     loadUser,
//     logout,
//   } = useAuth();

//   const [authChecked, setAuthChecked] = useState(false);
//   const [tab, setTab] = useState("overview");
//   const [overview, setOverview] = useState(null);
//   const [items, setItems] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");
//   const [refreshCounter, setRefreshCounter] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [action, setAction] = useState(null);
//   const [delta, setDelta] = useState("5");
//   const [reason, setReason] = useState("");
//   const [refundAmount, setRefundAmount] = useState("");

//   useEffect(() => {
//     let mounted = true;

//     Promise.resolve(loadUser())
//       .catch(() => {})
//       .finally(() => {
//         if (mounted) setAuthChecked(true);
//       });

//     return () => {
//       mounted = false;
//     };
//   }, [loadUser]);

//   useEffect(() => {
//     if (!authChecked || !isAuthenticated || user?.isAdmin !== true) {
//       return;
//     }

//     let cancelled = false;

//     async function loadPanel() {
//       setLoading(true);
//       setError("");

//       try {
//         if (tab === "overview") {
//           const data = await adminRequest("/admin/overview");
//           if (!cancelled) setOverview(data);
//         } else {
//           const params = new URLSearchParams({
//             page: String(page),
//             limit: String(PAGE_SIZE),
//           });

//           if (tab === "users" && search.trim()) {
//             params.set("search", search.trim());
//           }

//           const endpoint = tab === "audit" ? "audit-log" : tab;
//           const data = await adminRequest(
//             `/admin/${endpoint}?${params.toString()}`
//           );

//           if (!cancelled) {
//             setItems(Array.isArray(data.items) ? data.items : []);
//             setTotal(Number(data.total) || 0);
//           }
//         }
//       } catch (err) {
//         if (!cancelled) {
//           setError(err.message || "Unable to load admin data.");
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     void loadPanel();

//     return () => {
//       cancelled = true;
//     };
//   }, [
//     authChecked,
//     isAuthenticated,
//     user?.isAdmin,
//     tab,
//     page,
//     search,
//     refreshCounter,
//   ]);

//   const currentNav = NAV.find((item) => item.id === tab) || NAV[0];
//   const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
//   const refresh = () => setRefreshCounter((value) => value + 1);

//   function openUserAction(type, item) {
//     setAction({ type, item });
//     setReason("");
//     setDelta(type === "credits" ? "5" : "");
//   }

//   function openRefund(item) {
//     const remainingPaise = Math.max(
//       0,
//       Number(item.amount || 0) - Number(item.refundedAmount || 0)
//     );

//     setAction({ type: "refund", item, remainingPaise });
//     setRefundAmount((remainingPaise / 100).toFixed(2));
//     setReason("");
//   }

//   async function submitUserAction(event) {
//     event.preventDefault();
//     if (!action?.item) return;

//     const clean = reason.trim();

//     if (clean.length < 3) {
//       toast.error("Enter a reason of at least 3 characters.");
//       return;
//     }

//     setActionLoading(true);

//     try {
//       const { item, type } = action;
//       let result;

//       if (type === "credits") {
//         const amount = Number(delta);

//         if (
//           !Number.isSafeInteger(amount) ||
//           amount === 0 ||
//           Math.abs(amount) > 5000
//         ) {
//           toast.error("Enter a whole number between -5000 and 5000, excluding 0.");
//           setActionLoading(false);
//           return;
//         }

//         result = await adminRequest(`/admin/users/${item.id}/credits`, {
//           method: "POST",
//           body: { delta: amount, reason: clean },
//         });
//       } else if (type === "pro") {
//         result = await adminRequest(`/admin/users/${item.id}/pro`, {
//           method: "PATCH",
//           body: { isPro: !item.isPro, reason: clean },
//         });
//       } else if (type === "suspension") {
//         result = await adminRequest(
//           `/admin/users/${item.id}/suspension`,
//           {
//             method: "PATCH",
//             body: { suspended: !item.isSuspended, reason: clean },
//           }
//         );
//       }

//       toast.success(result?.message || "Admin action completed.");
//       setAction(null);
//       refresh();
//     } catch (err) {
//       toast.error(err.message || "Unable to complete admin action.");
//     } finally {
//       setActionLoading(false);
//     }
//   }

//   async function submitRefund(event) {
//     event.preventDefault();
//     if (!action?.item) return;

//     const amountPaise = Math.round(Number(refundAmount) * 100);
//     const clean = reason.trim();

//     if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) {
//       toast.error("Enter a valid refund amount.");
//       return;
//     }

//     if (amountPaise > action.remainingPaise) {
//       toast.error("Refund exceeds the remaining refundable amount.");
//       return;
//     }

//     if (clean.length < 5) {
//       toast.error("Enter a refund reason of at least 5 characters.");
//       return;
//     }

//     const item = action.item;
//     const confirmed = window.confirm(
//       `Submit a Razorpay refund of ${money(amountPaise)} for payment ${item.paymentId}? This action cannot be undone.`
//     );

//     if (!confirmed) return;

//     setActionLoading(true);

//     try {
//       const result = await adminRequest(
//         `/admin/payments/${encodeURIComponent(item.paymentId)}/refund`,
//         {
//           method: "POST",
//           body: { amountPaise, reason: clean },
//         }
//       );

//       toast.success(result?.message || "Refund request submitted.");
//       setAction(null);
//       refresh();
//     } catch (err) {
//       toast.error(err.message || "Unable to submit refund.");
//     } finally {
//       setActionLoading(false);
//     }
//   }

//   async function syncRefund(item) {
//     try {
//       const result = await adminRequest(
//         `/admin/payments/${encodeURIComponent(item.paymentId)}/refund-status`,
//         { method: "POST", body: {} }
//       );

//       toast.success(result?.message || "Refund status synced.");
//       refresh();
//     } catch (err) {
//       toast.error(err.message || "Unable to sync refund status.");
//     }
//   }

//   async function updateFeedback(item, status) {
//     const reasonText =
//       status === "resolved"
//         ? "Admin marked feedback resolved"
//         : status === "in_review"
//           ? "Admin started reviewing feedback"
//           : "Admin reopened feedback";

//     try {
//       await adminRequest(`/admin/feedback/${item.id}/status`, {
//         method: "PATCH",
//         body: { status, reason: reasonText },
//       });

//       toast.success(`Feedback marked ${humanize(status).toLowerCase()}.`);
//       refresh();
//     } catch (err) {
//       toast.error(err.message || "Unable to update feedback.");
//     }
//   }

//   if (!authChecked || authLoading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center text-[#76516f]">
//         <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
//         Checking admin access…
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return (
//       <div className="mx-auto max-w-xl rounded-3xl border border-[#e6d9df] bg-white p-8 text-center dark:border-white/10 dark:bg-[#15101b]">
//         <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-[#76516f]" />
//         <h1 className="text-xl font-bold">Admin sign-in required</h1>
//         <p className="mt-2 text-sm text-[#806f82]">
//           Sign in with the configured administrator account to continue.
//         </p>
//         <Link
//           className="mt-5 inline-flex rounded-xl bg-[#694B68] px-4 py-2 text-sm font-bold text-white"
//           to="/login"
//         >
//           Sign in
//         </Link>
//       </div>
//     );
//   }

//   if (user?.isAdmin !== true) {
//     return (
//       <div className="mx-auto max-w-xl rounded-3xl border border-rose-200 bg-white p-8 text-center dark:border-rose-900/50 dark:bg-[#15101b]">
//         <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-rose-500" />
//         <h1 className="text-xl font-bold">Access denied</h1>
//         <p className="mt-2 text-sm text-[#806f82]">
//           This account is not configured as the CareerLens administrator.
//           Check ADMIN_EMAIL in backend/.env and sign in again.
//         </p>
//         <Link
//           className="mt-5 inline-flex items-center rounded-xl border border-[#e6d9df] px-4 py-2 text-sm font-bold dark:border-white/10"
//           to="/dashboard"
//         >
//           <ChevronLeft className="mr-2 h-4 w-4" />
//           Back to dashboard
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto w-full max-w-[1600px] text-[#29182f] dark:text-[#faf5fc]">
//       <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
//         <div>
//           <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#76516f]/20 bg-[#76516f]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#694B68] dark:text-[#dfc3e5]">
//             <ShieldCheck className="h-3.5 w-3.5" />
//             CareerLens · Admin workspace
//           </span>
//           <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
//             Control Center<span className="text-[#b58b49]">.</span>
//           </h1>
//           <p className="mt-2 max-w-2xl text-sm leading-6 text-[#88778c] dark:text-[#b8a8bd]">
//             Manage accounts, credits, access, transactions and support from
//             one secure workspace.
//           </p>
//           <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#88778c] dark:text-[#b8a8bd]">
//             <Pill tone="green">Admin verified</Pill>
//             <span className="rounded-full border border-[#e8dce5] px-2.5 py-1 dark:border-white/10">
//               {user?.email}
//             </span>
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           <button
//             onClick={refresh}
//             disabled={loading}
//             className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#e8dce5] bg-white px-4 text-sm font-bold text-[#60455f] hover:bg-[#faf5fa] disabled:opacity-60 dark:border-white/10 dark:bg-[#15101b] dark:text-[#e8d9eb]"
//           >
//             <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
//             Refresh
//           </button>
//           <button
//             onClick={() => {
//               logout();
//               window.location.assign("/login");
//             }}
//             className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#694B68] px-4 text-sm font-bold text-white hover:bg-[#7a5b7a]"
//           >
//             <LogOut className="h-4 w-4" /> Logout
//           </button>
//         </div>
//       </header>

//       <div className="grid gap-5 lg:grid-cols-[232px_minmax(0,1fr)] xl:gap-6">
//         <aside className="h-fit rounded-2xl border border-[#e8dce5] bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#15101b] lg:sticky lg:top-5">
//           <p className="px-3 pb-2 pt-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#a08ea4]">
//             Administration
//           </p>
//           <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
//             {NAV.map((item) => {
//               const Icon = item.icon;
//               const selected = tab === item.id;

//               return (
//                 <button
//                   key={item.id}
//                   onClick={() => {
//                     setTab(item.id);
//                     setPage(1);
//                     setError("");
//                   }}
//                   className={`flex min-w-max items-center gap-3 rounded-xl px-3 py-3 text-left transition lg:w-full ${
//                     selected
//                       ? "bg-[#f2e7f1] text-[#5f3e60] dark:bg-[#76516f]/25 dark:text-[#f0dcf3]"
//                       : "text-[#88778c] hover:bg-[#faf5fa] dark:text-[#b8a8bd] dark:hover:bg-white/[0.05]"
//                   }`}
//                 >
//                   <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#faf5fa] dark:bg-white/[0.04]">
//                     <Icon className="h-4 w-4" />
//                   </span>
//                   <span className="whitespace-nowrap text-sm font-bold">
//                     {item.label}
//                   </span>
//                 </button>
//               );
//             })}
//           </nav>

//           <div className="mt-4 rounded-xl border border-[#eee2e9] bg-[#fffaf5] p-3 dark:border-white/10 dark:bg-white/[0.03]">
//             <div className="flex items-center gap-2 text-xs font-bold">
//               <LockKeyhole className="h-4 w-4 text-[#8e688f]" />
//               Secure operations
//             </div>
//             <p className="mt-1.5 text-[11px] leading-5 text-[#938397] dark:text-[#aa9aaf]">
//               Sensitive changes require a reason and are written to the audit
//               log.
//             </p>
//           </div>
//         </aside>

//         <main className="min-w-0 space-y-5">
//           <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
//             <div>
//               <p className="text-xs font-semibold text-[#a08ea4]">
//                 Admin / {currentNav.label}
//               </p>
//               <h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">
//                 {tab === "overview" ? "Platform overview" : currentNav.label}
//               </h2>
//               <p className="mt-1 text-sm text-[#88778c] dark:text-[#b8a8bd]">
//                 {tab === "overview"
//                   ? "A current snapshot of the CareerLens platform."
//                   : "Review records and perform authorized admin actions."}
//               </p>
//             </div>
//             {tab !== "overview" && (
//               <p className="text-xs text-[#a08ea4]">
//                 {total.toLocaleString("en-IN")} records · Page {page} of{" "}
//                 {totalPages}
//               </p>
//             )}
//           </div>

//           {error && (
//             <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-200">
//               <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
//               {error}
//             </div>
//           )}

//           {loading && (
//             <div className="flex items-center gap-2 rounded-xl border border-[#e8dce5] bg-white p-4 text-sm text-[#806f82] dark:border-white/10 dark:bg-[#15101b]">
//               <LoaderCircle className="h-4 w-4 animate-spin" />
//               Loading latest data…
//             </div>
//           )}

//           {!loading && tab === "overview" && overview && (
//             <>
//               <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
//                 <Metric title="Total users" value={overview.totalUsers || 0} detail="Registered accounts" icon={Users} />
//                 <Metric title="Pro members" value={overview.proUsers || 0} detail={`${overview.freeUsers || 0} Free accounts`} icon={Crown} tone="gold" />
//                 <Metric title="Net recorded payments" value={money(overview.netStoredAmountPaise)} detail={`${money(overview.refundedAmountPaise)} refunded`} icon={CircleDollarSign} tone="green" />
//                 <Metric title="Resume records" value={overview.totalResumes || 0} detail="Uploaded resumes" icon={FileText} tone="blue" />
//                 <Metric title="Verified payments" value={overview.verifiedPayments || 0} detail="Stored payment records" icon={CreditCard} tone="green" />
//                 <Metric title="Feedback" value={overview.totalFeedback || 0} detail="User submissions" icon={MessageSquare} tone="blue" />
//                 <Metric title="Suspended users" value={overview.suspendedUsers || 0} detail="Accounts restricted" icon={Ban} tone="rose" />
//                 <Metric title="Refunds pending" value={overview.pendingRefunds || 0} detail="Status may need syncing" icon={Clock3} tone="gold" />
//               </div>

//               <div className="grid gap-4 xl:grid-cols-2">
//                 <Panel className="p-5">
//                   <h3 className="font-black">Quick actions</h3>
//                   <p className="mt-1 text-xs text-[#938397]">
//                     Jump to common administrative tasks.
//                   </p>
//                   <div className="mt-4 grid gap-3 sm:grid-cols-2">
//                     {[
//                       { tab: "users", label: "Manage users", icon: Users },
//                       { tab: "payments", label: "Payments & refunds", icon: Wallet },
//                       { tab: "feedback", label: "Resolve feedback", icon: LifeBuoy },
//                       { tab: "audit", label: "View audit log", icon: History },
//                     ].map((item) => {
//                       const Icon = item.icon;
//                       return (
//                         <button
//                           key={item.tab}
//                           onClick={() => {
//                             setTab(item.tab);
//                             setPage(1);
//                           }}
//                           className="flex items-center gap-3 rounded-xl border border-[#eee2e9] p-3 text-left text-sm font-bold hover:bg-[#fcf7fc] dark:border-white/10 dark:hover:bg-white/[0.04]"
//                         >
//                           <Icon className="h-5 w-5 text-[#76516f]" />
//                           {item.label}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </Panel>

//                 <Panel className="p-5">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="font-black">Recent admin activity</h3>
//                       <p className="mt-1 text-xs text-[#938397]">
//                         Latest recorded administrative changes.
//                       </p>
//                     </div>
//                     <History className="h-5 w-5 text-[#8e688f]" />
//                   </div>
//                   <div className="mt-4 space-y-3">
//                     {(overview.recentAudit || []).length ? (
//                       overview.recentAudit.map((entry) => (
//                         <div
//                           key={entry.id}
//                           className="border-b border-[#f0e7ee] pb-3 last:border-0 dark:border-white/[0.06]"
//                         >
//                           <p className="text-xs font-bold">
//                             {humanize(entry.action)}
//                           </p>
//                           <p className="mt-1 text-xs text-[#938397]">
//                             {entry.reason}
//                           </p>
//                           <p className="mt-1 text-[10px] text-[#a08ea4]">
//                             {formatDate(entry.createdAt)}
//                           </p>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="py-5 text-sm text-[#938397]">
//                         No admin actions recorded yet.
//                       </p>
//                     )}
//                   </div>
//                   <button
//                     onClick={() => setTab("audit")}
//                     className="mt-3 text-xs font-bold text-[#76516f] hover:underline dark:text-[#d5b6df]"
//                   >
//                     View full audit log →
//                   </button>
//                 </Panel>
//               </div>

//               <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs leading-5 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">
//                 <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
//                 <p>
//                   Payment totals use locally stored payment records; they are
//                   not Razorpay settlement reports. Check Razorpay for the latest
//                   provider-side refund status.
//                 </p>
//               </div>
//             </>
//           )}

//           {!loading && tab === "users" && (
//             <Panel className="overflow-hidden">
//               <div className="flex flex-col gap-3 border-b border-[#eee4eb] p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                   <h3 className="font-black">User directory</h3>
//                   <p className="mt-1 text-xs text-[#938397]">
//                     Manage AI credits, Pro access and account status.
//                   </p>
//                 </div>
//                 <form
//                   onSubmit={(event) => {
//                     event.preventDefault();
//                     setSearch(searchInput.trim());
//                     setPage(1);
//                   }}
//                   className="flex w-full gap-2 sm:max-w-md"
//                 >
//                   <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#e8dce5] bg-[#fffaf5] px-3 dark:border-white/10 dark:bg-white/[0.03]">
//                     <Search className="h-4 w-4 shrink-0 text-[#a08ea4]" />
//                     <input
//                       value={searchInput}
//                       onChange={(event) => setSearchInput(event.target.value)}
//                       placeholder="Search name or email"
//                       className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none"
//                     />
//                   </div>
//                   <button
//                     type="submit"
//                     className="rounded-xl bg-[#694B68] px-4 py-2 text-sm font-bold text-white hover:bg-[#7a5b7a]"
//                   >
//                     Search
//                   </button>
//                 </form>
//               </div>

//               <DataTable>
//                 <thead>
//                   <tr>
//                     <HeadCell>User</HeadCell>
//                     <HeadCell>Role</HeadCell>
//                     <HeadCell>Plan</HeadCell>
//                     <HeadCell>Credits</HeadCell>
//                     <HeadCell>Account</HeadCell>
//                     <HeadCell>Joined</HeadCell>
//                     <HeadCell>Actions</HeadCell>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#f0e7ee] dark:divide-white/[0.06]">
//                   {items.map((item) => (
//                     <tr key={item.id} className="hover:bg-[#fdf9fd] dark:hover:bg-white/[0.02]">
//                       <Cell>
//                         <p className="font-bold">{item.name || "Unnamed user"}</p>
//                         <p className="mt-0.5 text-xs text-[#938397]">{item.email}</p>
//                       </Cell>
//                       <Cell>{humanize(item.role)}</Cell>
//                       <Cell>
//                         {item.isPro ? <Pill tone="green">Pro</Pill> : <Pill>Free</Pill>}
//                       </Cell>
//                       <Cell>
//                         <span className="inline-flex items-center gap-1.5 font-bold">
//                           <Coins className="h-3.5 w-3.5 text-[#a47a2d]" />
//                           {item.aiCredits ?? 0}
//                         </span>
//                       </Cell>
//                       <Cell>
//                         {item.isSuspended ? (
//                           <Pill tone="red">Suspended</Pill>
//                         ) : (
//                           <Pill tone="green">Active</Pill>
//                         )}
//                       </Cell>
//                       <Cell className="whitespace-nowrap text-xs text-[#938397]">
//                         {dateText(item.createdAt)}
//                       </Cell>
//                       <Cell>
//                         <div className="flex min-w-[205px] flex-wrap gap-1.5">
//                           <button
//                             onClick={() => openUserAction("credits", item)}
//                             className="rounded-lg border border-[#e8dce5] px-2 py-1.5 text-[11px] font-bold hover:bg-[#f7eff6] dark:border-white/10"
//                           >
//                             Credits
//                           </button>
//                           <button
//                             onClick={() => openUserAction("pro", item)}
//                             className="rounded-lg border border-[#e8dce5] px-2 py-1.5 text-[11px] font-bold hover:bg-[#f7eff6] dark:border-white/10"
//                           >
//                             {item.isPro ? "Revoke Pro" : "Grant Pro"}
//                           </button>
//                           <button
//                             onClick={() => openUserAction("suspension", item)}
//                             className={`rounded-lg border px-2 py-1.5 text-[11px] font-bold ${
//                               item.isSuspended
//                                 ? "border-emerald-200 text-emerald-700"
//                                 : "border-rose-200 text-rose-700"
//                             }`}
//                           >
//                             {item.isSuspended ? "Reactivate" : "Suspend"}
//                           </button>
//                         </div>
//                       </Cell>
//                     </tr>
//                   ))}
//                   {!items.length && (
//                     <tr>
//                       <td colSpan={7}>
//                         <Empty
//                           title="No users found"
//                           detail="Try another name or email."
//                         />
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </DataTable>

//               <Pagination
//                 page={page}
//                 total={total}
//                 totalPages={totalPages}
//                 onPage={setPage}
//               />
//             </Panel>
//           )}

//           {!loading && tab === "payments" && (
//             <Panel className="overflow-hidden">
//               <div className="border-b border-[#eee4eb] p-4 dark:border-white/10">
//                 <h3 className="font-black">Payments & refunds</h3>
//                 <p className="mt-1 text-xs leading-5 text-[#938397]">
//                   Refund requests are sent to Razorpay from the backend.
//                   Pending refunds can be synced here.
//                 </p>
//               </div>

//               <DataTable>
//                 <thead>
//                   <tr>
//                     <HeadCell>Payment / customer</HeadCell>
//                     <HeadCell>Plan</HeadCell>
//                     <HeadCell>Gross</HeadCell>
//                     <HeadCell>Refunded</HeadCell>
//                     <HeadCell>Refund status</HeadCell>
//                     <HeadCell>Recorded</HeadCell>
//                     <HeadCell>Action</HeadCell>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#f0e7ee] dark:divide-white/[0.06]">
//                   {items.map((item) => {
//                     const refunded = Number(item.refundedAmount || 0);
//                     const remaining = Math.max(
//                       0,
//                       Number(item.amount || 0) - refunded
//                     );

//                     return (
//                       <tr key={item.id}>
//                         <Cell>
//                           <p className="font-mono text-xs font-bold">{item.paymentId}</p>
//                           <p className="mt-1 text-xs">{item.user?.name || "Unknown user"}</p>
//                           <p className="text-[11px] text-[#938397]">
//                             {item.user?.email || item.userId}
//                           </p>
//                         </Cell>
//                         <Cell>
//                           <p className="font-semibold">{humanize(item.planId)}</p>
//                           <p className="mt-0.5 text-[11px] text-[#938397]">
//                             {item.credits} credits
//                           </p>
//                         </Cell>
//                         <Cell className="whitespace-nowrap font-bold">{money(item.amount)}</Cell>
//                         <Cell className="whitespace-nowrap">{money(refunded)}</Cell>
//                         <Cell>
//                           {item.refundStatus ? (
//                             <Pill
//                               tone={
//                                 item.refundStatus === "processed"
//                                   ? "green"
//                                   : item.refundStatus === "failed"
//                                     ? "red"
//                                     : "amber"
//                               }
//                             >
//                               {humanize(item.refundStatus)}
//                             </Pill>
//                           ) : (
//                             <Pill>None</Pill>
//                           )}
//                           {item.refundId && (
//                             <p className="mt-1 max-w-[140px] truncate font-mono text-[10px] text-[#938397]">
//                               {item.refundId}
//                             </p>
//                           )}
//                         </Cell>
//                         <Cell className="whitespace-nowrap text-xs text-[#938397]">
//                           {dateText(item.createdAt)}
//                         </Cell>
//                         <Cell>
//                           {item.refundStatus === "pending" ? (
//                             <button
//                               onClick={() => syncRefund(item)}
//                               className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-2 text-xs font-bold text-amber-800"
//                             >
//                               <RefreshCw className="h-3.5 w-3.5" />
//                               Sync
//                             </button>
//                           ) : remaining > 0 ? (
//                             <button
//                               onClick={() => openRefund(item)}
//                               className="inline-flex items-center gap-1 rounded-lg bg-[#694B68] px-3 py-2 text-xs font-bold text-white"
//                             >
//                               <RotateCcw className="h-3.5 w-3.5" />
//                               Refund
//                             </button>
//                           ) : (
//                             <Pill tone="green">Fully refunded</Pill>
//                           )}
//                         </Cell>
//                       </tr>
//                     );
//                   })}
//                   {!items.length && (
//                     <tr>
//                       <td colSpan={7}>
//                         <Empty
//                           title="No verified payments yet"
//                           detail="Payments appear here after CareerLens saves verified payment records."
//                         />
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </DataTable>

//               <Pagination
//                 page={page}
//                 total={total}
//                 totalPages={totalPages}
//                 onPage={setPage}
//               />
//             </Panel>
//           )}

//           {!loading && tab === "feedback" && (
//             <Panel className="overflow-hidden">
//               <div className="border-b border-[#eee4eb] p-4 dark:border-white/10">
//                 <h3 className="font-black">Feedback inbox</h3>
//                 <p className="mt-1 text-xs text-[#938397]">
//                   Change feedback status; each update is saved to the audit log.
//                 </p>
//               </div>

//               <DataTable>
//                 <thead>
//                   <tr>
//                     <HeadCell>Rating</HeadCell>
//                     <HeadCell>User</HeadCell>
//                     <HeadCell>Feedback</HeadCell>
//                     <HeadCell>Submitted</HeadCell>
//                     <HeadCell>Status / action</HeadCell>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#f0e7ee] dark:divide-white/[0.06]">
//                   {items.map((item) => {
//                     const status = item.adminStatus || "new";

//                     return (
//                       <tr key={item.id}>
//                         <Cell>
//                           <span className="font-black text-[#a47a2d]">
//                             {item.rating}/5 ★
//                           </span>
//                         </Cell>
//                         <Cell>
//                           <p className="font-bold">{item.user?.name || "Unknown user"}</p>
//                           <p className="text-xs text-[#938397]">
//                             {item.user?.email || item.userId}
//                           </p>
//                         </Cell>
//                         <Cell className="max-w-md whitespace-pre-wrap leading-6">
//                           {item.comment || "(No comment)"}
//                         </Cell>
//                         <Cell className="whitespace-nowrap text-xs text-[#938397]">
//                           {dateText(item.createdAt)}
//                         </Cell>
//                         <Cell>
//                           <div className="space-y-2">
//                             <Pill
//                               tone={
//                                 status === "resolved"
//                                   ? "green"
//                                   : status === "in_review"
//                                     ? "blue"
//                                     : "amber"
//                               }
//                             >
//                               {humanize(status)}
//                             </Pill>
//                             <select
//                               aria-label={`Update feedback ${item.id}`}
//                               value={status}
//                               onChange={(event) =>
//                                 updateFeedback(item, event.target.value)
//                               }
//                               className="block rounded-lg border border-[#e8dce5] bg-white px-2.5 py-2 text-xs font-semibold dark:border-white/10 dark:bg-[#1d1523]"
//                             >
//                               <option value="new">New</option>
//                               <option value="in_review">In review</option>
//                               <option value="resolved">Resolved</option>
//                             </select>
//                           </div>
//                         </Cell>
//                       </tr>
//                     );
//                   })}
//                   {!items.length && (
//                     <tr>
//                       <td colSpan={5}>
//                         <Empty
//                           title="Inbox is clear"
//                           detail="Submitted feedback will appear here."
//                         />
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </DataTable>

//               <Pagination
//                 page={page}
//                 total={total}
//                 totalPages={totalPages}
//                 onPage={setPage}
//               />
//             </Panel>
//           )}

//           {!loading && tab === "audit" && (
//             <Panel className="overflow-hidden">
//               <div className="border-b border-[#eee4eb] p-4 dark:border-white/10">
//                 <h3 className="font-black">Administrative audit log</h3>
//                 <p className="mt-1 text-xs text-[#938397]">
//                   A history of credit, account, Pro, refund and feedback changes.
//                 </p>
//               </div>

//               <DataTable>
//                 <thead>
//                   <tr>
//                     <HeadCell>When</HeadCell>
//                     <HeadCell>Action</HeadCell>
//                     <HeadCell>Target</HeadCell>
//                     <HeadCell>Reason</HeadCell>
//                     <HeadCell>Administrator</HeadCell>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#f0e7ee] dark:divide-white/[0.06]">
//                   {items.map((item) => (
//                     <tr key={item.id}>
//                       <Cell className="whitespace-nowrap text-xs text-[#938397]">
//                         {dateText(item.createdAt)}
//                       </Cell>
//                       <Cell>
//                         <Pill
//                           tone={
//                             item.action?.includes("refund")
//                               ? "amber"
//                               : item.action?.includes("suspend")
//                                 ? "red"
//                                 : "plum"
//                           }
//                         >
//                           {humanize(item.action)}
//                         </Pill>
//                       </Cell>
//                       <Cell>
//                         <p className="font-semibold">{humanize(item.targetType)}</p>
//                         <p className="mt-0.5 max-w-[150px] truncate font-mono text-[10px] text-[#938397]">
//                           {item.targetId || "—"}
//                         </p>
//                       </Cell>
//                       <Cell className="max-w-sm text-xs leading-5">{item.reason}</Cell>
//                       <Cell className="text-xs text-[#938397]">{item.adminEmail}</Cell>
//                     </tr>
//                   ))}
//                   {!items.length && (
//                     <tr>
//                       <td colSpan={5}>
//                         <Empty
//                           title="No audit entries yet"
//                           detail="Changes made from this panel will be recorded here."
//                         />
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </DataTable>

//               <Pagination
//                 page={page}
//                 total={total}
//                 totalPages={totalPages}
//                 onPage={setPage}
//               />
//             </Panel>
//           )}

//           <div className="flex items-start gap-2 rounded-xl border border-[#e8dce5] bg-[#fffaf5] p-3 text-[11px] leading-5 text-[#8b788f] dark:border-white/10 dark:bg-white/[0.025] dark:text-[#b8a8bd]">
//             <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#8e688f]" />
//             <p>
//               Actions are authorized on the backend. Refunds use Razorpay
//               provider status, and manually granted Pro access is not proof
//               of payment.
//             </p>
//           </div>
//         </main>
//       </div>

//       {action && ["credits", "pro", "suspension"].includes(action.type) && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#180e1c]/55 p-4 backdrop-blur-sm">
//           <section
//             role="dialog"
//             aria-modal="true"
//             className="w-full max-w-lg rounded-3xl border border-[#eadfe8] bg-[#fffaf5] p-5 shadow-2xl dark:border-white/10 dark:bg-[#17101d] sm:p-6"
//           >
//             <div className="flex items-start justify-between gap-4">
//               <div>
//                 <h2 className="text-lg font-black">
//                   {action.type === "credits"
//                     ? "Adjust AI credits"
//                     : action.type === "pro"
//                       ? action.item.isPro
//                         ? "Revoke Pro access"
//                         : "Grant Pro access"
//                       : action.item.isSuspended
//                         ? "Reactivate account"
//                         : "Suspend account"}
//                 </h2>
//                 <p className="mt-1 text-sm text-[#88778c]">
//                   {action.item.name} · {action.item.email}
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 aria-label="Close dialog"
//                 onClick={() => !actionLoading && setAction(null)}
//                 className="rounded-lg p-2 hover:bg-[#f1e6ef] dark:hover:bg-white/10"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>

//             {action.type === "credits" && (
//               <div className="my-4 rounded-xl bg-[#f5edf4] p-3 text-sm dark:bg-white/[0.04]">
//                 <p className="font-bold">
//                   Current balance: {action.item.aiCredits ?? 0} credits
//                 </p>
//                 <p className="mt-1 text-xs text-[#88778c]">
//                   Use a positive number to add credits or a negative number
//                   to deduct them.
//                 </p>
//               </div>
//             )}

//             {action.type === "pro" && (
//               <p className="my-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">
//                 Pro changes are audited. A linked active Razorpay subscription
//                 must be resolved before Pro access can be revoked safely.
//               </p>
//             )}

//             {action.type === "suspension" && (
//               <p className="my-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-5 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-100">
//                 {action.item.isSuspended
//                   ? "This account will regain access to authenticated APIs."
//                   : "This user will be blocked from authenticated APIs. Their records will not be deleted."}
//               </p>
//             )}

//             <form onSubmit={submitUserAction} className="mt-4 space-y-4">
//               {action.type === "credits" && (
//                 <label className="block text-sm font-bold">
//                   Credit adjustment
//                   <input
//                     type="number"
//                     min="-5000"
//                     max="5000"
//                     step="1"
//                     value={delta}
//                     onChange={(event) => setDelta(event.target.value)}
//                     className="mt-1.5 h-11 w-full rounded-xl border border-[#e8dce5] bg-white px-3 font-normal outline-none dark:border-white/10 dark:bg-[#201725]"
//                     required
//                   />
//                 </label>
//               )}

//               <label className="block text-sm font-bold">
//                 Reason <span className="font-normal text-[#938397]">(required)</span>
//                 <textarea
//                   value={reason}
//                   onChange={(event) => setReason(event.target.value)}
//                   minLength={3}
//                   maxLength={300}
//                   rows={3}
//                   placeholder="Explain why this change is needed…"
//                   className="mt-1.5 w-full resize-y rounded-xl border border-[#e8dce5] bg-white p-3 text-sm font-normal outline-none dark:border-white/10 dark:bg-[#201725]"
//                   required
//                 />
//               </label>

//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setAction(null)}
//                   disabled={actionLoading}
//                   className="rounded-xl border border-[#e8dce5] px-4 py-2.5 text-sm font-bold dark:border-white/10"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={actionLoading}
//                   className="inline-flex items-center gap-2 rounded-xl bg-[#694B68] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
//                 >
//                   {actionLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
//                   Confirm action
//                 </button>
//               </div>
//             </form>
//           </section>
//         </div>
//       )}

//       {action?.type === "refund" && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#180e1c]/55 p-4 backdrop-blur-sm">
//           <section
//             role="dialog"
//             aria-modal="true"
//             className="w-full max-w-lg rounded-3xl border border-[#eadfe8] bg-[#fffaf5] p-5 shadow-2xl dark:border-white/10 dark:bg-[#17101d] sm:p-6"
//           >
//             <div className="flex items-start justify-between gap-4">
//               <div>
//                 <h2 className="text-lg font-black">Issue Razorpay refund</h2>
//                 <p className="mt-1 text-sm text-[#88778c]">
//                   {action.item.user?.name || "Customer"} · {action.item.paymentId}
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 aria-label="Close dialog"
//                 onClick={() => !actionLoading && setAction(null)}
//                 className="rounded-lg p-2 hover:bg-[#f1e6ef] dark:hover:bg-white/10"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>

//             <div className="my-4 grid grid-cols-2 gap-3">
//               <div className="rounded-xl bg-[#f5edf4] p-3 dark:bg-white/[0.04]">
//                 <p className="text-xs text-[#88778c]">Original payment</p>
//                 <p className="mt-1 font-black">{money(action.item.amount)}</p>
//               </div>
//               <div className="rounded-xl bg-[#f5edf4] p-3 dark:bg-white/[0.04]">
//                 <p className="text-xs text-[#88778c]">Remaining refundable</p>
//                 <p className="mt-1 font-black">{money(action.remainingPaise)}</p>
//               </div>
//             </div>

//             <form onSubmit={submitRefund} className="space-y-4">
//               <label className="block text-sm font-bold">
//                 Refund amount (INR)
//                 <input
//                   type="number"
//                   min="0.01"
//                   max={(action.remainingPaise / 100).toFixed(2)}
//                   step="0.01"
//                   value={refundAmount}
//                   onChange={(event) => setRefundAmount(event.target.value)}
//                   className="mt-1.5 h-11 w-full rounded-xl border border-[#e8dce5] bg-white px-3 font-normal outline-none dark:border-white/10 dark:bg-[#201725]"
//                   required
//                 />
//               </label>

//               <label className="block text-sm font-bold">
//                 Refund reason
//                 <textarea
//                   value={reason}
//                   onChange={(event) => setReason(event.target.value)}
//                   minLength={5}
//                   maxLength={300}
//                   rows={3}
//                   placeholder="For example: duplicate payment or approved customer request"
//                   className="mt-1.5 w-full resize-y rounded-xl border border-[#e8dce5] bg-white p-3 text-sm font-normal outline-none dark:border-white/10 dark:bg-[#201725]"
//                   required
//                 />
//               </label>

//               <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-5 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-100">
//                 A submitted refund request moves through Razorpay. Verify this
//                 flow in Test Mode before using any live credentials.
//               </div>

//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setAction(null)}
//                   disabled={actionLoading}
//                   className="rounded-xl border border-[#e8dce5] px-4 py-2.5 text-sm font-bold dark:border-white/10"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={actionLoading}
//                   className="inline-flex items-center gap-2 rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
//                 >
//                   {actionLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
//                   Submit refund
//                 </button>
//               </div>
//             </form>
//           </section>
//         </div>
//       )}
//     </div>
//   );
// }





























import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  Ban,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Coins,
  CreditCard,
  Crown,
  FileText,
  History,
  LayoutDashboard,
  LifeBuoy,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  MessageSquare,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import { API_URL, TOKEN_KEY } from "@/utils/constants";

const PAGE_SIZE = 25;

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "payments", label: "Payments & refunds", icon: Wallet },
  { id: "feedback", label: "Feedback inbox", icon: MessageSquare },
  { id: "audit", label: "Audit log", icon: History },
];

const money = (paise) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format((Number(paise) || 0) / 100);

const dateText = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
};

const humanize = (value) =>
  String(value || "—")
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

async function adminRequest(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      Accept: "application/json",
      ...(options.body !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(options.body !== undefined
      ? { body: JSON.stringify(options.body) }
      : {}),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || `Request failed (${response.status})`
    );
  }

  return result.data;
}

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#e8dce5] bg-white shadow-sm dark:border-white/10 dark:bg-[#15101b] ${className}`}
    >
      {children}
    </section>
  );
}

function Pill({ children, tone = "neutral" }) {
  const colors = {
    neutral:
      "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200",
    green:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    amber:
      "bg-amber-50 text-amber-800 dark:bg-amber-900/25 dark:text-amber-200",
    red:
      "bg-rose-50 text-rose-700 dark:bg-rose-900/25 dark:text-rose-200",
    plum:
      "bg-[#f3e9f2] text-[#76516f] dark:bg-[#76516f]/20 dark:text-[#e1c6e5]",
    blue:
      "bg-blue-50 text-blue-700 dark:bg-blue-900/25 dark:text-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${colors[tone] || colors.neutral}`}
    >
      {children}
    </span>
  );
}

function DataTable({ children }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">{children}</table>
    </div>
  );
}

function HeadCell({ children }) {
  return (
    <th className="whitespace-nowrap bg-[#faf5fa] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#88778c] dark:bg-white/[0.035] dark:text-[#b8a8bd]">
      {children}
    </th>
  );
}

function Cell({ children, className = "" }) {
  return (
    <td className={`px-4 py-3.5 align-middle ${className}`}>
      {children}
    </td>
  );
}

function Empty({ title, detail }) {
  return (
    <div className="px-5 py-10 text-center">
      <p className="font-bold text-[#47344c] dark:text-white">{title}</p>
      {detail && (
        <p className="mt-1 text-xs text-[#928297] dark:text-[#a99aad]">
          {detail}
        </p>
      )}
    </div>
  );
}

function Metric({ title, value, detail, icon: Icon, tone = "plum" }) {
  const tones = {
    plum: "bg-[#f3e9f2] text-[#76516f] dark:bg-[#76516f]/20 dark:text-[#e1c6e5]",
    gold: "bg-[#fbf1d8] text-[#a47a2d] dark:bg-[#a47a2d]/15 dark:text-[#e7c77f]",
    green: "bg-[#e0f5eb] text-[#16805b] dark:bg-[#16805b]/15 dark:text-[#8ce0bb]",
    blue: "bg-[#e6efff] text-[#3767b0] dark:bg-[#3767b0]/15 dark:text-[#a7c7ff]",
    rose: "bg-[#ffeaec] text-[#aa4051] dark:bg-[#aa4051]/15 dark:text-[#f4a8b2]",
  };

  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-[#88778c] dark:text-[#b8a8bd]">
            {title}
          </p>
          <p className="mt-2 break-words text-2xl font-black text-[#29182f] dark:text-white">
            {value}
          </p>
          <p className="mt-1 text-xs text-[#96869a] dark:text-[#a99aad]">
            {detail}
          </p>
        </div>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[tone] || tones.plum}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </Panel>
  );
}

function Pagination({ page, total, totalPages, onPage }) {
  if (!total) return null;

  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="flex items-center justify-between gap-3 border-t border-[#eee4eb] px-4 py-3 dark:border-white/10">
      <p className="text-xs text-[#938397]">
        Showing {start}–{end} of {total}
      </p>
      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPage((value) => Math.max(1, value - 1))}
          className="inline-flex items-center gap-1 rounded-lg border border-[#e8dce5] px-3 py-2 text-xs font-bold disabled:opacity-40 dark:border-white/10"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Previous
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => onPage((value) => Math.min(totalPages, value + 1))}
          className="inline-flex items-center gap-1 rounded-lg border border-[#e8dce5] px-3 py-2 text-xs font-bold disabled:opacity-40 dark:border-white/10"
        >
          Next <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    loadUser,
    logout,
  } = useAuth();

  const [authChecked, setAuthChecked] = useState(false);
  const [tab, setTab] = useState("overview");
  const [overview, setOverview] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [action, setAction] = useState(null);
  const [delta, setDelta] = useState("5");
  const [reason, setReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");

  useEffect(() => {
    let mounted = true;

    Promise.resolve(loadUser())
      .catch(() => {})
      .finally(() => {
        if (mounted) setAuthChecked(true);
      });

    return () => {
      mounted = false;
    };
  }, [loadUser]);

  useEffect(() => {
    if (!authChecked || !isAuthenticated || user?.isAdmin !== true) {
      return;
    }

    let cancelled = false;

    async function loadPanel() {
      setLoading(true);
      setError("");

      try {
        if (tab === "overview") {
          const data = await adminRequest("/admin/overview");
          if (!cancelled) setOverview(data);
        } else {
          const params = new URLSearchParams({
            page: String(page),
            limit: String(PAGE_SIZE),
          });

          if (tab === "users" && search.trim()) {
            params.set("search", search.trim());
          }

          const endpoint = tab === "audit" ? "audit-log" : tab;
          const data = await adminRequest(
            `/admin/${endpoint}?${params.toString()}`
          );

          if (!cancelled) {
            setItems(Array.isArray(data.items) ? data.items : []);
            setTotal(Number(data.total) || 0);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load admin data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadPanel();

    return () => {
      cancelled = true;
    };
  }, [
    authChecked,
    isAuthenticated,
    user?.isAdmin,
    tab,
    page,
    search,
    refreshCounter,
  ]);

  const currentNav = NAV.find((item) => item.id === tab) || NAV[0];
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const refresh = () => setRefreshCounter((value) => value + 1);

  function openUserAction(type, item) {
    setAction({ type, item });
    setReason("");
    setDelta(type === "credits" ? "5" : "");
  }

  function openRefund(item) {
    const remainingPaise = Math.max(
      0,
      Number(item.amount || 0) - Number(item.refundedAmount || 0)
    );

    setAction({ type: "refund", item, remainingPaise });
    setRefundAmount((remainingPaise / 100).toFixed(2));
    setReason("");
  }

  async function submitUserAction(event) {
    event.preventDefault();
    if (!action?.item) return;

    const clean = reason.trim();

    if (clean.length < 3) {
      toast.error("Enter a reason of at least 3 characters.");
      return;
    }

    setActionLoading(true);

    try {
      const { item, type } = action;
      let result;

      if (type === "credits") {
        const amount = Number(delta);

        if (
          !Number.isSafeInteger(amount) ||
          amount === 0 ||
          Math.abs(amount) > 5000
        ) {
          toast.error("Enter a whole number between -5000 and 5000, excluding 0.");
          setActionLoading(false);
          return;
        }

        result = await adminRequest(`/admin/users/${item.id}/credits`, {
          method: "POST",
          body: { delta: amount, reason: clean },
        });
      } else if (type === "pro") {
        result = await adminRequest(`/admin/users/${item.id}/pro`, {
          method: "PATCH",
          body: { isPro: !item.isPro, reason: clean },
        });
      } else if (type === "suspension") {
        result = await adminRequest(
          `/admin/users/${item.id}/suspension`,
          {
            method: "PATCH",
            body: { suspended: !item.isSuspended, reason: clean },
          }
        );
      }

      toast.success(result?.message || "Admin action completed.");
      setAction(null);
      refresh();
    } catch (err) {
      toast.error(err.message || "Unable to complete admin action.");
    } finally {
      setActionLoading(false);
    }
  }

  async function submitRefund(event) {
    event.preventDefault();
    if (!action?.item) return;

    const amountPaise = Math.round(Number(refundAmount) * 100);
    const clean = reason.trim();

    if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) {
      toast.error("Enter a valid refund amount.");
      return;
    }

    if (amountPaise > action.remainingPaise) {
      toast.error("Refund exceeds the remaining refundable amount.");
      return;
    }

    if (clean.length < 5) {
      toast.error("Enter a refund reason of at least 5 characters.");
      return;
    }

    const item = action.item;
    const confirmed = window.confirm(
      `Submit a Razorpay refund of ${money(amountPaise)} for payment ${item.paymentId}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setActionLoading(true);

    try {
      const result = await adminRequest(
        `/admin/payments/${encodeURIComponent(item.paymentId)}/refund`,
        {
          method: "POST",
          body: { amountPaise, reason: clean },
        }
      );

      toast.success(result?.message || "Refund request submitted.");
      setAction(null);
      refresh();
    } catch (err) {
      toast.error(err.message || "Unable to submit refund.");
    } finally {
      setActionLoading(false);
    }
  }

  async function syncRefund(item) {
    try {
      const result = await adminRequest(
        `/admin/payments/${encodeURIComponent(item.paymentId)}/refund-status`,
        { method: "POST", body: {} }
      );

      toast.success(result?.message || "Refund status synced.");
      refresh();
    } catch (err) {
      toast.error(err.message || "Unable to sync refund status.");
    }
  }

  async function updateFeedback(item, status) {
    const reasonText =
      status === "resolved"
        ? "Admin marked feedback resolved"
        : status === "in_review"
          ? "Admin started reviewing feedback"
          : "Admin reopened feedback";

    try {
      await adminRequest(`/admin/feedback/${item.id}/status`, {
        method: "PATCH",
        body: { status, reason: reasonText },
      });

      toast.success(`Feedback marked ${humanize(status).toLowerCase()}.`);
      refresh();
    } catch (err) {
      toast.error(err.message || "Unable to update feedback.");
    }
  }

  if (!authChecked || authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[#76516f]">
        <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
        Checking admin access…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-[#e6d9df] bg-white p-8 text-center dark:border-white/10 dark:bg-[#15101b]">
        <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-[#76516f]" />
        <h1 className="text-xl font-bold">Admin sign-in required</h1>
        <p className="mt-2 text-sm text-[#806f82]">
          Sign in with the configured administrator account to continue.
        </p>
        <Link
          className="mt-5 inline-flex rounded-xl bg-[#694B68] px-4 py-2 text-sm font-bold text-white"
          to="/login"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (user?.isAdmin !== true) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-rose-200 bg-white p-8 text-center dark:border-rose-900/50 dark:bg-[#15101b]">
        <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-rose-500" />
        <h1 className="text-xl font-bold">Access denied</h1>
        <p className="mt-2 text-sm text-[#806f82]">
          This account is not configured as the CareerLens administrator.
          Check ADMIN_EMAIL in backend/.env and sign in again.
        </p>
        <Link
          className="mt-5 inline-flex items-center rounded-xl border border-[#e6d9df] px-4 py-2 text-sm font-bold dark:border-white/10"
          to="/dashboard"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] text-[#29182f] dark:text-[#faf5fc]">
      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#76516f]/20 bg-[#76516f]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#694B68] dark:text-[#dfc3e5]">
            <ShieldCheck className="h-3.5 w-3.5" />
            CareerLens · Admin workspace
          </span>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Control Center<span className="text-[#b58b49]">.</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#88778c] dark:text-[#b8a8bd]">
            Manage accounts, credits, access, transactions and support from
            one secure workspace.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#88778c] dark:text-[#b8a8bd]">
            <Pill tone="green">Admin verified</Pill>
            <span className="rounded-full border border-[#e8dce5] px-2.5 py-1 dark:border-white/10">
              {user?.email}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={refresh}
            disabled={loading}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#e8dce5] bg-white px-4 text-sm font-bold text-[#60455f] hover:bg-[#faf5fa] disabled:opacity-60 dark:border-white/10 dark:bg-[#15101b] dark:text-[#e8d9eb]"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => {
              logout();
              window.location.assign("/login");
            }}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#694B68] px-4 text-sm font-bold text-white hover:bg-[#7a5b7a]"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[232px_minmax(0,1fr)] xl:gap-6">
        <aside className="h-fit rounded-2xl border border-[#e8dce5] bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#15101b] lg:sticky lg:top-5">
          <p className="px-3 pb-2 pt-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#a08ea4]">
            Administration
          </p>
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {NAV.map((item) => {
              const Icon = item.icon;
              const selected = tab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    setPage(1);
                    setError("");
                  }}
                  className={`flex min-w-max items-center gap-3 rounded-xl px-3 py-3 text-left transition lg:w-full ${
                    selected
                      ? "bg-[#f2e7f1] text-[#5f3e60] dark:bg-[#76516f]/25 dark:text-[#f0dcf3]"
                      : "text-[#88778c] hover:bg-[#faf5fa] dark:text-[#b8a8bd] dark:hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#faf5fa] dark:bg-white/[0.04]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="whitespace-nowrap text-sm font-bold">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="mt-4 rounded-xl border border-[#eee2e9] bg-[#fffaf5] p-3 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center gap-2 text-xs font-bold">
              <LockKeyhole className="h-4 w-4 text-[#8e688f]" />
              Secure operations
            </div>
            <p className="mt-1.5 text-[11px] leading-5 text-[#938397] dark:text-[#aa9aaf]">
              Sensitive changes require a reason and are written to the audit
              log.
            </p>
          </div>
        </aside>

        <main className="min-w-0 space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold text-[#a08ea4]">
                Admin / {currentNav.label}
              </p>
              <h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">
                {tab === "overview" ? "Platform overview" : currentNav.label}
              </h2>
              <p className="mt-1 text-sm text-[#88778c] dark:text-[#b8a8bd]">
                {tab === "overview"
                  ? "A current snapshot of the CareerLens platform."
                  : "Review records and perform authorized admin actions."}
              </p>
            </div>
            {tab !== "overview" && (
              <p className="text-xs text-[#a08ea4]">
                {total.toLocaleString("en-IN")} records · Page {page} of{" "}
                {totalPages}
              </p>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-2 rounded-xl border border-[#e8dce5] bg-white p-4 text-sm text-[#806f82] dark:border-white/10 dark:bg-[#15101b]">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Loading latest data…
            </div>
          )}

          {!loading && tab === "overview" && overview && (
            <>
              <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
                <Metric title="Total users" value={overview.totalUsers || 0} detail="Registered accounts" icon={Users} />
                <Metric title="Pro members" value={overview.proUsers || 0} detail={`${overview.freeUsers || 0} Free accounts`} icon={Crown} tone="gold" />
                <Metric title="Net recorded payments" value={money(overview.netStoredAmountPaise)} detail={`${money(overview.refundedAmountPaise)} refunded`} icon={CircleDollarSign} tone="green" />
                <Metric title="Resume records" value={overview.totalResumes || 0} detail="Uploaded resumes" icon={FileText} tone="blue" />
                <Metric title="Verified payments" value={overview.verifiedPayments || 0} detail="Stored payment records" icon={CreditCard} tone="green" />
                <Metric title="Feedback" value={overview.totalFeedback || 0} detail="User submissions" icon={MessageSquare} tone="blue" />
                <Metric title="Suspended users" value={overview.suspendedUsers || 0} detail="Accounts restricted" icon={Ban} tone="rose" />
                <Metric title="Refunds pending" value={overview.pendingRefunds || 0} detail="Status may need syncing" icon={Clock3} tone="gold" />
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <Panel className="p-5">
                  <h3 className="font-black">Quick actions</h3>
                  <p className="mt-1 text-xs text-[#938397]">
                    Jump to common administrative tasks.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      { tab: "users", label: "Manage users", icon: Users },
                      { tab: "payments", label: "Payments & refunds", icon: Wallet },
                      { tab: "feedback", label: "Resolve feedback", icon: LifeBuoy },
                      { tab: "audit", label: "View audit log", icon: History },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.tab}
                          onClick={() => {
                            setTab(item.tab);
                            setPage(1);
                          }}
                          className="flex items-center gap-3 rounded-xl border border-[#eee2e9] p-3 text-left text-sm font-bold hover:bg-[#fcf7fc] dark:border-white/10 dark:hover:bg-white/[0.04]"
                        >
                          <Icon className="h-5 w-5 text-[#76516f]" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </Panel>

                <Panel className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black">Recent admin activity</h3>
                      <p className="mt-1 text-xs text-[#938397]">
                        Latest recorded administrative changes.
                      </p>
                    </div>
                    <History className="h-5 w-5 text-[#8e688f]" />
                  </div>
                  <div className="mt-4 space-y-3">
                    {(overview.recentAudit || []).length ? (
                      overview.recentAudit.map((entry) => (
                        <div
                          key={entry.id}
                          className="border-b border-[#f0e7ee] pb-3 last:border-0 dark:border-white/[0.06]"
                        >
                          <p className="text-xs font-bold">
                            {humanize(entry.action)}
                          </p>
                          <p className="mt-1 text-xs text-[#938397]">
                            {entry.reason}
                          </p>
                          <p className="mt-1 text-[10px] text-[#a08ea4]">
                            {dateText(entry.createdAt)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="py-5 text-sm text-[#938397]">
                        No admin actions recorded yet.
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setTab("audit")}
                    className="mt-3 text-xs font-bold text-[#76516f] hover:underline dark:text-[#d5b6df]"
                  >
                    View full audit log →
                  </button>
                </Panel>
              </div>

              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs leading-5 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Payment totals use locally stored payment records; they are
                  not Razorpay settlement reports. Check Razorpay for the latest
                  provider-side refund status.
                </p>
              </div>
            </>
          )}

          {!loading && tab === "users" && (
            <Panel className="overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-[#eee4eb] p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-black">User directory</h3>
                  <p className="mt-1 text-xs text-[#938397]">
                    Manage AI credits, Pro access and account status.
                  </p>
                </div>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSearch(searchInput.trim());
                    setPage(1);
                  }}
                  className="flex w-full gap-2 sm:max-w-md"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#e8dce5] bg-[#fffaf5] px-3 dark:border-white/10 dark:bg-white/[0.03]">
                    <Search className="h-4 w-4 shrink-0 text-[#a08ea4]" />
                    <input
                      value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)}
                      placeholder="Search name or email"
                      className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#694B68] px-4 py-2 text-sm font-bold text-white hover:bg-[#7a5b7a]"
                  >
                    Search
                  </button>
                </form>
              </div>

              <DataTable>
                <thead>
                  <tr>
                    <HeadCell>User</HeadCell>
                    <HeadCell>Role</HeadCell>
                    <HeadCell>Plan</HeadCell>
                    <HeadCell>Credits</HeadCell>
                    <HeadCell>Account</HeadCell>
                    <HeadCell>Joined</HeadCell>
                    <HeadCell>Actions</HeadCell>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0e7ee] dark:divide-white/[0.06]">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-[#fdf9fd] dark:hover:bg-white/[0.02]">
                      <Cell>
                        <p className="font-bold">{item.name || "Unnamed user"}</p>
                        <p className="mt-0.5 text-xs text-[#938397]">{item.email}</p>
                      </Cell>
                      <Cell>{humanize(item.role)}</Cell>
                      <Cell>
                        {item.isPro ? <Pill tone="green">Pro</Pill> : <Pill>Free</Pill>}
                      </Cell>
                      <Cell>
                        <span className="inline-flex items-center gap-1.5 font-bold">
                          <Coins className="h-3.5 w-3.5 text-[#a47a2d]" />
                          {item.aiCredits ?? 0}
                        </span>
                      </Cell>
                      <Cell>
                        {item.isSuspended ? (
                          <Pill tone="red">Suspended</Pill>
                        ) : (
                          <Pill tone="green">Active</Pill>
                        )}
                      </Cell>
                      <Cell className="whitespace-nowrap text-xs text-[#938397]">
                        {dateText(item.createdAt)}
                      </Cell>
                      <Cell>
                        <div className="flex min-w-[205px] flex-wrap gap-1.5">
                          <button
                            onClick={() => openUserAction("credits", item)}
                            className="rounded-lg border border-[#e8dce5] px-2 py-1.5 text-[11px] font-bold hover:bg-[#f7eff6] dark:border-white/10"
                          >
                            Credits
                          </button>
                          <button
                            onClick={() => openUserAction("pro", item)}
                            className="rounded-lg border border-[#e8dce5] px-2 py-1.5 text-[11px] font-bold hover:bg-[#f7eff6] dark:border-white/10"
                          >
                            {item.isPro ? "Revoke Pro" : "Grant Pro"}
                          </button>
                          <button
                            onClick={() => openUserAction("suspension", item)}
                            className={`rounded-lg border px-2 py-1.5 text-[11px] font-bold ${
                              item.isSuspended
                                ? "border-emerald-200 text-emerald-700"
                                : "border-rose-200 text-rose-700"
                            }`}
                          >
                            {item.isSuspended ? "Reactivate" : "Suspend"}
                          </button>
                        </div>
                      </Cell>
                    </tr>
                  ))}
                  {!items.length && (
                    <tr>
                      <td colSpan={7}>
                        <Empty
                          title="No users found"
                          detail="Try another name or email."
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </DataTable>

              <Pagination
                page={page}
                total={total}
                totalPages={totalPages}
                onPage={setPage}
              />
            </Panel>
          )}

          {!loading && tab === "payments" && (
            <Panel className="overflow-hidden">
              <div className="border-b border-[#eee4eb] p-4 dark:border-white/10">
                <h3 className="font-black">Payments & refunds</h3>
                <p className="mt-1 text-xs leading-5 text-[#938397]">
                  Refund requests are sent to Razorpay from the backend.
                  Pending refunds can be synced here.
                </p>
              </div>

              <DataTable>
                <thead>
                  <tr>
                    <HeadCell>Payment / customer</HeadCell>
                    <HeadCell>Plan</HeadCell>
                    <HeadCell>Gross</HeadCell>
                    <HeadCell>Refunded</HeadCell>
                    <HeadCell>Refund status</HeadCell>
                    <HeadCell>Recorded</HeadCell>
                    <HeadCell>Action</HeadCell>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0e7ee] dark:divide-white/[0.06]">
                  {items.map((item) => {
                    const refunded = Number(item.refundedAmount || 0);
                    const remaining = Math.max(
                      0,
                      Number(item.amount || 0) - refunded
                    );

                    return (
                      <tr key={item.id}>
                        <Cell>
                          <p className="font-mono text-xs font-bold">{item.paymentId}</p>
                          <p className="mt-1 text-xs">{item.user?.name || "Unknown user"}</p>
                          <p className="text-[11px] text-[#938397]">
                            {item.user?.email || item.userId}
                          </p>
                        </Cell>
                        <Cell>
                          <p className="font-semibold">{humanize(item.planId)}</p>
                          <p className="mt-0.5 text-[11px] text-[#938397]">
                            {item.credits} credits
                          </p>
                        </Cell>
                        <Cell className="whitespace-nowrap font-bold">{money(item.amount)}</Cell>
                        <Cell className="whitespace-nowrap">{money(refunded)}</Cell>
                        <Cell>
                          {item.refundStatus ? (
                            <Pill
                              tone={
                                item.refundStatus === "processed"
                                  ? "green"
                                  : item.refundStatus === "failed"
                                    ? "red"
                                    : "amber"
                              }
                            >
                              {humanize(item.refundStatus)}
                            </Pill>
                          ) : (
                            <Pill>None</Pill>
                          )}
                          {item.refundId && (
                            <p className="mt-1 max-w-[140px] truncate font-mono text-[10px] text-[#938397]">
                              {item.refundId}
                            </p>
                          )}
                        </Cell>
                        <Cell className="whitespace-nowrap text-xs text-[#938397]">
                          {dateText(item.createdAt)}
                        </Cell>
                        <Cell>
                          {item.refundStatus === "pending" ? (
                            <button
                              onClick={() => syncRefund(item)}
                              className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-2 text-xs font-bold text-amber-800"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                              Sync
                            </button>
                          ) : remaining > 0 ? (
                            <button
                              onClick={() => openRefund(item)}
                              className="inline-flex items-center gap-1 rounded-lg bg-[#694B68] px-3 py-2 text-xs font-bold text-white"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              Refund
                            </button>
                          ) : (
                            <Pill tone="green">Fully refunded</Pill>
                          )}
                        </Cell>
                      </tr>
                    );
                  })}
                  {!items.length && (
                    <tr>
                      <td colSpan={7}>
                        <Empty
                          title="No verified payments yet"
                          detail="Payments appear here after CareerLens saves verified payment records."
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </DataTable>

              <Pagination
                page={page}
                total={total}
                totalPages={totalPages}
                onPage={setPage}
              />
            </Panel>
          )}

          {!loading && tab === "feedback" && (
            <Panel className="overflow-hidden">
              <div className="border-b border-[#eee4eb] p-4 dark:border-white/10">
                <h3 className="font-black">Feedback inbox</h3>
                <p className="mt-1 text-xs text-[#938397]">
                  Change feedback status; each update is saved to the audit log.
                </p>
              </div>

              <DataTable>
                <thead>
                  <tr>
                    <HeadCell>Rating</HeadCell>
                    <HeadCell>User</HeadCell>
                    <HeadCell>Feedback</HeadCell>
                    <HeadCell>Submitted</HeadCell>
                    <HeadCell>Status / action</HeadCell>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0e7ee] dark:divide-white/[0.06]">
                  {items.map((item) => {
                    const status = item.adminStatus || "new";

                    return (
                      <tr key={item.id}>
                        <Cell>
                          <span className="font-black text-[#a47a2d]">
                            {item.rating}/5 ★
                          </span>
                        </Cell>
                        <Cell>
                          <p className="font-bold">{item.user?.name || "Unknown user"}</p>
                          <p className="text-xs text-[#938397]">
                            {item.user?.email || item.userId}
                          </p>
                        </Cell>
                        <Cell className="max-w-md whitespace-pre-wrap leading-6">
                          {item.comment || "(No comment)"}
                        </Cell>
                        <Cell className="whitespace-nowrap text-xs text-[#938397]">
                          {dateText(item.createdAt)}
                        </Cell>
                        <Cell>
                          <div className="space-y-2">
                            <Pill
                              tone={
                                status === "resolved"
                                  ? "green"
                                  : status === "in_review"
                                    ? "blue"
                                    : "amber"
                              }
                            >
                              {humanize(status)}
                            </Pill>
                            <select
                              aria-label={`Update feedback ${item.id}`}
                              value={status}
                              onChange={(event) =>
                                updateFeedback(item, event.target.value)
                              }
                              className="block rounded-lg border border-[#e8dce5] bg-white px-2.5 py-2 text-xs font-semibold dark:border-white/10 dark:bg-[#1d1523]"
                            >
                              <option value="new">New</option>
                              <option value="in_review">In review</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </div>
                        </Cell>
                      </tr>
                    );
                  })}
                  {!items.length && (
                    <tr>
                      <td colSpan={5}>
                        <Empty
                          title="Inbox is clear"
                          detail="Submitted feedback will appear here."
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </DataTable>

              <Pagination
                page={page}
                total={total}
                totalPages={totalPages}
                onPage={setPage}
              />
            </Panel>
          )}

          {!loading && tab === "audit" && (
            <Panel className="overflow-hidden">
              <div className="border-b border-[#eee4eb] p-4 dark:border-white/10">
                <h3 className="font-black">Administrative audit log</h3>
                <p className="mt-1 text-xs text-[#938397]">
                  A history of credit, account, Pro, refund and feedback changes.
                </p>
              </div>

              <DataTable>
                <thead>
                  <tr>
                    <HeadCell>When</HeadCell>
                    <HeadCell>Action</HeadCell>
                    <HeadCell>Target</HeadCell>
                    <HeadCell>Reason</HeadCell>
                    <HeadCell>Administrator</HeadCell>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0e7ee] dark:divide-white/[0.06]">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <Cell className="whitespace-nowrap text-xs text-[#938397]">
                        {dateText(item.createdAt)}
                      </Cell>
                      <Cell>
                        <Pill
                          tone={
                            item.action?.includes("refund")
                              ? "amber"
                              : item.action?.includes("suspend")
                                ? "red"
                                : "plum"
                          }
                        >
                          {humanize(item.action)}
                        </Pill>
                      </Cell>
                      <Cell>
                        <p className="font-semibold">{humanize(item.targetType)}</p>
                        <p className="mt-0.5 max-w-[150px] truncate font-mono text-[10px] text-[#938397]">
                          {item.targetId || "—"}
                        </p>
                      </Cell>
                      <Cell className="max-w-sm text-xs leading-5">{item.reason}</Cell>
                      <Cell className="text-xs text-[#938397]">{item.adminEmail}</Cell>
                    </tr>
                  ))}
                  {!items.length && (
                    <tr>
                      <td colSpan={5}>
                        <Empty
                          title="No audit entries yet"
                          detail="Changes made from this panel will be recorded here."
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </DataTable>

              <Pagination
                page={page}
                total={total}
                totalPages={totalPages}
                onPage={setPage}
              />
            </Panel>
          )}

          <div className="flex items-start gap-2 rounded-xl border border-[#e8dce5] bg-[#fffaf5] p-3 text-[11px] leading-5 text-[#8b788f] dark:border-white/10 dark:bg-white/[0.025] dark:text-[#b8a8bd]">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#8e688f]" />
            <p>
              Actions are authorized on the backend. Refunds use Razorpay
              provider status, and manually granted Pro access is not proof
              of payment.
            </p>
          </div>
        </main>
      </div>

      {action && ["credits", "pro", "suspension"].includes(action.type) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#180e1c]/55 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg rounded-3xl border border-[#eadfe8] bg-[#fffaf5] p-5 shadow-2xl dark:border-white/10 dark:bg-[#17101d] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black">
                  {action.type === "credits"
                    ? "Adjust AI credits"
                    : action.type === "pro"
                      ? action.item.isPro
                        ? "Revoke Pro access"
                        : "Grant Pro access"
                      : action.item.isSuspended
                        ? "Reactivate account"
                        : "Suspend account"}
                </h2>
                <p className="mt-1 text-sm text-[#88778c]">
                  {action.item.name} · {action.item.email}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close dialog"
                onClick={() => !actionLoading && setAction(null)}
                className="rounded-lg p-2 hover:bg-[#f1e6ef] dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {action.type === "credits" && (
              <div className="my-4 rounded-xl bg-[#f5edf4] p-3 text-sm dark:bg-white/[0.04]">
                <p className="font-bold">
                  Current balance: {action.item.aiCredits ?? 0} credits
                </p>
                <p className="mt-1 text-xs text-[#88778c]">
                  Use a positive number to add credits or a negative number
                  to deduct them.
                </p>
              </div>
            )}

            {action.type === "pro" && (
              <p className="my-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">
                Pro changes are audited. A linked active Razorpay subscription
                must be resolved before Pro access can be revoked safely.
              </p>
            )}

            {action.type === "suspension" && (
              <p className="my-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-5 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-100">
                {action.item.isSuspended
                  ? "This account will regain access to authenticated APIs."
                  : "This user will be blocked from authenticated APIs. Their records will not be deleted."}
              </p>
            )}

            <form onSubmit={submitUserAction} className="mt-4 space-y-4">
              {action.type === "credits" && (
                <label className="block text-sm font-bold">
                  Credit adjustment
                  <input
                    type="number"
                    min="-5000"
                    max="5000"
                    step="1"
                    value={delta}
                    onChange={(event) => setDelta(event.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#e8dce5] bg-white px-3 font-normal outline-none dark:border-white/10 dark:bg-[#201725]"
                    required
                  />
                </label>
              )}

              <label className="block text-sm font-bold">
                Reason <span className="font-normal text-[#938397]">(required)</span>
                <textarea
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  minLength={3}
                  maxLength={300}
                  rows={3}
                  placeholder="Explain why this change is needed…"
                  className="mt-1.5 w-full resize-y rounded-xl border border-[#e8dce5] bg-white p-3 text-sm font-normal outline-none dark:border-white/10 dark:bg-[#201725]"
                  required
                />
              </label>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAction(null)}
                  disabled={actionLoading}
                  className="rounded-xl border border-[#e8dce5] px-4 py-2.5 text-sm font-bold dark:border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#694B68] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                >
                  {actionLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  Confirm action
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {action?.type === "refund" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#180e1c]/55 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg rounded-3xl border border-[#eadfe8] bg-[#fffaf5] p-5 shadow-2xl dark:border-white/10 dark:bg-[#17101d] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black">Issue Razorpay refund</h2>
                <p className="mt-1 text-sm text-[#88778c]">
                  {action.item.user?.name || "Customer"} · {action.item.paymentId}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close dialog"
                onClick={() => !actionLoading && setAction(null)}
                className="rounded-lg p-2 hover:bg-[#f1e6ef] dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="my-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#f5edf4] p-3 dark:bg-white/[0.04]">
                <p className="text-xs text-[#88778c]">Original payment</p>
                <p className="mt-1 font-black">{money(action.item.amount)}</p>
              </div>
              <div className="rounded-xl bg-[#f5edf4] p-3 dark:bg-white/[0.04]">
                <p className="text-xs text-[#88778c]">Remaining refundable</p>
                <p className="mt-1 font-black">{money(action.remainingPaise)}</p>
              </div>
            </div>

            <form onSubmit={submitRefund} className="space-y-4">
              <label className="block text-sm font-bold">
                Refund amount (INR)
                <input
                  type="number"
                  min="0.01"
                  max={(action.remainingPaise / 100).toFixed(2)}
                  step="0.01"
                  value={refundAmount}
                  onChange={(event) => setRefundAmount(event.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-[#e8dce5] bg-white px-3 font-normal outline-none dark:border-white/10 dark:bg-[#201725]"
                  required
                />
              </label>

              <label className="block text-sm font-bold">
                Refund reason
                <textarea
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  minLength={5}
                  maxLength={300}
                  rows={3}
                  placeholder="For example: duplicate payment or approved customer request"
                  className="mt-1.5 w-full resize-y rounded-xl border border-[#e8dce5] bg-white p-3 text-sm font-normal outline-none dark:border-white/10 dark:bg-[#201725]"
                  required
                />
              </label>

              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-5 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-100">
                A submitted refund request moves through Razorpay. Verify this
                flow in Test Mode before using any live credentials.
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAction(null)}
                  disabled={actionLoading}
                  className="rounded-xl border border-[#e8dce5] px-4 py-2.5 text-sm font-bold dark:border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                >
                  {actionLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  Submit refund
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}