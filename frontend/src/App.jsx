import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useAuth } from "./hooks/useAuth";
// Initialize Google Analytics outside the component lifecycle 
// to ensure it only initializes once and prevents memory leaks
ReactGA.initialize("G-CJ1ETDCKHG");
export default function App() {
    const { loadUser } = useAuth();
    // Authenticate and load the current user's session data on initial mount
    useEffect(() => {
        loadUser();
    }, [loadUser]);
    // Track the initial page view when the application successfully loads
    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    }, []);
    return _jsx(RouterProvider, { router: router });
}
