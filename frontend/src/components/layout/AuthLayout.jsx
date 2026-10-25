import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
export function AuthLayout() {
    return (_jsxs("div", { className: "career-auth-layout flex min-h-screen min-w-0 overflow-x-hidden", children: [_jsx("style", { children: `
        .career-auth-layout {
          --wine: #211522;
          --wine-card: #2b1d2d;
          --wine-border: #49364a;
          --cream: #f7f0e5;
          --cream-card: #fffaf2;
          --ink: #302033;
          --muted: #b8a9ba;
          --gold: #d8ad55;
          --mauve: #b58ab5;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        /* Light branding panel when the main website is light */
        .career-auth-layout .auth-brand-panel {
          background:
            radial-gradient(ellipse at 50% 15%, rgba(216,173,85,.13), transparent 48%),
            var(--cream);
          color: var(--ink);
          border-right: 1px solid #e5d9ce;
        }

        .career-auth-layout .auth-brand-copy {
          color: #766779;
        }

        .career-auth-layout .auth-stat {
          background: rgba(255,250,242,.8);
          border: 1px solid #e7dcd0;
          color: var(--ink);
        }

        .career-auth-layout .auth-form-panel {
          background: var(--wine);
          color: #f5edf4;
        }

        .career-auth-layout .career-auth-form {
          color: #f5edf4;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        .career-auth-layout .career-form-heading {
          font-family: Georgia, "Times New Roman", serif;
          letter-spacing: -.045em;
          color: #f5edf4;
        }

        .career-auth-layout .career-form-muted {
          color: var(--muted);
        }

        .career-auth-layout .career-auth-form label {
          color: #eadfea !important;
        }

        .career-auth-layout .career-auth-form input,
        .career-auth-layout .career-auth-form select {
          min-height: 46px;
          border-radius: 12px;
          background: var(--wine-card) !important;
          border-color: var(--wine-border) !important;
          color: #f5edf4 !important;
        }

        .career-auth-layout .career-auth-form input::placeholder {
          color: #a091a4 !important;
        }

        .career-auth-layout .career-auth-form input:focus,
        .career-auth-layout .career-auth-form select:focus {
          border-color: var(--mauve) !important;
          box-shadow: 0 0 0 3px rgba(181,138,181,.16) !important;
        }

        .career-auth-layout .career-auth-form .career-submit {
          min-height: 49px;
          border: 0;
          border-radius: 12px;
          background: linear-gradient(110deg, #654765, #89658a);
          color: #fffaf2;
          box-shadow: 0 8px 22px rgba(0,0,0,.16);
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .career-auth-layout .career-auth-form .career-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 11px 26px rgba(0,0,0,.23);
        }

        .career-auth-layout .career-form-link {
          color: var(--gold);
        }

        /* Dark website: invert both auth panels */
        .dark .career-auth-layout .auth-brand-panel {
          background:
            radial-gradient(ellipse at 50% 15%, rgba(181,138,181,.13), transparent 48%),
            #171019;
          color: #f5edf4;
          border-right-color: #38283a;
        }

        .dark .career-auth-layout .auth-brand-copy {
          color: #b8a9ba;
        }

        .dark .career-auth-layout .auth-stat {
          background: rgba(255,255,255,.045);
          border-color: rgba(255,255,255,.10);
          color: #f5edf4;
        }

        .dark .career-auth-layout .auth-form-panel {
          background: var(--cream);
          color: var(--ink);
        }

        .dark .career-auth-layout .career-auth-form {
          color: var(--ink);
        }

        .dark .career-auth-layout .career-form-heading {
          color: var(--ink);
        }

        .dark .career-auth-layout .career-form-muted {
          color: #786a7b;
        }

        .dark .career-auth-layout .career-auth-form label {
          color: #49364e !important;
        }

        .dark .career-auth-layout .career-auth-form input,
        .dark .career-auth-layout .career-auth-form select {
          background: var(--cream-card) !important;
          border-color: #dfd0d9 !important;
          color: var(--ink) !important;
        }

        .dark .career-auth-layout .career-auth-form input::placeholder {
          color: #a091a0 !important;
        }

        .dark .career-auth-layout .career-auth-form input:focus,
        .dark .career-auth-layout .career-auth-form select:focus {
          border-color: #9a789b !important;
          box-shadow: 0 0 0 3px rgba(154,120,155,.15) !important;
        }

        .dark .career-auth-layout .career-auth-form .career-submit {
          background: linear-gradient(110deg, #604461, #88658b);
          color: #fffaf1;
        }

        .dark .career-auth-layout .career-form-link {
          color: #795778;
        }

        @media (prefers-reduced-motion: reduce) {
          .career-auth-layout *,
          .career-auth-layout *::before,
          .career-auth-layout *::after {
            transition-duration: .01ms !important;
            animation-duration: .01ms !important;
          }
        }
      ` }), _jsxs("section", { className: "auth-brand-panel relative hidden w-1/2 flex-col items-center justify-center overflow-hidden px-10 py-12 text-center lg:flex xl:px-16", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55 }, className: "relative z-10 mx-auto flex w-full max-w-lg flex-col items-center", children: [_jsx("a", { href: "/", "aria-label": "CareerLens home", className: "mb-7", children: _jsx("img", { src: "/logo.png", alt: "CareerLens", className: "h-24 w-24 object-contain drop-shadow-md" }) }), _jsx("p", { className: "mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#b58b49]", children: "Your career, in focus" }), _jsxs("h1", { className: "font-serif text-4xl font-semibold leading-tight tracking-tight xl:text-5xl", children: ["Make your next move", _jsx("span", { className: "mt-1 block text-[#b58b49]", children: "count." })] }), _jsx("p", { className: "auth-brand-copy mx-auto mt-5 max-w-sm text-base leading-7", children: "Turn your resume into a clearer path forward with AI-powered career insights." }), _jsx("div", { className: "mt-9 grid w-full max-w-md grid-cols-3 gap-3", children: [
                                    { value: "ATS", label: "Resume insights" },
                                    { value: "AI", label: "Skill guidance" },
                                    { value: "Next", label: "Career steps" },
                                ].map((stat) => (_jsxs("div", { className: "auth-stat rounded-2xl px-3 py-4", children: [_jsx("p", { className: "font-serif text-xl font-semibold", children: stat.value }), _jsx("p", { className: "mt-1 text-xs leading-4 opacity-75", children: stat.label })] }, stat.value))) })] }), _jsx("p", { className: "auth-brand-copy absolute bottom-6 text-xs", children: "A smarter way to shape your career." })] }), _jsx("section", { className: "auth-form-panel flex min-h-screen w-full min-w-0 items-center justify-center px-4 py-8 sm:px-8 lg:w-1/2 lg:px-10", children: _jsx(motion.div, { initial: { opacity: 0, x: 12 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.4 }, className: "w-full max-w-md", children: _jsx(Outlet, {}) }) })] }));
}
