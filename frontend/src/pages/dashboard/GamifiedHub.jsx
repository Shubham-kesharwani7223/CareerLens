// import { useEffect, useMemo, useState } from "react";
// import {
//   ArrowLeft, BookOpen, Brain, CheckCircle2, Clock3, Coins, Gamepad2,
//   Medal, Play, RotateCcw, Sparkles, Target, Trophy, Zap,
// } from "lucide-react";
// import { toast } from "sonner";
// import { API_URL, TOKEN_KEY } from "@/utils/constants";
// import { useAuth } from "@/hooks/useAuth";

// const tabs = [
//   { id: "quizzes", label: "Quizzes", icon: Brain },
//   { id: "games", label: "Games", icon: Gamepad2 },
//   { id: "leaderboard", label: "Leaderboard", icon: Trophy },
//   { id: "wallet", label: "Rewards wallet", icon: Coins },
// ];
// const dateText = (value) => value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";
// const formatTimer = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

// async function gameRequest(path, options = {}) {
//   const token = localStorage.getItem(TOKEN_KEY);
//   const response = await fetch(`${API_URL}/gamification${path}`, {
//     method: options.method || "GET",
//     headers: {
//       Accept: "application/json",
//       ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//     ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
//   });
//   const payload = await response.json().catch(() => ({}));
//   if (!response.ok) throw new Error(payload.message || `Request failed (${response.status})`);
//   return payload.data;
// }

// function Surface({ children, className = "" }) {
//   return <section className={`rounded-2xl border border-[#e6d9df] bg-white shadow-sm dark:border-white/10 dark:bg-[#15101b] ${className}`}>{children}</section>;
// }
// function TinyTag({ children }) {
//   return <span className="inline-flex items-center rounded-full border border-[#76516f]/15 bg-[#76516f]/10 px-2.5 py-1 text-[11px] font-bold text-[#694B68] dark:border-[#b78bb7]/20 dark:bg-[#76516f]/20 dark:text-[#e5c6ed]">{children}</span>;
// }
// function Empty({ title, detail }) {
//   return <div className="px-5 py-12 text-center"><Sparkles className="mx-auto mb-3 h-7 w-7 text-[#9e7a9e]" /><p className="font-bold">{title}</p>{detail && <p className="mt-1 text-sm text-[#8e7b94]">{detail}</p>}</div>;
// }

// export function GamifiedHubPage() {
//   const { user, loadUser } = useAuth();
//   const [tab, setTab] = useState("quizzes");
//   const [categories, setCategories] = useState([]);
//   const [quizzes, setQuizzes] = useState([]);
//   const [games, setGames] = useState([]);
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [period, setPeriod] = useState("week");
//   const [wallet, setWallet] = useState(null);
//   const [categoryId, setCategoryId] = useState("all");
//   const [difficulty, setDifficulty] = useState("all");
//   const [currentQuiz, setCurrentQuiz] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const [result, setResult] = useState(null);
//   const [currentGame, setCurrentGame] = useState(null);
//   const [typedText, setTypedText] = useState("");
//   const [gameResult, setGameResult] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [busy, setBusy] = useState(false);
//   const [error, setError] = useState("");

//   async function refreshCore() {
//     const [categoryData, quizData, gameData, walletData] = await Promise.all([
//       gameRequest("/categories"),
//       gameRequest("/quizzes"),
//       gameRequest("/games"),
//       gameRequest("/wallet"),
//     ]);
//     setCategories(categoryData || []);
//     setQuizzes(quizData || []);
//     setGames(gameData || []);
//     setWallet(walletData || null);
//   }

//   useEffect(() => {
//     let mounted = true;
//     setLoading(true);
//     Promise.all([gameRequest("/categories"), gameRequest("/quizzes"), gameRequest("/games"), gameRequest("/wallet")])
//       .then(([categoryData, quizData, gameData, walletData]) => {
//         if (!mounted) return;
//         setCategories(categoryData || []);
//         setQuizzes(quizData || []);
//         setGames(gameData || []);
//         setWallet(walletData || null);
//       })
//       .catch((err) => { if (mounted) setError(err.message || "Could not load learning hub."); })
//       .finally(() => { if (mounted) setLoading(false); });
//     return () => { mounted = false; };
//   }, []);

//   useEffect(() => {
//     if (!currentQuiz && !currentGame) return undefined;
//     const session = currentQuiz || currentGame;
//     const seconds = currentQuiz ? Number(session.quiz.timeLimitSeconds || 600) : Number(session.timeLimitSeconds || 90);
//     const startedAt = new Date(session.startedAt).getTime();
//     const tick = () => setTimeLeft(Math.max(0, seconds - Math.floor((Date.now() - startedAt) / 1000)));
//     tick();
//     const timer = window.setInterval(tick, 1000);
//     return () => window.clearInterval(timer);
//   }, [currentQuiz, currentGame]);

//   useEffect(() => {
//     if (tab !== "leaderboard") return;
//     let cancelled = false;
//     gameRequest(`/leaderboard?period=${period}`)
//       .then((data) => { if (!cancelled) setLeaderboard(data.items || []); })
//       .catch((err) => { if (!cancelled) setError(err.message || "Could not load leaderboard."); });
//     return () => { cancelled = true; };
//   }, [tab, period]);

//   const filteredQuizzes = useMemo(() => quizzes.filter((quiz) =>
//     (categoryId === "all" || String(quiz.category_id) === categoryId) &&
//     (difficulty === "all" || quiz.difficulty === difficulty)
//   ), [quizzes, categoryId, difficulty]);

//   async function startQuiz(quiz) {
//     setBusy(true); setError(""); setResult(null); setAnswers({});
//     try {
//       const data = await gameRequest(`/quizzes/${quiz.id}/start`, { method: "POST", body: {} });
//       setCurrentQuiz(data);
//       setCurrentGame(null);
//     } catch (err) { setError(err.message || "Could not start quiz."); }
//     finally { setBusy(false); }
//   }

//   async function submitQuiz() {
//     if (!currentQuiz || busy) return;
//     if (timeLeft <= 0) { setError("Time is over. Start the quiz again to try once more."); return; }
//     setBusy(true); setError("");
//     try {
//       const data = await gameRequest(`/attempts/${currentQuiz.attemptId}/submit`, { method: "POST", body: { answers } });
//       setResult(data);
//       await refreshCore();
//       await loadUser().catch(() => {});
//     } catch (err) { setError(err.message || "Could not submit quiz."); }
//     finally { setBusy(false); }
//   }

//   async function startGame(game) {
//     setBusy(true); setError(""); setGameResult(null); setTypedText("");
//     try {
//       const data = await gameRequest(`/games/${game.id}/start`, { method: "POST", body: {} });
//       setCurrentGame({ ...data, startedAt: data.startedAt || new Date().toISOString() });
//       setCurrentQuiz(null); setResult(null);
//     } catch (err) { setError(err.message || "Could not start this game."); }
//     finally { setBusy(false); }
//   }

//   async function submitGame() {
//     if (!currentGame || busy) return;
//     if (timeLeft <= 0) { setError("Time is over. Start a new round."); return; }
//     setBusy(true); setError("");
//     try {
//       const data = await gameRequest(`/games/${currentGame.game.id}/submit`, {
//         method: "POST", body: { attemptId: currentGame.attemptId, typedText },
//       });
//       setGameResult(data);
//       await refreshCore();
//       await loadUser().catch(() => {});
//     } catch (err) { setError(err.message || "Could not submit game."); }
//     finally { setBusy(false); }
//   }

//   function exitActivity() {
//     setCurrentQuiz(null); setCurrentGame(null); setResult(null); setGameResult(null); setAnswers({}); setTypedText(""); setError("");
//   }

//   return (
//     <div className="mx-auto w-full max-w-[1500px] space-y-5 text-[#29182f] dark:text-[#f7f1fa]">
//       <header className="relative overflow-hidden rounded-3xl border border-[#e5d5e7] bg-gradient-to-br from-[#fffaf2] via-[#f7edf9] to-[#eee6ff] p-5 sm:p-7 dark:border-white/10 dark:from-[#15101b] dark:via-[#1a1028] dark:to-[#100d1d]">
//         <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-[#8f4be8]/10 blur-3xl" />
//         <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//           <div>
//             <span className="inline-flex items-center gap-2 rounded-full border border-[#76516f]/20 bg-white/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-[#694B68] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#dfc3e5]"><Sparkles className="h-3.5 w-3.5" /> CareerLens Learn · Play · Earn</span>
//             <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Level up your career<span className="text-[#a855f7]">.</span></h1>
//             <p className="mt-2 max-w-2xl text-sm leading-6 text-[#806f82] dark:text-[#b7a5ba]">Practice aptitude, Java, SQL and DSA. Earn XP, climb the leaderboard and unlock a limited number of AI credits for useful learning.</p>
//           </div>
//           <div className="grid grid-cols-2 gap-2 sm:min-w-[250px]">
//             <div className="rounded-2xl border border-white/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.04]"><p className="text-xs text-[#88778c] dark:text-[#b8a8bd]">AI credits</p><p className="mt-1 flex items-center gap-2 text-2xl font-black"><Coins className="h-5 w-5 text-[#b58b49]" />{wallet?.aiCredits ?? user?.aiCredits ?? 0}</p></div>
//             <div className="rounded-2xl border border-white/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.04]"><p className="text-xs text-[#88778c] dark:text-[#b8a8bd]">Total XP</p><p className="mt-1 flex items-center gap-2 text-2xl font-black"><Zap className="h-5 w-5 text-violet-500" />{wallet?.xp ?? 0}</p></div>
//           </div>
//         </div>
//       </header>

//       <div className="flex gap-2 overflow-x-auto border-b border-[#e6d9df] pb-3 dark:border-white/10">
//         {tabs.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => { exitActivity(); setTab(item.id); }} className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${tab === item.id ? "bg-[#694B68] text-white shadow-sm" : "text-[#806f82] hover:bg-white dark:text-[#b7a5ba] dark:hover:bg-white/[0.05]"}`}><Icon className="h-4 w-4" />{item.label}</button>; })}
//       </div>

//       {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">{error}<button onClick={() => setError("")} className="ml-3 font-bold underline">Dismiss</button></div>}
//       {loading && <Surface className="p-5 text-sm text-[#806f82] dark:text-[#b7a5ba]">Loading your learning space…</Surface>}

//       {!loading && tab === "quizzes" && !currentQuiz && !result && (
//         <>
//           <div className="grid gap-3 sm:grid-cols-3">
//             <Surface className="p-4"><div className="flex items-center gap-3"><div className="rounded-xl bg-violet-100 p-3 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"><BookOpen className="h-5 w-5" /></div><div><p className="text-sm text-[#88778c] dark:text-[#b8a8bd]">Available quizzes</p><p className="text-2xl font-black">{quizzes.length}</p></div></div></Surface>
//             <Surface className="p-4"><div className="flex items-center gap-3"><div className="rounded-xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"><Trophy className="h-5 w-5" /></div><div><p className="text-sm text-[#88778c] dark:text-[#b8a8bd]">Reward XP</p><p className="text-2xl font-black">Up to 40+</p></div></div></Surface>
//             <Surface className="p-4"><div className="flex items-center gap-3"><div className="rounded-xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"><Coins className="h-5 w-5" /></div><div><p className="text-sm text-[#88778c] dark:text-[#b8a8bd]">Credit rewards</p><p className="text-2xl font-black">Daily capped</p></div></div></Surface>
//           </div>
//           <div className="flex flex-col gap-3 sm:flex-row">
//             <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="rounded-xl border border-[#e6d9df] bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#15101b]"><option value="all">All categories</option>{categories.map((cat) => <option key={cat.id} value={String(cat.id)}>{cat.name}</option>)}</select>
//             <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="rounded-xl border border-[#e6d9df] bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#15101b]"><option value="all">All levels</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select>
//           </div>
//           {filteredQuizzes.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredQuizzes.map((quiz) => <Surface key={quiz.id} className="flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3e9f2] text-[#76516f] dark:bg-[#76516f]/20 dark:text-[#dfc3e5]"><Brain className="h-5 w-5" /></span><TinyTag>{quiz.difficulty}</TinyTag></div><p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#9a879c]">{quiz.category_name}</p><h3 className="mt-1 text-lg font-black">{quiz.title}</h3><p className="mt-2 flex-1 text-sm leading-6 text-[#806f82] dark:text-[#b7a5ba]">{quiz.description || "Test your knowledge and earn XP by learning."}</p><div className="mt-4 flex flex-wrap gap-2"><TinyTag>{quiz.question_count} questions</TinyTag><TinyTag><Clock3 className="mr-1 inline h-3 w-3" />{Math.ceil(Number(quiz.time_limit_seconds) / 60)} min</TinyTag><TinyTag><Zap className="mr-1 inline h-3 w-3" />{quiz.reward_xp} XP</TinyTag></div><div className="mt-4 flex items-center justify-between border-t border-[#eee4eb] pt-4 dark:border-white/10"><span className="text-xs text-[#88778c]">Up to {quiz.reward_credits} credit(s), if eligible</span><button disabled={busy || !Number(quiz.question_count)} onClick={() => startQuiz(quiz)} className="inline-flex items-center gap-2 rounded-xl bg-[#694B68] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Play className="h-4 w-4" />Start</button></div></Surface>)}</div> : <Surface><Empty title="No quizzes match these filters" detail="The administrator can publish more quizzes from the Quiz & Game Studio." /></Surface>}
//         </>
//       )}

//       {!loading && tab === "quizzes" && currentQuiz && !result && <Surface className="mx-auto max-w-4xl overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee4eb] p-4 dark:border-white/10 sm:p-5"><div><button onClick={exitActivity} className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-[#88778c] hover:text-[#694B68]"><ArrowLeft className="h-3.5 w-3.5" /> Exit quiz</button><h2 className="text-xl font-black">{currentQuiz.quiz.title}</h2><p className="mt-1 text-xs text-[#88778c]">Question {Math.min(Object.keys(answers).length + 1, currentQuiz.questions.length)} of {currentQuiz.questions.length} · {currentQuiz.quiz.category_name}</p></div><div className={`rounded-xl px-4 py-2 text-sm font-black ${timeLeft < 30 ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" : "bg-[#f3e9f2] text-[#694B68] dark:bg-[#76516f]/20 dark:text-[#e6c9eb]"}`}><Clock3 className="mr-2 inline h-4 w-4" />{formatTimer(timeLeft)}</div></div><div className="space-y-5 p-4 sm:p-6">{currentQuiz.questions.map((question, index) => <div key={question.id} className="rounded-xl border border-[#eee4eb] p-4 dark:border-white/10"><div className="flex items-start gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#694B68] text-xs font-black text-white">{index + 1}</span><div className="flex-1"><p className="font-bold leading-6">{question.questionText}</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{question.options.map((option, optionIndex) => <label key={optionIndex} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${answers[String(question.id)] === optionIndex ? "border-[#76516f] bg-[#f3e9f2] dark:border-[#b78bb7] dark:bg-[#76516f]/20" : "border-[#eee4eb] hover:bg-[#fbf7fb] dark:border-white/10 dark:hover:bg-white/[0.04]"}`}><input type="radio" name={`q-${question.id}`} checked={answers[String(question.id)] === optionIndex} onChange={() => setAnswers((old) => ({ ...old, [String(question.id)]: optionIndex }))} />{option}</label>)}</div></div></div></div>)}<div className="flex flex-col gap-3 border-t border-[#eee4eb] pt-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-[#88778c]">Your answers are checked on the server after submission.</p><button onClick={submitQuiz} disabled={busy || timeLeft <= 0} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#694B68] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? "Submitting…" : "Submit answers"}<CheckCircle2 className="h-4 w-4" /></button></div></div></Surface>}

//       {!loading && tab === "quizzes" && result && <Surface className="mx-auto max-w-3xl p-5 text-center sm:p-8"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300"><Trophy className="h-8 w-8" /></div><p className="mt-4 text-xs font-black uppercase tracking-[0.15em] text-[#927a97]">Quiz results</p><h2 className="mt-1 text-3xl font-black">{result.accuracy}% accuracy</h2><p className="mt-2 text-sm text-[#806f82] dark:text-[#b7a5ba]">You scored {result.score} / {result.totalMarks} marks in {result.timeTakenSeconds}s.</p><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="rounded-xl bg-[#f5edf7] p-4 dark:bg-white/[0.04]"><Zap className="mx-auto h-5 w-5 text-violet-500" /><p className="mt-2 text-xl font-black">+{result.xpEarned} XP</p></div><div className="rounded-xl bg-[#fff5df] p-4 dark:bg-amber-500/10"><Coins className="mx-auto h-5 w-5 text-[#b58b49]" /><p className="mt-2 text-xl font-black">+{result.creditsEarned} credits</p></div><div className="col-span-2 rounded-xl bg-[#f0f8f3] p-4 dark:col-span-1 dark:bg-emerald-500/10"><Target className="mx-auto h-5 w-5 text-emerald-600 dark:text-emerald-300" /><p className="mt-2 text-sm font-black">{result.passed ? "Reward criteria met" : "Keep practising"}</p></div></div>{result.review?.length > 0 && <div className="mt-6 space-y-3 text-left"><h3 className="font-black">Answer review</h3>{result.review.map((item,index)=><div key={item.id} className="rounded-xl border border-[#eee4eb] p-4 dark:border-white/10"><p className="font-semibold">{index+1}. {item.questionText}</p><p className={`mt-2 text-xs font-bold ${item.isCorrect ? "text-emerald-600" : "text-rose-600"}`}>{item.isCorrect ? "Correct" : `Correct answer: ${item.options[item.correctOption]}`}</p>{item.explanation && <p className="mt-1 text-sm text-[#806f82] dark:text-[#b7a5ba]">{item.explanation}</p>}</div>)}</div>}<button onClick={() => { exitActivity(); setTab("quizzes"); }} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#694B68] px-5 py-3 text-sm font-bold text-white"><RotateCcw className="h-4 w-4" />Play another quiz</button></Surface>}

//       {!loading && tab === "games" && !currentGame && !gameResult && <><div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-100"><Zap className="mr-2 inline h-4 w-4" />Daily reward limits help keep free AI credits sustainable. XP remains useful for your leaderboard even when your daily credit cap is reached.</div>{games.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{games.map((game)=><Surface key={game.id} className="p-5"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e9f2] text-[#76516f] dark:bg-[#76516f]/20 dark:text-[#dfc3e5]"><Gamepad2 className="h-6 w-6" /></span><h3 className="mt-4 text-lg font-black">{game.title}</h3><p className="mt-2 min-h-12 text-sm text-[#806f82] dark:text-[#b7a5ba]">{game.description || "A quick typing challenge to sharpen focus and speed."}</p><div className="mt-4 flex gap-2"><TinyTag>Typing sprint</TinyTag><TinyTag>+{game.reward_xp ?? game.rewardXp} XP</TinyTag></div><button disabled={busy} onClick={() => startGame(game)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#694B68] px-4 py-3 text-sm font-bold text-white disabled:opacity-50"><Play className="h-4 w-4" />Play challenge</button></Surface>)}</div> : <Surface><Empty title="No active games yet" detail="The admin can publish a typing sprint from the Quiz & Game Studio." /></Surface>}</>}
//       {!loading && tab === "games" && currentGame && !gameResult && <Surface className="mx-auto max-w-3xl p-5 sm:p-7"><div className="flex items-center justify-between gap-3"><div><button onClick={exitActivity} className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-[#88778c]"><ArrowLeft className="h-3.5 w-3.5" /> Exit game</button><h2 className="text-2xl font-black">{currentGame.game.title}</h2><p className="mt-1 text-sm text-[#806f82] dark:text-[#b7a5ba]">Type the challenge as accurately and quickly as possible.</p></div><span className="rounded-xl bg-[#f3e9f2] px-4 py-2 text-sm font-black text-[#694B68] dark:bg-[#76516f]/20 dark:text-[#dfc3e5]">{formatTimer(timeLeft)}</span></div><div className="mt-5 rounded-xl border border-[#e6d9df] bg-[#fffaf2] p-4 text-base leading-7 dark:border-white/10 dark:bg-white/[0.03]">{currentGame.challengeText}</div><textarea value={typedText} onChange={(e) => setTypedText(e.target.value)} rows={5} placeholder="Start typing here…" className="mt-3 w-full rounded-xl border border-[#e6d9df] bg-white p-4 text-sm leading-6 outline-none focus:border-[#76516f] dark:border-white/10 dark:bg-[#100b16]" /><div className="mt-3 flex items-center justify-between gap-3"><span className="text-xs text-[#88778c]">{typedText.length} characters entered</span><button onClick={submitGame} disabled={busy || timeLeft <= 0 || !typedText.trim()} className="rounded-xl bg-[#694B68] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? "Checking…" : "Submit challenge"}</button></div></Surface>}
//       {!loading && tab === "games" && gameResult && <Surface className="mx-auto max-w-2xl p-7 text-center"><Trophy className="mx-auto h-12 w-12 text-amber-500" /><h2 className="mt-3 text-2xl font-black">Challenge complete!</h2><p className="mt-2 text-4xl font-black">{gameResult.score}/100</p><p className="mt-2 text-sm text-[#806f82] dark:text-[#b7a5ba]">Accuracy {gameResult.accuracy}% · {gameResult.wpm} WPM</p><div className="mt-5 flex justify-center gap-3"><TinyTag>+{gameResult.xpEarned} XP</TinyTag><TinyTag>+{gameResult.creditsEarned} credits</TinyTag></div><button onClick={exitActivity} className="mt-6 rounded-xl bg-[#694B68] px-5 py-3 text-sm font-bold text-white">Back to games</button></Surface>}

//       {!loading && tab === "leaderboard" && <Surface className="overflow-hidden"><div className="flex flex-col gap-3 border-b border-[#eee4eb] p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-black">Learning leaderboard</h2><p className="mt-1 text-xs text-[#88778c]">Ranked by XP, then accuracy. Credits do not determine rank.</p></div><div className="flex gap-2">{[{id:"week",label:"Weekly"},{id:"month",label:"Monthly"},{id:"all",label:"All time"}].map((option)=><button key={option.id} onClick={()=>setPeriod(option.id)} className={`rounded-lg px-3 py-2 text-xs font-bold ${period===option.id?"bg-[#694B68] text-white":"border border-[#e6d9df] dark:border-white/10"}`}>{option.label}</button>)}</div></div>{leaderboard.length?<div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-[#faf5fa] text-[10px] uppercase tracking-wider text-[#88778c] dark:bg-white/[0.035]"><tr><th className="px-4 py-3">Rank</th><th className="px-4 py-3">Learner</th><th className="px-4 py-3">XP</th><th className="px-4 py-3">Credits earned</th><th className="px-4 py-3">Attempts</th><th className="px-4 py-3">Accuracy</th></tr></thead><tbody className="divide-y divide-[#f0e7ee] dark:divide-white/[0.06]">{leaderboard.map((row)=><tr key={row.userId} className={row.userId===user?.id?"bg-[#f3e9f2] dark:bg-[#76516f]/20":""}><td className="px-4 py-3 font-black">{row.rank===1?<Trophy className="h-4 w-4 text-amber-500" />:row.rank<=3?<Medal className="h-4 w-4 text-[#76516f]" />:`#${row.rank}`}</td><td className="px-4 py-3 font-bold">{row.name}{row.userId===user?.id?" (You)":""}</td><td className="px-4 py-3 font-black">{row.xp}</td><td className="px-4 py-3">{row.credits}</td><td className="px-4 py-3">{row.attempts}</td><td className="px-4 py-3">{row.averageAccuracy}%</td></tr>)}</tbody></table></div>:<Empty title="Leaderboard is waiting for its first players" detail="Complete a quiz to appear here." />}</Surface>}

//       {!loading && tab === "wallet" && <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]"><Surface className="p-5"><h2 className="text-lg font-black">My rewards & credits</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1"><div className="rounded-xl border border-[#eee4eb] p-4 dark:border-white/10"><p className="text-xs text-[#88778c]">Available AI credits</p><p className="mt-2 flex items-center gap-2 text-3xl font-black"><Coins className="h-6 w-6 text-[#b58b49]" />{wallet?.aiCredits ?? 0}</p><p className="mt-1 text-xs text-[#88778c]">Used for eligible CareerLens AI features.</p><a href="/purchase" className="mt-3 inline-flex text-sm font-bold text-[#76516f] underline dark:text-[#dfc3e5]">Buy more credits</a></div><div className="rounded-xl border border-[#eee4eb] p-4 dark:border-white/10"><p className="text-xs text-[#88778c]">Lifetime XP</p><p className="mt-2 text-3xl font-black">{wallet?.xp ?? 0}</p><p className="mt-1 text-xs text-[#88778c]">Used for leaderboard ranking.</p></div><div className="rounded-xl border border-[#eee4eb] p-4 dark:border-white/10"><p className="text-xs text-[#88778c]">Credits earned in games</p><p className="mt-2 text-2xl font-black">{wallet?.earnedCredits ?? 0}</p></div><div className="rounded-xl border border-[#eee4eb] p-4 dark:border-white/10"><p className="text-xs text-[#88778c]">Completed attempts</p><p className="mt-2 text-2xl font-black">{wallet?.attempts ?? 0}</p></div></div></Surface><Surface className="overflow-hidden"><div className="border-b border-[#eee4eb] p-4 dark:border-white/10"><h2 className="font-black">Reward transaction history</h2><p className="mt-1 text-xs text-[#88778c]">Reward records from quiz and game activity.</p></div>{wallet?.history?.length?<div className="divide-y divide-[#f0e7ee] dark:divide-white/[0.06]">{wallet.history.map((row,index)=><div key={`${row.source_type}-${row.source_id}-${index}`} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="text-sm font-bold">{String(row.source_type).replace(/_/g," ").replace(/^./,(c)=>c.toUpperCase())}</p><p className="mt-1 text-xs text-[#88778c]">{dateText(row.created_at)} · {row.status}</p></div><div className="text-right"><p className="text-sm font-black text-violet-600 dark:text-violet-300">+{row.xp_earned} XP</p><p className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">+{row.credits_earned} credits</p></div></div>)}</div>:<Empty title="No rewards yet" detail="Your completed learning activities will appear here." />}</Surface></div>}
//     </div>
//   );
// }


































































import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, BookOpen, Brain, CheckCircle2, Clock3, Coins, Gamepad2,
  Medal, Play, RotateCcw, Sparkles, Target, Trophy, Zap,
} from "lucide-react";
import { toast } from "sonner";
import { API_URL, TOKEN_KEY } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuth";

const tabs = [
  { id: "quizzes", label: "Quizzes", icon: Brain },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "wallet", label: "Rewards wallet", icon: Coins },
];

const dateText = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

const formatTimer = (seconds) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60,
  ).padStart(2, "0")}`;

async function gameRequest(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);

  const response = await fetch(`${API_URL}/gamification${path}`, {
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

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload.message || `Request failed (${response.status})`,
    );
  }

  return payload.data;
}

function Surface({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#e6d9df] bg-white shadow-sm dark:border-white/10 dark:bg-[#15101b] ${className}`}
    >
      {children}
    </section>
  );
}

function TinyTag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#76516f]/15 bg-[#76516f]/10 px-2.5 py-1 text-[11px] font-bold text-[#694B68] dark:border-[#b78bb7]/20 dark:bg-[#76516f]/20 dark:text-[#e5c6ed]">
      {children}
    </span>
  );
}

function Empty({ title, detail }) {
  return (
    <div className="px-5 py-12 text-center">
      <Sparkles className="mx-auto mb-3 h-7 w-7 text-[#9e7a9e]" />
      <p className="font-bold">{title}</p>
      {detail && (
        <p className="mt-1 text-sm text-[#8e7b94]">{detail}</p>
      )}
    </div>
  );
}

export function GamifiedHubPage({ initialTab = "quizzes" }) {
  const { user, loadUser } = useAuth();

  const [tab, setTab] = useState(initialTab);
  const [categories, setCategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [games, setGames] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [period, setPeriod] = useState("week");
  const [wallet, setWallet] = useState(null);
  const [categoryId, setCategoryId] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);
  const [typedText, setTypedText] = useState("");
  const [gameResult, setGameResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function refreshCore() {
    const [
      categoryData,
      quizData,
      gameData,
      walletData,
    ] = await Promise.all([
      gameRequest("/categories"),
      gameRequest("/quizzes"),
      gameRequest("/games"),
      gameRequest("/wallet"),
    ]);

    setCategories(categoryData || []);
    setQuizzes(quizData || []);
    setGames(gameData || []);
    setWallet(walletData || null);
  }

  // Select the appropriate tab when opened from a sidebar route.
  useEffect(() => {
    setTab(initialTab);
    setCurrentQuiz(null);
    setCurrentGame(null);
    setResult(null);
    setGameResult(null);
    setAnswers({});
    setTypedText("");
    setError("");
  }, [initialTab]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([
      gameRequest("/categories"),
      gameRequest("/quizzes"),
      gameRequest("/games"),
      gameRequest("/wallet"),
    ])
      .then(([categoryData, quizData, gameData, walletData]) => {
        if (!mounted) return;

        setCategories(categoryData || []);
        setQuizzes(quizData || []);
        setGames(gameData || []);
        setWallet(walletData || null);
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || "Could not load learning hub.");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!currentQuiz && !currentGame) return undefined;

    const session = currentQuiz || currentGame;
    const seconds = currentQuiz
      ? Number(session.quiz.timeLimitSeconds || 600)
      : Number(session.timeLimitSeconds || 90);

    const startedAt = new Date(session.startedAt).getTime();

    const tick = () =>
      setTimeLeft(
        Math.max(
          0,
          seconds - Math.floor((Date.now() - startedAt) / 1000),
        ),
      );

    tick();

    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [currentQuiz, currentGame]);

  useEffect(() => {
    if (tab !== "leaderboard") return undefined;

    let cancelled = false;

    gameRequest(`/leaderboard?period=${period}`)
      .then((data) => {
        if (!cancelled) setLeaderboard(data.items || []);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Could not load leaderboard.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [tab, period]);

  const filteredQuizzes = useMemo(
    () =>
      quizzes.filter(
        (quiz) =>
          (categoryId === "all" ||
            String(quiz.category_id) === categoryId) &&
          (difficulty === "all" || quiz.difficulty === difficulty),
      ),
    [quizzes, categoryId, difficulty],
  );

  async function startQuiz(quiz) {
    setBusy(true);
    setError("");
    setResult(null);
    setAnswers({});

    try {
      const data = await gameRequest(
        `/quizzes/${quiz.id}/start`,
        { method: "POST", body: {} },
      );

      setCurrentQuiz(data);
      setCurrentGame(null);
    } catch (err) {
      setError(err.message || "Could not start quiz.");
    } finally {
      setBusy(false);
    }
  }

  async function submitQuiz() {
    if (!currentQuiz || busy) return;

    if (timeLeft <= 0) {
      setError("Time is over. Start the quiz again to try once more.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const data = await gameRequest(
        `/attempts/${currentQuiz.attemptId}/submit`,
        { method: "POST", body: { answers } },
      );

      setResult(data);
      await refreshCore();
      await loadUser().catch(() => {});
    } catch (err) {
      setError(err.message || "Could not submit quiz.");
    } finally {
      setBusy(false);
    }
  }

  async function startGame(game) {
    setBusy(true);
    setError("");
    setGameResult(null);
    setTypedText("");

    try {
      const data = await gameRequest(
        `/games/${game.id}/start`,
        { method: "POST", body: {} },
      );

      setCurrentGame({
        ...data,
        startedAt: data.startedAt || new Date().toISOString(),
      });

      setCurrentQuiz(null);
      setResult(null);
    } catch (err) {
      setError(err.message || "Could not start this game.");
    } finally {
      setBusy(false);
    }
  }

  async function submitGame() {
    if (!currentGame || busy) return;

    if (timeLeft <= 0) {
      setError("Time is over. Start a new round.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const data = await gameRequest(
        `/games/${currentGame.game.id}/submit`,
        {
          method: "POST",
          body: {
            attemptId: currentGame.attemptId,
            typedText,
          },
        },
      );

      setGameResult(data);
      await refreshCore();
      await loadUser().catch(() => {});
    } catch (err) {
      setError(err.message || "Could not submit game.");
    } finally {
      setBusy(false);
    }
  }

  function exitActivity() {
    setCurrentQuiz(null);
    setCurrentGame(null);
    setResult(null);
    setGameResult(null);
    setAnswers({});
    setTypedText("");
    setError("");
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-5 text-[#29182f] dark:text-[#f7f1fa]">
      <header className="relative overflow-hidden rounded-3xl border border-[#e5d5e7] bg-gradient-to-br from-[#fffaf2] via-[#f7edf9] to-[#eee6ff] p-5 sm:p-7 dark:border-white/10 dark:from-[#15101b] dark:via-[#1a1028] dark:to-[#100d1d]">
        <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-[#8f4be8]/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#76516f]/20 bg-white/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-[#694B68] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#dfc3e5]">
              <Sparkles className="h-3.5 w-3.5" />
              CareerLens Learn · Play · Earn
            </span>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Level up your career
              <span className="text-[#a855f7]">.</span>
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#806f82] dark:text-[#b7a5ba]">
              Practice aptitude, Java, SQL and DSA. Earn XP, climb the
              leaderboard and unlock a limited number of AI credits for useful
              learning.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:min-w-[250px]">
            <div className="rounded-2xl border border-white/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-xs text-[#88778c] dark:text-[#b8a8bd]">
                AI credits
              </p>
              <p className="mt-1 flex items-center gap-2 text-2xl font-black">
                <Coins className="h-5 w-5 text-[#b58b49]" />
                {wallet?.aiCredits ?? user?.aiCredits ?? 0}
              </p>
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-xs text-[#88778c] dark:text-[#b8a8bd]">
                Total XP
              </p>
              <p className="mt-1 flex items-center gap-2 text-2xl font-black">
                <Zap className="h-5 w-5 text-violet-500" />
                {wallet?.xp ?? 0}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto border-b border-[#e6d9df] pb-3 dark:border-white/10">
        {tabs.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                exitActivity();
                setTab(item.id);
              }}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                tab === item.id
                  ? "bg-[#694B68] text-white shadow-sm"
                  : "text-[#806f82] hover:bg-white dark:text-[#b7a5ba] dark:hover:bg-white/[0.05]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200"
        >
          {error}
          <button
            onClick={() => setError("")}
            className="ml-3 font-bold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading && (
        <Surface className="p-5 text-sm text-[#806f82] dark:text-[#b7a5ba]">
          Loading your learning space…
        </Surface>
      )}

      {!loading && tab === "quizzes" && !currentQuiz && !result && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Surface className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-100 p-3 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-[#88778c] dark:text-[#b8a8bd]">
                    Available quizzes
                  </p>
                  <p className="text-2xl font-black">{quizzes.length}</p>
                </div>
              </div>
            </Surface>

            <Surface className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-[#88778c] dark:text-[#b8a8bd]">
                    Reward XP
                  </p>
                  <p className="text-2xl font-black">Up to 40+</p>
                </div>
              </div>
            </Surface>

            <Surface className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-[#88778c] dark:text-[#b8a8bd]">
                    Credit rewards
                  </p>
                  <p className="text-2xl font-black">Daily capped</p>
                </div>
              </div>
            </Surface>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="rounded-xl border border-[#e6d9df] bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#15101b]"
            >
              <option value="all">All categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="rounded-xl border border-[#e6d9df] bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#15101b]"
            >
              <option value="all">All levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {filteredQuizzes.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredQuizzes.map((quiz) => (
                <Surface
                  key={quiz.id}
                  className="flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3e9f2] text-[#76516f] dark:bg-[#76516f]/20 dark:text-[#dfc3e5]">
                      <Brain className="h-5 w-5" />
                    </span>
                    <TinyTag>{quiz.difficulty}</TinyTag>
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#9a879c]">
                    {quiz.category_name}
                  </p>

                  <h3 className="mt-1 text-lg font-black">{quiz.title}</h3>

                  <p className="mt-2 flex-1 text-sm leading-6 text-[#806f82] dark:text-[#b7a5ba]">
                    {quiz.description ||
                      "Test your knowledge and earn XP by learning."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <TinyTag>{quiz.question_count} questions</TinyTag>
                    <TinyTag>
                      <Clock3 className="mr-1 inline h-3 w-3" />
                      {Math.ceil(Number(quiz.time_limit_seconds) / 60)} min
                    </TinyTag>
                    <TinyTag>
                      <Zap className="mr-1 inline h-3 w-3" />
                      {quiz.reward_xp} XP
                    </TinyTag>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#eee4eb] pt-4 dark:border-white/10">
                    <span className="text-xs text-[#88778c]">
                      Up to {quiz.reward_credits} credit(s), if eligible
                    </span>

                    <button
                      disabled={busy || !Number(quiz.question_count)}
                      onClick={() => startQuiz(quiz)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#694B68] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                    >
                      <Play className="h-4 w-4" />
                      Start
                    </button>
                  </div>
                </Surface>
              ))}
            </div>
          ) : (
            <Surface>
              <Empty
                title="No quizzes match these filters"
                detail="The administrator can publish more quizzes from the Quiz & Game Studio."
              />
            </Surface>
          )}
        </>
      )}

      {!loading && tab === "quizzes" && currentQuiz && !result && (
        <Surface className="mx-auto max-w-4xl overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee4eb] p-4 dark:border-white/10 sm:p-5">
            <div>
              <button
                onClick={exitActivity}
                className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-[#88778c] hover:text-[#694B68]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Exit quiz
              </button>

              <h2 className="text-xl font-black">
                {currentQuiz.quiz.title}
              </h2>

              <p className="mt-1 text-xs text-[#88778c]">
                Question{" "}
                {Math.min(
                  Object.keys(answers).length + 1,
                  currentQuiz.questions.length,
                )}{" "}
                of {currentQuiz.questions.length} ·{" "}
                {currentQuiz.quiz.category_name}
              </p>
            </div>

            <div
              className={`rounded-xl px-4 py-2 text-sm font-black ${
                timeLeft < 30
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                  : "bg-[#f3e9f2] text-[#694B68] dark:bg-[#76516f]/20 dark:text-[#e6c9eb]"
              }`}
            >
              <Clock3 className="mr-2 inline h-4 w-4" />
              {formatTimer(timeLeft)}
            </div>
          </div>

          <div className="space-y-5 p-4 sm:p-6">
            {currentQuiz.questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-xl border border-[#eee4eb] p-4 dark:border-white/10"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#694B68] text-xs font-black text-white">
                    {index + 1}
                  </span>

                  <div className="flex-1">
                    <p className="font-bold leading-6">
                      {question.questionText}
                    </p>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {question.options.map((option, optionIndex) => (
                        <label
                          key={optionIndex}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                            answers[String(question.id)] === optionIndex
                              ? "border-[#76516f] bg-[#f3e9f2] dark:border-[#b78bb7] dark:bg-[#76516f]/20"
                              : "border-[#eee4eb] hover:bg-[#fbf7fb] dark:border-white/10 dark:hover:bg-white/[0.04]"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${question.id}`}
                            checked={
                              answers[String(question.id)] === optionIndex
                            }
                            onChange={() =>
                              setAnswers((old) => ({
                                ...old,
                                [String(question.id)]: optionIndex,
                              }))
                            }
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-3 border-t border-[#eee4eb] pt-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#88778c]">
                Your answers are checked on the server after submission.
              </p>

              <button
                onClick={submitQuiz}
                disabled={busy || timeLeft <= 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#694B68] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {busy ? "Submitting…" : "Submit answers"}
                <CheckCircle2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Surface>
      )}

      {!loading && tab === "quizzes" && result && (
        <Surface className="mx-auto max-w-3xl p-5 text-center sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
            <Trophy className="h-8 w-8" />
          </div>

          <p className="mt-4 text-xs font-black uppercase tracking-[0.15em] text-[#927a97]">
            Quiz results
          </p>

          <h2 className="mt-1 text-3xl font-black">
            {result.accuracy}% accuracy
          </h2>

          <p className="mt-2 text-sm text-[#806f82] dark:text-[#b7a5ba]">
            You scored {result.score} / {result.totalMarks} marks in{" "}
            {result.timeTakenSeconds}s.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-[#f5edf7] p-4 dark:bg-white/[0.04]">
              <Zap className="mx-auto h-5 w-5 text-violet-500" />
              <p className="mt-2 text-xl font-black">
                +{result.xpEarned} XP
              </p>
            </div>

            <div className="rounded-xl bg-[#fff5df] p-4 dark:bg-amber-500/10">
              <Coins className="mx-auto h-5 w-5 text-[#b58b49]" />
              <p className="mt-2 text-xl font-black">
                +{result.creditsEarned} credits
              </p>
            </div>

            <div className="col-span-2 rounded-xl bg-[#f0f8f3] p-4 dark:col-span-1 dark:bg-emerald-500/10">
              <Target className="mx-auto h-5 w-5 text-emerald-600 dark:text-emerald-300" />
              <p className="mt-2 text-sm font-black">
                {result.passed ? "Reward criteria met" : "Keep practising"}
              </p>
            </div>
          </div>

          {result.review?.length > 0 && (
            <div className="mt-6 space-y-3 text-left">
              <h3 className="font-black">Answer review</h3>

              {result.review.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#eee4eb] p-4 dark:border-white/10"
                >
                  <p className="font-semibold">
                    {index + 1}. {item.questionText}
                  </p>

                  <p
                    className={`mt-2 text-xs font-bold ${
                      item.isCorrect
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {item.isCorrect
                      ? "Correct"
                      : `Correct answer: ${item.options[item.correctOption]}`}
                  </p>

                  {item.explanation && (
                    <p className="mt-1 text-sm text-[#806f82] dark:text-[#b7a5ba]">
                      {item.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              exitActivity();
              setTab("quizzes");
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#694B68] px-5 py-3 text-sm font-bold text-white"
          >
            <RotateCcw className="h-4 w-4" />
            Play another quiz
          </button>
        </Surface>
      )}

      {!loading && tab === "games" && !currentGame && !gameResult && (
        <>
          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-100">
            <Zap className="mr-2 inline h-4 w-4" />
            Daily reward limits help keep free AI credits sustainable. XP
            remains useful for your leaderboard even when your daily credit
            cap is reached.
          </div>

          {games.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {games.map((game) => (
                <Surface key={game.id} className="p-5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e9f2] text-[#76516f] dark:bg-[#76516f]/20 dark:text-[#dfc3e5]">
                    <Gamepad2 className="h-6 w-6" />
                  </span>

                  <h3 className="mt-4 text-lg font-black">{game.title}</h3>

                  <p className="mt-2 min-h-12 text-sm text-[#806f82] dark:text-[#b7a5ba]">
                    {game.description ||
                      "A quick typing challenge to sharpen focus and speed."}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <TinyTag>Typing sprint</TinyTag>
                    <TinyTag>
                      +{game.reward_xp ?? game.rewardXp} XP
                    </TinyTag>
                  </div>

                  <button
                    disabled={busy}
                    onClick={() => startGame(game)}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#694B68] px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                  >
                    <Play className="h-4 w-4" />
                    Play challenge
                  </button>
                </Surface>
              ))}
            </div>
          ) : (
            <Surface>
              <Empty
                title="No active games yet"
                detail="The admin can publish a typing sprint from the Quiz & Game Studio."
              />
            </Surface>
          )}
        </>
      )}

      {!loading && tab === "games" && currentGame && !gameResult && (
        <Surface className="mx-auto max-w-3xl p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <button
                onClick={exitActivity}
                className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-[#88778c]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Exit game
              </button>

              <h2 className="text-2xl font-black">
                {currentGame.game.title}
              </h2>

              <p className="mt-1 text-sm text-[#806f82] dark:text-[#b7a5ba]">
                Type the challenge as accurately and quickly as possible.
              </p>
            </div>

            <span className="rounded-xl bg-[#f3e9f2] px-4 py-2 text-sm font-black text-[#694B68] dark:bg-[#76516f]/20 dark:text-[#dfc3e5]">
              {formatTimer(timeLeft)}
            </span>
          </div>

          <div className="mt-5 rounded-xl border border-[#e6d9df] bg-[#fffaf2] p-4 text-base leading-7 dark:border-white/10 dark:bg-white/[0.03]">
            {currentGame.challengeText}
          </div>

          <textarea
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            rows={5}
            placeholder="Start typing here…"
            className="mt-3 w-full rounded-xl border border-[#e6d9df] bg-white p-4 text-sm leading-6 outline-none focus:border-[#76516f] dark:border-white/10 dark:bg-[#100b16]"
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-[#88778c]">
              {typedText.length} characters entered
            </span>

            <button
              onClick={submitGame}
              disabled={busy || timeLeft <= 0 || !typedText.trim()}
              className="rounded-xl bg-[#694B68] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {busy ? "Checking…" : "Submit challenge"}
            </button>
          </div>
        </Surface>
      )}

      {!loading && tab === "games" && gameResult && (
        <Surface className="mx-auto max-w-2xl p-7 text-center">
          <Trophy className="mx-auto h-12 w-12 text-amber-500" />
          <h2 className="mt-3 text-2xl font-black">Challenge complete!</h2>
          <p className="mt-2 text-4xl font-black">{gameResult.score}/100</p>
          <p className="mt-2 text-sm text-[#806f82] dark:text-[#b7a5ba]">
            Accuracy {gameResult.accuracy}% · {gameResult.wpm} WPM
          </p>

          <div className="mt-5 flex justify-center gap-3">
            <TinyTag>+{gameResult.xpEarned} XP</TinyTag>
            <TinyTag>+{gameResult.creditsEarned} credits</TinyTag>
          </div>

          <button
            onClick={exitActivity}
            className="mt-6 rounded-xl bg-[#694B68] px-5 py-3 text-sm font-bold text-white"
          >
            Back to games
          </button>
        </Surface>
      )}

      {!loading && tab === "leaderboard" && (
        <Surface className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-[#eee4eb] p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black">Learning leaderboard</h2>
              <p className="mt-1 text-xs text-[#88778c]">
                Ranked by XP, then accuracy. Credits do not determine rank.
              </p>
            </div>

            <div className="flex gap-2">
              {[
                { id: "week", label: "Weekly" },
                { id: "month", label: "Monthly" },
                { id: "all", label: "All time" },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setPeriod(option.id)}
                  className={`rounded-lg px-3 py-2 text-xs font-bold ${
                    period === option.id
                      ? "bg-[#694B68] text-white"
                      : "border border-[#e6d9df] dark:border-white/10"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {leaderboard.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#faf5fa] text-[10px] uppercase tracking-wider text-[#88778c] dark:bg-white/[0.035]">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Learner</th>
                    <th className="px-4 py-3">XP</th>
                    <th className="px-4 py-3">Credits earned</th>
                    <th className="px-4 py-3">Attempts</th>
                    <th className="px-4 py-3">Accuracy</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f0e7ee] dark:divide-white/[0.06]">
                  {leaderboard.map((row) => (
                    <tr
                      key={row.userId}
                      className={
                        row.userId === user?.id
                          ? "bg-[#f3e9f2] dark:bg-[#76516f]/20"
                          : ""
                      }
                    >
                      <td className="px-4 py-3 font-black">
                        {row.rank === 1 ? (
                          <Trophy className="h-4 w-4 text-amber-500" />
                        ) : row.rank <= 3 ? (
                          <Medal className="h-4 w-4 text-[#76516f]" />
                        ) : (
                          `#${row.rank}`
                        )}
                      </td>

                      <td className="px-4 py-3 font-bold">
                        {row.name}
                        {row.userId === user?.id ? " (You)" : ""}
                      </td>

                      <td className="px-4 py-3 font-black">{row.xp}</td>
                      <td className="px-4 py-3">{row.credits}</td>
                      <td className="px-4 py-3">{row.attempts}</td>
                      <td className="px-4 py-3">{row.averageAccuracy}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty
              title="Leaderboard is waiting for its first players"
              detail="Complete a quiz to appear here."
            />
          )}
        </Surface>
      )}

      {!loading && tab === "wallet" && (
        <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
          <Surface className="p-5">
            <h2 className="text-lg font-black">My rewards & credits</h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-xl border border-[#eee4eb] p-4 dark:border-white/10">
                <p className="text-xs text-[#88778c]">Available AI credits</p>
                <p className="mt-2 flex items-center gap-2 text-3xl font-black">
                  <Coins className="h-6 w-6 text-[#b58b49]" />
                  {wallet?.aiCredits ?? 0}
                </p>
                <p className="mt-1 text-xs text-[#88778c]">
                  Used for eligible CareerLens AI features.
                </p>
                <a
                  href="/purchase"
                  className="mt-3 inline-flex text-sm font-bold text-[#76516f] underline dark:text-[#dfc3e5]"
                >
                  Buy more credits
                </a>
              </div>

              <div className="rounded-xl border border-[#eee4eb] p-4 dark:border-white/10">
                <p className="text-xs text-[#88778c]">Lifetime XP</p>
                <p className="mt-2 text-3xl font-black">
                  {wallet?.xp ?? 0}
                </p>
                <p className="mt-1 text-xs text-[#88778c]">
                  Used for leaderboard ranking.
                </p>
              </div>

              <div className="rounded-xl border border-[#eee4eb] p-4 dark:border-white/10">
                <p className="text-xs text-[#88778c]">
                  Credits earned in games
                </p>
                <p className="mt-2 text-2xl font-black">
                  {wallet?.earnedCredits ?? 0}
                </p>
              </div>

              <div className="rounded-xl border border-[#eee4eb] p-4 dark:border-white/10">
                <p className="text-xs text-[#88778c]">Completed attempts</p>
                <p className="mt-2 text-2xl font-black">
                  {wallet?.attempts ?? 0}
                </p>
              </div>
            </div>
          </Surface>

          <Surface className="overflow-hidden">
            <div className="border-b border-[#eee4eb] p-4 dark:border-white/10">
              <h2 className="font-black">Reward transaction history</h2>
              <p className="mt-1 text-xs text-[#88778c]">
                Reward records from quiz and game activity.
              </p>
            </div>

            {wallet?.history?.length ? (
              <div className="divide-y divide-[#f0e7ee] dark:divide-white/[0.06]">
                {wallet.history.map((row, index) => (
                  <div
                    key={`${row.source_type}-${row.source_id}-${index}`}
                    className="flex flex-wrap items-center justify-between gap-3 p-4"
                  >
                    <div>
                      <p className="text-sm font-bold">
                        {String(row.source_type)
                          .replace(/_/g, " ")
                          .replace(/^./, (c) => c.toUpperCase())}
                      </p>
                      <p className="mt-1 text-xs text-[#88778c]">
                        {dateText(row.created_at)} · {row.status}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-black text-violet-600 dark:text-violet-300">
                        +{row.xp_earned} XP
                      </p>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                        +{row.credits_earned} credits
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                title="No rewards yet"
                detail="Your completed learning activities will appear here."
              />
            )}
          </Surface>
        </div>
      )}
    </div>
  );
}
