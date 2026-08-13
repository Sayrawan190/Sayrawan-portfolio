import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { useLang } from "../context/LangContext";
import { useT } from "../data/uiText";
import { useData } from "../context/DataContext";
import { L } from "../utils/field";
import { fadeUp, staggerParent, viewportOnce } from "../utils/motion";

function formatDates(exp, lang, t) {
  const start = exp.start || "";
  const end = exp.endIsPresent ? t.exp_present : exp.end || "";
  if (!start && !end) return "";
  return [start, end].filter(Boolean).join(" — ");
}

export default function Experience() {
  const { lang } = useLang();
  const t = useT(lang);
  const { data } = useData();
  const experience = data.experience || [];
  const reduced = useReducedMotion();
  const trackRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 88%", "end 65%"],
  });

  const container = staggerParent(reduced, { stagger: 0.14 });
  const item = fadeUp(reduced, { y: 18 });

  return (
    <section className="section" id="experience" aria-label="Experience">
      <div className="container">
        <div className="sectionHead">
          <div>
            <p className="sectionEyebrow" aria-hidden="true">
              <span className="sectionEyebrow__line"></span>04
            </p>
            <h2 className="sectionTitle">{t.exp_title}</h2>
          </div>
          <p className="sectionSubtitle">{t.exp_subtitle}</p>
        </div>

        {experience.length === 0 ? (
          <div className="emptyState">{t.empty_experience}</div>
        ) : (
          <motion.div
            className="timeline"
            ref={trackRef}
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <div className="timeline__track" aria-hidden="true">
              {reduced ? (
                <div className="timeline__trackFill" style={{ transform: "scaleY(1)" }} />
              ) : (
                <motion.div className="timeline__trackFill" style={{ scaleY: scrollYProgress }} />
              )}
            </div>

            {experience.map((exp) => (
              <motion.article className="timelineItem" key={exp.id} variants={item}>
                <div className="timelineItem__dot" aria-hidden="true"></div>
                <div className="timelineItem__body card card--pad">
                  <h3 className="timelineItem__title">{L(exp.title, lang)}</h3>
                  {L(exp.organization, lang) && (
                    <p className="timelineItem__org">{L(exp.organization, lang)}</p>
                  )}
                  {formatDates(exp, lang, t) && (
                    <p className="timelineItem__dates">{formatDates(exp, lang, t)}</p>
                  )}
                  <p className="timelineItem__desc">{L(exp.description, lang)}</p>
                  {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                    <ul className="timelineItem__tags" aria-label="Technologies used">
                      {exp.technologies.map((tech, i) => (
                        <li className="tag" key={i}>{tech}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
