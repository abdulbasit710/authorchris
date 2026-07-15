import React from "react";
import LiquidEther from "../components/LiquidEther/LiquidEther";
import MindsetBookJourney from "../components/MindsetBookJourney/MindsetBookJourney";
import FaqScroll from "../components/FaqScroll/FaqScroll";
import BookContact from "../components/BookContact/BookContact";
import TestimonialsScroll from "../components/TestimonialsScroll/TestimonialsScroll";
import bookCover from "../assets/book-image/book-1-mockup.png";
import "./MillionDollarMindsetPage.css";

const bookFaqs = [
  {
    question: "What is The Million-Dollar Mindset about?",
    answer: "It is Christopher DiCristo's guide to courage, confidence, disciplined action, and building a real estate legacy that lasts. It combines lived experience with practical professional systems.",
  },
  {
    question: "Is this a get-rich-quick book?",
    answer: "No. The manuscript directly rejects shortcuts. Its core belief is that durable confidence is earned through action, difficulty, honest reflection, persistence, and time.",
  },
  {
    question: "Who should read this book?",
    answer: "It is written for real estate and mortgage professionals, entrepreneurs, leaders, and anyone rebuilding after a setback or trying to raise their personal standard.",
  },
  {
    question: "What practical material is included?",
    answer: "The book covers failure, courage, confidence, mortgage banking, professional branding, digital lead generation, high performance, ethics, negotiation, financial freedom, consistency, and legacy—with exercises designed for action.",
  },
  {
    question: "How can I order a copy or request a bulk order?",
    answer: "Use the book inquiry form below to request purchase information, bulk or team orders, speaking engagements, media conversations, or release updates.",
  },
];

const bookTestimonials = [
  {
    quote: "A rare business manuscript that begins with who the reader must become before it explains what the reader should build.",
    name: "Editorial Preview",
    role: "Sample presentation copy · Manuscript overview",
  },
  {
    quote: "The lessons on failure are direct and useful: acknowledge it, analyze it, extract the principle, test again, and carry the wisdom forward.",
    name: "Advance Reader",
    role: "Sample presentation copy · Personal growth",
  },
  {
    quote: "Real estate strategy, mortgage knowledge, reputation, and relationships are connected to one clear standard—build for the long game.",
    name: "Industry Reader",
    role: "Sample presentation copy · Real estate",
  },
  {
    quote: "Christopher's story gives the practical framework its authority. The ideas come from building, losing, rebuilding, surviving, and leading.",
    name: "Business Reader",
    role: "Sample presentation copy · Leadership",
  },
];

function MillionDollarMindsetPage() {
  return (
    <main className="mindset-page">
      <section className="mindset-hero" id="top" aria-labelledby="mindset-page-title">
        <div className="mindset-hero__ether" aria-hidden="true">
          <LiquidEther
            colors={["#3A2106", "#D9AB55", "#FFF1C8"]}
            mouseForce={20}
            cursorSize={100}
            isViscous
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo
            autoSpeed={0.48}
            autoIntensity={2.1}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
        <div className="mindset-hero__shade" aria-hidden="true" />

        <div className="mindset-hero__layout">
          <div className="mindset-hero__copy">
            <p>Book One · Christopher DiCristo</p>
            <h1 id="mindset-page-title">The Million-<br />Dollar <em>Mindset</em></h1>
            <h2>Learning to believe in yourself.</h2>
            <span>A complete guide to courage, confidence, and building a real estate legacy that lasts.</span>
            <a href="#inside-the-book">Enter the Book <b aria-hidden="true">↓</b></a>
          </div>

          <figure className="mindset-hero__book">
            <img src={bookCover} alt="The Million-Dollar Mindset by Christopher DiCristo" />
            <figcaption>First edition · 2026</figcaption>
          </figure>
        </div>
      </section>

      <MindsetBookJourney />
      <FaqScroll
        items={bookFaqs}
        eyebrow="The book, answered"
        titleLead="Read with"
        titleAccent="intention."
        hint="Scroll through the book questions"
      />
      <BookContact />
      <TestimonialsScroll
        items={bookTestimonials}
        eyebrow="Early reflections"
        titleLead="A mindset"
        titleAccent="that stays."
        footerNote="Preview presentation copy · Replace with verified reader testimonials before publication"
      />
    </main>
  );
}

export default MillionDollarMindsetPage;
