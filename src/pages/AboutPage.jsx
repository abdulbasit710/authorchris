import React from "react";
import LiquidEther from "../components/LiquidEther/LiquidEther";
import VisionSlides from "../components/VisionSlides/VisionSlides";
import AboutChristopher from "../components/AboutChristopher/AboutChristopher";
import MoreAboutAuthor from "../components/MoreAboutAuthor/MoreAboutAuthor";
import BookCollection from "../components/BookCollection/BookCollection";
import VentureScroll from "../components/VentureScroll/VentureScroll";
import CristoSocial from "../components/CristoSocial/CristoSocial";
import FaqScroll from "../components/FaqScroll/FaqScroll";
import "./AboutPage.css";

function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero" id="top" aria-labelledby="about-page-title">
        <div className="about-hero__ether" aria-hidden="true">
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
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>

        <div className="about-hero__shade" aria-hidden="true" />

        <div className="about-hero__content">
          <p className="about-hero__eyebrow">The story behind the vision</p>
          <h1 id="about-page-title">
            About
            <span>Christopher</span>
          </h1>
          <p className="about-hero__intro">
            Discipline forged the foundation. Purpose shaped the path.
          </p>
        </div>

        <a className="about-hero__scroll" href="#real-estate-vision" aria-label="Scroll to discover Christopher's story">
          <span>Discover his story</span>
          <i aria-hidden="true" />
        </a>
      </section>

  
      <AboutChristopher />
      <MoreAboutAuthor />
      <BookCollection />
      <VentureScroll />
      <CristoSocial />
      <FaqScroll />
      
    </main>
  );
}

export default AboutPage;
