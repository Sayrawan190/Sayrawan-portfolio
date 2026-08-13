import { useState } from "react";
import { useLang } from "../context/LangContext";
import { useT } from "../data/uiText";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import LocalizedField from "./components/LocalizedField";
import ImageInput from "./components/ImageInput";
import FormModal from "./components/FormModal";
import ConfirmDialog from "./components/ConfirmDialog";
import { L, emptyLocalized } from "../utils/field";

const BLANK = {
  name: emptyLocalized(),
  description: emptyLocalized(),
  badge: emptyLocalized(),
  technologies: [],
  image: "",
  link: "",
};

function ProjectForm({ initial, t, saving, onSave, onClose }) {
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
      <LocalizedField label={t.dash_name} value={form.name} onChange={(v) => set("name", v)} />
      <LocalizedField label={t.dash_description} value={form.description} onChange={(v) => set("description", v)} as="textarea" />
      <LocalizedField label={t.dash_badge} value={form.badge} onChange={(v) => set("badge", v)} />
      <div className="field">
        <label>{t.dash_technologies}</label>
        <input type="text" value={techText} onChange={(e) => setTechText(e.target.value)} placeholder="HTML, CSS, JavaScript" />
      </div>
      <ImageInput label={t.dash_image} value={form.image} onChange={(v) => set("image", v)} />
      <div className="field">
        <label>{t.dash_link}</label>
        <input type="url" value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="https://..." />
      </div>
      <div className="formActions">
        <button type="button" className="btn btn--ghost" onClick={onClose} disabled={saving}>{t.dash_cancel}</button>
        <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? t.dash_saving : t.dash_save}</button>
      </div>
    </form>
  );
}

export default function ProjectsEditor() {
  const { lang } = useLang();
  const t = useT(lang);
  const { data, addItem, updateItem, deleteItem } = useData();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(null); // null | "new" | project object
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const projects = data.projects || [];

  async function handleSave(values) {
    setSaving(true);
    try {
      if (editing === "new") {
        await addItem("projects", values, "proj");
      } else {
        await updateItem("projects", editing.id, values);
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
      await deleteItem("projects", confirmDeleteId);
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
          <h1>{t.dash_tab_projects}</h1>
          <p>{t.dash_title}</p>
        </div>
        <button className="btn btn--primary" type="button" onClick={() => setEditing("new")}>+ {t.dash_add}</button>
      </div>

      {projects.length === 0 ? (
        <div className="emptyState">{t.empty_projects}</div>
      ) : (
        <div className="dashList">
          {projects.map((p) => (
            <div className="dashRow" key={p.id}>
              <div className="dashRow__main">
                {p.image ? (
                  <img className="dashRow__thumb" src={p.image} alt="" />
                ) : (
                  <div className="dashRow__icon">💼</div>
                )}
                <div className="dashRow__text">
                  <p className="dashRow__title">{L(p.name, lang)}</p>
                  <p className="dashRow__sub">{(p.technologies || []).join(", ") || L(p.description, lang)}</p>
                </div>
              </div>
              <div className="dashRow__actions">
                <button className="btn btn--ghost btn--sm" type="button" onClick={() => setEditing(p)}>{t.dash_edit}</button>
                <button className="btn btn--danger btn--sm" type="button" onClick={() => setConfirmDeleteId(p.id)}>{t.dash_delete}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FormModal
        open={!!editing}
        title={editing === "new" ? t.dash_add : t.dash_edit}
        onClose={() => (saving ? null : setEditing(null))}
        wide
      >
        {editing && (
          <ProjectForm
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
