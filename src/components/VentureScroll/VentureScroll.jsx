import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import loormaxLogo from "../../assets/logo/Loormax_Logosmall.png";
import overallAgentLogo from "../../assets/logo/overall-agent-white-by-loormax.png";
import "./VentureScroll.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ventures = [
  {
    number: "01",
    eyebrow: "Mortgage Leadership",
    title: "Loormax Lending",
    copy: "A national mortgage lending company built to help borrowers, investors, and commercial clients navigate financing with experienced guidance and a broad range of loan solutions.",
    href: "https://ceo.loormaxlending.com/",
    linkLabel: "Explore Loormax Lending",
    logoClass: "venture-scroll__logo--loormax",
    logo: loormaxLogo,
  },
  {
    number: "02",
    eyebrow: "The Overall Agent System",
    title: "Unlock New Income",
    copy: "A professional platform created to help real-estate agents expand their services through mortgage education, business tools, training, support, and new income opportunities.",
    href: "https://unlock-new-income-eda6jpk.gamma.site/",
    linkLabel: "Discover Overall Agent",
    logoClass: "venture-scroll__logo--overall",
    logo: overallAgentLogo,
  },
];

function VentureScroll({ showIntro = true, limit = ventures.length }) {
  const sectionRef = useRef(null);
  const visibleVentures = ventures.slice(0, limit);

  useGSAP(() => {
    const panels = gsap.utils.toArray(".venture-scroll__panel", sectionRef.current);

    panels.forEach((panel) => {
      const logo = panel.querySelector(".venture-scroll__brand");
      const copy = panel.querySelector(".venture-scroll__copy");
      const rule = panel.querySelector(".venture-scroll__rule span");

      gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 72%",
          end: "center 48%",
          scrub: 1.15,
        },
      })
        .fromTo(logo, { x: -90, autoAlpha: 0, scale: 0.92 }, { x: 0, autoAlpha: 1, scale: 1, ease: "power3.out" })
        .fromTo(copy, { x: 90, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power3.out" }, 0.08)
        .fromTo(rule, { scaleX: 0 }, { scaleX: 1, transformOrigin: "left", ease: "none" }, 0.12);
    });
  }, { scope: sectionRef });

  return (
    <section
      className="venture-scroll"
      ref={sectionRef}
      aria-labelledby={showIntro ? "venture-scroll-title" : undefined}
      aria-label={showIntro ? undefined : "Loormax Lending"}
    >
      {showIntro && (
        <header className="venture-scroll__intro">
          <p>Christopher DiCristo · Beyond the Books</p>
          <h2 id="venture-scroll-title">Ideas built into<br /><em>working ventures.</em></h2>
          <span>Scroll to explore</span>
        </header>
      )}

      {visibleVentures.map((venture) => (
        <article className="venture-scroll__panel" key={venture.title}>
          <div className="venture-scroll__inner">
            <div className="venture-scroll__brand">
              <div className={`venture-scroll__logo ${venture.logoClass}`}>
                <img src={venture.logo} alt={`${venture.title} logo`} />
              </div>
              <span>{venture.number}</span>
            </div>

            <div className="venture-scroll__copy">
              <p>{venture.eyebrow}</p>
              <h3>{venture.title}</h3>
              <div className="venture-scroll__rule" aria-hidden="true"><span /></div>
              <div className="venture-scroll__description">{venture.copy}</div>
              <a href={venture.href} target="_blank" rel="noreferrer">
                {venture.linkLabel} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

export default VentureScroll;
