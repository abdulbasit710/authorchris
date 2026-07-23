import React, { useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import "./HomeSlider.css";

import slideOne from "../../assets/images/christopher-writing-office-hero.png";
import millionDollarMindsetHero from "../../assets/images/christopher-million-dollar-mindset-hero.png";
import powerOfNewRealEstateMoneyHero from "../../assets/images/christopher-power-of-new-real-estate-money-hero.png";
import realEstateLegacyHero from "../../assets/images/real-estate-legacy-sunrise-hero.png";
import websiteLogo from "../../assets/logo/real-estate-beyond-limits-loader.png";

gsap.registerPlugin(Observer, ScrollTrigger, useGSAP);

const slides = [
  {
    kind: "intro",
    heading: "Real Estate Beyond Limits",
    copy: "Books, real-world insight, and proven principles for building the mindset, business, and legacy that take you beyond ordinary limits.",
    image: websiteLogo,
    fallback: "radial-gradient(circle at 50% 42%, #1b1509 0%, #090806 34%, #020202 72%)",
  },
  {
    kind: "author",
    eyebrow: "AUTHOR · ENTREPRENEUR · REAL ESTATE & MORTGAGE LEADER",
    heading: "Christopher DiCristo",
    copy: "From South Philadelphia to the United States Marine Corps, real estate development, mortgage banking, and the founding of Loormax Lending Franchise Corporation.",
    image: slideOne,
    fallback: "linear-gradient(135deg, #000000 0%, #151515 52%, #c89a3d 100%)",
  },
  {
    eyebrow: "FIFTY YEARS OF LIVED EXPERIENCE",
    heading: "Principles Tested in the Real World",
    copy: "Practical lessons forged through business failure, real estate development, mortgage leadership, survival, recovery, and rebuilding.",
    image: realEstateLegacyHero,
    fallback: "linear-gradient(135deg, #000000 0%, #181818 48%, #b8862f 100%)",
  },
  {
    eyebrow: "THE MILLION-DOLLAR MINDSET",
    heading: "Learn to Believe in Yourself",
    copy: "A complete guide to courage, confidence, disciplined action, and building a real estate legacy that lasts.",
    image: millionDollarMindsetHero,
    fallback: "linear-gradient(135deg, #000000 0%, #1f1f1f 54%, #d6a652 100%)",
  },
  {
    eyebrow: "THE POWER OF NEW REAL ESTATE MONEY",
    heading: "Wealth Beyond Traditional Limits",
    copy: "Discover how modern lending, mortgage niches, and investor financing can create new paths to income, ownership, and long-term wealth.",
    image: powerOfNewRealEstateMoneyHero,
    fallback: "linear-gradient(135deg, #000000 0%, #242424 52%, #a87524 100%)",
  },
];

function HomeSlider() {
  const wrapperRef = useRef(null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const sections = gsap.utils.toArray(".home-slide", wrapper);
      const track = wrapper.querySelector(".home-slider__track");
      let observer;
      let splitHeadings = [];

      const useNativeScroll = window.matchMedia("(max-width: 900px)").matches;
      if (useNativeScroll) {
        gsap.set(sections, { autoAlpha: 0, zIndex: 0 });
        gsap.set(sections[0], { autoAlpha: 1, zIndex: 2 });

        const mobileTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.45,
            snap: {
              snapTo: 1 / (sections.length - 1),
              duration: { min: 0.16, max: 0.34 },
              delay: 0.04,
              ease: "power2.inOut",
            },
            invalidateOnRefresh: true,
          },
        });

        sections.slice(1).forEach((section, index) => {
          const previous = sections[index];
          const position = index + 0.72;
          mobileTimeline
            .to(previous, { autoAlpha: 0, scale: 0.985, duration: 0.28, ease: "power2.in" }, position)
            .set(previous, { zIndex: 0 })
            .set(section, { zIndex: 2 }, position)
            .fromTo(
              section,
              { autoAlpha: 0, scale: 1.025 },
              { autoAlpha: 1, scale: 1, duration: 0.34, ease: "power2.out" },
              position
            );
        });
        mobileTimeline.to({}, { duration: 0.72 });

        const refresh = () => ScrollTrigger.refresh();
        const images = gsap.utils.toArray(".home-slide__image", wrapper);
        images.forEach((image) => {
          if (!image.complete) image.addEventListener("load", refresh, { once: true });
        });

        return () => {
          images.forEach((image) => image.removeEventListener("load", refresh));
          mobileTimeline.scrollTrigger?.kill();
          mobileTimeline.kill();
        };
      }

      const showFallbackSlide = () => {
        gsap.set(sections, { clearProps: "all" });
        gsap.set(sections.slice(1), { autoAlpha: 0, zIndex: 0 });
        gsap.set(sections[0], { autoAlpha: 1, zIndex: 2 });
        gsap.set(gsap.utils.toArray(".outer, .inner, .bg, .slide-content", wrapper), { clearProps: "all" });
      };

      try {
        const outers = gsap.utils.toArray(".outer", wrapper);
        const inners = gsap.utils.toArray(".inner", wrapper);
        const backgrounds = gsap.utils.toArray(".bg", wrapper);
        const contents = gsap.utils.toArray(".slide-content", wrapper);
        const headings = gsap.utils.toArray(".section-heading", wrapper);
        splitHeadings = headings.map((heading) => new SplitType(heading, { types: "words,chars" }));

        let currentIndex = -1;
        let animating = false;
        gsap.set(sections, { autoAlpha: 0, zIndex: 0 });
        gsap.set(outers, { yPercent: 0 });
        gsap.set(inners, { yPercent: 0 });
        gsap.set(backgrounds, { scale: 1.05, yPercent: 0 });
        gsap.set(contents, { autoAlpha: 0, y: 34 });
        splitHeadings.forEach((split) => gsap.set(split.chars, { yPercent: 115, autoAlpha: 0 }));

        const gotoSection = (index, direction) => {
          if (animating || index < 0 || index >= sections.length) return;
          animating = true;

          const active = currentIndex >= 0 ? sections[currentIndex] : null;
          const next = sections[index];
          const nextSplit = splitHeadings[index];
          const timeline = gsap.timeline({
            defaults: { duration: .52, ease: "power2.out" },
            onComplete: () => { currentIndex = index; animating = false; },
          });

          gsap.set(next, { autoAlpha: 0, zIndex: 2 });
          gsap.set([outers[index], inners[index]], { yPercent: 0 });
          gsap.set(backgrounds[index], { scale: 1.06, yPercent: 2 * direction });
          gsap.set(contents[index], { autoAlpha: 0, y: 18 * direction });
          gsap.set(nextSplit.chars, { yPercent: 70 * direction, autoAlpha: 0 });

          if (active) {
            gsap.set(active, { zIndex: 1 });
            timeline.to(backgrounds[currentIndex], { scale: 1.02, yPercent: -2 * direction, duration: .58 }, 0);
            timeline.to(contents[currentIndex], { autoAlpha: 0, y: -14 * direction, duration: .28 }, 0);
            timeline.set(active, { autoAlpha: 0, zIndex: 0 });
          }

          timeline.to(next, { autoAlpha: 1, duration: .18 }, 0);
          timeline.to(backgrounds[index], { scale: 1, yPercent: 0, duration: .62 }, 0);
          timeline.to(contents[index], { autoAlpha: 1, y: 0, duration: .42 }, .08);
          timeline.to(nextSplit.chars, {
            yPercent: 0,
            autoAlpha: 1,
            duration: .44,
            stagger: { each: .006, from: direction > 0 ? "start" : "end" },
            ease: "power4.out",
          }, .1);
        };

        observer = Observer.create({
          target: wrapper,
          type: "wheel,touch,pointer",
          wheelSpeed: -1,
          tolerance: 6,
          preventDefault: true,
          ignore: ".home-slider-header a",
          onDown: () => gotoSection(currentIndex - 1, -1),
          onUp: () => {
            if (currentIndex === sections.length - 1 && !animating) {
              observer.disable();
              window.scrollTo({ top: wrapper.offsetTop + wrapper.offsetHeight, behavior: "smooth" });
              return;
            }
            gotoSection(currentIndex + 1, 1);
          },
        });

        gotoSection(0, 1);

        const handleWindowScroll = () => {
          if (window.scrollY <= wrapper.offsetTop + 4 && observer && !observer.isEnabled) observer.enable();
        };
        window.addEventListener("scroll", handleWindowScroll, { passive: true });

        return () => {
          window.removeEventListener("scroll", handleWindowScroll);
          observer?.kill();
          splitHeadings.forEach((split) => split.revert());
        };
      } catch (error) {
        showFallbackSlide();
        console.error("HomeSlider animation setup failed:", error);
      }
    },
    { scope: wrapperRef }
  );

  return (
    <section className="home-slider" id="top" ref={wrapperRef} aria-label="Christopher DiCristo homepage slider">
      <div className="home-slider__track">
        {slides.map((slide, index) => (
          <article className={`home-slide home-slide--${index + 1} home-slide--${slide.kind || "story"}`} key={slide.heading} aria-label={`Slide ${index + 1} of ${slides.length}`}>
          <div className="outer">
            <div className="inner">
              <div
                className="bg"
                style={{
                  background: slide.fallback,
                }}
              >
                <img
                  className="home-slide__image"
                  src={slide.image}
                  alt=""
                  aria-hidden="true"
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                />
              </div>
              <div className="slide-content">
                {slide.eyebrow && <p className="slide-eyebrow">{slide.eyebrow}</p>}
                <h1 className="section-heading">{slide.heading}</h1>
                <p className="slide-copy">{slide.copy}</p>
              </div>
              <p className="slide-count">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{String(slides.length).padStart(2, "0")}</span>
              </p>
            </div>
          </div>
          </article>
        ))}
      </div>

      <div className="scroll-indicator" aria-hidden="true">
        <span />
        Scroll
      </div>
    </section>
  );
}

export default HomeSlider;
