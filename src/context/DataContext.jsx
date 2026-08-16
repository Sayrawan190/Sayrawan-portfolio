import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLang } from "./LangContext";
import { useT } from "../data/uiText";
import LoadingScreen from "../components/LoadingScreen";

const DataContext = createContext(null);

async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.error || String(res.status));
  }
  return res.json();
}

export function DataProvider({ children }) {
  const { lang } = useLang();
  const t = useT(lang);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api("/data")
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ---- Profile -------------------------------------------------------
  async function updateProfile(patch) {
    setData(await api("/profile", { method: "PUT", body: patch }));
  }

  // ---- Generic list helpers (skills categories, projects, experience, certs) ----
  async function addItem(listKey, item) {
    const { data: next, insertedId } = await api(`/${listKey}/items`, {
      method: "POST",
      body: item,
    });
    setData(next);
    return insertedId;
  }

  async function updateItem(listKey, id, patch) {
    setData(await api(`/${listKey}/items/${id}`, { method: "PUT", body: patch }));
  }

  async function deleteItem(listKey, id) {
    setData(await api(`/${listKey}/items/${id}`, { method: "DELETE" }));
  }

  async function reorderList(listKey, nextList) {
    setData(
      await api(`/${listKey}/reorder`, {
        method: "PUT",
        body: { order: nextList.map((item) => item.id) },
      })
    );
  }

  // ---- Skill categories (nested skills) -------------------------------
  async function addSkillToCategory(categoryId, skill) {
    const { data: next } = await api(`/skillCategories/${categoryId}/skills`, {
      method: "POST",
      body: skill,
    });
    setData(next);
  }

  async function updateSkillInCategory(categoryId, skillId, patch) {
    setData(
      await api(`/skillCategories/${categoryId}/skills/${skillId}`, {
        method: "PUT",
        body: patch,
      })
    );
  }

  async function deleteSkillFromCategory(categoryId, skillId) {
    setData(
      await api(`/skillCategories/${categoryId}/skills/${skillId}`, { method: "DELETE" })
    );
  }

  // ---- Reset -----------------------------------------------------------
  async function resetToDefaults() {
    setData(await api("/reset", { method: "POST" }));
  }

  const value = useMemo(
    () => ({
      data,
      updateProfile,
      addItem,
      updateItem,
      deleteItem,
      reorderList,
      addSkillToCategory,
      updateSkillInCategory,
      deleteSkillFromCategory,
      resetToDefaults,
    }),
    [data]
  );

  if (loading) return <LoadingScreen text={t.dash_data_loading} />;
  if (error) return <div className="dataStatus dataStatus--error">{t.dash_data_error}</div>;

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside <DataProvider>");
  return ctx;
}
