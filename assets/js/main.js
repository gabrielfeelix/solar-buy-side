(() => {
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  const header = document.querySelector("[data-elevate-on-scroll]");
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-elevated", window.scrollY > 8);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const inViewTargets = Array.from(document.querySelectorAll(".reveal"));
  if (!prefersReducedMotion && "IntersectionObserver" in window && inViewTargets.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-inview");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 }
    );

    for (const el of inViewTargets) observer.observe(el);
  } else {
    for (const el of inViewTargets) el.classList.add("is-inview");
  }

  const accordion = document.querySelector("[data-accordion]");
  if (accordion) {
    const items = Array.from(accordion.querySelectorAll(".faq-item"));
    const closeAll = (exceptItem) => {
      for (const item of items) {
        if (exceptItem && item === exceptItem) continue;
        item.classList.remove("is-open");
        const btn = item.querySelector(".faq-q");
        const panel = item.querySelector(".faq-a");
        if (btn) btn.setAttribute("aria-expanded", "false");
        if (panel) panel.style.maxHeight = "0px";
      }
    };

    for (const item of items) {
      const btn = item.querySelector(".faq-q");
      const panel = item.querySelector(".faq-a");
      if (!btn || !panel) continue;

      panel.style.maxHeight = "0px";
      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        closeAll(item);
        item.classList.toggle("is-open", !isOpen);
        btn.setAttribute("aria-expanded", String(!isOpen));
        panel.style.maxHeight = !isOpen ? `${panel.scrollHeight}px` : "0px";
      });
    }
  }

  const mobileCta = document.querySelector("[data-mobile-cta]");
  const offer = document.querySelector("#oferta");
  const shouldShowMobileCta = () => window.matchMedia?.("(max-width: 768px)")?.matches ?? false;

  const updateMobileCta = () => {
    if (!mobileCta) return;
    if (!shouldShowMobileCta()) {
      mobileCta.classList.remove("is-visible");
      return;
    }

    const nearTop = window.scrollY < 320;
    const nearOffer = offer ? offer.getBoundingClientRect().top < window.innerHeight * 0.75 : false;
    mobileCta.classList.toggle("is-visible", !nearTop && !nearOffer);
  };

  updateMobileCta();
  window.addEventListener("scroll", updateMobileCta, { passive: true });
  window.addEventListener("resize", updateMobileCta);

  const form = document.querySelector('[data-form="leadmagnet"]');
  if (form) {
    form.addEventListener("submit", (e) => {
      if (form.getAttribute("action") && form.getAttribute("action") !== "#") return;
      e.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      if (button) {
        button.disabled = true;
        button.textContent = "Enviando...";
      }

      window.setTimeout(() => {
        if (button) {
          button.disabled = false;
          button.textContent = "BAIXAR EBOOK GRÁTIS AGORA";
        }
        form.reset();
        alert("Prévia enviada! (Integre o formulário ao seu provedor para receber os leads.)");
      }, 650);
    });
  }
})();

