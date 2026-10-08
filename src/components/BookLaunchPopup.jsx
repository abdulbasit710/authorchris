import { useEffect, useRef, useState } from "react";
import books from "../data/books";
import "./BookLaunchPopup.css";

const POPUP_DISMISSED_KEY = "christopher-two-book-popup-dismissed";
const availableBooks = books.filter((book) => !book.comingSoon && book.purchaseHref);
const bookNotes = {
  "million-dollar-mindset": "Build your confidence. Believe in what comes next.",
  "power-of-new-real-estate-money": "Discover new possibilities in real estate and finance.",
};

function shouldShowPopup() {
  try {
    return window.sessionStorage.getItem(POPUP_DISMISSED_KEY) !== "true";
  } catch {
    return true;
  }
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BookLaunchPopup() {
  const [isOpen, setIsOpen] = useState(shouldShowPopup);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const backdropPointerDown = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    dialog.showModal();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  const closePopup = () => {
    try {
      window.sessionStorage.setItem(POPUP_DISMISSED_KEY, "true");
    } catch {
      // Dismissal still works if browser storage is disabled.
    }
    setIsOpen(false);
  };

  const isBackdrop = (event) => {
    if (event.target !== dialogRef.current) return false;
    const bounds = dialogRef.current.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom;
  };

  if (!isOpen) return null;

  return (
    <dialog
      className="book-popup"
      ref={dialogRef}
      aria-labelledby="book-popup-title"
      aria-describedby="book-popup-description"
      onCancel={(event) => {
        event.preventDefault();
        closePopup();
      }}
      onPointerDown={(event) => {
        backdropPointerDown.current = isBackdrop(event);
      }}
      onClick={(event) => {
        if (backdropPointerDown.current && isBackdrop(event)) closePopup();
        backdropPointerDown.current = false;
      }}
    >
      <button className="book-popup__close" type="button" ref={closeRef} onClick={closePopup} aria-label="Close book promotion">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m6 6 12 12M6 18 18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <div className="book-popup__content">
        <header className="book-popup__header">
          <p className="book-popup__eyebrow"><span /> The Christopher DiCristo Collection</p>
          <h2 id="book-popup-title">Your next chapter <em>starts here.</em></h2>
          <p id="book-popup-description">Two books. Real-world wisdom. A world of possibility.</p>
        </header>

        <div className="book-popup__books">
          {availableBooks.map((book, index) => (
            <article className="book-popup__book" key={book.id}>
              <div className="book-popup__art">
                <span className="book-popup__number" aria-hidden="true">0{index + 1}</span>
                <img src={book.image} alt={`${book.title} book cover`} width="500" height="500" loading="eager" />
              </div>
              <div className="book-popup__details">
                <p className="book-popup__book-label">{book.eyebrow} <span aria-hidden="true">/</span> Available now</p>
                <h3>{book.title}</h3>
                <p className="book-popup__note">{bookNotes[book.id]}</p>
                <a
                  className="book-popup__buy"
                  href={book.purchaseHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Buy your copy now: ${book.title} on Amazon (opens in a new tab)`}
                >
                  <span>Buy your copy now</span>
                  <ArrowIcon />
                </a>
              </div>
            </article>
          ))}
        </div>

        <footer className="book-popup__footer">
          <p>Available on <strong>Amazon</strong> <span aria-hidden="true">↗</span></p>
          <button type="button" onClick={closePopup}>Continue exploring <span aria-hidden="true">→</span></button>
        </footer>
      </div>
    </dialog>
  );
}
