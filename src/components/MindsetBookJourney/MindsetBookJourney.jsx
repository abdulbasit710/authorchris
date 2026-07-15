import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import bookCover from "../../assets/book-image/book-1-mockup.png";
import "./MindsetBookJourney.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const movements = [
  {
    eyebrow: "Movement One · The Foundation",
    title: "Believe Before the Evidence",
    copy: "This is not a promise of overnight wealth. Christopher begins with the inner work: learning from failure, choosing courage, and earning confidence through action when the outcome is still uncertain.",
  },
  {
    eyebrow: "Movement Two · The System",
    title: "Turn Experience Into a System",
    copy: "Five decades of real estate and mortgage leadership become practical frameworks for relationships, professional reputation, modern lead generation, lending knowledge, and disciplined growth.",
  },
  {
    eyebrow: "Movement Three · The Mindset",
    title: "Build for the Long Game",
    copy: "The final movement brings performance, ethics, consistency, mentorship, and legacy together. The real million-dollar mindset is becoming the person capable of building something that serves people and lasts.",
  },
];

function MindsetBookJourney({
  movements: movementItems = movements,
  bookImage = bookCover,
  bookTitle = "The Million-Dollar Mindset",
  introEyebrow = "Inside the manuscript",
  introLead = "One book.",
  introAccent = "Three movements.",
  introHint = "Keep scrolling—the cover moves three times",
  sectionId = "inside-the-book",
}) {
  const sectionRef = useRef(null);

  useGSAP(() => {
    let movementContext;

    const buildMovement = () => {
      movementContext?.revert();

      movementContext = gsap.context(() => {
        const track = sectionRef.current.querySelector(".mindset-journey__track");
        const movingBook = sectionRef.current.querySelector(".mindset-journey__moving-book");
        const markers = gsap.utils.toArray(".mindset-journey__marker", sectionRef.current);
        const stages = gsap.utils.toArray(".mindset-journey__stage", sectionRef.current);
        const stories = gsap.utils.toArray(".mindset-journey__story", sectionRef.current);
        const progress = sectionRef.current.querySelector(".mindset-journey__progress-fill");
        const trackRect = track.getBoundingClientRect();
        const bookRect = movingBook.getBoundingClientRect();

        const points = markers.map((marker) => {
          const markerRect = marker.getBoundingClientRect();

          return {
            x: markerRect.left + markerRect.width / 2 - trackRect.left - bookRect.width / 2,
            y: markerRect.top + markerRect.height / 2 - trackRect.top - bookRect.height / 2,
          };
        });

        gsap.set(movingBook, {
          x: points[0].x,
          y: points[0].y,
          autoAlpha: 1,
          rotate: -2,
        });

        const bookTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: stages[0],
            start: "center center",
            endTrigger: stages[stages.length - 1],
            end: "center center",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        bookTimeline
          .to(movingBook, {
            x: points[1].x,
            y: points[1].y,
            rotate: 2,
            duration: 1,
            ease: "power1.inOut",
          })
          .to(movingBook, {
            x: points[2].x,
            y: points[2].y,
            rotate: -2,
            duration: 1,
            ease: "power1.inOut",
          });

        stages.forEach((stage, index) => {
          const direction = index === 1 ? 1 : -1;

          gsap.fromTo(
            stories[index],
            { autoAlpha: 0, x: direction * -90, filter: "blur(8px)" },
            {
              autoAlpha: 1,
              x: 0,
              filter: "blur(0px)",
              ease: "power3.out",
              scrollTrigger: {
                trigger: stage,
                start: "top 84%",
                end: "center 55%",
                scrub: 1,
                invalidateOnRefresh: true,
              },
            }
          );
        });

        gsap.to(progress, {
          scaleY: 1,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: "top center",
            end: "bottom center",
            scrub: 1,
          },
        });
      }, sectionRef);
    };

    buildMovement();
    window.addEventListener("resize", buildMovement);

    return () => {
      window.removeEventListener("resize", buildMovement);
      movementContext?.revert();
    };
  }, { scope: sectionRef });

  return (
    <section className="mindset-journey" id={sectionId} ref={sectionRef} aria-labelledby="mindset-journey-title">
      <header className="mindset-journey__intro">
        <p>{introEyebrow}</p>
        <h2 id="mindset-journey-title">{introLead}<br /><em>{introAccent}</em></h2>
        <span>{introHint}</span>
      </header>

      <div className="mindset-journey__track">
        <div className="mindset-journey__rail" aria-hidden="true"><span className="mindset-journey__progress-fill" /></div>

        <div className="mindset-journey__moving-start">
          <figure className="mindset-journey__moving-book">
            <img src={bookImage} alt={`${bookTitle} book cover`} />
          </figure>
        </div>

        {movementItems.map((movement, index) => (
          <article className={`mindset-journey__stage mindset-journey__stage--${index + 1}`} key={movement.title}>
            <div className="mindset-journey__story">
              <p>{movement.eyebrow}</p>
              <h3>{movement.title}</h3>
              <i className="mindset-journey__divider" aria-hidden="true"><b /></i>
              <span>{movement.copy}</span>
              {index === movementItems.length - 1 && (
                <a href="#book-contact">Buy Your Copy Now <b aria-hidden="true">↗</b></a>
              )}
            </div>

            <div className="mindset-journey__marker-wrap" aria-hidden="true">
              <div className="mindset-journey__marker" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MindsetBookJourney;
