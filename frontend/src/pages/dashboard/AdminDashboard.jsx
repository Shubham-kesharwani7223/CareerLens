import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CreditCard,
  FileText,
  LoaderCircle,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { API_URL, TOKEN_KEY } from "@/utils/constants";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Users" },
  { id: "payments", label: "Payments" },
  { id: "feedback", label: "Feedback" },
];

function moneyFromPaise(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format((Number(value) || 0) / 100);
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

async function adminFetch(path) {
  const token = localStorage.getItem(TOKEN_KEY);

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      body.message ||
        body.error ||
        `Request failed (${response.status})`
    );
  }

  return body.data;
}

function MetricCard({ title, value, description, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-[#e6d9df] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#15101b]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[#806f82] dark:text-[#b7a5ba]">
            {title}
          </p>
          <p className="mt-2 break-words text-2xl font-black text-[#29182f] dark:text-[#f7f1fa]">
            {value}
          </p>
          <p className="mt-1 text-xs text-[#948399]">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f1e6ef] text-[#76516f] dark:bg-[#76577c]/20 dark:text-[#d5b6df]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function EmptyRow({ columns, message }) {
  return (
    <tr>
      <td
        colSpan={columns}
        className="px-4 py-12 text-center text-sm text-[#806f82]"
      >
        {message}
      </td>
    </tr>
  );
}

export function AdminDashboardPage() {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    loadUser,
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
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    Promise.resolve(loadUser()).finally(() => {
      if (mounted) setAuthChecked(true);
    });

    return () => {
      mounted = false;
    };
  }, [loadUser]);

  useEffect(() => {
    if (
      !authChecked ||
      !isAuthenticated ||
      user?.isAdmin !== true
    ) {
      return;
    }

    let cancelled = false;

    async function loadPanel() {
      setLoading(true);
      setError("");

      try {
        if (tab === "overview") {
          const result = await adminFetch("/admin/overview");

          if (!cancelled) {
            setOverview(result);
          }
        } else {
          const params = new URLSearchParams({
            page: String(page),
            limit: "25",
          });

          if (tab === "users" && search.trim()) {
            params.set("search", search.trim());
          }

          const result = await adminFetch(
            `/admin/${tab}?${params.toString()}`
          );

          if (!cancelled) {
            setItems(Array.isArray(result.items) ? result.items : []);
            setTotal(Number(result.total) || 0);
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

  const totalPages = Math.max(1, Math.ceil(total / 25));

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
      <div className="mx-auto max-w-xl rounded-2xl border border-[#e6d9df] bg-white p-8 text-center dark:border-white/10 dark:bg-[#15101b]">
        <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-[#76516f]" />
        <h1 className="text-xl font-bold">Admin sign-in required</h1>
        <p className="mt-2 text-sm text-[#806f82]">
          Sign in using the configured administrator account.
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
      <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-8 text-center dark:border-red-900/50 dark:bg-[#15101b]">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <h1 className="text-xl font-bold">Access denied</h1>
        <p className="mt-2 text-sm text-[#806f82]">
          This account is not the configured administrator.
          Set ADMIN_EMAIL in backend/.env to the same email as
          the account you use to sign in, restart the backend,
          and sign in again.
        </p>
        <Link
          className="mt-5 inline-flex items-center rounded-xl border border-[#e6d9df] px-4 py-2 text-sm font-bold dark:border-white/10"
          to="/dashboard"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#76516f]/20 bg-[#76516f]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#694B68] dark:text-[#dfc3e5]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin Console
          </div>

          <h1 className="text-2xl font-black tracking-tight text-[#29182f] dark:text-[#f7f1fa] sm:text-3xl">
            CareerLens Administration
          </h1>

          <p className="mt-1 text-sm text-[#806f82] dark:text-[#b7a5ba]">
            Signed in as {user.email}. This panel is read-only.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefreshCounter((value) => value + 1)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e6d9df] bg-white px-4 text-sm font-semibold text-[#60455f] hover:bg-[#f7eff6] dark:border-white/10 dark:bg-[#15101b] dark:text-[#e8d9eb]"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </header>

      <div className="flex flex-wrap gap-2 border-b border-[#e6d9df] pb-3 dark:border-white/10">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTab(item.id);
              setPage(1);
              setError("");
            }}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              tab === item.id
                ? "bg-[#694B68] text-white shadow-sm"
                : "text-[#806f82] hover:bg-white hover:text-[#29182f] dark:text-[#b7a5ba] dark:hover:bg-white/[0.05] dark:hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab !== "overview" && tab === "users" && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(searchInput.trim());
            setPage(1);
          }}
          className="flex w-full gap-2 sm:max-w-md"
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#e6d9df] bg-white px-3 dark:border-white/10 dark:bg-[#15101b]">
            <Search className="h-4 w-4 shrink-0 text-[#948399]" />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search name or email"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-[#694B68] px-4 py-2 text-sm font-bold text-white"
          >
            Search
          </button>
        </form>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 py-8 text-sm text-[#806f82]">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Loading admin data…
        </div>
      )}

      {!loading && tab === "overview" && overview && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            title="Registered users"
            value={overview.totalUsers ?? 0}
            description="All CareerLens accounts"
            icon={Users}
          />
          <MetricCard
            title="Pro users"
            value={overview.proUsers ?? 0}
            description="Accounts currently flagged as Pro"
            icon={ShieldCheck}
          />
          <MetricCard
            title="Free users"
            value={overview.freeUsers ?? 0}
            description="Accounts not flagged as Pro"
            icon={Users}
          />
          <MetricCard
            title="Resume records"
            value={overview.totalResumes ?? 0}
            description="Uploaded resume records"
            icon={FileText}
          />
          <MetricCard
            title="Payment records"
            value={overview.verifiedPayments ?? 0}
            description="Payment records stored by CareerLens"
            icon={CreditCard}
          />
          <MetricCard
            title="Payment total"
            value={moneyFromPaise(overview.verifiedPaymentAmountPaise)}
            description="Stored records; not a settlement report"
            icon={CreditCard}
          />
          <MetricCard
            title="Feedback entries"
            value={overview.totalFeedback ?? 0}
            description="Saved feedback submissions"
            icon={MessageSquare}
          />
        </div>
      )}

      {!loading && tab === "users" && (
        <div className="overflow-x-auto rounded-2xl border border-[#e6d9df] bg-white dark:border-white/10 dark:bg-[#15101b]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f7eff6] text-xs uppercase tracking-wide text-[#806f82] dark:bg-white/[0.04] dark:text-[#b7a5ba]">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">AI Credits</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eee4eb] dark:divide-white/[0.06]">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-[#88758B]">{item.email}</p>
                  </td>
                  <td className="px-4 py-4 capitalize">
                    {String(item.role || "member").replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        item.isPro
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-gray-300"
                      }`}
                    >
                      {item.isPro ? "Pro" : "Free"}
                    </span>
                  </td>
                  <td className="px-4 py-4">{item.aiCredits ?? 0}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-xs text-[#806f82]">
                    {formatDate(item.createdAt)}
                  </td>
                </tr>
              ))}
              {!items.length && (
                <EmptyRow columns={5} message="No users found." />
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === "payments" && (
        <div className="overflow-x-auto rounded-2xl border border-[#e6d9df] bg-white dark:border-white/10 dark:bg-[#15101b]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f7eff6] text-xs uppercase tracking-wide text-[#806f82] dark:bg-white/[0.04] dark:text-[#b7a5ba]">
              <tr>
                <th className="px-4 py-3">Payment ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Plan/Pack</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eee4eb] dark:divide-white/[0.06]">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap px-4 py-4 font-mono text-xs">
                    {item.paymentId}
                  </td>
                  <td className="px-4 py-4">
                    <p>{item.user?.name || "Unknown user"}</p>
                    <p className="text-xs text-[#88758B]">
                      {item.user?.email || item.userId}
                    </p>
                  </td>
                  <td className="px-4 py-4">{item.planId}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-semibold">
                    {moneyFromPaise(item.amount)}
                  </td>
                  <td className="px-4 py-4">{item.credits}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-xs text-[#806f82]">
                    {formatDate(item.createdAt)}
                  </td>
                </tr>
              ))}
              {!items.length && (
                <EmptyRow columns={6} message="No payment records found." />
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === "feedback" && (
        <div className="overflow-x-auto rounded-2xl border border-[#e6d9df] bg-white dark:border-white/10 dark:bg-[#15101b]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f7eff6] text-xs uppercase tracking-wide text-[#806f82] dark:bg-white/[0.04] dark:text-[#b7a5ba]">
              <tr>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Comment</th>
                <th className="px-4 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eee4eb] dark:divide-white/[0.06]">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap px-4 py-4 font-bold text-[#a17b37]">
                    {item.rating}/5 ★
                  </td>
                  <td className="px-4 py-4">
                    <p>{item.user?.name || "Unknown user"}</p>
                    <p className="text-xs text-[#88758B]">
                      {item.user?.email || item.userId}
                    </p>
                  </td>
                  <td className="max-w-xl whitespace-pre-wrap px-4 py-4">
                    {item.comment || "(No comment)"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-xs text-[#806f82]">
                    {formatDate(item.createdAt)}
                  </td>
                </tr>
              ))}
              {!items.length && (
                <EmptyRow columns={4} message="No feedback entries found." />
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab !== "overview" && total > 0 && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-[#88758B]">
            Showing {Math.min((page - 1) * 25 + 1, total)}–
            {Math.min(page * 25, total)} of {total}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="rounded-xl border border-[#e6d9df] px-3 py-2 text-sm disabled:opacity-40 dark:border-white/10"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              className="rounded-xl border border-[#e6d9df] px-3 py-2 text-sm disabled:opacity-40 dark:border-white/10"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <p className="text-xs leading-5 text-[#948399] dark:text-[#9c8da2]">
        Read-only admin console. Payment totals include records saved
        by CareerLens; they do not show settlements, refunds or
        chargebacks from Razorpay.
      </p>
    </div>
  );
}