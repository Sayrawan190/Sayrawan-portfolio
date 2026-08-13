import { motion, useReducedMotion } from "motion/react";
import { useLang } from "../context/LangContext";
import { useT } from "../data/uiText";
import { useData } from "../context/DataContext";
import { L } from "../utils/field";
import { fadeUp, viewportOnce } from "../utils/motion";

export default function About() {
  const { lang } = useLang();
  const t = useT(lang);
  const { data } = useData();
  const reduced = useReducedMotion();

  return (
    <section className="section" id="about" aria-label="About me">
      <div className="container">
        <div className="sectionHead">
          <div>
            <p className="sectionEyebrow" aria-hidden="true">
              <span className="sectionEyebrow__line"></span>01
            </p>
            <h2 className="sectionTitle">{t.about_title}</h2>
          </div>
          <p className="sectionSubtitle">{t.about_subtitle}</p>
        </div>

        <motion.div
          className="card card--pad"
          variants={fadeUp(reduced, { y: 16 })}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <p className="prose prose--lead">{L(data.profile.about, lang)}</p>
        </motion.div>
      </div>
    </section>
  );
}
