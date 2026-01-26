(function () {
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const autoAnimate = () => {
    const selectors = [
      ".hero__left",
      ".hero__right",
      ".section__header",
      ".diagnostico__card",
      ".solucao-scroll__header",
      ".segmentacao__card",
      ".processo__left",
      ".testimonials__header",
      ".testimonials__card",
      ".modulos-grid__card",
      ".metodo-bonus__card",
      ".pricing__card",
      ".author__photo",
      ".author__text",
      ".lead-magnet__benefit",
      ".newsletter__card",
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        if (el instanceof HTMLElement && !el.hasAttribute("data-animate")) {
          el.setAttribute("data-animate", "fade-up");
        }
      });
    });
  };

  const applyDelay = (element, delayMs) => {
    const explicitDelay = element.getAttribute("data-animate-delay");
    const baseDelay = explicitDelay ? Number(explicitDelay) || 0 : 0;
    const nextDelay = baseDelay + (delayMs || 0);
    if (nextDelay <= 0) return;
    element.style.transitionDelay = `${nextDelay}ms`;
  };

  const reveal = (element, delayMs) => {
    if (!(element instanceof HTMLElement)) return;
    if (element.classList.contains("animate-in")) return;
    applyDelay(element, delayMs);
    element.classList.add("animate-in");
  };

  const revealStaggeredChildren = (container) => {
    if (!(container instanceof Element)) return;
    const children = Array.from(container.children).filter(
      (child) => child instanceof HTMLElement && child.hasAttribute("data-animate")
    );
    children.forEach((child, index) => {
      window.setTimeout(() => reveal(child), index * 100);
    });
  };

  const setup = () => {
    autoAnimate();
    const targets = Array.from(document.querySelectorAll("[data-animate], [data-stagger]"));
    if (!targets.length) return;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      targets.forEach((target) => {
        if (target instanceof HTMLElement && target.hasAttribute("data-animate")) reveal(target);
        if (target instanceof Element && target.hasAttribute("data-stagger")) revealStaggeredChildren(target);
      });
      return;
    }

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target;
        if (target instanceof HTMLElement && target.hasAttribute("data-animate")) reveal(target);
        if (target instanceof Element && target.hasAttribute("data-stagger")) revealStaggeredChildren(target);

        observer.unobserve(target);
      });
    }, observerOptions);

    targets.forEach((el) => animateOnScroll.observe(el));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();
