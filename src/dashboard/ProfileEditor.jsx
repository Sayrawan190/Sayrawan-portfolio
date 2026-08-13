import { useState } from "react";
import { useLang } from "../context/LangContext";
import { useT } from "../data/uiText";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import LocalizedField from "./components/LocalizedField";
import ImageInput from "./components/ImageInput";
import ConfirmDialog from "./components/ConfirmDialog";

export default function ProfileEditor() {
  const { lang } = useLang();
  const t = useT(lang);
  const { data, updateProfile, resetToDefaults } = useData();
  const { showToast } = useToast();
  const [form, setForm] = useState(data.profile);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwBusy, setPwBusy] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setSummaryPoint(index, value) {
    const next = [...(form.summary || [])];
    next[index] = value;
    set("summary", next);
  }

  function addSummaryPoint() {
    set("summary", [...(form.summary || []), { en: "", ar: "" }]);
  }

  function removeSummaryPoint(index) {
    set("summary", (form.summary || []).filter((_, i) => i !== index));
  }

  function setRoleWord(index, value) {
    const next = [...(form.roleWords || [])];
    next[index] = value;
    set("roleWords", next);
  }

  function addRoleWord() {
    set("roleWords", [...(form.roleWords || []), { en: "", ar: "" }]);
  }

  function removeRoleWord(index) {
    set("roleWords", (form.roleWords || []).filter((_, i) => i !== index));
  }

  function handleSave(e) {
    e.preventDefault();
    updateProfile(form);
    showToast(t.dash_saved);
  }

  function handleReset() {
    resetToDefaults();
    setForm(data.profile);
    setConfirmReset(false);
    showToast(t.dash_saved);
  }

  async function handleChangePassword() {
    setPwError("");
    if (!pwForm.next || pwForm.next !== pwForm.confirm) {
      setPwError(t.dash_change_password_error_mismatch);
      return;
    }
    setPwBusy(true);
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setPwError(
          body.error === "wrong_current_password"
            ? t.dash_change_password_error_wrong_current
            : t.dash_change_password_error_generic
        );
        return;
      }
      showToast(t.dash_change_password_success);
      window.location.reload();
    } finally {
      setPwBusy(false);
    }
  }

  return (
    <form onSubmit={handleSave}>
      <div className="dashHead">
        <div>
          <h1>{t.dash_tab_profile}</h1>
          <p>{t.dash_title}</p>
        </div>
        <button className="btn btn--primary" type="submit">{t.dash_save}</button>
      </div>

      <section className="dashSection">
        <h2 className="dashSection__title">{t.dash_photo}</h2>
        <ImageInput label={t.dash_photo} value={form.photo} onChange={(v) => set("photo", v)} />
      </section>

      <section className="dashSection">
        <h2 className="dashSection__title">{t.dash_name}</h2>
        <LocalizedField label={t.dash_name} value={form.name} onChange={(v) => set("name", v)} />
        <LocalizedField label={t.dash_headline} value={form.title} onChange={(v) => set("title", v)} />
        <LocalizedField label={t.dash_tagline} value={form.tagline} onChange={(v) => set("tagline", v)} as="textarea" />
        <LocalizedField label={t.dash_about} value={form.about} onChange={(v) => set("about", v)} as="textarea" />
      </section>

      <section className="dashSection">
        <h2 className="dashSection__title">{t.dash_summary_points}</h2>
        {(form.summary || []).map((point, i) => (
          <div key={i} className="formGrid formGrid--single" style={{ marginBottom: 8 }}>
            <div className="dashRow">
              <div className="dashRow__main" style={{ flex: 1 }}>
                <div className="formGrid" style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={point.en}
                    placeholder="English"
                    onChange={(e) => setSummaryPoint(i, { ...point, en: e.target.value })}
                  />
                  <input
                    type="text"
                    value={point.ar}
                    placeholder="العربية"
                    dir="rtl"
                    onChange={(e) => setSummaryPoint(i, { ...point, ar: e.target.value })}
                  />
                </div>
              </div>
              <button type="button" className="btn btn--danger btn--sm" onClick={() => removeSummaryPoint(i)}>
                {t.dash_delete}
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn--ghost btn--sm" onClick={addSummaryPoint}>
          + {t.dash_add_point}
        </button>
      </section>

      <section className="dashSection">
        <h2 className="dashSection__title">{t.dash_role_words}</h2>
        <p className="fieldHint" style={{ marginBottom: 10 }}>{t.dash_role_words_hint}</p>
        {(form.roleWords || []).map((word, i) => (
          <div key={i} className="formGrid formGrid--single" style={{ marginBottom: 8 }}>
            <div className="dashRow">
              <div className="dashRow__main" style={{ flex: 1 }}>
                <div className="formGrid" style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={word.en}
                    placeholder="English"
                    onChange={(e) => setRoleWord(i, { ...word, en: e.target.value })}
                  />
                  <input
                    type="text"
                    value={word.ar}
                    placeholder="العربية"
                    dir="rtl"
                    onChange={(e) => setRoleWord(i, { ...word, ar: e.target.value })}
                  />
                </div>
              </div>
              <button type="button" className="btn btn--danger btn--sm" onClick={() => removeRoleWord(i)}>
                {t.dash_delete}
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn--ghost btn--sm" onClick={addRoleWord}>
          + {t.dash_add_role_word}
        </button>
      </section>

      <section className="dashSection">
        <h2 className="dashSection__title">{t.dash_focus} / {t.dash_location}</h2>
        <LocalizedField label={t.dash_focus} value={form.focus} onChange={(v) => set("focus", v)} />
        <LocalizedField label={t.dash_location} value={form.location} onChange={(v) => set("location", v)} />
      </section>

      <section className="dashSection">
        <h2 className="dashSection__title">Links</h2>
        <div className="formGrid">
          <div className="field">
            <label>{t.dash_cv_link}</label>
            <input type="text" value={form.cvLink || ""} onChange={(e) => set("cvLink", e.target.value)} placeholder="cv.pdf or https://..." />
          </div>
          <div className="field">
            <label>{t.dash_linkedin}</label>
            <input type="url" value={form.linkedin || ""} onChange={(e) => set("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." />
          </div>
          <div className="field">
            <label>{t.dash_x}</label>
            <input type="url" value={form.x || ""} onChange={(e) => set("x", e.target.value)} placeholder="https://x.com/..." />
          </div>
          <div className="field">
            <label>{t.dash_phone}</label>
            <input type="tel" value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} placeholder="+966 5xxxxxxxx" />
          </div>
        </div>
      </section>

      <div className="formActions" style={{ justifyContent: "flex-start", marginBottom: 30 }}>
        <button className="btn btn--primary" type="submit">{t.dash_save}</button>
      </div>

      <section className="dangerZone">
        <h3>{t.dash_reset_title}</h3>
        <p>{t.dash_reset_body}</p>
        <button type="button" className="btn btn--danger" onClick={() => setConfirmReset(true)}>
          {t.dash_reset_btn}
        </button>
      </section>

      <section className="dangerZone">
        <h3>{t.dash_change_password_title}</h3>
        <p>{t.dash_change_password_body}</p>
        <div className="formGrid">
          <div className="field">
            <label>{t.dash_current_password_label}</label>
            <input
              type="password"
              value={pwForm.current}
              onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>{t.dash_new_password_label}</label>
            <input
              type="password"
              value={pwForm.next}
              onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>{t.dash_confirm_password_label}</label>
            <input
              type="password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
            />
          </div>
        </div>
        {pwError && <p className="gateError">{pwError}</p>}
        <button type="button" className="btn btn--danger" disabled={pwBusy} onClick={handleChangePassword}>
          {t.dash_change_password_btn}
        </button>
      </section>

      <ConfirmDialog
        open={confirmReset}
        title={t.dash_reset_title}
        body={t.dash_reset_body}
        confirmLabel={t.dash_reset_btn}
        cancelLabel={t.dash_cancel}
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </form>
  );
}
