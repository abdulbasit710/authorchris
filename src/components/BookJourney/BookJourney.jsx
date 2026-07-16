import React, { useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import journeyBooks from "../../data/books";
import GradientBlinds from "../GradientBlinds/GradientBlinds";
import "./BookJourney.css";

gsap.registerPlugin(Flip, ScrollTrigger, useGSAP);

function BookJourney() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const activeRef = useRef(0);
  const [activeBook, setActiveBook] = useState(0);

  useGSAP(() => {
    const movingBook = sectionRef.current.querySelector(".book-journey__moving-book");
    const markers = gsap.utils.toArray(".book-journey__marker", sectionRef.current);
    const copyBlocks = gsap.utils.toArray(".book-journey__copy", sectionRef.current);
    let context;

    const setBook = (index) => {
      if (activeRef.current === index) return;
      activeRef.current = index;
      setActiveBook(index);
      gsap.fromTo(
        imageRef.current,
        { autoAlpha: 0.6, scale: 0.96 },
        { autoAlpha: 1, scale: 1, duration: 0.55, ease: "power2.out", overwrite: true }
      );
    };

    const buildTimeline = () => {
      context?.revert();
      context = gsap.context(() => {
        activeRef.current = 0;
        setActiveBook(0);
        gsap.set(copyBlocks, { autoAlpha: 0, y: 28 });
        gsap.set(copyBlocks[0], { autoAlpha: 1, y: 0 });
        gsap.set(movingBook, { clearProps: "all" });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current.querySelector(".book-journey__main"),
            start: "top top",
            end: "bottom bottom",
            scrub: 1.65,
            fastScrollEnd: false,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const index = Math.min(journeyBooks.length - 1, Math.round(self.progress * (journeyBooks.length - 1)));
              setBook(index);
            },
          },
        });

        timeline
          .to(copyBlocks[0], { autoAlpha: 0, y: -18, duration: 0.16 }, 0.12)
          .add(Flip.fit(movingBook, markers[0], { duration: 1.1, ease: "sine.inOut" }), 0.18)
          .to(movingBook, { rotate: -2, duration: 1.1, ease: "sine.inOut" }, 0.18)
          .to(copyBlocks[1], { autoAlpha: 1, y: 0, duration: 0.14 }, 1.04)
          .to(copyBlocks[1], { autoAlpha: 0, y: -18, duration: 0.16 }, 1.38)
          .add(Flip.fit(movingBook, markers[1], { duration: 1.1, ease: "sine.inOut" }), 1.46)
          .to(movingBook, { rotate: 2, duration: 1.1, ease: "sine.inOut" }, 1.46)
          .to(copyBlocks[2], { autoAlpha: 1, y: 0, duration: 0.14 }, 2.31)
          .to(copyBlocks[2], { autoAlpha: 0, y: -18, duration: 0.16 }, 2.7)
          .add(Flip.fit(movingBook, markers[2], { duration: 1.1, ease: "sine.inOut" }), 2.78)
          .to(movingBook, { rotate: -1, duration: 1.1, ease: "sine.inOut" }, 2.78)
          .to(copyBlocks[3], { autoAlpha: 1, y: 0, duration: 0.16 }, 3.63)
          .to({}, { duration: 0.28 });
      }, sectionRef);
    };

    buildTimeline();
    window.addEventListener("resize", buildTimeline);
    return () => { window.removeEventListener("resize", buildTimeline); context?.revert(); };
  }, { scope: sectionRef });

  return (
    <section className="book-journey" ref={sectionRef} aria-label="Featured book movement">
      <GradientBlinds
        angle={20}
        noise={0.035}
        blindCount={16}
        spotlightRadius={0.5}
        spotlightSoftness={1}
        spotlightOpacity={0.8}
        mouseDampening={0.15}
        distortAmount={0.35}
      />
      <div className="book-journey__spacer"><p>Two Books. One Enduring Mission.</p></div>
      <div className="book-journey__main">
        <div className="book-journey__container book-journey__container--initial">
          <div className="book-journey__moving-book"><img ref={imageRef} src={journeyBooks[activeBook].image} alt={`${journeyBooks[activeBook].title} book cover`} /></div>
        </div>
        {journeyBooks.map((book, index) => (
          <article className={`book-journey__copy book-journey__copy--${index + 1}`} key={book.id}>
            <img className="book-journey__mobile-cover" src={book.image} alt="" aria-hidden="true" />
            <p>{book.eyebrow}{book.comingSoon ? " · Coming Soon" : ""}</p><h2>{book.title}</h2><span>{book.copy}</span><a href={book.href}>{book.comingSoon ? "View What's Next" : "Explore the Book"}</a>
          </article>
        ))}
        <div className="book-journey__container book-journey__container--second" aria-hidden="true"><div className="book-journey__marker" /></div>
        <div className="book-journey__container book-journey__container--third" aria-hidden="true"><div className="book-journey__marker" /></div>
        <div className="book-journey__container book-journey__container--fourth" aria-hidden="true"><div className="book-journey__marker" /></div>
      </div>
      <div className="book-journey__spacer book-journey__spacer--final" />
    </section>
  );
}

export default BookJourney;
