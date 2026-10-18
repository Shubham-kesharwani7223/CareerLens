import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Star, X, Send } from "lucide-react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { API_URL, TOKEN_KEY } from "@/utils/constants";
// export function FeedbackModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
//   const [rating, setRating] = useState(0);
//   const [hovered, setHovered] = useState(0);
//   const [comment, setComment] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   useEffect(() => {
//     if (!isOpen) {
//       setRating(0);
//       setHovered(0);
//       setComment("");
//       setIsSubmitting(false);
//     }
//   }, [isOpen]);
//   const handleSubmit = async () => {
//     if (rating === 0) { toast.error("Please select a rating"); return; }
//     setIsSubmitting(true);
//     try {
//       const token = localStorage.getItem(TOKEN_KEY);
//       const res = await fetch(`${API_URL}/feedback`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ rating, comment }),
//       });
//       if (res.ok) {
//         toast.success("Thank you! Your feedback helps us grow. 🚀");
//         onClose();
//         setRating(0);
//         setComment("");
//       } else {
//         const data = await res.json().catch(() => ({}));
//         toast.error(data.message || "Failed to submit feedback");
//       }
//     } catch {
//       toast.error("Network error. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
//             onClick={onClose}
//           />
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 20 }}
//             transition={{ type: "spring", damping: 25, stiffness: 300 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4"
//           >
//             <div
//               className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-slate-900"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="mb-5 flex items-center justify-between">
//                 <div>
//                   <h3 className="text-lg font-bold text-gray-900 dark:text-white">How's your experience?</h3>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Your feedback shapes our product</p>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10"
//                 >
//                   <X className="h-5 w-5" />
//                 </button>
//               </div>
//               <div className="mb-5">
//                 <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Rating</p>
//                 <div className="flex gap-1.5">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <button
//                       key={star}
//                       type="button"
//                       onMouseEnter={() => setHovered(star)}
//                       onMouseLeave={() => setHovered(0)}
//                       onClick={() => setRating(star)}
//                       className="transition-transform hover:scale-110"
//                     >
//                       <Star
//                         className={`h-8 w-8 transition-colors ${
//                           star <= (hovered || rating)
//                             ? "fill-amber-400 text-amber-400"
//                             : "text-gray-300 dark:text-gray-600"
//                         }`}
//                       />
//                     </button>
//                   ))}
//                 </div>
//                 {rating > 0 && (
//                   <p className="mt-1 text-xs text-gray-500">
//                     {rating === 5 ? "Excellent! 🎉" : rating === 4 ? "Great! 😊" : rating === 3 ? "Good 👍" : rating === 2 ? "Could be better" : "We'll work harder 💪"}
//                   </p>
//                 )}
//               </div>
//               <div className="mb-5">
//                 <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                   What can we improve or what did you love?
//                 </label>
//                 <textarea
//                   value={comment}
//                   onChange={(e) => setComment(e.target.value)}
//                   placeholder="Your thoughts help us build a better product..."
//                   rows={3}
//                   maxLength={1000}
//                   className="w-full resize-none rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
//                 />
//               </div>
//               <Button className="w-full gap-2" onClick={handleSubmit} isLoading={isSubmitting}>
//                 <Send className="h-4 w-4" /> Submit Feedback
//               </Button>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Send, Sparkles, MessageCircleHeart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { API_URL, TOKEN_KEY } from "@/utils/constants";
const ratingLabels = {
    1: "We’ll work harder to improve",
    2: "There’s room for improvement",
    3: "Thanks! We’re listening",
    4: "Glad you’re enjoying CareerLens",
    5: "Amazing! Thanks for the love",
};
export function FeedbackModal({ isOpen, onClose }) {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        if (!isOpen) {
            setRating(0);
            setHovered(0);
            setComment("");
            setIsSubmitting(false);
        }
    }, [isOpen]);
    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem(TOKEN_KEY);
            const res = await fetch(`${API_URL}/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ rating, comment }),
            });
            if (res.ok) {
                toast.success("Thank you! Your feedback helps CareerLens grow. ✨");
                onClose();
                setRating(0);
                setComment("");
            }
            else {
                const data = await res.json().catch(() => ({}));
                toast.error(data.message || "Failed to submit feedback");
            }
        }
        catch {
            toast.error("Network error. Please try again.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 }, className: "fixed inset-0 z-50 bg-[#160D1B]/55 backdrop-blur-md", onClick: onClose }), _jsx(motion.div, { initial: { opacity: 0, scale: 0.96, y: 16 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.96, y: 16 }, transition: { type: "spring", damping: 25, stiffness: 300 }, className: "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6", onClick: onClose, children: _jsxs("section", { role: "dialog", "aria-modal": "true", "aria-labelledby": "feedback-title", className: "relative my-auto w-full max-w-lg overflow-hidden rounded-[28px] border border-[#E5D5E1] bg-[#FFFAF2] text-[#2C1930] shadow-[0_24px_90px_rgba(29,13,34,0.25)] dark:border-[#4A354D] dark:bg-[#100B14] dark:text-[#F8F0FA]", onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#8A6689] via-[#D7B45A] to-[#8A6689]" }), _jsxs("div", { className: "p-5 sm:p-7", children: [_jsxs("div", { className: "mb-6 flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#E8D9B0] bg-[#F8F0D9] text-[#9B7626] dark:border-[#5A4930] dark:bg-[#2A2116] dark:text-[#E3C36E]", children: _jsx(MessageCircleHeart, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#94738F] dark:text-[#C4A9C8]", children: "CareerLens Community" }), _jsx("h3", { id: "feedback-title", className: "text-xl font-bold tracking-tight sm:text-2xl", children: "How\u2019s your experience?" }), _jsx("p", { className: "mt-1 text-sm text-[#78677C] dark:text-[#B9AABD]", children: "Your feedback helps us make your career workspace better." })] })] }), _jsx("button", { type: "button", onClick: onClose, "aria-label": "Close feedback form", className: "rounded-xl p-2 text-[#8E7D91] transition hover:bg-[#F0E5EE] hover:text-[#38233D] focus:outline-none focus:ring-2 focus:ring-[#9A7598] dark:text-[#B8A7BB] dark:hover:bg-white/10 dark:hover:text-white", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "mb-6 rounded-2xl border border-[#E9DDE7] bg-white/70 p-4 dark:border-[#403044] dark:bg-white/[0.035] sm:p-5", children: [_jsxs("div", { className: "mb-3 flex items-center justify-between gap-3", children: [_jsx("label", { className: "text-sm font-semibold", children: "How would you rate CareerLens?" }), _jsx("span", { className: "rounded-full bg-[#F3E8F2] px-2.5 py-1 text-xs font-semibold text-[#79577D] dark:bg-[#38243B] dark:text-[#D7B9DB]", children: rating ? `${rating}/5` : "Your rating" })] }), _jsx("div", { className: "flex flex-wrap gap-2", onMouseLeave: () => setHovered(0), children: [1, 2, 3, 4, 5].map((star) => {
                                                    const active = star <= (hovered || rating);
                                                    return (_jsx("button", { type: "button", "aria-label": `Rate ${star} out of 5 stars`, "aria-pressed": rating === star, onMouseEnter: () => setHovered(star), onFocus: () => setHovered(star), onBlur: () => setHovered(0), onClick: () => setRating(star), className: `flex h-11 w-11 items-center justify-center rounded-xl border transition duration-150 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#A17A9D] ${active
                                                            ? "border-[#D5B65D] bg-[#FFF3C9] text-[#B28722] dark:border-[#8E7132] dark:bg-[#352A18] dark:text-[#E8C96B]"
                                                            : "border-[#E8DFE8] bg-[#FFFCF8] text-[#C9BACB] hover:border-[#BFA0BD] dark:border-[#46364A] dark:bg-[#17101C] dark:text-[#756278]"}`, children: _jsx(Star, { className: `h-5 w-5 ${active ? "fill-current" : ""}` }) }, star));
                                                }) }), _jsx(AnimatePresence, { mode: "wait", children: rating > 0 && (_jsx(motion.p, { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -4 }, className: "mt-3 text-xs font-medium text-[#876B88] dark:text-[#D0B8D3]", children: ratingLabels[rating] }, rating)) })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "mb-2 flex items-center justify-between gap-3", children: [_jsx("label", { htmlFor: "career-lens-feedback", className: "text-sm font-semibold", children: "What should we improve?" }), _jsxs("span", { className: "text-xs tabular-nums text-[#9A899D] dark:text-[#9C8AA2]", children: [comment.length, "/1000"] })] }), _jsx("textarea", { id: "career-lens-feedback", value: comment, onChange: (e) => setComment(e.target.value), placeholder: "Share what you liked, what felt confusing, or what feature you\u2019d love to see...", rows: 4, maxLength: 1000, className: "w-full resize-y rounded-2xl border border-[#E1D3E0] bg-white px-4 py-3 text-sm leading-relaxed text-[#2C1930] shadow-sm outline-none transition placeholder:text-[#A89AAA] focus:border-[#9A7598] focus:ring-4 focus:ring-[#9A7598]/15 dark:border-[#49364D] dark:bg-[#17101C] dark:text-[#F8F0FA] dark:placeholder:text-[#8F7E95] dark:focus:border-[#B18CAF] dark:focus:ring-[#B18CAF]/15" })] }), _jsxs("div", { className: "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onClose, disabled: isSubmitting, className: "rounded-xl border-[#DDCEDD] bg-transparent text-[#6D5872] hover:bg-[#F2E8F1] dark:border-[#49364D] dark:text-[#D5C3D9] dark:hover:bg-white/10 sm:min-w-28", children: "Maybe later" }), _jsxs(Button, { type: "button", onClick: handleSubmit, disabled: isSubmitting || rating === 0, isLoading: isSubmitting, className: "gap-2 rounded-xl border border-[#80607F] bg-gradient-to-r from-[#71516F] to-[#906D8F] font-semibold text-white shadow-[0_10px_24px_rgba(113,81,111,0.25)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#9B789B] dark:from-[#765477] dark:to-[#936D92]", children: [_jsx(Send, { className: "h-4 w-4" }), "Submit feedback"] })] }), _jsxs("div", { className: "mt-5 flex items-center justify-center gap-2 text-[11px] text-[#9A899D] dark:text-[#9C8AA2]", children: [_jsx(Sparkles, { className: "h-3.5 w-3.5 text-[#B28B35]" }), _jsx("span", { children: "Your feedback is private and helps shape CareerLens." })] })] })] }) })] })) }));
}
