import { HashRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "./context/LangContext";
import { DataProvider } from "./context/DataContext";
import { ToastProvider } from "./context/ToastContext";
import PortfolioPage from "./pages/PortfolioPage";
import DashboardPage from "./pages/DashboardPage";

// HashRouter is used on purpose: it means the site works when opened as a
// static file or hosted on any plain static host, with no server-side
// routing config needed for /dashboard to work on refresh.
export default function App() {
  return (
    <LangProvider>
      <DataProvider>
        <ToastProvider>
          <HashRouter>
            <Routes>
              <Route path="/dashboard/*" element={<DashboardPage />} />
              {/* In-page nav links (href="#about", "#contact", ...) reuse the
                  same hash HashRouter uses for routing, so any hash that isn't
                  the dashboard route should still render the one-page site. */}
              <Route path="*" element={<PortfolioPage />} />
            </Routes>
          </HashRouter>
        </ToastProvider>
      </DataProvider>
    </LangProvider>
  );
}
