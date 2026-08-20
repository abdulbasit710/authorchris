import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import popupImage from "../assets/images/chris popup.jpg";
import { MILLION_DOLLAR_MINDSET_AMAZON_URL } from "../constants/links";

const POPUP_SEEN_KEY = "million-dollar-mindset-launch-popup-seen";

const shouldShowPopup = () => {
  try {
    return window.localStorage.getItem(POPUP_SEEN_KEY) !== "true";
  } catch {
    return true;
  }
};

const BookLaunchPopup = () => {
  const [isOpen, setIsOpen] = useState(shouldShowPopup);

  const overlayRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    try {
      window.localStorage.setItem(POPUP_SEEN_KEY, "true");
    } catch {
      // The popup still works when browser storage is unavailable.
    }

    // Stop page from scrolling while popup is open
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.45,
          ease: "power2.out",
        }
      );

      gsap.fromTo(
        popupRef.current,
        {
          opacity: 0,
          scale: 0.82,
          y: 50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          delay: 0.1,
          ease: "back.out(1.4)",
        }
      );
    });

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closePopup();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      ctx.revert();
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const closePopup = () => {
    if (!popupRef.current || !overlayRef.current) {
      setIsOpen(false);
      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => setIsOpen(false),
    });

    timeline
      .to(popupRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 30,
        duration: 0.3,
        ease: "power2.in",
      })
      .to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
        },
        "-=0.15"
      );
  };

  const handleBackdropClick = (event) => {
    if (event.target === overlayRef.current) {
      closePopup();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="book-popup-overlay"
      ref={overlayRef}
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="The Million-Dollar Mindset book launch"
    >
      <div className="book-popup" ref={popupRef}>

        {/* Close button */}
        <button
          className="book-popup-close"
          type="button"
          onClick={closePopup}
          aria-label="Close book promotion"
        >
          ×
        </button>

        {/* Poster */}
        <img
          src={popupImage}
          alt="The Million-Dollar Mindset by Christopher DiCristo, now live on Amazon"
          className="book-popup-image"
        />

        {/*
          Clickable area positioned over the
          BUY YOUR COPY NOW button inside the poster.
        */}
        <a
          href={MILLION_DOLLAR_MINDSET_AMAZON_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="book-popup-amazon-link"
          aria-label="Buy The Million-Dollar Mindset on Amazon"
        >
          <span className="sr-only">Buy your copy on Amazon</span>
        </a>

      </div>
    </div>
  );
};

export default BookLaunchPopup;
