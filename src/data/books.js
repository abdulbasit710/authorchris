import bookOne from "../assets/book-image/book-1-mockup.png";
import bookTwo from "../assets/book-image/book-2-mockup.png";
import bookThree from "../assets/book-image/book-3-mockup.png";
import bookFour from "../assets/book-image/book-4-mockup.png";

const books = [
  {
    id: "million-dollar-mindset",
    title: "The Million-Dollar Mindset",
    eyebrow: "Book One",
    image: bookOne,
    copy: "Learning to Believe in Yourself—a complete guide to courage, confidence, disciplined action, and building a real estate legacy that lasts.",
    href: "/books/the-million-dollar-mindset",
    comingSoon: false,
  },
  {
    id: "power-of-new-real-estate-money",
    title: "The Power of New Real Estate Money",
    eyebrow: "Book Two",
    image: bookTwo,
    copy: "How modern lending, mortgage niches, and investor financing create wealth beyond traditional limits—for agents, borrowers, and investors.",
    href: "/books/the-power-of-new-real-estate-money",
    comingSoon: false,
  },
  {
    id: "book-three",
    title: "Real Estate Marketing Domination",
    eyebrow: "Book Three",
    image: bookThree,
    copy: "The ultimate blueprint for building your brand, generating endless leads, and becoming the go-to agent in your market.",
    href: "/books/coming-soon#book-03",
    comingSoon: true,
  },
  {
    id: "book-four",
    title: "Land to Legacy",
    eyebrow: "Book Four",
    image: bookFour,
    copy: "How to build wealth through land development, builder and real estate investing—from vision to lasting legacy.",
    href: "/books/coming-soon#book-04",
    comingSoon: true,
  },
];

export default books;
