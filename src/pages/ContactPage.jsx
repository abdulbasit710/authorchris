import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import LiquidEther from "../components/LiquidEther/LiquidEther";
import VentureScroll from "../components/VentureScroll/VentureScroll";
import FaqScroll from "../components/FaqScroll/FaqScroll";
import "./ContactPage.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const contactFaqs = [
  {
    question: "What can I contact Christopher about?",
    answer: "Use this page for speaking, interviews, media, books, bulk orders, coaching, real estate, mortgage-industry conversations, partnerships, and general professional inquiries.",
  },
  {
    question: "Is Christopher available for speaking engagements?",
    answer: "Speaking and event requests are welcomed. Include the event date, location, audience, format, and the subject you would like Christopher to address.",
  },
  {
    question: "Can organizations request bulk book orders?",
    answer: "Yes. Select Books and Bulk Orders in the form and provide the title, estimated quantity, preferred timing, and whether the books are connected to an event or team program.",
  },
  {
    question: "Can I request an interview or media appearance?",
    answer: "Yes. Share the publication or program, proposed topic, format, deadline, and any preparation details so the request can be reviewed efficiently.",
  },
  {
    question: "Where else can I follow Christopher?",
    answer: "Use the official social links on this page to connect with Christopher and follow new writing, business perspectives, real estate insight, and upcoming announcements.",
  },
];

const socialProfiles = [
  {
    name: "LinkedIn",
    handle: "Christopher DiCristo",
    href: "https://www.linkedin.com/in/chris-dicristo-b63913233",
    icon: <path d="M5.2 8.1H1.5V20h3.7V8.1ZM3.35 2A2.15 2.15 0 1 0 3.35 6.3 2.15 2.15 0 0 0 3.35 2ZM22 13.2c0-3.6-1.9-5.3-4.5-5.3-2.1 0-3 1.15-3.55 1.95V8.1h-3.7V20h3.7v-5.9c0-1.55.3-3.05 2.25-3.05 1.9 0 1.95 1.8 1.95 3.15V20H22v-6.8Z" />,
  },
  {
    name: "Instagram",
    handle: "Follow the visual story",
    href: "https://www.instagram.com/",
    icon: <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.5" /><circle cx="18" cy="6" r="1" className="contact-social__dot" /></>,
  },
  {
    name: "Facebook",
    handle: "Join the community",
    href: "https://www.facebook.com/",
    icon: <path d="M14.5 22v-8h2.8l.42-3.2H14.5V8.75c0-.93.26-1.56 1.62-1.56h1.73V4.33a23 23 0 0 0-2.52-.13c-2.5 0-4.2 1.52-4.2 4.32v2.28H8.3V14h2.83v8h3.37Z" />,
  },
];

function ContactPage() {
  const pageRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);

  useGSAP(() => {
    gsap.fromTo(".contact-hero__copy > *",
      { y: 46, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 1, stagger: .09, ease: "power3.out", delay: .15 }
    );

    gsap.to(".contact-orbit__core", {
      rotateY: 360,
      rotateX: 18,
      duration: 18,
      repeat: -1,
      ease: "none",
    });

    gsap.from(".contact-paths__card", {
      y: 90,
      autoAlpha: 0,
      rotateY: -10,
      stagger: .12,
      scrollTrigger: {
        trigger: ".contact-paths__grid",
        start: "top 84%",
        end: "center 56%",
        scrub: 1,
      },
    });

    gsap.from(".contact-form__panel", {
      y: 80,
      autoAlpha: 0,
      scale: .97,
      scrollTrigger: {
        trigger: ".contact-form-section",
        start: "top 82%",
        end: "center 58%",
        scrub: 1,
      },
    });

    gsap.from(".contact-social__card", {
      x: -70,
      autoAlpha: 0,
      stagger: .12,
      scrollTrigger: {
        trigger: ".contact-social__grid",
        start: "top 84%",
        end: "center 58%",
        scrub: 1,
      },
    });
  }, { scope: pageRef });

  const submitForm = (event) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <main className="contact-page" ref={pageRef}>
      <section className="contact-hero" id="top" aria-labelledby="contact-page-title">
        <div className="contact-hero__ether" aria-hidden="true">
          <LiquidEther
            colors={["#211405", "#B67C28", "#FFE0A0"]}
            mouseForce={22}
            cursorSize={110}
            isViscous
            viscous={31}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo
            autoSpeed={0.44}
            autoIntensity={2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
        <div className="contact-hero__shade" aria-hidden="true" />
        <div className="contact-hero__layout">
          <div className="contact-hero__copy">
            <p>Start a conversation</p>
            <h1 id="contact-page-title">Let’s build<br /><em>what’s next.</em></h1>
            <span>Books, business, speaking, real estate, media, or a meaningful new idea—every strong collaboration begins with a clear conversation.</span>
            <a href="#contact-form">Send an Inquiry <b aria-hidden="true">↓</b></a>
          </div>

          <div className="contact-orbit" aria-hidden="true">
            <span className="contact-orbit__halo contact-orbit__halo--one" />
            <span className="contact-orbit__halo contact-orbit__halo--two" />
            <div className="contact-orbit__core">
              <i className="contact-orbit__face contact-orbit__face--front">C</i>
              <i className="contact-orbit__face contact-orbit__face--back">D</i>
              <i className="contact-orbit__face contact-orbit__face--left">BUILD</i>
              <i className="contact-orbit__face contact-orbit__face--right">BEYOND</i>
              <i className="contact-orbit__face contact-orbit__face--top">01</i>
              <i className="contact-orbit__face contact-orbit__face--bottom">∞</i>
            </div>
            <span className="contact-orbit__node contact-orbit__node--one" />
            <span className="contact-orbit__node contact-orbit__node--two" />
            <span className="contact-orbit__node contact-orbit__node--three" />
            <p>Ideas become<br /><b>connections.</b></p>
          </div>
        </div>
      </section>

      <section className="contact-paths" aria-labelledby="contact-paths-title">
        <header>
          <p>Choose the conversation</p>
          <h2 id="contact-paths-title">One message.<br /><em>Many possibilities.</em></h2>
        </header>
        <div className="contact-paths__grid">
          {[
            ["01", "Books & Orders", "Individual copies, team packages, bulk orders, launch conversations, and reader inquiries."],
            ["02", "Speaking & Media", "Keynotes, panels, podcasts, interviews, events, coaching, and leadership conversations."],
            ["03", "Business & Real Estate", "Mortgage leadership, real estate strategy, partnerships, development, and professional collaboration."],
          ].map(([number, title, copy]) => (
            <article className="contact-paths__card" key={number}>
              <span>{number}</span><h3>{title}</h3><p>{copy}</p><a href="#contact-form">Begin here <b>↗</b></a>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-form-section" id="contact-form" aria-labelledby="contact-form-title">
        <div className="contact-form__panel">
          <header>
            <p>Contact Christopher</p>
            <h2 id="contact-form-title">Tell us where<br /><em>the story begins.</em></h2>
            <span>Share enough detail for Christopher and his team to understand the opportunity and respond thoughtfully.</span>
            <div className="contact-form__note"><b>01</b><p>Clear ideas<br />create strong starts.</p></div>
          </header>

          <form onSubmit={submitForm}>
            <label><span>Your name</span><input name="name" type="text" placeholder="Full name" required /></label>
            <label><span>Email address</span><input name="email" type="email" placeholder="you@example.com" required /></label>
            <label><span>Phone number</span><input name="phone" type="tel" placeholder="Optional" /></label>
            <label><span>Organization</span><input name="organization" type="text" placeholder="Company or publication" /></label>
            <label className="contact-form__wide">
              <span>What can we discuss?</span>
              <select name="interest" defaultValue="Speaking or event">
                <option>Speaking or event</option>
                <option>Books or bulk orders</option>
                <option>Media or interview</option>
                <option>Real estate or mortgage</option>
                <option>Business partnership</option>
                <option>Coaching or mentorship</option>
                <option>General inquiry</option>
              </select>
            </label>
            <label className="contact-form__wide"><span>Your message</span><textarea name="message" rows="5" placeholder="Tell us about the idea, timing, audience, or opportunity..." required /></label>
            <button type="submit">Send Your Inquiry <b aria-hidden="true">↗</b></button>
            <p className={`contact-form__success${submitted ? " is-visible" : ""}`} role="status">Thank you. Your message is ready for the next conversation.</p>
          </form>
        </div>
      </section>

      <VentureScroll showIntro={false} limit={2} />

      <section className="contact-social" aria-labelledby="contact-social-title">
        <header>
          <p>Follow the work</p>
          <h2 id="contact-social-title">Stay connected.<br /><em>Keep building.</em></h2>
        </header>
        <div className="contact-social__grid">
          {socialProfiles.map((social, index) => (
            <a className="contact-social__card" href={social.href} target="_blank" rel="noreferrer" key={social.name}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">{social.icon}</svg>
              <div><h3>{social.name}</h3><p>{social.handle}</p></div>
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </div>
      </section>

      <FaqScroll
        items={contactFaqs}
        eyebrow="Before you reach out"
        titleLead="Good questions."
        titleAccent="Clear answers."
        hint="Scroll through contact questions"
      />
    </main>
  );
}

export default ContactPage;
