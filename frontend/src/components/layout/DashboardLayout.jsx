import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { DashboardTopBar } from "./DashboardTopBar";
export function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (_jsxs("div", { className: "\n        careerlens-layout\n        flex h-screen min-w-0 flex-col overflow-hidden\n        bg-[#F7F0E5] text-[#29182F]\n        dvh-screen\n        dark:bg-[#090811] dark:text-[#F7F1FA]\n        lg:flex-row\n      ", children: [_jsxs("div", { className: "pointer-events-none fixed inset-0 -z-0 hidden overflow-hidden dark:block", children: [_jsx("div", { className: "absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[#76577C]/10 blur-3xl" }), _jsx("div", { className: "absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-[#B78BB7]/5 blur-3xl" })] }), _jsx(Sidebar, { isOpen: sidebarOpen, onClose: () => setSidebarOpen(false) }), _jsxs("div", { className: "relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", children: [_jsx(Navbar, { onMenuClick: () => setSidebarOpen(true) }), _jsx(DashboardTopBar, {}), _jsx("main", { className: "\n            dashboard-scroll\n            flex min-h-0 min-w-0 flex-1 flex-col\n            overflow-x-hidden overflow-y-auto\n            bg-[#F7F0E5]\n            px-3 py-4\n            sm:px-4 sm:py-5\n            md:px-6 md:py-6\n            lg:px-8 lg:py-7\n            scrollbar-thin\n            dark:bg-[#090811]\n          ", children: _jsx(Outlet, {}) })] })] }));
}
