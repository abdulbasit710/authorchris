import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import logoImage from "../../assets/logo/logo-1.png";
import "./LogoScroll.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function LogoScroll() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  useGSAP(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const image = new Image();
    const playhead = { progress: 0 };
    let imageReady = false;
    let transparentLogo;

    const removeWhiteBackground = () => {
      const offscreen = document.createElement("canvas");
      offscreen.width = image.naturalWidth;
      offscreen.height = image.naturalHeight;
      const offscreenContext = offscreen.getContext("2d", { willReadFrequently: true });
      offscreenContext.drawImage(image, 0, 0);
      const pixels = offscreenContext.getImageData(0, 0, offscreen.width, offscreen.height);
      const data = pixels.data;

      for (let index = 0; index < data.length; index += 4) {
        const red = data[index];
        const green = data[index + 1];
        const blue = data[index + 2];
        const darkest = Math.min(red, green, blue);
        const brightest = Math.max(red, green, blue);
        const saturation = brightest - darkest;
        const distanceFromWhite = 255 - darkest;
        data[index + 3] = Math.max(0, Math.min(255, distanceFromWhite * 2.4));
        if (saturation < 28 && brightest < 175) {
          data[index] = 248;
          data[index + 1] = 241;
          data[index + 2] = 224;
        }
      }

      offscreenContext.putImageData(pixels, 0, 0);
      return offscreen;
    };

    const drawLogo = () => {
      if (!imageReady) return;
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(bounds.width * pixelRatio);
      const height = Math.round(bounds.height * pixelRatio);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      const progress = playhead.progress;
      const intro = gsap.parseEase("power2.out")(gsap.utils.clamp(0, 1, progress / 0.36));
      const scale = gsap.utils.interpolate(0.86, 1, intro);
      const opacity = gsap.utils.interpolate(0.12, 1, intro);
      const lift = gsap.utils.interpolate(38, 0, intro);
      const containScale = Math.min(width / transparentLogo.width, height / transparentLogo.height) * scale;
      const drawWidth = transparentLogo.width * containScale;
      const drawHeight = transparentLogo.height * containScale;
      context.clearRect(0, 0, width, height);
      context.save();
      context.globalAlpha = opacity;
      context.translate(width / 2, height / 2 + lift * pixelRatio);
      context.drawImage(transparentLogo, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      context.restore();
    };

    image.onload = () => {
      transparentLogo = removeWhiteBackground();
      imageReady = true;
      drawLogo();
      ScrollTrigger.refresh();
    };
    image.src = logoImage;

    const animation = gsap.to(playhead, {
      progress: 1,
      ease: "none",
      onUpdate: drawLogo,
      scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom bottom", scrub: 1.6, invalidateOnRefresh: true },
    });

    const textReveal = gsap.fromTo(
      [".logo-scroll__eyebrow", ".logo-scroll__hint"],
      { autoAlpha: 0, y: 22 },
      {
        autoAlpha: 1,
        y: 0,
        stagger: 0.12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=55%",
          scrub: 1.2,
        },
      }
    );

    const handleResize = () => drawLogo();
    window.addEventListener("resize", handleResize);
    return () => { window.removeEventListener("resize", handleResize); animation.kill(); textReveal.kill(); };
  }, { scope: sectionRef });

  return (
    <section className="logo-scroll" ref={sectionRef} aria-label="Real Estate Beyond Limits">
      <div className="logo-scroll__sticky">
        <div className="logo-scroll__eyebrow">Christopher DiCristo</div>
        <div className="logo-scroll__canvas-wrap"><canvas ref={canvasRef} aria-label="Real Estate Beyond Limits logo" role="img" /></div>
        <p className="logo-scroll__hint">Scroll to reveal the vision</p>
      </div>
    </section>
  );
}

export default LogoScroll;
