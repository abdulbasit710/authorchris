import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./AuthorGallery.css";

import mindsetRelease from "../../assets/images/book-release-01-mindset.png";
import powerRelease from "../../assets/images/book-release-02-power.png";
import marketingRelease from "../../assets/images/book-release-03-marketing.png";
import bookFourRelease from "../../assets/images/book-release-04-presentation.png";
import completeLibrary from "../../assets/images/book-release-all-library.jpg";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const galleryItems = [
  { image: mindsetRelease, label: "The Million-Dollar Mindset" },
  { image: powerRelease, label: "The Power of New Real Estate Money" },
  { image: marketingRelease, label: "Real Estate Marketing Domination" },
  { image: bookFourRelease, label: "Book Four · Complete Cover Presentation" },
  { image: completeLibrary, label: "The Complete Christopher DiCristo Library" },
];

function AuthorGallery() {
  const galleryRef = useRef(null);

  useGSAP(
    () => {
      const wrapper = galleryRef.current.querySelector(".horiz-gallery-wrapper");
      const strip = galleryRef.current.querySelector(".horiz-gallery-strip");
      if (window.matchMedia("(max-width: 900px)").matches) {
        const portfolio = galleryRef.current.querySelector("#portfolio");
        const mobileTween = gsap.to(strip, {
          x: () => -(strip.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: portfolio,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.55,
            snap: {
              snapTo: 1 / (galleryItems.length - 1),
              duration: { min: 0.16, max: 0.34 },
              delay: 0.04,
              ease: "power2.inOut",
            },
            invalidateOnRefresh: true,
          },
        });

        const refresh = () => ScrollTrigger.refresh();
        const images = gsap.utils.toArray("img", galleryRef.current);
        images.forEach((image) => {
          if (!image.complete) image.addEventListener("load", refresh, { once: true });
        });

        return () => {
          images.forEach((image) => image.removeEventListener("load", refresh));
          mobileTween.scrollTrigger?.kill();
          mobileTween.kill();
        };
      }
      const getScrollLength = () =>
        Math.max(0, strip.scrollWidth - window.innerWidth + Math.min(72, window.innerWidth * 0.05));

      const tween = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          pin: wrapper,
          scrub: 0.65,
          start: "center center",
          end: () => `+=${strip.scrollWidth * 1.15}`,
          invalidateOnRefresh: true,
        },
      });

      tween
        .to(strip, {
          x: () => -getScrollLength(),
          duration: 0.84,
          ease: "none",
        })
        .to({}, { duration: 0.16 });

      const refreshOnLoad = () => ScrollTrigger.refresh();
      const images = gsap.utils.toArray("img", galleryRef.current);
      images.forEach((image) => {
        if (!image.complete) {
          image.addEventListener("load", refreshOnLoad, { once: true });
        }
      });

      ScrollTrigger.refresh();

      return () => {
        images.forEach((image) => image.removeEventListener("load", refreshOnLoad));
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: galleryRef }
  );

  return (
    <div className="author-gallery" ref={galleryRef}>
      <section className="panel plain">
        <p className="gallery-eyebrow">The Life Behind the Lessons</p>
        <h2>From South Philly to CEO</h2>
      </section>

      <section id="portfolio">
        <div className="container-fluid">
          <div className="horiz-gallery-wrapper">
            <div className="horiz-gallery-strip">
              {galleryItems.map((item, index) => (
                <figure className="project-wrap" key={`${item.label}-${index}`}>
                  <img src={item.image} alt={item.label} />
                  <figcaption>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {item.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default AuthorGallery;
