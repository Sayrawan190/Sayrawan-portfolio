import { pool } from "../server/db.js";
import { assembleData } from "../db/mappers.js";

// Accepts a partial patch and merges it over the current row (mirrors the
// old client-side `updateProfile(patch)` merge-over-current-state behavior).
export async function updateProfile(req, res) {
  const current = (await assembleData(pool)).profile;
  const patch = req.body ?? {};
  const next = {
    photo: patch.photo ?? current.photo,
    name: { ...current.name, ...patch.name },
    title: { ...current.title, ...patch.title },
    tagline: { ...current.tagline, ...patch.tagline },
    about: { ...current.about, ...patch.about },
    cvLink: patch.cvLink ?? current.cvLink,
    linkedin: patch.linkedin ?? current.linkedin,
    x: patch.x ?? current.x,
    phone: patch.phone ?? current.phone,
    focus: { ...current.focus, ...patch.focus },
    location: { ...current.location, ...patch.location },
    summary: patch.summary ?? current.summary,
    roleWords: patch.roleWords ?? current.roleWords,
  };

  await pool.query(
    `UPDATE profile SET
      photo=$1, name_en=$2, name_ar=$3, title_en=$4, title_ar=$5, tagline_en=$6, tagline_ar=$7,
      about_en=$8, about_ar=$9, cv_link=$10, linkedin=$11, x=$12, phone=$13,
      focus_en=$14, focus_ar=$15, location_en=$16, location_ar=$17, updated_at=now()
     WHERE id = 1`,
    [
      next.photo, next.name.en, next.name.ar, next.title.en, next.title.ar,
      next.tagline.en, next.tagline.ar, next.about.en, next.about.ar,
      next.cvLink, next.linkedin, next.x, next.phone,
      next.focus.en, next.focus.ar, next.location.en, next.location.ar,
    ]
  );

  await pool.query("DELETE FROM profile_summary_points WHERE profile_id = 1");
  for (let i = 0; i < next.summary.length; i++) {
    const point = next.summary[i];
    await pool.query(
      "INSERT INTO profile_summary_points (profile_id, position, en, ar) VALUES (1, $1, $2, $3)",
      [i, point.en ?? "", point.ar ?? ""]
    );
  }

  await pool.query("DELETE FROM profile_role_words WHERE profile_id = 1");
  for (let i = 0; i < next.roleWords.length; i++) {
    const word = next.roleWords[i];
    await pool.query(
      "INSERT INTO profile_role_words (profile_id, position, en, ar) VALUES (1, $1, $2, $3)",
      [i, word.en ?? "", word.ar ?? ""]
    );
  }

  res.json(await assembleData(pool));
}
