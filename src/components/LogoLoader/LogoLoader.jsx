import React, { useEffect, useState } from "react";
import loaderLogo from "../../assets/logo/real-estate-beyond-limits-loader.png";
import "./LogoLoader.css";

function LogoLoader() {
  const [leaving, setLeaving] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const startedAt = performance.now();
    let exitTimer;
    let removeTimer;

    const finish = () => {
      const remaining = Math.max(0, 3000 - (performance.now() - startedAt));
      exitTimer = window.setTimeout(() => {
        setLeaving(true);
        removeTimer = window.setTimeout(() => setVisible(false), 950);
      }, remaining);
    };

    document.body.classList.add("is-loading-site");
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      document.body.classList.remove("is-loading-site");
    };
  }, []);

  useEffect(() => {
    if (!visible) document.body.classList.remove("is-loading-site");
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={`site-loader${leaving ? " site-loader--leaving" : ""}`} role="status" aria-live="polite" aria-label="Loading Christopher DiCristo website">
      <div className="site-loader__noise" aria-hidden="true" />
      <div className="site-loader__glow" aria-hidden="true" />
      <span className="site-loader__line site-loader__line--top" aria-hidden="true" />
      <div className="site-loader__brand">
        <div className="site-loader__logo"><span className="site-loader__halo" aria-hidden="true" /><img src={loaderLogo} alt="Real Estate Beyond Limits — Christopher DiCristo" /></div>
        <div className="site-loader__progress" aria-hidden="true"><span /></div>
        <p>Building a legacy beyond limits</p>
      </div>
      <span className="site-loader__counter" aria-hidden="true">EST. · 2026</span>
      <span className="site-loader__line site-loader__line--bottom" aria-hidden="true" />
    </div>
  );
}

export default LogoLoader;
