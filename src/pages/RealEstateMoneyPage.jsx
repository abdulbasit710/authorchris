import React from "react";
import LiquidEther from "../components/LiquidEther/LiquidEther";
import MindsetBookJourney from "../components/MindsetBookJourney/MindsetBookJourney";
import FaqScroll from "../components/FaqScroll/FaqScroll";
import BookContact from "../components/BookContact/BookContact";
import TestimonialsScroll from "../components/TestimonialsScroll/TestimonialsScroll";
import bookCover from "../assets/book-image/book-2-mockup.png";
import "./MillionDollarMindsetPage.css";

const moneyMovements = [
  {
    eyebrow: "Movement One · The Commitment",
    title: "Choose Wealth With Purpose",
    copy: "The journey begins beneath every strategy: sustain yourself, serve others, accept responsibility for your future, and turn knowledge into committed action. Financial success is built deliberately—not discovered by accident.",
  },
  {
    eyebrow: "Movement Two · The Opportunity",
    title: "Solve What Others Cannot",
    copy: "Modern mortgage niches create possibilities when traditional lending stops. Bank statements, DSCR, 1099 income, asset-based lending, bridge financing, and other specialized products reward professionals who learn to solve real problems.",
  },
  {
    eyebrow: "Movement Three · The Freedom",
    title: "Build Income Beyond Limits",
    copy: "The final movement connects the right financing strategy to investment cash flow, repeatable income, stronger client relationships, and long-term wealth. Master the niches, act with integrity, and create opportunity on demand.",
  },
];

const moneyFaqs = [
  {
    question: "What is The Power of New Real Estate Money about?",
    answer: "It is Christopher DiCristo's working guide to modern lending, mortgage niches, investor financing, and creating wealth beyond the limits of conventional loan thinking.",
  },
  {
    question: "Who is this book written for?",
    answer: "It is designed for real estate agents, mortgage professionals, investors, self-employed borrowers, entrepreneurs, and buyers who want to understand more flexible paths to financing and wealth creation.",
  },
  {
    question: "Which lending strategies are covered?",
    answer: "The manuscript explores DSCR, bank-statement, 1099, VOE, profit-and-loss, asset-based, foreign-national, bridge, construction, private-money, mixed-use, FHA multi-unit, renovation, reverse-purchase, and credit-focused strategies.",
  },
  {
    question: "Is the book only a reference guide?",
    answer: "No. Alongside product guidance, it includes decision frameworks, readiness checklists, workbooks, action plans, professional principles, and a commitment-based approach intended to turn information into results.",
  },
  {
    question: "How can I request a copy or bulk order?",
    answer: "Use the inquiry form below for individual copies, team or bulk orders, speaking engagements, media requests, book discussions, and publication updates.",
  },
];

const moneyTestimonials = [
  {
    quote: "A remarkably broad field guide to the financing strategies that conventional conversations often leave out.",
    name: "Editorial Preview",
    role: "Sample presentation copy · Manuscript overview",
  },
  {
    quote: "The strongest idea is simple: professionals create value when they understand the borrower, diagnose the real obstacle, and find the right product.",
    name: "Industry Reader",
    role: "Sample presentation copy · Mortgage strategy",
  },
  {
    quote: "From DSCR and bank statements to bridge and asset-based lending, the material turns specialized products into an understandable opportunity map.",
    name: "Advance Reader",
    role: "Sample presentation copy · Real estate investing",
  },
  {
    quote: "This is not information for the shelf. The checklists, worksheets, and decision tools continually push the reader toward disciplined action.",
    name: "Business Reader",
    role: "Sample presentation copy · Professional growth",
  },
];

function RealEstateMoneyPage() {
  return (
    <main className="mindset-page money-page">
      <section className="mindset-hero money-hero" id="top" aria-labelledby="money-page-title">
        <div className="mindset-hero__ether" aria-hidden="true">
          <LiquidEther
            colors={["#2B1805", "#C89439", "#FFF1C8"]}
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
            <p>Book Two · Christopher DiCristo</p>
            <h1 id="money-page-title">The Power of<br />New Real Estate<br /><em>Money</em></h1>
            <h2>Opportunity begins where traditional lending ends.</h2>
            <span>How modern lending, mortgage niches, and investor financing create wealth beyond traditional limits.</span>
            <a href="#inside-book-two">Enter the Book <b aria-hidden="true">↓</b></a>
          </div>

          <figure className="mindset-hero__book">
            <img src={bookCover} alt="The Power of New Real Estate Money by Christopher DiCristo" />
            <figcaption>Second edition · 2026</figcaption>
          </figure>
        </div>
      </section>

      <MindsetBookJourney
        movements={moneyMovements}
        bookImage={bookCover}
        bookTitle="The Power of New Real Estate Money"
        introEyebrow="Inside book two"
        introLead="New money."
        introAccent="Real opportunity."
        introHint="Keep scrolling—the cover moves through three strategies"
        sectionId="inside-book-two"
      />
      <FaqScroll
        items={moneyFaqs}
        eyebrow="The strategy, answered"
        titleLead="Opportunity"
        titleAccent="explained."
        hint="Scroll through the book questions"
      />
      <BookContact
        bookTitle="The Power of New Real Estate Money"
        editionNumber="02"
        editionLabel="Second edition"
        editionYear="2026"
      />
      <TestimonialsScroll
        items={moneyTestimonials}
        eyebrow="Early reflections"
        titleLead="Modern lending"
        titleAccent="made useful."
        footerNote="Preview presentation copy · Replace with verified reader testimonials before publication"
      />
    </main>
  );
}

export default RealEstateMoneyPage;
