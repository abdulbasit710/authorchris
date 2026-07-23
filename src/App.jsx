import React, { lazy, Suspense } from "react";
import AboutChristopher from "./components/AboutChristopher/AboutChristopher";
import AuthorGallery from "./components/AuthorGallery/AuthorGallery";
import BookCollection from "./components/BookCollection/BookCollection";
import BookJourney from "./components/BookJourney/BookJourney";
import HomeSlider from "./components/HomeSlider/HomeSlider";
import VentureScroll from "./components/VentureScroll/VentureScroll";
import VisionSlides from "./components/VisionSlides/VisionSlides";
import CristoSocial from "./components/CristoSocial/CristoSocial";
import CurvedLoopSection from "./components/CurvedLoop/CurvedLoopSection";
import FaqScroll from "./components/FaqScroll/FaqScroll";
import SiteFooter from "./components/SiteFooter/SiteFooter";
import SiteHeader from "./components/SiteHeader/SiteHeader";
import CustomCursor from "./components/CustomCursor/CustomCursor";

const AboutPage = lazy(() => import("./pages/AboutPage"));
const MillionDollarMindsetPage = lazy(() => import("./pages/MillionDollarMindsetPage"));
const RealEstateMoneyPage = lazy(() => import("./pages/RealEstateMoneyPage"));
const ComingSoonPage = lazy(() => import("./pages/ComingSoonPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

function HomePage() {
  return (
    <main>
      <HomeSlider />
      <AuthorGallery />
      <AboutChristopher />
      <BookCollection />
      <BookJourney />
      <VentureScroll />
      <CristoSocial />
      <CurvedLoopSection />
      <FaqScroll />
    </main>
  );
}

function App() {
  const currentPath = window.location.pathname.replace(/\/+$/, "");
  const isAboutPage = currentPath === "/about";
  const isMindsetPage = currentPath === "/books/the-million-dollar-mindset";
  const isMoneyPage = currentPath === "/books/the-power-of-new-real-estate-money";
  const isComingSoonPage = currentPath === "/books/coming-soon";
  const isContactPage = currentPath === "/contact";

  return (
    <>
      <CustomCursor />
      <SiteHeader />
      {isContactPage ? (
        <Suspense fallback={<main className="route-loading" aria-label="Loading contact page" />}>
          <ContactPage />
        </Suspense>
      ) : isComingSoonPage ? (
        <Suspense fallback={<main className="route-loading" aria-label="Loading upcoming books page" />}>
          <ComingSoonPage />
        </Suspense>
      ) : isMoneyPage ? (
        <Suspense fallback={<main className="route-loading" aria-label="Loading The Power of New Real Estate Money page" />}>
          <RealEstateMoneyPage />
        </Suspense>
      ) : isMindsetPage ? (
        <Suspense fallback={<main className="route-loading" aria-label="Loading The Million-Dollar Mindset page" />}>
          <MillionDollarMindsetPage />
        </Suspense>
      ) : isAboutPage ? (
        <Suspense fallback={<main className="route-loading" aria-label="Loading About Christopher page" />}>
          <AboutPage />
        </Suspense>
      ) : <HomePage />}
      <SiteFooter />
    </>
  );
}

export default App;
