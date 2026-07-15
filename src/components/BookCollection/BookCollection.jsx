import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import books from "../../data/books";
import "./BookCollection.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function UnbrokenTitle({ children }) {
  return String(children)
    .split(" ")
    .map((word, index) => (
      <React.Fragment key={`${word}-${index}`}>
        {index > 0 ? " " : null}
        <span className="book-collection__word">{word}</span>
      </React.Fragment>
    ));
}

function BookCollection() {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const [activeBook, setActiveBook] = useState(0);

  useGSAP(
    () => {
      const items = gsap.utils.toArray(".book-collection__item", sectionRef.current);
      const slides = gsap.utils.toArray(".book-collection__slide", sectionRef.current);
      const fill = sectionRef.current.querySelector(".book-collection__fill");

      gsap.set(slides, { autoAlpha: 0, y: 34, scale: 0.92, rotateY: -10 });
      gsap.set(slides[0], { autoAlpha: 1, y: 0, scale: 1, rotateY: 0 });
      gsap.set(items[0], { color: "#ffe8ac" });
      gsap.set(fill, {
        scaleY: 1 / books.length,
        transformOrigin: "top left",
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          id: "book-collection",
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * (books.length * 0.9)}`,
          pin: true,
          scrub: 1.25,
          snap: {
            snapTo: 1 / (books.length - 1),
            duration: { min: 0.25, max: 0.55 },
            delay: 0.08,
            ease: "power2.inOut",
          },
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const nextIndex = Math.min(books.length - 1, Math.round(self.progress * (books.length - 1)));
            setActiveBook(nextIndex);
          },
        },
      });

      books.forEach((_, index) => {
        if (index === 0) return;

        timeline
          .to(
            slides[index - 1],
            { autoAlpha: 0, y: -30, scale: 0.94, rotateY: 10, duration: 0.28 },
            index
          )
          .to(
            slides[index],
            { autoAlpha: 1, y: 0, scale: 1, rotateY: 0, duration: 0.34 },
            index
          )
          .to(items[index - 1], { color: "rgba(255, 247, 233, 0.42)", duration: 0.18 }, index)
          .to(items[index], { color: "#ffe8ac", duration: 0.18 }, index);
      });

      timeline.to(fill, { scaleY: 1, ease: "none", duration: books.length - 1 }, 0);
      timeline.to({}, { duration: 0.35 });
      triggerRef.current = timeline.scrollTrigger;

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
        triggerRef.current = null;
      };
    },
    { scope: sectionRef }
  );

  const goToBook = (index) => {
    const trigger = triggerRef.current || ScrollTrigger.getById("book-collection");
    if (!trigger) return;

    const targetProgress = books.length === 1 ? 0 : index / (books.length - 1);
    const targetScroll = trigger.start + (trigger.end - trigger.start) * targetProgress;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
    setActiveBook(index);
  };

  return (
    <section className="book-collection" id="books" ref={sectionRef} aria-label="Christopher DiCristo book collection">
      <div className="book-collection__content">
        <div className="book-collection__left">
          <p className="book-collection__eyebrow">Books by Christopher DiCristo</p>
          <h2>
            <span>Experience</span>
            <span>Into Action</span>
          </h2>

          <div className="book-collection__nav">
            <span className="book-collection__rail" aria-hidden="true">
              <span className="book-collection__fill" />
            </span>

            <ul className="book-collection__list">
              {books.map((book, index) => (
                <li key={book.id}>
                  <button
                    className={`book-collection__item${activeBook === index ? " is-active" : ""}`}
                    type="button"
                    onClick={() => goToBook(index)}
                  >
                    <span className="book-collection__item-meta">
                      {book.eyebrow}{book.comingSoon ? " · Coming Soon" : ""}
                    </span>
                    <span className="book-collection__item-title">
                      <UnbrokenTitle>{book.title}</UnbrokenTitle>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="book-collection__right">
          {books.map((book) => (
            <article className="book-collection__slide" key={book.id}>
              <a className="book-collection__mockup" href={book.href} aria-label={`Open ${book.title} page`}>
                <img src={book.image} alt={`${book.title} book cover`} />
              </a>
              <div className="book-collection__detail">
                <p>{book.eyebrow}{book.comingSoon ? " · Coming Soon" : ""}</p>
                <h3><a href={book.href}><UnbrokenTitle>{book.title}</UnbrokenTitle></a></h3>
                <span>{book.copy}</span>
                <a className="book-collection__page-link" href={book.href}>
                  {book.comingSoon ? "View book details" : "Explore the book"}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BookCollection;
