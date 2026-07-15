import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./FaqScroll.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const faqs = [
  {
    question: "What is Real Estate Beyond Limits?",
    answer: "It is Christopher DiCristo's philosophy for combining courage, disciplined preparation, modern lending knowledge, and service to create value beyond a single transaction.",
  },
  {
    question: "Who is Christopher DiCristo?",
    answer: "Christopher is an author, entrepreneur, former United States Marine, real estate developer, mortgage leader, speaker, coach, cancer survivor, and founder of Loormax Lending Franchise Corporation.",
  },
  {
    question: "What is The Million-Dollar Mindset about?",
    answer: "It is a practical and personal guide to courage, confidence, disciplined action, real estate systems, and becoming the person capable of building a lasting legacy.",
  },
  {
    question: "What is The Power of New Real Estate Money about?",
    answer: "It explains how modern lending, mortgage niches, and investor financing—including bank-statement, DSCR, construction, and other nontraditional products—can open paths beyond traditional limits.",
  },
  {
    question: "Is Christopher available for speaking or coaching?",
    answer: "Yes. Speaking, coaching, media, book, and business inquiries are welcomed through the Contact Christopher page.",
  },
];

function FaqScroll({
  items = faqs,
  eyebrow = "Questions, answered",
  titleLead = "Curious",
  titleAccent = "by nature.",
  hint = "Scroll to explore each answer",
}) {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(() => {
    const section = sectionRef.current;
    const progress = section.querySelector(".faq-scroll__progress-fill");
    const isCompact = window.matchMedia("(max-width: 800px)").matches;
    let pinnedTrigger;

    if (isCompact) {
      gsap.set(progress, { scaleY: 1, transformOrigin: "top" });
    } else {
      pinnedTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        // Give every FAQ one equal viewport of scroll. The previous intro/outro
        // padding made the first transition take roughly two full scrolls.
        end: () => `+=${window.innerHeight * items.length}`,
        pin: true,
        scrub: .45,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const questionProgress = gsap.utils.clamp(0, 1, self.progress);
          const nextIndex = Math.min(items.length - 1, Math.floor(questionProgress * items.length));
          setActiveIndex((current) => current === nextIndex ? current : nextIndex);
          gsap.set(progress, { scaleY: questionProgress, transformOrigin: "top" });
        },
      });
    }

    gsap.from(".faq-scroll__eyebrow, .faq-scroll__title", {
      y: 45,
      autoAlpha: 0,
      stagger: .08,
      scrollTrigger: { trigger: section, start: "top 80%", end: "top 35%", scrub: 1 },
    });

    return () => {
      pinnedTrigger?.kill();
    };
  }, { scope: sectionRef });

  const selectQuestion = (index) => {
    setActiveIndex(index);
    const trigger = ScrollTrigger.getAll().find((item) => item.trigger === sectionRef.current && item.pin);
    if (trigger) {
      const progress = (index + .5) / items.length;
      window.scrollTo({ top: trigger.start + progress * (trigger.end - trigger.start), behavior: "smooth" });
    }
  };

  return (
    <section className="faq-scroll" ref={sectionRef} aria-labelledby="faq-scroll-title">
      <div className="faq-scroll__orb" style={{ "--faq-position": `${(activeIndex / Math.max(items.length - 1, 1)) * 100}%` }} aria-hidden="true" />
      <div className="faq-scroll__layout">
        <header className="faq-scroll__header">
          <p className="faq-scroll__eyebrow">{eyebrow}</p>
          <h2 className="faq-scroll__title" id="faq-scroll-title">{titleLead}<br /><em>{titleAccent}</em></h2>
          <div className="faq-scroll__counter" aria-hidden="true">
            <strong>{String(activeIndex + 1).padStart(2, "0")}</strong>
            <span>/ {String(items.length).padStart(2, "0")}</span>
          </div>
          <p className="faq-scroll__hint">{hint}</p>
        </header>

        <div className="faq-scroll__questions">
          <div className="faq-scroll__progress" aria-hidden="true"><span className="faq-scroll__progress-fill" /></div>
          {items.map((faq, index) => {
            const isActive = index === activeIndex;
            return (
              <article className={`faq-scroll__item${isActive ? " is-active" : ""}`} key={faq.question}>
                <button type="button" onClick={() => selectQuestion(index)} aria-expanded={isActive} aria-controls={`faq-answer-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{faq.question}</h3>
                  <i aria-hidden="true"><b /><b /></i>
                </button>
                <div className="faq-scroll__answer" id={`faq-answer-${index}`} aria-hidden={!isActive}>
                  <div><p>{faq.answer}</p></div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FaqScroll;
