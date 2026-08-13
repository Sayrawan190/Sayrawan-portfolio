import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Certificates from "../components/Certificates";
import Contact from "../components/Contact";

export default function PortfolioPage() {
  const location = useLocation();

  useEffect(() => {
    document.title = "Portfolio";
  }, []);

  // HashRouter routes on the same "#" fragment the in-page nav links use for
  // scrolling (href="#about", "#contact", ...), so a plain browser anchor
  // jump never happens here — do it ourselves whenever the hash changes.
  useEffect(() => {
    const id = location.pathname.replace(/^\//, "");
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certificates />
        <Contact />
      </main>
    </>
  );
}
