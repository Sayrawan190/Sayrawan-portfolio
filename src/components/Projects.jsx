import { motion, useReducedMotion } from "motion/react";
import { useLang } from "../context/LangContext";
import { useT } from "../data/uiText";
import { useData } from "../context/DataContext";
import { L } from "../utils/field";
import { fadeUp, staggerParent, viewportOnce } from "../utils/motion";

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
    <span className="projectCard__action">
      <span>View project</span>
      <span className="projectCard__actionArrow"><ArrowIcon /></span>
    </span>
  );
}

function FeaturedProject({ project, lang, variants }) {
  const isLink = Boolean(project.link);
  const Tag = isLink ? motion.a : motion.div;
  const linkProps = isLink ? { href: project.link, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Tag className="projectFeatured" variants={variants} {...linkProps} aria-label={isLink ? L(project.name, lang) : undefined}>
      <div className="projectFeatured__media">
        <div className="projectFeatured__browserBar" aria-hidden="true">
          <span className="projectFeatured__dot"></span>
          <span className="projectFeatured__dot"></span>
          <span className="projectFeatured__dot"></span>
        </div>
        {project.image && <img src={project.image} alt={L(project.name, lang)} loading="lazy" />}
      </div>
      <div className="projectFeatured__body">
        <p className="projectFeatured__eyebrow">
          Featured{L(project.badge, lang) ? ` · ${L(project.badge, lang)}` : ""}
        </p>
        <h3 className="projectFeatured__title">{L(project.name, lang)}</h3>
        <p className="projectFeatured__desc">{L(project.description, lang)}</p>
        {Array.isArray(project.technologies) && project.technologies.length > 0 && (
          <ul className="projectCard__tags" aria-label="Project tags">
            {project.technologies.map((tech, i) => (
              <li className="tag" key={i}>{tech}</li>
            ))}
          </ul>
        )}
        <div className="projectFeatured__actions">
          <ProjectAction project={project} />
        </div>
      </div>
    </Tag>
  );
}

function ProjectCard({ project, lang, variants }) {
  const content = (
    <>
      {project.image && (
        <div className="projectCard__imageWrap">
          <img className="projectCard__image" src={project.image} alt={L(project.name, lang)} loading="lazy" />
        </div>
      )}
      <header className="projectCard__head">
        <h3 className="projectCard__title">{L(project.name, lang)}</h3>
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
    </>
  );

  if (project.link) {
    return (
      <motion.a
        className="projectCard"
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={L(project.name, lang)}
        variants={variants}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.article className="projectCard" variants={variants}>
      {content}
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
  const featuredVariants = fadeUp(reduced, { y: 26 });
  const cardVariants = fadeUp(reduced, { y: 20 });

  const [featured, ...rest] = projects;

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
            className="projectsLayout"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {featured && <FeaturedProject project={featured} lang={lang} variants={featuredVariants} />}
            {rest.length > 0 && (
              <div className="projectsGrid">
                {rest.map((p) => (
                  <ProjectCard key={p.id} project={p} lang={lang} variants={cardVariants} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
