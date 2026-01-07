(function () {
  const header = document.getElementById("header");
  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest('a[href^="#"]');
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const top = el.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight || 0) - 16;
    window.scrollTo({ top, behavior: "smooth" });
  });

  const accordion = document.querySelector("[data-accordion]");
  if (accordion) {
    accordion.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest(".accordion__trigger");
      if (!trigger) return;
      const item = trigger.closest(".accordion__item");
      if (!item) return;
      const panel = item.querySelector(".accordion__panel");
      if (!(panel instanceof HTMLElement)) return;

      const isOpen = item.classList.contains("is-open");
      const nextOpen = !isOpen;

      accordion.querySelectorAll(".accordion__item").forEach((it) => {
        if (!(it instanceof HTMLElement)) return;
        it.classList.remove("is-open");
        const trig = it.querySelector(".accordion__trigger");
        const pan = it.querySelector(".accordion__panel");
        if (trig) trig.setAttribute("aria-expanded", "false");
        if (pan) pan.setAttribute("hidden", "");
      });

      if (nextOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        panel.removeAttribute("hidden");
      }
    });
  }

  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

