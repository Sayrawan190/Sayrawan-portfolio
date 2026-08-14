import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../server/db.js";
import { makeId, LIST_CONFIG, SKILL_MAPPER } from "./mappers.js";
import {
  SEED_PROFILE,
  SEED_SKILL_CATEGORIES,
  SEED_PROJECTS,
  SEED_EXPERIENCE,
  SEED_CERTIFICATES,
} from "./seedData.js";

// Never touches admin_auth — the dashboard password is created once via the
// first-run setup screen (POST /api/auth/setup) and only ever changed from
// inside the dashboard, so resetting content can never affect login.
export async function seedDatabase(client) {
  await client.query("BEGIN");
  try {
    await client.query(
      "TRUNCATE profile_summary_points, profile_role_words, skills, skill_categories, projects, experience, certificates RESTART IDENTITY CASCADE"
    );

    const p = SEED_PROFILE;
    await client.query(
      `INSERT INTO profile (
        id, photo, name_en, name_ar, title_en, title_ar, tagline_en, tagline_ar,
        about_en, about_ar, cv_link, linkedin, x, phone, focus_en, focus_ar, location_en, location_ar, updated_at
      ) VALUES (1, $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17, now())
      ON CONFLICT (id) DO UPDATE SET
        photo=$1, name_en=$2, name_ar=$3, title_en=$4, title_ar=$5, tagline_en=$6, tagline_ar=$7,
        about_en=$8, about_ar=$9, cv_link=$10, linkedin=$11, x=$12, phone=$13,
        focus_en=$14, focus_ar=$15, location_en=$16, location_ar=$17, updated_at=now()`,
      [
        p.photo, p.name.en, p.name.ar, p.title.en, p.title.ar, p.tagline.en, p.tagline.ar,
        p.about.en, p.about.ar, p.cvLink, p.linkedin, p.x, p.phone,
        p.focus.en, p.focus.ar, p.location.en, p.location.ar,
      ]
    );

    for (let i = 0; i < p.summary.length; i++) {
      const point = p.summary[i];
      await client.query(
        "INSERT INTO profile_summary_points (profile_id, position, en, ar) VALUES (1, $1, $2, $3)",
        [i, point.en, point.ar]
      );
    }

    for (let i = 0; i < p.roleWords.length; i++) {
      const word = p.roleWords[i];
      await client.query(
        "INSERT INTO profile_role_words (profile_id, position, en, ar) VALUES (1, $1, $2, $3)",
        [i, word.en, word.ar]
      );
    }

    for (let i = 0; i < SEED_SKILL_CATEGORIES.length; i++) {
      const cat = SEED_SKILL_CATEGORIES[i];
      const catId = makeId("cat");
      const row = LIST_CONFIG.skillCategories.toRow(cat);
      await client.query(
        "INSERT INTO skill_categories (id, position, icon, name_en, name_ar) VALUES ($1,$2,$3,$4,$5)",
        [catId, i, row.icon, row.name_en, row.name_ar]
      );
      for (let j = 0; j < cat.skills.length; j++) {
        const skillRow = SKILL_MAPPER.toRow(cat.skills[j]);
        await client.query(
          "INSERT INTO skills (id, category_id, position, name_en, name_ar, level) VALUES ($1,$2,$3,$4,$5,$6)",
          [makeId("skill"), catId, j, skillRow.name_en, skillRow.name_ar, skillRow.level]
        );
      }
    }

    for (let i = 0; i < SEED_PROJECTS.length; i++) {
      const row = LIST_CONFIG.projects.toRow(SEED_PROJECTS[i]);
      await client.query(
        `INSERT INTO projects (id, position, name_en, name_ar, description_en, description_ar, badge_en, badge_ar, technologies, images, link)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [makeId("proj"), i, row.name_en, row.name_ar, row.description_en, row.description_ar, row.badge_en, row.badge_ar, row.technologies, row.images, row.link]
      );
    }

    for (let i = 0; i < SEED_EXPERIENCE.length; i++) {
      const row = LIST_CONFIG.experience.toRow(SEED_EXPERIENCE[i]);
      await client.query(
        `INSERT INTO experience (id, position, title_en, title_ar, organization_en, organization_ar, start_date, end_date, end_is_present, description_en, description_ar, technologies)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [makeId("exp"), i, row.title_en, row.title_ar, row.organization_en, row.organization_ar, row.start_date, row.end_date, row.end_is_present, row.description_en, row.description_ar, row.technologies]
      );
    }

    for (let i = 0; i < SEED_CERTIFICATES.length; i++) {
      const row = LIST_CONFIG.certificates.toRow(SEED_CERTIFICATES[i]);
      await client.query(
        `INSERT INTO certificates (id, position, name_en, name_ar, issuer_en, issuer_ar, date, image, link)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [makeId("cert"), i, row.name_en, row.name_ar, row.issuer_en, row.issuer_ar, row.date, row.image, row.link]
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}

const isMain = fileURLToPath(import.meta.url) === path.resolve(process.argv[1] ?? "");
if (isMain) {
  seedDatabase(pool)
    .then(() => {
      console.log("Database seeded.");
      return pool.end();
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
