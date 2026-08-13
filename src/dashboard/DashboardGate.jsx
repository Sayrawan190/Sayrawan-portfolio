import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { useT } from "../data/uiText";

export default function DashboardGate() {
  const { lang, toggleLang } = useLang();
  const t = useT(lang);
  const [status, setStatus] = useState("checking"); // "checking" | "authed" | "login" | "setup"
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [setupForm, setSetupForm] = useState({ password: "", confirm: "" });
  const [setupError, setSetupError] = useState("");
  const [setupBusy, setSetupBusy] = useState(false);

  useEffect(() => {
    fetch("/api/auth/status", { credentials: "include" })
      .then((res) => res.json())
      .then(({ authed, hasPassword }) => {
        setStatus(authed ? "authed" : hasPassword ? "login" : "setup");
      })
      .catch(() => setStatus("login"));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: value }),
    });
    if (res.ok) {
      setStatus("authed");
      setError(false);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  }

  async function handleSetupSubmit(e) {
    e.preventDefault();
    setSetupError("");
    if (setupForm.password.length < 8) {
      setSetupError(t.gate_setup_error_short);
      return;
    }
    if (setupForm.password !== setupForm.confirm) {
      setSetupError(t.gate_setup_error_mismatch);
      return;
    }
    setSetupBusy(true);
    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: setupForm.password, confirmPassword: setupForm.confirm }),
      });
      if (!res.ok) {
        setSetupError(t.gate_setup_error_generic);
        return;
      }
      setStatus("authed");
    } finally {
      setSetupBusy(false);
    }
  }

  if (status === "checking") return null;
  if (status === "authed") return <Outlet />;

  return (
    <div className="gatePage">
      <div className="gatePage__bg" aria-hidden="true"></div>

      <button type="button" className="btn btn--ghost gatePage__lang" onClick={toggleLang}>
        <span className="btn__icon" aria-hidden="true">🌐</span>
        <span>{lang === "ar" ? "EN" : "AR"}</span>
      </button>

      {status === "setup" ? (
        <form
          onSubmit={handleSetupSubmit}
          className={`card card--pad gateCard${shake ? " gateCard--shake" : ""}`}
        >
          <div className="gateIcon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 10V8a6 6 0 1 1 12 0v2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <rect x="4.5" y="10" width="15" height="10.5" rx="3" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="15" r="1.6" fill="currentColor" />
            </svg>
          </div>

          <h1 className="gateCard__title">{t.gate_setup_title}</h1>
          <p className="gateCard__subtitle">{t.gate_setup_subtitle}</p>

          <div className="field">
            <label htmlFor="setup-password">{t.gate_new_password_label}</label>
            <input
              id="setup-password"
              type="password"
              value={setupForm.password}
              autoFocus
              onChange={(e) => setSetupForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>

          <div className="field">
            <label htmlFor="setup-confirm-password">{t.gate_confirm_password_label}</label>
            <input
              id="setup-confirm-password"
              type="password"
              value={setupForm.confirm}
              onChange={(e) => setSetupForm((f) => ({ ...f, confirm: e.target.value }))}
            />
          </div>

          {setupError && (
            <p className="gateError">
              <span aria-hidden="true">⚠</span> {setupError}
            </p>
          )}

          <div className="formActions" style={{ justifyContent: "stretch" }}>
            <button type="submit" className="btn btn--primary" style={{ width: "100%" }} disabled={setupBusy}>
              {t.gate_setup_submit}
            </button>
          </div>

          <Link to="/" className="gateCard__back">
            {t.gate_back_site}
          </Link>
        </form>
      ) : (
        <form
          onSubmit={handleSubmit}
          className={`card card--pad gateCard${shake ? " gateCard--shake" : ""}`}
        >
          <div className="gateIcon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 10V8a6 6 0 1 1 12 0v2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <rect x="4.5" y="10" width="15" height="10.5" rx="3" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="15" r="1.6" fill="currentColor" />
            </svg>
          </div>

          <h1 className="gateCard__title">{t.gate_title}</h1>
          <p className="gateCard__subtitle">{t.gate_subtitle}</p>

          <div className="field">
            <label htmlFor="dashboard-password">{t.gate_password_label}</label>
            <div className="passwordField">
              <input
                id="dashboard-password"
                type={showPassword ? "text" : "password"}
                placeholder={t.gate_password_placeholder}
                value={value}
                autoFocus
                className={error ? "is-invalid" : ""}
                onChange={(e) => { setValue(e.target.value); setError(false); }}
              />
              <button
                type="button"
                className="passwordField__toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? t.gate_hide_password : t.gate_show_password}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path
                      d="M10.6 5.2A10.9 10.9 0 0 1 12 5c6 0 9.5 5.2 10.4 7-.4.8-1.2 2.1-2.4 3.3M6.5 6.7C3.9 8.3 2.2 10.7 1.6 12c.9 1.8 4.4 7 10.4 7 1.4 0 2.7-.3 3.9-.8M9.9 9.9a3 3 0 0 0 4.2 4.2"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M1.6 12S5.1 5 12 5s10.4 7 10.4 7-3.5 7-10.4 7S1.6 12 1.6 12Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="gateError">
              <span aria-hidden="true">⚠</span> {t.gate_error}
            </p>
          )}

          <div className="formActions" style={{ justifyContent: "stretch" }}>
            <button type="submit" className="btn btn--primary" style={{ width: "100%" }}>
              {t.gate_submit}
            </button>
          </div>

          <Link to="/" className="gateCard__back">
            {t.gate_back_site}
          </Link>
        </form>
      )}
    </div>
  );
}
