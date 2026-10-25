import { useEffect, useMemo, useState } from "react";
import {
  Copy,
  Gift,
  Share2,
  UsersRound,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { API_URL, TOKEN_KEY } from "@/utils/constants";

export function ReferralsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const referralLink = useMemo(() => {
    if (!data?.referralCode) return "";

    return `${window.location.origin}/register?ref=${encodeURIComponent(
      data.referralCode
    )}`;
  }, [data?.referralCode]);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem(TOKEN_KEY);

    fetch(`${API_URL}/referrals/me`, {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            payload.message || "Could not load referral details."
          );
        }

        return payload.data;
      })
      .then((value) => {
        if (active) setData(value);
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Could not load referral details.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success("Referral link copied");
    } catch {
      toast.error("Copy failed. Please copy the link manually.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 text-[#29182f] dark:text-[#f7f1fa]">
      <header className="rounded-3xl border border-[#e5d5e7] bg-gradient-to-br from-[#fffaf2] via-[#f7edf9] to-[#eee6ff] p-6 dark:border-white/10 dark:from-[#15101b] dark:via-[#1a1028] dark:to-[#100d1d] sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#76516f]/20 bg-white/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-[#694B68] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#dfc3e5]">
          <Gift className="h-3.5 w-3.5" />
          Referral program
        </span>

        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          Grow with CareerLens<span className="text-[#a855f7]">.</span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#806f82] dark:text-[#b7a5ba]">
          Invite friends to join CareerLens and see who signed up using your personal link.
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-[#e6d9df] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#15101b] sm:p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-[#f3e9f2] p-3 text-[#76516f] dark:bg-[#76516f]/20 dark:text-[#dfc3e5]">
              <Share2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-black">Your invite link</h2>
              <p className="text-xs text-[#88778c] dark:text-[#b7a5ba]">
                Share this link with friends.
              </p>
            </div>
          </div>

          <div className="mt-5 break-all rounded-xl border border-[#e6d9df] bg-[#fffaf2] p-3 text-sm dark:border-white/10 dark:bg-white/[0.03]">
            {loading
              ? "Generating your referral link…"
              : referralLink || "Referral link unavailable"}
          </div>

          <button
            type="button"
            onClick={copyLink}
            disabled={!referralLink}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#694B68] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            <Copy className="h-4 w-4" />
            Copy referral link
          </button>
        </section>

        <section className="rounded-2xl border border-[#e6d9df] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#15101b] sm:p-6">
          <span className="inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            <UsersRound className="h-5 w-5" />
          </span>

          <p className="mt-4 text-sm text-[#88778c] dark:text-[#b7a5ba]">
            Successful sign-ups
          </p>
          <p className="mt-1 text-4xl font-black">
            {loading ? "—" : data?.total ?? 0}
          </p>
          <p className="mt-2 text-xs text-[#88778c] dark:text-[#b7a5ba]">
            Accounts registered through your referral link.
          </p>
        </section>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#e6d9df] bg-white shadow-sm dark:border-white/10 dark:bg-[#15101b]">
        <div className="border-b border-[#eee4eb] p-5 dark:border-white/10">
          <h2 className="font-black">Your referrals</h2>
          <p className="mt-1 text-xs text-[#88778c] dark:text-[#b7a5ba]">
            Recent sign-ups attributed to your link.
          </p>
        </div>

        {loading ? (
          <p className="p-5 text-sm text-[#88778c]">
            Loading referral activity…
          </p>
        ) : data?.referrals?.length ? (
          <div className="divide-y divide-[#f0e7ee] dark:divide-white/[0.06]">
            {data.referrals.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#f3e9f2] p-2 text-[#76516f] dark:bg-[#76516f]/20 dark:text-[#dfc3e5]">
                    <UsersRound className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-bold">
                      {item.name || "CareerLens member"}
                    </p>
                    <p className="text-xs text-[#88778c] dark:text-[#b7a5ba]">
                      Joined{" "}
                      {new Date(item.joinedAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  Joined
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Sparkles className="mx-auto h-7 w-7 text-[#9e7a9e]" />
            <p className="mt-3 font-bold">No referrals yet</p>
            <p className="mt-1 text-sm text-[#88778c] dark:text-[#b7a5ba]">
              Share your invite link to get started.
            </p>
          </div>
        )}
      </section>

      <p className="text-xs leading-5 text-[#88778c] dark:text-[#b7a5ba]">
        Referral tracking currently records sign-ups. Credit or Pro rewards should only be enabled after eligibility rules and abuse checks are configured.
      </p>
    </div>
  );
}
