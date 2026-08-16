import { motion, useReducedMotion } from "motion/react";
import { useLang } from "../context/LangContext";
import { useT } from "../data/uiText";
import { useData } from "../context/DataContext";
import { L } from "../utils/field";
import { fadeUp, staggerParent } from "../utils/motion";

// Not the shared `viewportOnce` (amount: 0.2) — the folder-card rows make
// this list far taller than the viewport on mobile, so scrolling straight to
// it via a nav-link jump can land with under 20% ever on screen at once,
// and the fade-in trigger with `once: true` then never fires again — every
// row stays permanently at opacity: 0. A near-zero amount only needs a
// sliver on screen to start the animation.
const projectsViewport = { once: true, amount: 0.01 };
import ProjectFolder from "./ProjectFolder";

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProjectAction({ project }) {
  if (!project.link) return null;
  return (
    <a className="projectCard__action" href={project.link} target="_blank" rel="noopener noreferrer">
      <span>View project</span>
      <span className="projectCard__actionArrow"><ArrowIcon /></span>
    </a>
  );
}

function ProjectRow({ project, lang, t, variants }) {
  const images = project.images || [];
  const title = L(project.name, lang);

  return (
    <motion.article className={`projectRow${images.length === 0 ? " projectRow--noMedia" : ""}`} variants={variants}>
      {images.length > 0 && (
        <div className="projectRow__media">
          <ProjectFolder images={images} title={title} t={t} />
        </div>
      )}
      <div className="projectRow__content">
        <header className="projectCard__head">
          <h3 className="projectCard__title">{title}</h3>
          {L(project.badge, lang) && <span className="projectCard__badge">{L(project.badge, lang)}</span>}
        </header>
        <p className="projectCard__desc">{L(project.description, lang)}</p>
        {Array.isArray(project.technologies) && project.technologies.length > 0 && (
          <ul className="projectCard__tags" aria-label="Project tags">
            {project.technologies.map((tech, i) => (
              <li className="tag" key={i}>{tech}</li>
            ))}
          </ul>
        )}
        <ProjectAction project={project} />
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const { lang } = useLang();
  const t = useT(lang);
  const { data } = useData();
  const projects = data.projects || [];
  const reduced = useReducedMotion();

  const container = staggerParent(reduced, { stagger: 0.1 });
  const rowVariants = fadeUp(reduced, { y: 20 });

  return (
    <section className="section" id="projects" aria-label="Projects">
      <div className="container">
        <div className="sectionHead">
          <div>
            <p className="sectionEyebrow" aria-hidden="true">
              <span className="sectionEyebrow__line"></span>03
            </p>
            <h2 className="sectionTitle">{t.projects_title}</h2>
          </div>
          <p className="sectionSubtitle">{t.projects_subtitle}</p>
        </div>

        {projects.length === 0 ? (
          <div className="emptyState">{t.empty_projects}</div>
        ) : (
          <motion.div
            className="projectsList"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={projectsViewport}
          >
            {projects.map((p) => (
              <ProjectRow key={p.id} project={p} lang={lang} t={t} variants={rowVariants} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
