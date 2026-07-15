import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./TestimonialsScroll.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const testimonials = [
  {
    quote: "Christopher brings rare clarity to complex decisions. His message is direct, grounded, and built from experience—not theory.",
    name: "Advance Reader",
    role: "Sample testimonial · Leadership",
  },
  {
    quote: "Real Estate Beyond Limits changes the conversation from short-term transactions to long-term purpose, trust, and legacy.",
    name: "Industry Professional",
    role: "Sample testimonial · Real estate",
  },
  {
    quote: "The discipline behind Christopher's story stays with you. It is honest, resilient, and deeply motivating without ever feeling rehearsed.",
    name: "Business Leader",
    role: "Sample testimonial · Entrepreneurship",
  },
  {
    quote: "This is the kind of perspective that makes you pause, reconsider your standard, and return to your work with a stronger sense of purpose.",
    name: "Event Attendee",
    role: "Sample testimonial · Speaking",
  },
];

function TestimonialsScroll({
  items = testimonials,
  eyebrow = "Reflections on the work",
  titleLead = "Words that",
  titleAccent = "move with us.",
  footerNote = "Sample presentation copy · Replace with verified testimonials before publishing",
}) {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const cards = gsap.utils.toArray(".testimonials-scroll__card", section);
    const numbers = gsap.utils.toArray(".testimonials-scroll__step", section);
    const progress = section.querySelector(".testimonials-scroll__progress-fill");

    gsap.set(cards, { xPercent: -125, autoAlpha: 0, rotateZ: -4 });
    gsap.set(numbers, { color: "rgba(255,255,255,.25)" });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * 5.5}`,
        pin: true,
        scrub: 1.1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    cards.forEach((card, index) => {
      const position = index * 1.4;
      timeline
        .to(card, { xPercent: 0, autoAlpha: 1, rotateZ: 0, duration: .55, ease: "power3.out" }, position)
        .to(numbers[index], { color: "#d9ab55", duration: .18 }, position)
        .to(card, { scale: 1.015, duration: .42, ease: "none" }, position + .55)
        .to(card, { xPercent: 125, autoAlpha: 0, rotateZ: 3, duration: .48, ease: "power3.in" }, position + .98)
        .to(numbers[index], { color: "rgba(255,255,255,.25)", duration: .16 }, position + 1.04);
    });

    timeline.to(progress, { scaleX: 1, transformOrigin: "left", duration: timeline.duration(), ease: "none" }, 0);

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  }, { scope: sectionRef });

  return (
    <section className="testimonials-scroll" ref={sectionRef} aria-labelledby="testimonials-title">
      <div className="testimonials-scroll__grain" aria-hidden="true" />
      <header className="testimonials-scroll__header">
        <div>
          <p>{eyebrow}</p>
          <h2 id="testimonials-title">{titleLead}<br /><em>{titleAccent}</em></h2>
        </div>
        <span>Scroll to read</span>
      </header>

      <div className="testimonials-scroll__stage">
        <div className="testimonials-scroll__quote-mark" aria-hidden="true">“</div>
        {items.map((testimonial, index) => (
          <article className="testimonials-scroll__card" key={testimonial.quote}>
            <div className="testimonials-scroll__card-top">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span className="testimonials-scroll__stars" aria-label="Five stars">★★★★★</span>
            </div>
            <blockquote>{testimonial.quote}</blockquote>
            <footer>
              <span className="testimonials-scroll__avatar" aria-hidden="true">{testimonial.name.charAt(0)}</span>
              <div><strong>{testimonial.name}</strong><small>{testimonial.role}</small></div>
            </footer>
          </article>
        ))}
      </div>

      <footer className="testimonials-scroll__footer">
        <div className="testimonials-scroll__steps" aria-hidden="true">
          {items.map((_, index) => <span className="testimonials-scroll__step" key={index}>{String(index + 1).padStart(2, "0")}</span>)}
        </div>
        <div className="testimonials-scroll__progress" aria-hidden="true"><span className="testimonials-scroll__progress-fill" /></div>
        <p>{footerNote}</p>
      </footer>
    </section>
  );
}

export default TestimonialsScroll;
