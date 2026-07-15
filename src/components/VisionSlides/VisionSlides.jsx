import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import visionOne from "../../assets/images/slide-1.jpg";
import visionTwo from "../../assets/images/slide-3.jpg";
import visionThree from "../../assets/images/slide-5a.jpg";
import "./VisionSlides.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const visionPanels = [
  {
    number: "01",
    eyebrow: "South Philly Roots",
    title: "Discipline Became His Foundation",
    copy: "After losing his father at nine, Christopher learned responsibility early. Service in the United States Marine Corps then gave him the discipline, standards, and belief that would guide every chapter ahead.",
    image: visionOne,
  },
  {
    number: "02",
    eyebrow: "A Career Rebuilt",
    title: "From Failure to Real Estate",
    copy: "When his first business collapsed, Christopher started again. Guided by mentor Frank Cedrone, he built a real-estate career around relationships, service, value, and developments including Marriott Farms, Tara Estates, and Christopher's Crossing.",
    image: visionTwo,
  },
  {
    number: "03",
    eyebrow: "Mortgage Leadership",
    title: "Building at National Scale",
    copy: "Christopher moved from development into mortgage banking, helped grow American Mortgage to 26 operating offices, and later founded Loormax Lending Franchise Corporation to turn decades of experience into opportunity for others.",
    image: visionThree,
  },
];

function VisionSlides() {
  const wrapperRef = useRef(null);

  useGSAP(() => {
    const panels = gsap.utils.toArray(".vision-slides__panel", wrapperRef.current);

    panels.slice(0, -1).forEach((panel) => {
      const content = panel.querySelector(".vision-slides__inner");

      gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "bottom bottom",
          end: "+=100%",
          pin: true,
          pinSpacing: false,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
        .to(content, { yPercent: -4, ease: "none", duration: 0.25 }, 0)
        .to(panel, { scale: 0.86, opacity: 0.38, filter: "blur(5px)", transformOrigin: "50% 80%", ease: "none", duration: 0.75 }, 0.25)
        .to(panel, { opacity: 0, duration: 0.15 });
    });
  }, { scope: wrapperRef });

  return (
    <section className="vision-slides" id="real-estate-vision" ref={wrapperRef} aria-label="More about Christopher DiCristo">
      <header className="vision-slides__intro">
        <p>The Story Behind the Work</p>
        <h2>More About<br />the Author</h2>
        <span>Continue scrolling through Christopher's journey</span>
      </header>

      {visionPanels.map((panel, index) => (
        <article className={`vision-slides__panel vision-slides__panel--${index + 1}`} key={panel.title}>
          <div className="vision-slides__inner">
            <div className="vision-slides__copy">
              <div className="vision-slides__meta"><span>{panel.number}</span>{panel.eyebrow}</div>
              <h3>{panel.title}</h3>
              <p>{panel.copy}</p>
            </div>

            {panel.image ? (
              <figure className="vision-slides__visual">
                <img src={panel.image} alt="" />
              </figure>
            ) : (
              <div className="vision-slides__mark" aria-hidden="true">CD</div>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}

export default VisionSlides;
