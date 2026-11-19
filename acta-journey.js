/* ACTA animated correspondence illustrations.
   Replay while in view; pause when hidden; honor reduced motion. */
(function () {
  "use strict";
  const journey = document.querySelector(".acta-journey");
  if (!journey) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canAnimate = () => !reducedMotion.matches && !document.hidden;

  function setPlaying(inView) {
    journey.classList.toggle("is-playing", Boolean(inView && canAnimate()));
    journey.dataset.inView = inView ? "true" : "false";
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === journey) setPlaying(entry.isIntersecting);
      }
    }, { threshold: 0.12 });
    observer.observe(journey);
  } else {
    setPlaying(true);
  }

  document.addEventListener("visibilitychange", () => {
    setPlaying(journey.dataset.inView === "true");
  });
  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", () => {
      setPlaying(journey.dataset.inView === "true");
    });
  }
})();
