import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import brandLogo from "../../assets/logo/noncolor.png";
import "./SiteFooter.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const navLinks = [
  ["Home", "/"],
  ["About Christopher", "/about"],
  ["The Million-Dollar Mindset", "/books/the-million-dollar-mindset"],
  ["The Power of New Real Estate Money", "/books/the-power-of-new-real-estate-money"],
  ["Books Three & Four", "/books/coming-soon"],
  ["Contact Christopher", "/contact"],
];

const socialLinks = [
  ["Facebook", "https://www.facebook.com/"],
  ["Instagram", "https://www.instagram.com/"],
  ["LinkedIn", "https://www.linkedin.com/in/chris-dicristo-b63913233"],
];

function SiteFooter() {
  const footerRef = useRef(null);

  useGSAP(() => {
    const footer = footerRef.current;
    const path = footer.querySelector(".site-footer__wave-path");
    const revealItems = gsap.utils.toArray(".site-footer__reveal", footer);
    const downPath = "M0 0 C0 0 464 165 1139 165 S2278 0 2278 0 V683 H0 Z";
    const flatPath = "M0 0 C0 0 464 0 1139 0 S2278 0 2278 0 V683 H0 Z";

    ScrollTrigger.create({
      trigger: footer,
      start: "top 88%",
      once: true,
      onEnter: (self) => {
        const velocity = Math.min(1.8, Math.abs(self.getVelocity()) / 2400);
        gsap.fromTo(path,
          { attr: { d: downPath } },
          { attr: { d: flatPath }, duration: 1.8, ease: `elastic.out(${1 + velocity * .35}, ${.42 - Math.min(.18, velocity * .08)})` }
        );
        gsap.fromTo(revealItems,
          { y: 42, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: .9, stagger: .08, ease: "power3.out", delay: .32 }
        );
        gsap.fromTo(".site-footer__logo-frame",
          { scale: .72, rotateZ: -6, autoAlpha: 0 },
          { scale: 1, rotateZ: 0, autoAlpha: 1, duration: 1.15, delay: .5, ease: "back.out(1.7)" }
        );
      },
    });

    gsap.to(".site-footer__logo-frame img", {
      y: -6,
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const letters = gsap.utils.toArray(".site-footer__name span", footer);
    gsap.to(letters, {
      yPercent: -7,
      stagger: { each: .035, yoyo: true, repeat: 1 },
      ease: "sine.inOut",
      scrollTrigger: { trigger: ".site-footer__name", start: "top 92%", end: "bottom 70%", scrub: .7 },
    });
  }, { scope: footerRef });

  const scrollToTarget = (event, target) => {
    if (!target.startsWith(".") && !target.startsWith("#")) return;
    event.preventDefault();
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="site-footer" id="contact-christopher" ref={footerRef}>
      <div className="site-footer__wave" aria-hidden="true">
        <svg preserveAspectRatio="none" viewBox="0 0 2278 683">
          <defs>
            <linearGradient id="footer-gold" x1="0" y1="0" x2="2278" y2="683" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#8b6428" />
              <stop offset=".46" stopColor="#e5bd72" />
              <stop offset="1" stopColor="#5d421d" />
            </linearGradient>
          </defs>
          <path className="site-footer__wave-path" fill="url(#footer-gold)" d="M0 0 C0 0 464 165 1139 165 S2278 0 2278 0 V683 H0 Z" />
        </svg>
      </div>

      <div className="site-footer__inner">
        <section className="site-footer__cta site-footer__reveal" aria-labelledby="footer-heading">
          <p>Build beyond the expected</p>
          <h2 id="footer-heading">The next chapter<br />starts with a <em>conversation.</em></h2>
          <a href="https://www.linkedin.com/in/chris-dicristo-b63913233" target="_blank" rel="noreferrer">
            Connect with Christopher <span aria-hidden="true">↗</span>
          </a>
        </section>

        <div className="site-footer__rule site-footer__reveal" />

        <div className="site-footer__directory">
          <div className="site-footer__statement site-footer__reveal">
            <div className="site-footer__brand-lockup">
              <div className="site-footer__logo-frame">
                <span aria-hidden="true" />
                <img src={brandLogo} alt="Real Estate Beyond Limits — Christopher DiCristo" />
              </div>
              <p>Author, entrepreneur, real estate leader, and advocate for building a legacy with purpose.</p>
            </div>
          </div>

          <nav className="site-footer__column site-footer__reveal" aria-label="Footer navigation">
            <p>Explore</p>
            {navLinks.map(([label, href]) => <a key={label} href={href} onClick={(event) => scrollToTarget(event, href)}>{label}<span>↗</span></a>)}
          </nav>

          <nav className="site-footer__column site-footer__reveal" aria-label="Social links">
            <p>Follow</p>
            {socialLinks.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer">{label}<span>↗</span></a>)}
          </nav>
        </div>

        <div className="site-footer__name" aria-label="DiCristo">
          {[..."DICRISTO"].map((letter, index) => <span key={`${letter}-${index}`}>{letter}</span>)}
        </div>

        <div className="site-footer__bottom site-footer__reveal">
          <p>© {new Date().getFullYear()} Christopher DiCristo. All rights reserved.</p>
          <a href="#top">Back to top <span aria-hidden="true">↑</span></a>
          <p>Real Estate Beyond Limits</p>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
