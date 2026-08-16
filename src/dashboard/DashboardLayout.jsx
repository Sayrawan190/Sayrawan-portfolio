import { NavLink, Outlet, Link } from "react-router-dom";
import { User, Puzzle, Briefcase, Compass, GraduationCap, Globe } from "lucide-react";
import { useLang } from "../context/LangContext";
import { useT } from "../data/uiText";

const TABS = [
  { to: "/dashboard", key: "dash_tab_profile", Icon: User, end: true },
  { to: "/dashboard/skills", key: "dash_tab_skills", Icon: Puzzle },
  { to: "/dashboard/projects", key: "dash_tab_projects", Icon: Briefcase },
  { to: "/dashboard/experience", key: "dash_tab_experience", Icon: Compass },
  { to: "/dashboard/certificates", key: "dash_tab_certificates", Icon: GraduationCap },
];

export default function DashboardLayout() {
  const { lang, toggleLang } = useLang();
  const t = useT(lang);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    window.location.reload();
  }

  return (
    <div className="dashShell">
      <aside className="dashSidebar">
        <div className="dashBrand">
          <span className="dashBrand__mark" aria-hidden="true"></span>
          <span className="dashBrand__text">{t.dash_title}</span>
        </div>

        <nav className="dashNav">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) => `dashNav__link${isActive ? " is-active" : ""}`}
            >
              <tab.Icon size={17} aria-hidden="true" />
              <span>{t[tab.key]}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dashSidebar__footer">
          <button className="btn btn--ghost" type="button" onClick={toggleLang}>
            <Globe size={16} aria-hidden="true" /> {lang === "ar" ? "English" : "العربية"}
          </button>
          <Link className="btn btn--ghost" to="/">← {t.dash_back_site}</Link>
          <button className="btn btn--ghost" type="button" onClick={handleLogout}>
            {t.dash_logout}
          </button>
        </div>
      </aside>

      <main className="dashMain">
        <Outlet />
      </main>
    </div>
  );
}
