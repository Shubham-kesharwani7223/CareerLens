import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, BookOpen, CircleAlert, Gamepad2, Moon, Plus,
  RefreshCw, Save, ShieldCheck, Sun, Trash2, ToggleLeft, ToggleRight,
  Trophy, WandSparkles, X,
} from "lucide-react";
import { toast } from "sonner";
import { API_URL, TOKEN_KEY } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

async function adminGameRequest(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}/gamification${path}`, {
    method: options.method || "GET",
    headers: {
      Accept: "application/json",
      ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || `Request failed (${response.status})`);
  return body.data;
}

const blankQuiz = { title: "", description: "", categoryId: "", difficulty: "beginner", timeLimitSeconds: 600, rewardXp: 40, rewardCredits: 1, status: "draft" };
const blankQuestion = { questionText: "", option1: "", option2: "", option3: "", option4: "", correctOption: "0", explanation: "", marks: 1, position: 1 };
const blankGame = { title: "", description: "", challengeText: "Practice a little every day and build skills for your next career opportunity.", timeLimitSeconds: 90, rewardXp: 20, rewardCredits: 1, status: "draft" };
const dateText = (value) => value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

function Panel({ children, className = "" }) {
  return <section className={`rounded-2xl border border-[#e6d9df] bg-white shadow-sm dark:border-white/10 dark:bg-[#15101b] ${className}`}>{children}</section>;
}
function Field({ label, children, className = "" }) {
  return <label className={`block space-y-1.5 ${className}`}><span className="text-xs font-bold text-[#806f82] dark:text-[#b7a5ba]">{label}</span>{children}</label>;
}
const inputClass = "w-full rounded-xl border border-[#e6d9df] bg-white px-3 py-2.5 text-sm text-[#29182f] outline-none transition focus:border-[#76516f] focus:ring-2 focus:ring-[#76516f]/10 dark:border-white/10 dark:bg-[#100b16] dark:text-[#f7f1fa]";
function Status({ value }) {
  const tone = value === "active" || value === true ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300" : value === "draft" ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${tone}`}>{String(value)}</span>;
}
function Metric({ label, value, detail, icon: Icon }) {
  return <div className="rounded-2xl border border-[#e6d9df] bg-white p-4 dark:border-white/10 dark:bg-[#15101b]"><div className="flex items-start justify-between gap-3"><div><p className="text-xs text-[#88778c] dark:text-[#b8a8bd]">{label}</p><p className="mt-2 text-2xl font-black">{value ?? 0}</p><p className="mt-1 text-[11px] text-[#96869a]">{detail}</p></div><span className="rounded-xl bg-[#f3e9f2] p-2.5 text-[#76516f] dark:bg-[#76516f]/20 dark:text-[#dfc3e5]"><Icon className="h-5 w-5" /></span></div></div>;
}

export function AdminGamificationPage() {
  const { user, isAuthenticated, isLoading: authLoading, loadUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [authChecked, setAuthChecked] = useState(false);
  const [section, setSection] = useState("overview");
  const [overview, setOverview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [games, setGames] = useState([]);
  const [rules, setRules] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "", icon: "book-open" });
  const [quizForm, setQuizForm] = useState(blankQuiz);
  const [questionForm, setQuestionForm] = useState(blankQuestion);
  const [gameForm, setGameForm] = useState(blankGame);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [questions, setQuestions] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [editingGameId, setEditingGameId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    Promise.resolve(loadUser()).catch(() => {}).finally(() => { if (mounted) setAuthChecked(true); });
    return () => { mounted = false; };
  }, [loadUser]);

  async function loadAll() {
    setLoading(true); setError("");
    try {
      const [overviewData, categoryData, quizData, gameData, ruleData, analyticsData] = await Promise.all([
        adminGameRequest("/admin/overview"), adminGameRequest("/admin/categories"),
        adminGameRequest("/admin/quizzes"), adminGameRequest("/admin/games"),
        adminGameRequest("/admin/reward-rules"), adminGameRequest("/admin/analytics"),
      ]);
      setOverview(overviewData); setCategories(categoryData || []); setQuizzes(quizData || []);
      setGames(gameData || []); setRules(ruleData || []); setAnalytics(analyticsData || null);
      setQuizForm((old) => ({ ...old, categoryId: old.categoryId || String(categoryData?.find((item) => item.is_active)?.id || "") }));
    } catch (err) { setError(err.message || "Unable to load gamification admin data."); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (authChecked && isAuthenticated && user?.isAdmin === true) loadAll(); }, [authChecked, isAuthenticated, user?.isAdmin]);

  async function loadQuestions(quizId) {
    if (!quizId) { setQuestions([]); return; }
    try { const data = await adminGameRequest(`/admin/quizzes/${quizId}/questions`); setQuestions(data || []); }
    catch (err) { setError(err.message || "Unable to load questions."); }
  }
  useEffect(() => { loadQuestions(selectedQuiz); }, [selectedQuiz]);

  async function runAction(action, successMessage) {
    setBusy(true); setError("");
    try { await action(); toast.success(successMessage); await loadAll(); if (selectedQuiz) await loadQuestions(selectedQuiz); }
    catch (err) { setError(err.message || "The action could not be completed."); toast.error(err.message || "Action failed."); }
    finally { setBusy(false); }
  }

  function createCategory(event) {
    event.preventDefault();
    return runAction(async () => {
      const created = await adminGameRequest("/admin/categories", { method: "POST", body: categoryForm });
      setCategoryForm({ name: "", description: "", icon: "book-open" });
      if (created?.id) setQuizForm((old) => ({ ...old, categoryId: old.categoryId || String(created.id) }));
    }, "Category created.");
  }

  function editQuiz(quiz) {
    setEditingQuizId(String(quiz.id));
    setQuizForm({
      title: quiz.title || "", description: quiz.description || "",
      categoryId: String(quiz.category_id || ""), difficulty: quiz.difficulty || "beginner",
      timeLimitSeconds: Number(quiz.time_limit_seconds || 600), rewardXp: Number(quiz.reward_xp || 0),
      rewardCredits: Number(quiz.reward_credits || 0), status: quiz.status || "draft",
    });
    setSection("quizzes");
  }

  function saveQuiz(event) {
    event.preventDefault();
    const wasEditing = Boolean(editingQuizId);
    return runAction(async () => {
      const body = { ...quizForm, categoryId: Number(quizForm.categoryId), timeLimitSeconds: Number(quizForm.timeLimitSeconds), rewardXp: Number(quizForm.rewardXp), rewardCredits: Number(quizForm.rewardCredits) };
      const saved = wasEditing
        ? await adminGameRequest(`/admin/quizzes/${editingQuizId}`, { method: "PATCH", body })
        : await adminGameRequest("/admin/quizzes", { method: "POST", body });
      setEditingQuizId(null);
      setQuizForm((old) => ({ ...blankQuiz, categoryId: old.categoryId }));
      if (!wasEditing) { setSelectedQuiz(String(saved.id)); setSection("questions"); }
    }, wasEditing ? "Quiz details updated." : "Quiz created. Now add at least one question before publishing.");
  }

  function editQuestion(question) {
    setEditingQuestionId(question.id);
    setQuestionForm({ questionText: question.question_text, option1: question.options?.[0] || "", option2: question.options?.[1] || "", option3: question.options?.[2] || "", option4: question.options?.[3] || "", correctOption: String(question.correct_option), explanation: question.explanation || "", marks: question.marks || 1, position: question.position || 1 });
    setSection("questions");
  }

  function saveQuestion(event) {
    event.preventDefault();
    if (!selectedQuiz) { toast.error("Choose a quiz first."); return; }
    const body = { questionText: questionForm.questionText, options: [questionForm.option1, questionForm.option2, questionForm.option3, questionForm.option4], correctOption: Number(questionForm.correctOption), explanation: questionForm.explanation, marks: Number(questionForm.marks), position: Number(questionForm.position) };
    return runAction(async () => {
      if (editingQuestionId) await adminGameRequest(`/admin/questions/${editingQuestionId}`, { method: "PATCH", body });
      else await adminGameRequest(`/admin/quizzes/${selectedQuiz}/questions`, { method: "POST", body });
      setQuestionForm({ ...blankQuestion, position: questions.length + 1 }); setEditingQuestionId(null);
      await loadQuestions(selectedQuiz);
    }, editingQuestionId ? "Question updated." : "Question added.");
  }

  function editGame(game) {
    setEditingGameId(String(game.id));
    setGameForm({
      title: game.title || "", description: game.description || "",
      challengeText: game.config?.challengeText || blankGame.challengeText,
      timeLimitSeconds: Number(game.config?.timeLimitSeconds || 90),
      rewardXp: Number(game.reward_xp || 0), rewardCredits: Number(game.reward_credits || 0),
      status: game.status || "draft",
    });
    setSection("games");
  }

  function saveGame(event) {
    event.preventDefault();
    const wasEditing = Boolean(editingGameId);
    return runAction(async () => {
      const body = { ...gameForm, timeLimitSeconds: Number(gameForm.timeLimitSeconds), rewardXp: Number(gameForm.rewardXp), rewardCredits: Number(gameForm.rewardCredits) };
      if (wasEditing) await adminGameRequest(`/admin/games/${editingGameId}`, { method: "PATCH", body });
      else await adminGameRequest("/admin/games", { method: "POST", body });
      setEditingGameId(null);
      setGameForm(blankGame);
    }, wasEditing ? "Game updated." : "Typing sprint created.");
  }

  async function changeStatus(type, item) {
    const next = item.status === "active" ? "inactive" : "active";
    await runAction(() => adminGameRequest(`/admin/${type}/${item.id}`, { method: "PATCH", body: { status: next } }), `${type === "quizzes" ? "Quiz" : "Game"} marked ${next}.`);
  }

  async function toggleCategory(category) {
    await runAction(() => adminGameRequest(`/admin/categories/${category.id}`, { method: "PATCH", body: { isActive: !category.is_active } }), `Category ${category.is_active ? "deactivated" : "activated"}.`);
  }

  async function deleteQuestion(question) {
    if (!window.confirm("Delete this question? This cannot be undone.")) return;
    await runAction(() => adminGameRequest(`/admin/questions/${question.id}`, { method: "DELETE" }), "Question deleted.");
  }

  async function saveRule(rule) {
    const conditions = { ...(rule.condition_data || {}), daily_credit_cap: Number(rule.condition_data?.daily_credit_cap ?? rule.limit_count ?? 0), daily_xp_cap: Number(rule.condition_data?.daily_xp_cap ?? (rule.rule_key === "quiz_completion" ? 200 : 100)), min_accuracy: Number(rule.condition_data?.min_accuracy ?? 70), min_duration_seconds: Number(rule.condition_data?.min_duration_seconds ?? 10) };
    await runAction(() => adminGameRequest(`/admin/reward-rules/${rule.rule_key}`, { method: "PATCH", body: { conditionData: conditions, rewardXp: Number(rule.reward_xp), rewardCredits: Number(rule.reward_credits), limitCount: Number(rule.limit_count), isActive: Boolean(rule.is_active) } }), `Saved ${rule.title}.`);
  }

  if (!authChecked || authLoading) return <div className="flex min-h-[50vh] items-center justify-center text-[#76516f]">Checking admin access…</div>;
  if (!isAuthenticated) return <Panel className="mx-auto max-w-xl p-8 text-center"><ShieldCheck className="mx-auto h-10 w-10 text-[#76516f]" /><h1 className="mt-3 text-xl font-black">Admin sign-in required</h1><Link to="/login" className="mt-4 inline-flex rounded-xl bg-[#694B68] px-4 py-2 text-sm font-bold text-white">Sign in</Link></Panel>;
  if (user?.isAdmin !== true) return <Panel className="mx-auto max-w-xl p-8 text-center"><CircleAlert className="mx-auto h-10 w-10 text-rose-500" /><h1 className="mt-3 text-xl font-black">Access denied</h1><p className="mt-2 text-sm text-[#806f82]">Only the configured CareerLens administrator can manage learning content.</p><Link to="/dashboard" className="mt-4 inline-flex items-center gap-2 text-sm font-bold underline"><ArrowLeft className="h-4 w-4" />Back to dashboard</Link></Panel>;

  const nav = [
    { id: "overview", label: "Overview", icon: Trophy },
    { id: "quizzes", label: "Quizzes", icon: BookOpen },
    { id: "questions", label: "Questions", icon: WandSparkles },
    { id: "games", label: "Games", icon: Gamepad2 },
    { id: "categories", label: "Categories", icon: BookOpen },
    { id: "rewards", label: "Reward rules", icon: Coins },
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5 text-[#29182f] dark:text-[#f7f1fa]">
      <header className="flex flex-col justify-between gap-4 rounded-3xl border border-[#e6d9df] bg-gradient-to-r from-[#fffaf2] via-[#f6eef8] to-[#f0eaff] p-5 dark:border-white/10 dark:from-[#15101b] dark:via-[#1b1126] dark:to-[#100d1d] sm:flex-row sm:items-end sm:p-6">
        <div><span className="inline-flex items-center gap-2 rounded-full border border-[#76516f]/20 bg-white/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#694B68] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#dfc3e5]"><ShieldCheck className="h-3.5 w-3.5" /> Admin workspace</span><h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Quiz & Game Studio<span className="text-[#b58b49]">.</span></h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#806f82] dark:text-[#b7a5ba]">Create, schedule, publish and reward learning activities. Changes go live through the PostgreSQL-backed API.</p><p className="mt-2 text-xs text-[#96869a]">Signed in as {user?.email}</p></div>
        <div className="flex flex-wrap gap-2"><Link to="/admin" className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e6d9df] bg-white/70 px-3 text-xs font-bold dark:border-white/10 dark:bg-white/[0.04]"><ArrowLeft className="h-4 w-4" /> Admin Console</Link><button onClick={toggleTheme} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e6d9df] bg-white/70 px-3 text-xs font-bold dark:border-white/10 dark:bg-white/[0.04]">{theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}{theme === "dark" ? "Light mode" : "Dark mode"}</button><button onClick={loadAll} disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#694B68] px-3 text-xs font-bold text-white disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button></div>
      </header>

      {error && <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />{error}<button onClick={() => setError("")} className="ml-auto underline">Dismiss</button></div>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Quizzes" value={overview?.quizzes?.total} detail={`${overview?.quizzes?.active || 0} active`} icon={BookOpen} /><Metric label="Questions" value={overview?.questions} detail="Stored in PostgreSQL" icon={WandSparkles} /><Metric label="Games" value={overview?.games?.total} detail={`${overview?.games?.active || 0} active`} icon={Gamepad2} /><Metric label="Credits distributed" value={overview?.creditsDistributed} detail={`${overview?.activeLearners7Days || 0} active learners in 7 days`} icon={Trophy} /></div>

      <div className="grid gap-5 lg:grid-cols-[210px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-[#e6d9df] bg-white p-3 dark:border-white/10 dark:bg-[#15101b]"><p className="px-3 pb-2 pt-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#a08ea4]">Content controls</p><nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">{nav.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setSection(item.id)} className={`flex min-w-max items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition lg:w-full ${section === item.id ? "bg-[#f2e7f1] text-[#5f3e60] dark:bg-[#76516f]/25 dark:text-[#f0dcf3]" : "text-[#88778c] hover:bg-[#faf5fa] dark:text-[#b8a8bd] dark:hover:bg-white/[0.05]"}`}><Icon className="h-4 w-4" />{item.label}</button>; })}</nav><div className="mt-4 rounded-xl border border-[#eee2e9] bg-[#fffaf5] p-3 text-[11px] leading-5 text-[#806f82] dark:border-white/10 dark:bg-white/[0.03] dark:text-[#b7a5ba]">Draft content stays hidden. Publish only after adding and reviewing all questions.</div></aside>

        <main className="min-w-0 space-y-4">
          {loading && <Panel className="p-4 text-sm text-[#806f82]">Loading SQL learning data…</Panel>}
          {!loading && section === "overview" && <div className="grid gap-4 xl:grid-cols-2"><Panel className="p-5"><h2 className="font-black">Performance snapshot</h2><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl bg-[#f7eff7] p-4 dark:bg-white/[0.04]"><p className="text-xs text-[#88778c]">All attempts</p><p className="mt-2 text-2xl font-black">{analytics?.summary?.attempts || overview?.attempts?.total || 0}</p></div><div className="rounded-xl bg-[#f7eff7] p-4 dark:bg-white/[0.04]"><p className="text-xs text-[#88778c]">Average accuracy</p><p className="mt-2 text-2xl font-black">{analytics?.summary?.average_accuracy || 0}%</p></div><div className="rounded-xl bg-[#f7eff7] p-4 dark:bg-white/[0.04]"><p className="text-xs text-[#88778c]">Attempts in 7 days</p><p className="mt-2 text-2xl font-black">{overview?.attempts?.recent || 0}</p></div><div className="rounded-xl bg-[#f7eff7] p-4 dark:bg-white/[0.04]"><p className="text-xs text-[#88778c]">XP distributed</p><p className="mt-2 text-2xl font-black">{analytics?.summary?.xp || 0}</p></div></div></Panel><Panel className="p-5"><h2 className="font-black">Category performance</h2>{analytics?.categories?.length ? <div className="mt-3 space-y-3">{analytics.categories.slice(0, 8).map((row) => <div key={row.name}><div className="flex items-center justify-between gap-3 text-xs"><span className="font-bold">{row.name}</span><span className="text-[#88778c]">{row.attempts} attempts · {row.average_accuracy}% avg.</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#eee4eb] dark:bg-white/10"><div className="h-full rounded-full bg-[#8b5cf6]" style={{ width: `${Math.min(100, Number(row.average_accuracy) || 0)}%` }} /></div></div>)}</div> : <p className="mt-3 text-sm text-[#88778c]">No attempts recorded yet.</p>}</Panel></div>}

          {!loading && section === "categories" && <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]"><Panel className="p-5"><h2 className="font-black">Create category</h2><form onSubmit={createCategory} className="mt-4 space-y-3"><Field label="Name"><input className={inputClass} value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required minLength={2} maxLength={80} /></Field><Field label="Description"><textarea className={inputClass} rows={3} value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} maxLength={500} /></Field><Field label="Icon name"><input className={inputClass} value={categoryForm.icon} onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })} maxLength={40} /></Field><button disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-[#694B68] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Plus className="h-4 w-4" />Add category</button></form></Panel><Panel className="overflow-hidden"><div className="border-b border-[#eee4eb] p-4 dark:border-white/10"><h2 className="font-black">Category library</h2></div><div className="divide-y divide-[#f0e7ee] dark:divide-white/[0.06]">{categories.map((category) => <div key={category.id} className="flex items-center justify-between gap-3 p-4"><div><p className="font-bold">{category.name}</p><p className="mt-1 text-xs text-[#88778c]">{category.description || "No description"} · {category.quiz_count} quiz(zes)</p></div><button onClick={() => toggleCategory(category)} disabled={busy} className="inline-flex items-center gap-2 text-xs font-bold"><Status value={category.is_active ? "active" : "inactive"} />{category.is_active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}</button></div>)}</div></Panel></div>}

          {!loading && section === "quizzes" && <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]"><Panel className="p-5"><h2 className="font-black">{editingQuizId ? "Edit quiz settings" : "Create a quiz"}</h2><p className="mt-1 text-xs text-[#88778c]">Set schedule later if needed. Drafts are hidden from learners.</p><form onSubmit={saveQuiz} className="mt-4 space-y-3"><Field label="Title"><input className={inputClass} value={quizForm.title} onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })} required minLength={3} maxLength={160} /></Field><Field label="Description"><textarea className={inputClass} rows={2} value={quizForm.description} onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })} maxLength={1000} /></Field><div className="grid gap-3 sm:grid-cols-2"><Field label="Category"><select className={inputClass} value={quizForm.categoryId} onChange={(e) => setQuizForm({ ...quizForm, categoryId: e.target.value })} required><option value="">Select category</option>{categories.filter((item) => item.is_active).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Difficulty"><select className={inputClass} value={quizForm.difficulty} onChange={(e) => setQuizForm({ ...quizForm, difficulty: e.target.value })}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></Field></div><div className="grid grid-cols-2 gap-3"><Field label="Time limit (seconds)"><input type="number" min="30" max="7200" className={inputClass} value={quizForm.timeLimitSeconds} onChange={(e) => setQuizForm({ ...quizForm, timeLimitSeconds: e.target.value })} /></Field><Field label="XP reward"><input type="number" min="0" max="10000" className={inputClass} value={quizForm.rewardXp} onChange={(e) => setQuizForm({ ...quizForm, rewardXp: e.target.value })} /></Field><Field label="AI credits reward"><input type="number" min="0" max="20" className={inputClass} value={quizForm.rewardCredits} onChange={(e) => setQuizForm({ ...quizForm, rewardCredits: e.target.value })} /></Field><Field label={editingQuizId ? "Status" : "Initial status"}><select className={inputClass} value={quizForm.status} onChange={(e) => setQuizForm({ ...quizForm, status: e.target.value })}><option value="draft">Draft</option><option value="active">Active</option><option value="inactive">Inactive</option></select></Field></div><div className="flex flex-wrap gap-2"><button disabled={busy || !categories.some((item) => item.is_active)} className="inline-flex items-center gap-2 rounded-xl bg-[#694B68] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{editingQuizId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{editingQuizId ? "Save quiz changes" : "Create quiz"}</button>{editingQuizId && <button type="button" onClick={() => { setEditingQuizId(null); setQuizForm((old) => ({ ...blankQuiz, categoryId: old.categoryId })); }} className="rounded-xl border border-[#e6d9df] px-4 py-2.5 text-sm font-bold dark:border-white/10">Cancel edit</button>}</div></form></Panel><Panel className="overflow-hidden"><div className="border-b border-[#eee4eb] p-4 dark:border-white/10"><h2 className="font-black">Quiz library</h2><p className="mt-1 text-xs text-[#88778c]">Publish only quizzes that have questions.</p></div>{quizzes.length?<div className="divide-y divide-[#f0e7ee] dark:divide-white/[0.06]">{quizzes.map((quiz) => <div key={quiz.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><p className="font-bold">{quiz.title}</p><Status value={quiz.status} /></div><p className="mt-1 text-xs text-[#88778c]">{quiz.category_name} · {quiz.difficulty} · {quiz.question_count} questions · {quiz.reward_xp} XP · {quiz.reward_credits} credit(s)</p><p className="mt-1 text-[10px] text-[#9b8ba0]">Created {dateText(quiz.created_at)}</p></div><div className="flex flex-wrap gap-2"><button onClick={() => editQuiz(quiz)} disabled={busy} className="rounded-lg border border-[#e6d9df] px-3 py-2 text-xs font-bold dark:border-white/10">Edit quiz</button><button onClick={() => { setSelectedQuiz(String(quiz.id)); setSection("questions"); }} className="rounded-lg border border-[#e6d9df] px-3 py-2 text-xs font-bold dark:border-white/10">Manage questions</button><button onClick={() => changeStatus("quizzes", quiz)} disabled={busy || Number(quiz.question_count) === 0 && quiz.status !== "inactive"} className="rounded-lg bg-[#694B68] px-3 py-2 text-xs font-bold text-white disabled:opacity-40">{quiz.status === "active" ? "Deactivate" : "Activate"}</button></div></div>)}</div>:<p className="p-5 text-sm text-[#88778c]">Create your first quiz.</p>}</Panel></div>}

          {!loading && section === "questions" && <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]"><Panel className="p-5"><h2 className="font-black">{editingQuestionId ? "Edit question" : "Add questions"}</h2><Field label="Choose quiz"><select className={`${inputClass} mt-2`} value={selectedQuiz} onChange={(e) => { setSelectedQuiz(e.target.value); setEditingQuestionId(null); setQuestionForm({ ...blankQuestion, position: 1 }); }}><option value="">Select quiz</option>{quizzes.map((quiz) => <option key={quiz.id} value={quiz.id}>{quiz.title} · {quiz.status}</option>)}</select></Field><form onSubmit={saveQuestion} className="mt-4 space-y-3"><Field label="Question"><textarea className={inputClass} rows={3} value={questionForm.questionText} onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })} required minLength={5} maxLength={3000} /></Field><div className="grid gap-3 sm:grid-cols-2">{[1,2,3,4].map((n) => <Field key={n} label={`Option ${n}`}><input className={inputClass} value={questionForm[`option${n}`]} onChange={(e) => setQuestionForm({ ...questionForm, [`option${n}`]: e.target.value })} required maxLength={500} /></Field>)}</div><div className="grid gap-3 sm:grid-cols-3"><Field label="Correct answer"><select className={inputClass} value={questionForm.correctOption} onChange={(e) => setQuestionForm({ ...questionForm, correctOption: e.target.value })}>{[0,1,2,3].map((n) => <option key={n} value={n}>Option {n+1}</option>)}</select></Field><Field label="Marks"><input type="number" min="1" max="100" className={inputClass} value={questionForm.marks} onChange={(e) => setQuestionForm({ ...questionForm, marks: e.target.value })} /></Field><Field label="Position"><input type="number" min="1" className={inputClass} value={questionForm.position} onChange={(e) => setQuestionForm({ ...questionForm, position: e.target.value })} /></Field></div><Field label="Explanation (shown after submit)"><textarea className={inputClass} rows={2} value={questionForm.explanation} onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })} maxLength={2000} /></Field><div className="flex flex-wrap gap-2"><button disabled={busy || !selectedQuiz} className="inline-flex items-center gap-2 rounded-xl bg-[#694B68] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Save className="h-4 w-4" />{editingQuestionId ? "Save question" : "Add question"}</button>{editingQuestionId && <button type="button" onClick={() => { setEditingQuestionId(null); setQuestionForm({ ...blankQuestion, position: questions.length+1 }); }} className="inline-flex items-center gap-2 rounded-xl border border-[#e6d9df] px-4 py-2.5 text-sm font-bold dark:border-white/10"><X className="h-4 w-4" />Cancel edit</button>}</div></form></Panel><Panel className="overflow-hidden"><div className="border-b border-[#eee4eb] p-4 dark:border-white/10"><h2 className="font-black">Question bank {selectedQuiz && `· ${quizzes.find((q) => String(q.id) === selectedQuiz)?.title || ""}`}</h2><p className="mt-1 text-xs text-[#88778c]">Correct options stay server-side until an attempt is submitted.</p></div>{questions.length?<div className="divide-y divide-[#f0e7ee] dark:divide-white/[0.06]">{questions.map((question,index)=><div key={question.id} className="p-4"><div className="flex items-start gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f3e9f2] text-xs font-black text-[#76516f] dark:bg-[#76516f]/20 dark:text-[#dfc3e5]">{index+1}</span><div className="min-w-0 flex-1"><p className="font-bold">{question.question_text}</p><div className="mt-2 grid gap-1 sm:grid-cols-2">{question.options?.map((option,optionIndex)=><p key={optionIndex} className={`text-xs ${optionIndex===Number(question.correct_option)?"font-bold text-emerald-600 dark:text-emerald-300":"text-[#88778c]"}`}>{String.fromCharCode(65+optionIndex)}. {option}{optionIndex===Number(question.correct_option)?" ✓":""}</p>)}</div><p className="mt-2 text-[10px] text-[#9b8ba0]">{question.marks} mark(s) · position {question.position}</p></div><div className="flex gap-1"><button title="Edit question" onClick={() => editQuestion(question)} className="rounded-lg border border-[#e6d9df] px-2 py-1.5 text-xs font-bold dark:border-white/10">Edit</button><button title="Delete question" onClick={() => deleteQuestion(question)} className="rounded-lg border border-rose-200 px-2 py-1.5 text-rose-600 dark:border-rose-900/50"><Trash2 className="h-3.5 w-3.5" /></button></div></div></div>)}</div>:<p className="p-5 text-sm text-[#88778c]">Select a quiz and add its first question.</p>}</Panel></div>}

          {!loading && section === "games" && <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]"><Panel className="p-5"><h2 className="font-black">{editingGameId ? "Edit typing sprint" : "Create typing sprint"}</h2><p className="mt-1 text-xs text-[#88778c]">The first game type is a timed typing challenge. The backend calculates accuracy and score; it does not trust a client-supplied score.</p><form onSubmit={saveGame} className="mt-4 space-y-3"><Field label="Title"><input className={inputClass} value={gameForm.title} onChange={(e) => setGameForm({ ...gameForm, title: e.target.value })} required minLength={3} maxLength={160} /></Field><Field label="Description"><textarea className={inputClass} rows={2} value={gameForm.description} onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })} maxLength={1000} /></Field><Field label="Challenge text"><textarea className={inputClass} rows={4} value={gameForm.challengeText} onChange={(e) => setGameForm({ ...gameForm, challengeText: e.target.value })} required maxLength={700} /></Field><div className="grid grid-cols-2 gap-3"><Field label="Time (seconds)"><input type="number" min="30" max="300" className={inputClass} value={gameForm.timeLimitSeconds} onChange={(e) => setGameForm({ ...gameForm, timeLimitSeconds: e.target.value })} /></Field><Field label="XP reward"><input type="number" min="0" max="10000" className={inputClass} value={gameForm.rewardXp} onChange={(e) => setGameForm({ ...gameForm, rewardXp: e.target.value })} /></Field><Field label="Credit reward"><input type="number" min="0" max="10" className={inputClass} value={gameForm.rewardCredits} onChange={(e) => setGameForm({ ...gameForm, rewardCredits: e.target.value })} /></Field><Field label="Status"><select className={inputClass} value={gameForm.status} onChange={(e) => setGameForm({ ...gameForm, status: e.target.value })}><option value="draft">Draft</option><option value="active">Active</option><option value="inactive">Inactive</option></select></Field></div><div className="flex flex-wrap gap-2"><button disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-[#694B68] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{editingGameId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{editingGameId ? "Save game changes" : "Create game"}</button>{editingGameId && <button type="button" onClick={() => { setEditingGameId(null); setGameForm(blankGame); }} className="rounded-xl border border-[#e6d9df] px-4 py-2.5 text-sm font-bold dark:border-white/10">Cancel edit</button>}</div></form></Panel><Panel className="overflow-hidden"><div className="border-b border-[#eee4eb] p-4 dark:border-white/10"><h2 className="font-black">Game library</h2></div>{games.length?<div className="divide-y divide-[#f0e7ee] dark:divide-white/[0.06]">{games.map((game)=><div key={game.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><p className="font-bold">{game.title}</p><Status value={game.status} /></div><p className="mt-1 text-xs text-[#88778c]">Typing sprint · {game.reward_xp} XP · {game.reward_credits} credit(s)</p><p className="mt-1 text-xs text-[#88778c]">{game.description}</p></div><div className="flex gap-2"><button onClick={() => editGame(game)} disabled={busy} className="rounded-lg border border-[#e6dce5] px-3 py-2 text-xs font-bold dark:border-white/10">Edit</button><button onClick={() => changeStatus("games", game)} disabled={busy} className="rounded-lg bg-[#694B68] px-3 py-2 text-xs font-bold text-white">{game.status === "active" ? "Deactivate" : "Activate"}</button></div></div>)}</div>:<p className="p-5 text-sm text-[#88778c]">Create a typing sprint.</p>}</Panel></div>}

          {!loading && section === "rewards" && <div className="space-y-4"><div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100">Keep daily credit and XP limits low in the beginning. Limits apply per activity type (quizzes versus typing sprint). Rewards update the MongoDB AI-credit balance only after server-side validation; XP and credits have separate accounting.</div>{rules.map((rule)=><Panel key={rule.rule_key} className="p-5"><div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"><div className="xl:max-w-xs"><div className="flex items-center gap-2"><h3 className="font-black">{rule.title}</h3><Status value={rule.is_active ? "active" : "inactive"} /></div><p className="mt-1 text-xs text-[#88778c]">Rule key: {rule.rule_key}</p><label className="mt-3 flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={Boolean(rule.is_active)} onChange={(e)=>setRules((old)=>old.map((item)=>item.id===rule.id?{...item,is_active:e.target.checked}:item))} /> Rule enabled</label></div><div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"><Field label="Minimum accuracy (%)"><input type="number" min="0" max="100" className={inputClass} value={rule.condition_data?.min_accuracy ?? 70} onChange={(e)=>setRules((old)=>old.map((item)=>item.id===rule.id?{...item,condition_data:{...(item.condition_data||{}),min_accuracy:Number(e.target.value)}}:item))} /></Field><Field label="Minimum time (sec)"><input type="number" min="0" max="7200" className={inputClass} value={rule.condition_data?.min_duration_seconds ?? 10} onChange={(e)=>setRules((old)=>old.map((item)=>item.id===rule.id?{...item,condition_data:{...(item.condition_data||{}),min_duration_seconds:Number(e.target.value)}}:item))} /></Field><Field label="Daily credit cap (per activity)"><input type="number" min="0" max="100" className={inputClass} value={rule.condition_data?.daily_credit_cap ?? rule.limit_count} onChange={(e)=>setRules((old)=>old.map((item)=>item.id===rule.id?{...item,limit_count:Number(e.target.value),condition_data:{...(item.condition_data||{}),daily_credit_cap:Number(e.target.value)}}:item))} /></Field><Field label="Daily XP cap (per activity)"><input type="number" min="0" max="10000" className={inputClass} value={rule.condition_data?.daily_xp_cap ?? (rule.rule_key === "quiz_completion" ? 200 : 100)} onChange={(e)=>setRules((old)=>old.map((item)=>item.id===rule.id?{...item,condition_data:{...(item.condition_data||{}),daily_xp_cap:Number(e.target.value)}}:item))} /></Field><Field label="XP reward"><input type="number" min="0" max="10000" className={inputClass} value={rule.reward_xp} onChange={(e)=>setRules((old)=>old.map((item)=>item.id===rule.id?{...item,reward_xp:Number(e.target.value)}:item))} /></Field><Field label="Credit reward"><input type="number" min="0" max="20" className={inputClass} value={rule.reward_credits} onChange={(e)=>setRules((old)=>old.map((item)=>item.id===rule.id?{...item,reward_credits:Number(e.target.value)}:item))} /></Field></div><button disabled={busy} onClick={()=>saveRule(rule)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#694B68] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Save className="h-4 w-4" />Save rule</button></div></Panel>)}</div>}
        </main>
      </div>
      <p className="text-xs leading-5 text-[#948399] dark:text-[#9c8da2]">Theme follows CareerLens Light/Dark preferences. All admin operations are protected by the backend ADMIN_EMAIL check. Do not publish a quiz until you have added its questions and reviewed the answer keys.</p>
    </div>
  );
}
