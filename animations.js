// Geenius Studio · scroll & entrance animations powered by framer-motion's
// vanilla DOM API. Loaded as an ES module from a CDN because the site is a
// no-build static site. Degrades gracefully: if the module or CDN fails, the
// inline head watchdog removes `.motion-ready` and all content stays visible.

const root = document.documentElement;
const reduceMotion =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function clearWatchdog() {
  if (window.__motionWatchdog) {
    clearTimeout(window.__motionWatchdog);
    window.__motionWatchdog = null;
  }
}

function reveal() {
  // No-op fallback: show everything, no animation.
  clearWatchdog();
  root.classList.remove("motion-ready");
}

if (reduceMotion || !root.classList.contains("motion-ready")) {
  reveal();
} else {
  let motion = null;
  try {
    motion = await import("https://esm.sh/framer-motion@12.40.0/dom");
  } catch (err) {
    motion = null;
  }

  if (!motion || typeof motion.animate !== "function") {
    reveal();
  } else {
    clearWatchdog();
    try {
      init(motion);
    } catch (err) {
      reveal();
    }
  }
}

function init({ animate, inView, scroll, stagger }) {
  const ease = [0.2, 0.8, 0.2, 1];

  // --- Hero entrance (staggered) ---
  const heroItems = document.querySelectorAll(
    ".hero .eyebrow, .hero h1, .hero .lead, .hero .hero-actions, .hero .hero-stats"
  );
  if (heroItems.length) {
    animate(
      heroItems,
      { opacity: [0, 1], transform: ["translateY(24px)", "translateY(0px)"] },
      { duration: 0.7, ease, delay: stagger(0.1, { startDelay: 0.05 }) }
    );
  }

  // --- Single-element reveals on scroll (headings, leads) ---
  document
    .querySelectorAll(".section h2, .section .eyebrow, .section-lead")
    .forEach((el) => {
      const stop = inView(
        el,
        () => {
          animate(
            el,
            { opacity: [0, 1], transform: ["translateY(20px)", "translateY(0px)"] },
            { duration: 0.6, ease }
          );
          stop();
        },
        { amount: 0.2, margin: "0px 0px -8% 0px" }
      );
    });

  // --- Grouped reveals with stagger ---
  const groups = [
    { container: ".services-grid", child: ".service-card", gap: 0.08, y: 24 },
    { container: ".work-scroller", child: ".work-card", gap: 0.08, y: 24 },
    { container: ".bullets", child: "li", gap: 0.06, y: 18 },
    { container: ".contact-list", child: "li", gap: 0.06, y: 18 },
  ];
  groups.forEach(({ container, child, gap, y }) => {
    const el = document.querySelector(container);
    if (!el) return;
    const kids = el.querySelectorAll(child);
    if (!kids.length) return;
    const stop = inView(
      el,
      () => {
        animate(
          kids,
          {
            opacity: [0, 1],
            transform: [`translateY(${y}px)`, "translateY(0px)"],
          },
          { duration: 0.6, ease, delay: stagger(gap) }
        );
        stop();
      },
      { amount: 0.15, margin: "0px 0px -8% 0px" }
    );
  });

  // --- Scroll progress bar ---
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  scroll(animate(bar, { scaleX: [0, 1] }, { ease: "linear" }));

  // --- Subtle parallax on the device mockups ---
  document.querySelectorAll(".work-device").forEach((el) => {
    scroll(
      animate(
        el,
        { transform: ["translateY(22px)", "translateY(-22px)"] },
        { ease: "linear" }
      ),
      { target: el, offset: ["start end", "end start"] }
    );
  });
}
