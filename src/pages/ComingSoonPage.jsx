import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import LiquidEther from "../components/LiquidEther/LiquidEther";
import FaqScroll from "../components/FaqScroll/FaqScroll";
import bookThree from "../assets/book-image/book-3-mockup.png";
import bookFour from "../assets/book-image/book-4-mockup.png";
import "./ComingSoonPage.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const upcomingBooks = [
  {
    number: "03",
    label: "Book Three",
    title: "Real Estate Marketing Domination",
    status: "Coming soon",
    image: bookThree,
    copy: "A practical blueprint for building a powerful real estate brand, creating consistent leads, and becoming the go-to agent in your market.",
  },
  {
    number: "04",
    label: "Book Four",
    title: "Land Development, New Home Builder and Real Estate Investments",
    status: "Coming soon",
    image: bookFour,
    copy: "A guide to building wealth through land development, builder strategy, and real estate investing with a long-term legacy mindset.",
  },
];

const comingFaqs = [
  {
    question: "Which Christopher DiCristo books are coming next?",
    answer: "Real Estate Marketing Domination and Land Development, New Home Builder and Real Estate Investments are Christopher's next announced books. Release information will be shared when available.",
  },
  {
    question: "When will the next book be released?",
    answer: "A publication date has not been announced. This page will be updated as each manuscript moves from development through editing, design, and release preparation.",
  },
  {
    question: "Can I join the early notification list?",
    answer: "Yes. Use the early-access form on this page to register your interest in title reveals, cover announcements, excerpts, preorder information, and launch updates.",
  },
  {
    question: "Will advance or bulk copies be available?",
    answer: "Advance, team, event, and bulk-order opportunities may be announced closer to publication. Select the relevant interest in the notification form so Christopher's team knows what you need.",
  },
  {
    question: "Where can I read Christopher's available books?",
    answer: "The Million-Dollar Mindset and The Power of New Real Estate Money each have a dedicated page accessible through the main menu and website footer.",
  },
];

function ComingSoonPage() {
  const pageRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);

  useGSAP(() => {
    const library = pageRef.current.querySelector(".coming-library");
    const books = gsap.utils.toArray(".coming-library__book", library);
    const details = gsap.utils.toArray(".coming-library__detail", library);

    const shelfTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: library,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.15,
        invalidateOnRefresh: true,
      },
    });

    shelfTimeline
      .fromTo(books[0], { yPercent: 85, rotate: -9, autoAlpha: 0 }, { yPercent: 0, rotate: -2, autoAlpha: 1, duration: 1, ease: "power3.out" }, 0)
      .fromTo(details[0], { y: 50, autoAlpha: 0, filter: "blur(10px)" }, { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: .65 }, .32)
      .fromTo(books[1], { yPercent: 90, rotate: 10, autoAlpha: 0 }, { yPercent: 0, rotate: 2, autoAlpha: 1, duration: 1, ease: "power3.out" }, 1.05)
      .fromTo(details[1], { y: 50, autoAlpha: 0, filter: "blur(10px)" }, { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: .65 }, 1.35)
      .to(books, { y: -10, duration: .35, stagger: .08, ease: "sine.inOut" }, 2.02);

    gsap.from(".coming-process__card", {
      y: 90,
      autoAlpha: 0,
      rotateX: -12,
      stagger: .12,
      scrollTrigger: {
        trigger: ".coming-process__grid",
        start: "top 82%",
        end: "center 52%",
        scrub: 1,
      },
    });

    gsap.from(".coming-notify__panel", {
      y: 80,
      autoAlpha: 0,
      scale: .96,
      scrollTrigger: {
        trigger: ".coming-notify",
        start: "top 80%",
        end: "center 58%",
        scrub: 1,
      },
    });

    return () => shelfTimeline.kill();
  }, { scope: pageRef });

  const submitForm = (event) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <main className="coming-page" ref={pageRef}>
      <section className="coming-hero" id="top" aria-labelledby="coming-page-title">
        <div className="coming-hero__ether" aria-hidden="true">
          <LiquidEther
            colors={["#241706", "#9B6B24", "#E8C276"]}
            mouseForce={18}
            cursorSize={110}
            isViscous
            viscous={32}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo
            autoSpeed={0.42}
            autoIntensity={1.9}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
        <div className="coming-hero__veil" aria-hidden="true" />
        <div className="coming-hero__content">
          <p>The library continues</p>
          <h1 id="coming-page-title">The next chapter<br />is <em>coming.</em></h1>
          <span>New books. New lessons. The same commitment to discipline, purpose, and building beyond limits.</span>
          <a href="#coming-library">Enter the Library <b aria-hidden="true">↓</b></a>
        </div>
        <div className="coming-hero__preview" aria-hidden="true">
          <span className="coming-hero__orbit coming-hero__orbit--one" />
          <span className="coming-hero__orbit coming-hero__orbit--two" />
          <figure className="coming-hero__preview-book coming-hero__preview-book--three">
            <i>03</i>
            <img src={bookThree} alt="" />
          </figure>
          <figure className="coming-hero__preview-book coming-hero__preview-book--four">
            <i>04</i>
            <img src={bookFour} alt="" />
          </figure>
          <p><span>Two new works</span><b>Now being written</b></p>
        </div>
      </section>

      <section className="coming-library" id="coming-library" aria-labelledby="coming-library-title">
        <div className="coming-library__sticky">
          <header>
            <p>On Christopher's shelf</p>
            <h2 id="coming-library-title">Works in<br /><em>progress.</em></h2>
            <span>Scroll to place each upcoming book on the shelf.</span>
          </header>

          <div className="coming-library__display">
            <div className="coming-library__books">
              {upcomingBooks.map((book) => (
                <article className="coming-library__book-wrap" id={`book-${book.number}`} key={book.number}>
                  <figure className="coming-library__book">
                    <span>{book.number}</span>
                    <img src={book.image} alt={`${book.title} by Christopher DiCristo`} />
                  </figure>
                  <div className="coming-library__detail">
                    <p>{book.label}</p>
                    <h3>{book.title}</h3>
                    <strong>{book.status}</strong>
                    <span>{book.copy}</span>
                  </div>
                </article>
              ))}
            </div>
            <div className="coming-library__shelf" aria-hidden="true"><span /><span /></div>
          </div>
        </div>
      </section>

      <section className="coming-process" aria-labelledby="coming-process-title">
        <header>
          <p>From idea to release</p>
          <h2 id="coming-process-title">Every book earns<br /><em>its place.</em></h2>
        </header>
        <div className="coming-process__grid">
          {[
            ["01", "Lived", "The lesson begins in real experience—not theory."],
            ["02", "Written", "Stories and frameworks become a working manuscript."],
            ["03", "Refined", "Editing and design shape a clear, useful reader experience."],
            ["04", "Released", "The finished work joins Christopher's growing library."],
          ].map(([number, title, copy]) => (
            <article className="coming-process__card" key={number}>
              <span>{number}</span><h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
      </section>


      <section className="coming-notify" id="early-access" aria-labelledby="coming-notify-title">
        <div className="coming-notify__panel">
          <header>
            <p>Early access list</p>
            <h2 id="coming-notify-title">Be there when<br /><em>the cover opens.</em></h2>
            <span>Register your interest for title reveals, excerpts, release news, events, and ordering information.</span>
          </header>
          <form onSubmit={submitForm}>
            <label>
              <span>Your name</span>
              <input name="name" type="text" placeholder="Your name" required />
            </label>
            <label>
              <span>Email address</span>
              <input name="email" type="email" placeholder="you@example.com" required />
            </label>
            <label className="coming-notify__wide">
              <span>Keep me informed about</span>
              <select name="interest" defaultValue="All upcoming books">
                <option>All upcoming books</option>
                <option>Real Estate Marketing Domination</option>
                <option>Land Development, New Home Builder and Real Estate Investments</option>
                <option>Bulk and team orders</option>
                <option>Speaking and launch events</option>
              </select>
            </label>
            <button type="submit">Join the Early List <b aria-hidden="true">↗</b></button>
            <p className={`coming-notify__success${submitted ? " is-visible" : ""}`} role="status">You're on the list. The next chapter starts here.</p>
          </form>
        </div>
      </section>

      <FaqScroll
        items={comingFaqs}
        eyebrow="Upcoming books, answered"
        titleLead="What comes"
        titleAccent="next?"
        hint="Scroll through release questions"
      />
    </main>
  );
}

export default ComingSoonPage;
