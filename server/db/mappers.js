import crypto from "node:crypto";
import { pool } from "../server/db.js";

export function makeId(prefix) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

// One entry per listKey exposed through the generic /:listKey/items routes.
// toRow(item) turns a JSON-shaped item into a flat row of column values;
// fromRow(row) turns a DB row back into the JSON shape the front-end expects.
export const LIST_CONFIG = {
  skillCategories: {
    table: "skill_categories",
    idPrefix: "cat",
    toRow: (item) => ({
      icon: item.icon ?? "",
      name_en: item.name?.en ?? "",
      name_ar: item.name?.ar ?? "",
    }),
    fromRow: (row) => ({
      id: row.id,
      icon: row.icon,
      name: { en: row.name_en, ar: row.name_ar },
    }),
  },
  projects: {
    table: "projects",
    idPrefix: "proj",
    toRow: (item) => ({
      name_en: item.name?.en ?? "",
      name_ar: item.name?.ar ?? "",
      description_en: item.description?.en ?? "",
      description_ar: item.description?.ar ?? "",
      badge_en: item.badge?.en ?? "",
      badge_ar: item.badge?.ar ?? "",
      technologies: item.technologies ?? [],
      images: (item.images ?? []).filter(Boolean).slice(0, 5),
      link: item.link ?? "",
    }),
    fromRow: (row) => ({
      id: row.id,
      name: { en: row.name_en, ar: row.name_ar },
      description: { en: row.description_en, ar: row.description_ar },
      badge: { en: row.badge_en, ar: row.badge_ar },
      technologies: row.technologies ?? [],
      // Falls back to the legacy single `image` column for rows saved before
      // the multi-image gallery existed.
      images: row.images?.length ? row.images : row.image ? [row.image] : [],
      link: row.link,
    }),
  },
  experience: {
    table: "experience",
    idPrefix: "exp",
    toRow: (item) => ({
      title_en: item.title?.en ?? "",
      title_ar: item.title?.ar ?? "",
      organization_en: item.organization?.en ?? "",
      organization_ar: item.organization?.ar ?? "",
      start_date: item.start ?? "",
      end_date: item.end ?? "",
      end_is_present: !!item.endIsPresent,
      description_en: item.description?.en ?? "",
      description_ar: item.description?.ar ?? "",
      technologies: item.technologies ?? [],
    }),
    fromRow: (row) => ({
      id: row.id,
      title: { en: row.title_en, ar: row.title_ar },
      organization: { en: row.organization_en, ar: row.organization_ar },
      start: row.start_date,
      end: row.end_date,
      endIsPresent: row.end_is_present,
      description: { en: row.description_en, ar: row.description_ar },
      technologies: row.technologies ?? [],
    }),
  },
  certificates: {
    table: "certificates",
    idPrefix: "cert",
    toRow: (item) => ({
      name_en: item.name?.en ?? "",
      name_ar: item.name?.ar ?? "",
      issuer_en: item.issuer?.en ?? "",
      issuer_ar: item.issuer?.ar ?? "",
      date: item.date ?? "",
      image: item.image ?? "",
      link: item.link ?? "",
    }),
    fromRow: (row) => ({
      id: row.id,
      name: { en: row.name_en, ar: row.name_ar },
      issuer: { en: row.issuer_en, ar: row.issuer_ar },
      date: row.date,
      image: row.image,
      link: row.link,
    }),
  },
};

function skillToRow(skill) {
  return {
    name_en: skill.name?.en ?? "",
    name_ar: skill.name?.ar ?? "",
    level: skill.level ?? "",
  };
}

function skillFromRow(row) {
  return {
    id: row.id,
    name: { en: row.name_en, ar: row.name_ar },
    level: row.level,
  };
}

export const SKILL_MAPPER = { toRow: skillToRow, fromRow: skillFromRow };

export async function assembleData(client = pool) {
  const [
    profileRes,
    summaryRes,
    roleWordsRes,
    categoriesRes,
    skillsRes,
    projectsRes,
    experienceRes,
    certificatesRes,
  ] = await Promise.all([
    client.query("SELECT * FROM profile WHERE id = 1"),
    client.query("SELECT * FROM profile_summary_points ORDER BY position"),
    client.query("SELECT * FROM profile_role_words ORDER BY position"),
    client.query("SELECT * FROM skill_categories ORDER BY position"),
    client.query("SELECT * FROM skills ORDER BY position"),
    client.query("SELECT * FROM projects ORDER BY position"),
    client.query("SELECT * FROM experience ORDER BY position"),
    client.query("SELECT * FROM certificates ORDER BY position"),
  ]);

  const p = profileRes.rows[0];
  const profile = p
    ? {
        photo: p.photo,
        name: { en: p.name_en, ar: p.name_ar },
        title: { en: p.title_en, ar: p.title_ar },
        tagline: { en: p.tagline_en, ar: p.tagline_ar },
        about: { en: p.about_en, ar: p.about_ar },
        cvLink: p.cv_link,
        linkedin: p.linkedin,
        x: p.x,
        phone: p.phone,
        focus: { en: p.focus_en, ar: p.focus_ar },
        location: { en: p.location_en, ar: p.location_ar },
        summary: summaryRes.rows.map((row) => ({ en: row.en, ar: row.ar })),
        roleWords: roleWordsRes.rows.map((row) => ({ en: row.en, ar: row.ar })),
      }
    : null;

  const skillsByCategory = new Map();
  for (const row of skillsRes.rows) {
    const list = skillsByCategory.get(row.category_id) ?? [];
    list.push(skillFromRow(row));
    skillsByCategory.set(row.category_id, list);
  }

  return {
    profile,
    skillCategories: categoriesRes.rows.map((row) => ({
      ...LIST_CONFIG.skillCategories.fromRow(row),
      skills: skillsByCategory.get(row.id) ?? [],
    })),
    projects: projectsRes.rows.map(LIST_CONFIG.projects.fromRow),
    experience: experienceRes.rows.map(LIST_CONFIG.experience.fromRow),
    certificates: certificatesRes.rows.map(LIST_CONFIG.certificates.fromRow),
  };
}
