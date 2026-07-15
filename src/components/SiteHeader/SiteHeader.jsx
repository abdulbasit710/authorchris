import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./SiteHeader.css";

const menuLinks = [
  ["Home", "/"], ["About Christopher", "/about"],
  ["The Million-Dollar Mindset", "/books/the-million-dollar-mindset"], ["The Power of New Real Estate Money", "/books/the-power-of-new-real-estate-money"],
  ["Books Three & Four", "/books/coming-soon"], ["Contact Christopher", "/contact"],
];

function SiteHeader() {
  const scopeRef = useRef(null);
  const timelineRef = useRef(null);
  const openRef = useRef(false);
  const enterEndRef = useRef(0);
  const buttonRef = useRef(null);

  useGSAP(() => {
    const nav = scopeRef.current.querySelector(".menu-nav");
    const timeline = gsap.timeline({ paused: true });
    gsap.set(nav, { visibility: "hidden", pointerEvents: "none" });
    gsap.set(".menu-nav__backdrop", { opacity: 0 });
    gsap.set(".menu-nav__note", { opacity: 0, y: 8 });

    timeline
      .set(nav, { visibility: "visible", pointerEvents: "auto" })
      .to(".menu-nav__backdrop", { opacity: 1, duration: .4, ease: "power2.out" }, 0)
      .fromTo(".menu-nav__panel", { x: "110%", y: 0, rotation: 0 }, { x: "0%", y: 0, duration: .62, ease: "back.out(1.2)", stagger: .09 }, 0)
      .fromTo(".menu-nav__item", { opacity: 0, x: -22 }, { opacity: 1, x: 0, duration: .9, ease: "expo.out", stagger: .035 }, .12)
      .to(".menu-toggle", { borderColor: "#e5bd72", backgroundColor: "rgba(217,171,85,.12)", boxShadow: "0 0 22px rgba(217,171,85,.22)", duration: .3 }, .06)
      .to(".menu-bar--top", { attr: { x1: 5, y1: 5, x2: 15, y2: 15 }, stroke: "#e5bd72", duration: .35, ease: "back.out(1.4)" }, .06)
      .to(".menu-bar--middle", { opacity: 0, duration: .15 }, .06)
      .to(".menu-bar--bottom", { attr: { x1: 15, y1: 5, x2: 5, y2: 15 }, stroke: "#e5bd72", duration: .35, ease: "back.out(1.4)" }, .06)
      .to(".menu-nav__note", { opacity: 1, y: 0, duration: .3, ease: "power3.out" }, .42)
      .addPause();

    enterEndRef.current = timeline.duration();
    timeline
      .to(".menu-bar", { stroke: "#fff7e9", duration: .18 })
      .to(".menu-toggle", { borderColor: "rgba(255,247,233,.35)", backgroundColor: "rgba(5,5,4,.46)", boxShadow: "none", duration: .2 }, "<")
      .to(".menu-bar--top", { attr: { x1: 3, y1: 7, x2: 17, y2: 7 }, duration: .2, ease: "power3.in" }, "<")
      .to(".menu-bar--middle", { opacity: 1, duration: .16 }, "<")
      .to(".menu-bar--bottom", { attr: { x1: 3, y1: 13, x2: 17, y2: 13 }, duration: .2, ease: "power3.in" }, "<")
      .to(".menu-nav__panel", { y: "112vh", rotation: () => gsap.utils.random(-18, 18), duration: .82, ease: "power3.in", stagger: { from: "end", each: .035 } }, "<")
      .to(".menu-nav__backdrop", { opacity: 0, duration: .28, ease: "power2.in" }, "<.1")
      .set(nav, { visibility: "hidden", pointerEvents: "none" });

    timelineRef.current = timeline;
    return () => timeline.kill();
  }, { scope: scopeRef });

  const toggleMenu = () => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    openRef.current = !openRef.current;
    buttonRef.current?.setAttribute("aria-expanded", String(openRef.current));
    buttonRef.current?.setAttribute("aria-label", openRef.current ? "Close menu" : "Open menu");
    document.body.style.overflow = openRef.current ? "hidden" : "";
    if (openRef.current) {
      if (timeline.time() >= enterEndRef.current) timeline.timeScale(1).restart();
      else timeline.timeScale(1).play();
    } else if (timeline.time() < enterEndRef.current) timeline.timeScale(1.65).reverse();
    else timeline.timeScale(1.25).play();
  };

  const goTo = (event, target) => {
    event.preventDefault();
    if (openRef.current) toggleMenu();
    window.setTimeout(() => {
      const url = new URL(target, window.location.href);
      const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
      const targetPath = url.pathname.replace(/\/+$/, "") || "/";

      if (targetPath !== currentPath) {
        window.location.assign(`${url.pathname}${url.hash}`);
        return;
      }

      if (url.hash) {
        document.querySelector(url.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 180);
  };

  useEffect(() => {
    const escape = (event) => { if (event.key === "Escape" && openRef.current) { toggleMenu(); buttonRef.current?.focus(); } };
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("keydown", escape); document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="menu-header" ref={scopeRef}>
      <div className="menu-topbar">
        <a className="menu-topbar__logo" href="/" onClick={(event) => goTo(event, "/")}>
          <strong><span>Christopher</span> <span>DiCristo</span></strong>
        </a>
        <button className="menu-toggle" ref={buttonRef} type="button" onClick={toggleMenu} aria-expanded="false" aria-label="Open menu">
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <line className="menu-bar menu-bar--top" x1="3" y1="7" x2="17" y2="7" stroke="#fff7e9" strokeWidth="1.5" strokeLinecap="round" />
            <line className="menu-bar menu-bar--middle" x1="3" y1="10" x2="17" y2="10" stroke="#fff7e9" strokeWidth="1.5" strokeLinecap="round" />
            <line className="menu-bar menu-bar--bottom" x1="3" y1="13" x2="17" y2="13" stroke="#fff7e9" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="menu-nav">
        <button className="menu-nav__backdrop" type="button" onClick={toggleMenu} aria-label="Close menu" />
        <section className="menu-nav__top menu-nav__panel">
          <ul>{menuLinks.map(([label, target], index) => <li className="menu-nav__item" key={label}><a href={target} onClick={(event) => goTo(event, target)}><span>{String(index + 1).padStart(2, "0")}</span>{label}</a></li>)}</ul>
          <p className="menu-nav__note">Real Estate Beyond Limits · Christopher DiCristo</p>
        </section>
      </div>
    </div>
  );
}
export default SiteHeader;
