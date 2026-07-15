import React, { useState } from "react";
import "./BookContact.css";

function BookContact({
  bookTitle = "The Million-Dollar Mindset",
  editionNumber = "01",
  editionLabel = "First edition",
  editionYear = "2026",
}) {
  const [submitted, setSubmitted] = useState(false);

  const submitForm = (event) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <section className="book-contact" id="book-contact" aria-labelledby="book-contact-title">
      <div className="book-contact__layout">
        <header>
          <p>Book inquiries</p>
          <h2 id="book-contact-title">Let’s build<br /><em>the next chapter.</em></h2>
          <span>
            Ask about copies, bulk orders, speaking engagements, media, or bringing
            the principles of {bookTitle} to your organization.
          </span>
          <div className="book-contact__edition"><b>{editionNumber}</b><small>{editionLabel}<br />{editionYear}</small></div>
        </header>

        <form onSubmit={submitForm}>
          <div className="book-contact__field">
            <label htmlFor="book-contact-name">Your name</label>
            <input id="book-contact-name" name="name" type="text" placeholder="Christopher Reader" required />
          </div>

          <div className="book-contact__field">
            <label htmlFor="book-contact-email">Email address</label>
            <input id="book-contact-email" name="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="book-contact__field book-contact__field--wide">
            <label htmlFor="book-contact-interest">I’m interested in</label>
            <select id="book-contact-interest" name="interest" defaultValue="Individual copy">
              <option>Individual copy</option>
              <option>Signed copy</option>
              <option>Bulk or team order</option>
              <option>Speaking engagement</option>
              <option>Media or interview</option>
              <option>Book discussion</option>
            </select>
          </div>

          <div className="book-contact__field book-contact__field--wide">
            <label htmlFor="book-contact-message">Tell us more</label>
            <textarea id="book-contact-message" name="message" rows="4" placeholder="How can Christopher and his team help?" required />
          </div>

          <button type="submit">Send Your Inquiry <span aria-hidden="true">↗</span></button>
          <p className={`book-contact__success${submitted ? " is-visible" : ""}`} role="status">
            Thank you. Your inquiry is ready for the next chapter.
          </p>
        </form>
      </div>
    </section>
  );
}

export default BookContact;
