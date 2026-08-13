import { motion, useReducedMotion } from "motion/react";
import { useLang } from "../context/LangContext";
import { useT } from "../data/uiText";
import { useData } from "../context/DataContext";
import { L } from "../utils/field";
import { fadeUp, staggerParent, viewportOnce } from "../utils/motion";

// Only converts a *recognized* level word into a dot rating — never invents a
// number from arbitrary free text. The dashboard's "Level / note" field is
// documented as an optional free-form note, so anything that isn't clearly a
// level word (e.g. "used in 3 shipped apps") is shown as plain text context
// instead of being forced into a fabricated rating.
const LEVEL_DOTS = {
  beginner: 1, basic: 1, novice: 1, learning: 1,
  intermediate: 2, moderate: 2, familiar: 2,
  advanced: 3, proficient: 3, strong: 3, experienced: 3,
  expert: 4, master: 4, fluent: 4,
};

function levelToDots(level) {
  if (!level) return null;
  const key = String(level).trim().toLowerCase();
  return LEVEL_DOTS[key] ?? null;
}

export default function Skills() {
  const { lang } = useLang();
  const t = useT(lang);
  const { data } = useData();
  const categories = data.skillCategories || [];
  const reduced = useReducedMotion();

  const container = staggerParent(reduced, { stagger: 0.1 });
  const card = fadeUp(reduced, { y: 20 });

  return (
    <section className="section" id="skills" aria-label="Skills">
      <div className="container">
        <div className="sectionHead">
          <div>
            <p className="sectionEyebrow" aria-hidden="true">
              <span className="sectionEyebrow__line"></span>02
            </p>
            <h2 className="sectionTitle">{t.skills_title}</h2>
          </div>
          <p className="sectionSubtitle">{t.skills_subtitle}</p>
        </div>

        {categories.length === 0 ? (
          <div className="emptyState">{t.empty_skills}</div>
        ) : (
          <motion.div
            className="skillsGrid"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {categories.map((cat) => {
              const skills = cat.skills || [];
              return (
                <motion.article className="skillCard" key={cat.id} variants={card}>
                  <header className="skillCard__head">
                    <span className="skillCard__icon" aria-hidden="true">{cat.icon || "🧩"}</span>
                    <div>
                      <h3 className="skillCard__title">{L(cat.name, lang)}</h3>
                      <p className="skillCard__count">
                        {skills.length} {skills.length === 1 ? "skill" : "skills"}
                      </p>
                    </div>
                  </header>
                  <ul className="chipList" aria-label={L(cat.name, lang)}>
                    {skills.map((skill) => {
                      const dots = levelToDots(skill.level);
                      return (
                        <li
                          className="chip"
                          key={skill.id}
                          tabIndex={skill.level ? 0 : undefined}
                          title={skill.level || undefined}
                        >
                          {L(skill.name, lang)}
                          {dots != null && (
                            <span className="chip__dots" aria-hidden="true">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <span key={i} className={`chip__dot${i < dots ? " is-filled" : ""}`}></span>
                              ))}
                            </span>
                          )}
                          {skill.level && (
                            <span className="chip__detail" role="tooltip">{skill.level}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
