import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import DecayCard from "./DecayCard";
import LightRays from "../LightRays/LightRays";
import cristoPortrait from "../../assets/images/christopher-dicristo-boardroom.png";
import "./CristoSocial.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const icons = {
  Facebook: <path d="M14 8.8h3V5.2c-.5-.1-2.2-.2-4.1-.2-4.1 0-6.9 2.5-6.9 7.1V16H2v4h4v10h5V20h4.2l.7-4H11v-3.5c0-1.2.3-2 3-2v-1.7Z" />,
  Instagram: <><rect x="3.5" y="3.5" width="25" height="25" rx="7" /><circle cx="16" cy="16" r="6" /><circle cx="24.5" cy="7.8" r="1.2" className="social-icon__dot" /></>,
  LinkedIn: <><path d="M7.2 11.5H2.4V27h4.8V11.5ZM4.8 4A2.8 2.8 0 1 0 4.8 9.6 2.8 2.8 0 0 0 4.8 4Z" /><path d="M15.2 11.5h-4.6V27h4.8v-7.7c0-2 .4-4 2.9-4 2.5 0 2.5 2.3 2.5 4.1V27h4.8v-8.6c0-4.2-.9-7.4-5.8-7.4-2.3 0-3.9 1.3-4.6 2.5v-2Z" /></>,
};

const socials = [
  { label: "Facebook", href: "https://www.facebook.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/chris-dicristo-b63913233" },
];

function CristoSocial() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const heading = sectionRef.current.querySelector(".cristo-social__heading");
    const card = sectionRef.current.querySelector(".cristo-social__card-wrap");
    const line = sectionRef.current.querySelector(".cristo-social__line");
    const isCompact = window.matchMedia("(max-width: 600px)").matches;

    if (isCompact) {
      gsap.set([heading, card], { clearProps: "all", autoAlpha: 1 });
      gsap.set(line, { scaleX: 1, transformOrigin: "center" });
      return () => gsap.set([heading, card, line], { clearProps: "all" });
    }

    gsap.set(card, { autoAlpha: 0, y: 120, scale: .88 });
    gsap.set(line, { scaleX: 0, transformOrigin: "center" });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=190%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    timeline
      .to(line, { scaleX: 1, duration: .2, ease: "none" })
      .to(heading, { y: -70, autoAlpha: 0, filter: "blur(7px)", duration: .38, ease: "power2.in" }, .26)
      .to(card, { y: 0, scale: 1, autoAlpha: 1, duration: .55, ease: "power3.out" }, .46)
      .to(card, { scale: 1.025, duration: .25, ease: "none" });

    return () => timeline.kill();
  }, { scope: sectionRef });

  return (
    <section className="cristo-social" ref={sectionRef} aria-labelledby="cristo-social-title">
      <LightRays
        raysOrigin="top-center"
        raysColor="#f2bd52"
        raysSpeed={0.5}
        lightSpread={0.82}
        rayLength={2.8}
        followMouse
        mouseInfluence={0.1}
        noiseAmount={0.035}
        distortion={0.018}
        className="cristo-social__rays"
      />
      <div className="cristo-social__stage">
        <header className="cristo-social__heading">
          <p>Connect with the author</p>
          <h2 id="cristo-social-title">Christopher<br /><em>Social</em></h2>
          <span className="cristo-social__line" aria-hidden="true" />
          <small>Continue scrolling</small>
        </header>

        <div className="cristo-social__card-wrap">
          <p className="cristo-social__card-label">Christopher DiCristo · Official Profiles</p>
          <DecayCard image={cristoPortrait} width={620} height={440} />
          <div className="cristo-social__identity">
            <p className="cristo-social__role">Author · Entrepreneur · Real Estate & Mortgage Leader</p>
            <h3>Christopher DiCristo</h3>
            <nav className="cristo-social__links" aria-label="Christopher DiCristo social profiles">
              {socials.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={`Visit Christopher DiCristo on ${social.label}`} title={social.label}>
                  <svg viewBox="0 0 32 32" aria-hidden="true" className={`social-icon social-icon--${social.label.toLowerCase()}`}>
                    {icons[social.label]}
                  </svg>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CristoSocial;
