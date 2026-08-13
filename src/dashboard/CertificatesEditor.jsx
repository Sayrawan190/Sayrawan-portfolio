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
  issuer: emptyLocalized(),
  date: "",
  image: "",
  link: "",
};

function CertForm({ initial, t, onSave, onClose }) {
  const [form, setForm] = useState(initial || BLANK);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form onSubmit={submit}>
      <LocalizedField label={t.dash_name} value={form.name} onChange={(v) => set("name", v)} />
      <LocalizedField label={t.dash_issuer} value={form.issuer} onChange={(v) => set("issuer", v)} />
      <div className="field">
        <label>{t.dash_issue_date}</label>
        <input type="text" value={form.date} onChange={(e) => set("date", e.target.value)} placeholder="2026/1/22" />
      </div>
      <ImageInput label={t.dash_image} value={form.image} onChange={(v) => set("image", v)} />
      <div className="field">
        <label>{t.dash_credential_link}</label>
        <input type="url" value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="https://..." />
      </div>
      <div className="formActions">
        <button type="button" className="btn btn--ghost" onClick={onClose}>{t.dash_cancel}</button>
        <button type="submit" className="btn btn--primary">{t.dash_save}</button>
      </div>
    </form>
  );
}

export default function CertificatesEditor() {
  const { lang } = useLang();
  const t = useT(lang);
  const { data, addItem, updateItem, deleteItem } = useData();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const certs = data.certificates || [];

  function handleSave(values) {
    if (editing === "new") {
      addItem("certificates", values, "cert");
    } else {
      updateItem("certificates", editing.id, values);
    }
    setEditing(null);
    showToast(t.dash_saved);
  }

  return (
    <div>
      <div className="dashHead">
        <div>
          <h1>{t.dash_tab_certificates}</h1>
          <p>{t.dash_title}</p>
        </div>
        <button className="btn btn--primary" type="button" onClick={() => setEditing("new")}>+ {t.dash_add}</button>
      </div>

      {certs.length === 0 ? (
        <div className="emptyState">{t.empty_certs}</div>
      ) : (
        <div className="dashList">
          {certs.map((c) => (
            <div className="dashRow" key={c.id}>
              <div className="dashRow__main">
                {c.image ? <img className="dashRow__thumb" src={c.image} alt="" /> : <div className="dashRow__icon">🎓</div>}
                <div className="dashRow__text">
                  <p className="dashRow__title">{L(c.name, lang)}</p>
                  <p className="dashRow__sub">{[L(c.issuer, lang), c.date].filter(Boolean).join(" · ")}</p>
                </div>
              </div>
              <div className="dashRow__actions">
                <button className="btn btn--ghost btn--sm" type="button" onClick={() => setEditing(c)}>{t.dash_edit}</button>
                <button className="btn btn--danger btn--sm" type="button" onClick={() => setConfirmDeleteId(c.id)}>{t.dash_delete}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FormModal open={!!editing} title={editing === "new" ? t.dash_add : t.dash_edit} onClose={() => setEditing(null)} wide>
        {editing && (
          <CertForm
            initial={editing === "new" ? null : editing}
            t={t}
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
        onConfirm={() => { deleteItem("certificates", confirmDeleteId); setConfirmDeleteId(null); showToast(t.dash_saved); }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
