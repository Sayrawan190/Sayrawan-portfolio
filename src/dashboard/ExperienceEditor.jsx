import { useState } from "react";
import { useLang } from "../context/LangContext";
import { useT } from "../data/uiText";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import LocalizedField from "./components/LocalizedField";
import FormModal from "./components/FormModal";
import ConfirmDialog from "./components/ConfirmDialog";
import { L, emptyLocalized } from "../utils/field";

const BLANK = {
  title: emptyLocalized(),
  organization: emptyLocalized(),
  start: "",
  end: "",
  endIsPresent: false,
  description: emptyLocalized(),
  technologies: [],
};

function ExperienceForm({ initial, t, saving, onSave, onClose }) {
  const [form, setForm] = useState(initial || BLANK);
  const [techText, setTechText] = useState((initial?.technologies || []).join(", "));

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit(e) {
    e.preventDefault();
    const technologies = techText.split(",").map((s) => s.trim()).filter(Boolean);
    onSave({ ...form, technologies });
  }

  return (
    <form onSubmit={submit}>
      <LocalizedField label={t.dash_title_field} value={form.title} onChange={(v) => set("title", v)} />
      <LocalizedField label={t.dash_organization} value={form.organization} onChange={(v) => set("organization", v)} />
      <div className="formGrid">
        <div className="field">
          <label>{t.dash_start_date}</label>
          <input type="text" value={form.start} onChange={(e) => set("start", e.target.value)} placeholder="e.g. 2024" />
        </div>
        <div className="field">
          <label>{t.dash_end_date}</label>
          <input
            type="text"
            value={form.end}
            disabled={form.endIsPresent}
            onChange={(e) => set("end", e.target.value)}
            placeholder="e.g. 2025"
          />
        </div>
      </div>
      <label className="checkboxField">
        <input
          type="checkbox"
          checked={form.endIsPresent}
          onChange={(e) => set("endIsPresent", e.target.checked)}
        />
        {t.dash_present}
      </label>
      <LocalizedField label={t.dash_description} value={form.description} onChange={(v) => set("description", v)} as="textarea" />
      <div className="field">
        <label>{t.dash_technologies}</label>
        <input type="text" value={techText} onChange={(e) => setTechText(e.target.value)} placeholder="Excel, Java" />
      </div>
      <div className="formActions">
        <button type="button" className="btn btn--ghost" onClick={onClose} disabled={saving}>{t.dash_cancel}</button>
        <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? t.dash_saving : t.dash_save}</button>
      </div>
    </form>
  );
}

export default function ExperienceEditor() {
  const { lang } = useLang();
  const t = useT(lang);
  const { data, addItem, updateItem, deleteItem } = useData();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const experience = data.experience || [];

  async function handleSave(values) {
    setSaving(true);
    try {
      if (editing === "new") {
        await addItem("experience", values, "exp");
      } else {
        await updateItem("experience", editing.id, values);
      }
      setEditing(null);
      showToast(t.dash_saved);
    } catch {
      showToast(t.dash_save_error, "danger");
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    try {
      await deleteItem("experience", confirmDeleteId);
      showToast(t.dash_saved);
    } catch {
      showToast(t.dash_save_error, "danger");
    } finally {
      setConfirmDeleteId(null);
    }
  }

  return (
    <div>
      <div className="dashHead">
        <div>
          <h1>{t.dash_tab_experience}</h1>
          <p>{t.dash_title}</p>
        </div>
        <button className="btn btn--primary" type="button" onClick={() => setEditing("new")}>+ {t.dash_add}</button>
      </div>

      {experience.length === 0 ? (
        <div className="emptyState">{t.empty_experience}</div>
      ) : (
        <div className="dashList">
          {experience.map((exp) => (
            <div className="dashRow" key={exp.id}>
              <div className="dashRow__main">
                <div className="dashRow__icon">🧭</div>
                <div className="dashRow__text">
                  <p className="dashRow__title">{L(exp.title, lang)}</p>
                  <p className="dashRow__sub">
                    {[L(exp.organization, lang), [exp.start, exp.endIsPresent ? t.exp_present : exp.end].filter(Boolean).join(" — ")]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </div>
              <div className="dashRow__actions">
                <button className="btn btn--ghost btn--sm" type="button" onClick={() => setEditing(exp)}>{t.dash_edit}</button>
                <button className="btn btn--danger btn--sm" type="button" onClick={() => setConfirmDeleteId(exp.id)}>{t.dash_delete}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FormModal open={!!editing} title={editing === "new" ? t.dash_add : t.dash_edit} onClose={() => (saving ? null : setEditing(null))} wide>
        {editing && (
          <ExperienceForm
            initial={editing === "new" ? null : editing}
            t={t}
            saving={saving}
            onSave={handleSave}
            onClose={() => setEditing(null)}
          />
        )}
      </FormModal>

      <ConfirmDialog
        open={!!confirmDeleteId}
        title={t.dash_confirm_delete_title}
        body={t.dash_confirm_delete_body}
        confirmLabel={t.dash_confirm}
        cancelLabel={t.dash_cancel}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
