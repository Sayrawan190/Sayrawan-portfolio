import { useState } from "react";
import { Pencil, X, Check } from "lucide-react";
import { useLang } from "../context/LangContext";
import { useT } from "../data/uiText";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "./components/ConfirmDialog";

function AddSkillRow({ t, onAdd }) {
  const [en, setEn] = useState("");
  const [ar, setAr] = useState("");
  const [level, setLevel] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!en.trim() && !ar.trim()) return;
    onAdd({ name: { en: en.trim(), ar: ar.trim() }, level: level.trim() });
    setEn(""); setAr(""); setLevel("");
  }

  return (
    <form className="inlineAddRow" onSubmit={submit}>
      <input type="text" placeholder="Skill (EN)" value={en} onChange={(e) => setEn(e.target.value)} />
      <input type="text" placeholder="مهارة (AR)" dir="rtl" value={ar} onChange={(e) => setAr(e.target.value)} />
      <input type="text" placeholder={t.dash_level} value={level} onChange={(e) => setLevel(e.target.value)} style={{ maxWidth: 140 }} />
      <button className="btn btn--ghost btn--sm" type="submit">+ {t.dash_new_skill}</button>
    </form>
  );
}

function CategoryBlock({ category, t, onUpdateCategory, onDeleteCategory, onAddSkill, onUpdateSkill, onDeleteSkill }) {
  const [name, setName] = useState(category.name);
  const [icon, setIcon] = useState(category.icon || "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState(null);

  function saveHeader() {
    onUpdateCategory({ name, icon });
  }

  return (
    <div className="categoryBlock">
      <div className="categoryHead">
        <div className="categoryHead__title" style={{ flexWrap: "wrap" }}>
          <input
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            onBlur={saveHeader}
            style={{ width: 44, textAlign: "center", padding: "8px 6px", borderRadius: 10, border: "1px solid rgba(255,255,255,.14)", background: "rgba(255,255,255,.04)", color: "inherit" }}
            aria-label={t.dash_icon}
          />
          <input
            type="text"
            value={name.en}
            placeholder="Category (EN)"
            onChange={(e) => setName((n) => ({ ...n, en: e.target.value }))}
            onBlur={saveHeader}
            style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(255,255,255,.14)", background: "rgba(255,255,255,.04)", color: "inherit" }}
          />
          <input
            type="text"
            value={name.ar}
            placeholder="الفئة (AR)"
            dir="rtl"
            onChange={(e) => setName((n) => ({ ...n, ar: e.target.value }))}
            onBlur={saveHeader}
            style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(255,255,255,.14)", background: "rgba(255,255,255,.04)", color: "inherit" }}
          />
        </div>
        <button type="button" className="btn btn--danger btn--sm" onClick={() => setConfirmDelete(true)}>
          {t.dash_delete}
        </button>
      </div>

      <div className="skillChipRow">
        {category.skills.map((skill) =>
          editingSkillId === skill.id ? (
            <SkillEditChip
              key={skill.id}
              skill={skill}
              t={t}
              onSave={(patch) => { onUpdateSkill(skill.id, patch); setEditingSkillId(null); }}
              onCancel={() => setEditingSkillId(null)}
            />
          ) : (
            <span className="skillChipEdit" key={skill.id}>
              {skill.name.en || skill.name.ar}
              {skill.level ? ` · ${skill.level}` : ""}
              <button type="button" onClick={() => setEditingSkillId(skill.id)} aria-label={t.dash_edit} title={t.dash_edit}><Pencil size={13} aria-hidden="true" /></button>
              <button type="button" onClick={() => onDeleteSkill(skill.id)} aria-label={t.dash_delete} title={t.dash_delete}><X size={13} aria-hidden="true" /></button>
            </span>
          )
        )}
      </div>

      <AddSkillRow t={t} onAdd={onAddSkill} />

      <ConfirmDialog
        open={confirmDelete}
        title={t.dash_confirm_delete_title}
        body={t.dash_confirm_delete_body}
        confirmLabel={t.dash_confirm}
        cancelLabel={t.dash_cancel}
        onConfirm={() => { onDeleteCategory(); setConfirmDelete(false); }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}

function SkillEditChip({ skill, t, onSave, onCancel }) {
  const [en, setEn] = useState(skill.name.en);
  const [ar, setAr] = useState(skill.name.ar);
  const [level, setLevel] = useState(skill.level || "");

  return (
    <span className="skillChipEdit" style={{ gap: 6 }}>
      <input type="text" value={en} onChange={(e) => setEn(e.target.value)} style={{ width: 90, border: "none", background: "transparent", color: "inherit" }} />
      <input type="text" value={ar} dir="rtl" onChange={(e) => setAr(e.target.value)} style={{ width: 90, border: "none", background: "transparent", color: "inherit" }} />
      <input type="text" value={level} placeholder={t.dash_level} onChange={(e) => setLevel(e.target.value)} style={{ width: 70, border: "none", background: "transparent", color: "inherit" }} />
      <button type="button" onClick={() => onSave({ name: { en, ar }, level })} title={t.dash_save}><Check size={13} aria-hidden="true" /></button>
      <button type="button" onClick={onCancel} title={t.dash_cancel}><X size={13} aria-hidden="true" /></button>
    </span>
  );
}

export default function SkillsEditor() {
  const { lang } = useLang();
  const t = useT(lang);
  const { data, addItem, updateItem, deleteItem, addSkillToCategory, updateSkillInCategory, deleteSkillFromCategory } = useData();
  const { showToast } = useToast();
  const categories = data.skillCategories || [];

  // Every one of these hits the API and must be awaited before declaring
  // success — firing the request and immediately toasting "saved" (the
  // previous pattern here and in every other editor) meant a failed request
  // still told the user it worked.
  async function runOrToastError(action) {
    try {
      await action();
      showToast(t.dash_saved);
    } catch {
      showToast(t.dash_save_error, "danger");
    }
  }

  function addCategory() {
    runOrToastError(() =>
      addItem("skillCategories", { icon: "✨", name: { en: "New Category", ar: "فئة جديدة" }, skills: [] }, "cat")
    );
  }

  return (
    <div>
      <div className="dashHead">
        <div>
          <h1>{t.dash_tab_skills}</h1>
          <p>{t.dash_title}</p>
        </div>
        <button className="btn btn--primary" type="button" onClick={addCategory}>+ {t.dash_new_category}</button>
      </div>

      {categories.length === 0 ? (
        <div className="emptyState">{t.dash_no_categories}</div>
      ) : (
        categories.map((cat) => (
          <CategoryBlock
            key={cat.id}
            category={cat}
            t={t}
            onUpdateCategory={(patch) => runOrToastError(() => updateItem("skillCategories", cat.id, patch))}
            onDeleteCategory={() => runOrToastError(() => deleteItem("skillCategories", cat.id))}
            onAddSkill={(skill) => runOrToastError(() => addSkillToCategory(cat.id, skill))}
            onUpdateSkill={(skillId, patch) => runOrToastError(() => updateSkillInCategory(cat.id, skillId, patch))}
            onDeleteSkill={(skillId) => runOrToastError(() => deleteSkillFromCategory(cat.id, skillId))}
          />
        ))
      )}
    </div>
  );
}
