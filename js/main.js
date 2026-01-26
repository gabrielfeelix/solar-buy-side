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


  // Pricing Toggle
  const toggleBtns = document.querySelectorAll(".oferta-principal__toggle-btn");
  if (toggleBtns.length > 0) {
    toggleBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        toggleBtns.forEach(b => b.classList.remove("oferta-principal__toggle-btn--active"));
        btn.classList.add("oferta-principal__toggle-btn--active");

        // Update prices based on selection (example logic)
        const priceMain = document.querySelector(".oferta-principal__price-main");
        const priceCash = document.querySelector(".oferta-principal__price-cash");

        if (priceMain && priceCash) {
          const btnText = btn.textContent.trim();
          if (btnText.includes("12x")) {
            priceMain.textContent = "12x de R$ 47,25";
            priceCash.textContent = "R$ 567 à vista";
          } else if (btnText.includes("vista")) {
            priceMain.textContent = "R$ 538,65";
            priceCash.textContent = "5% de desconto aplicado";
          } else if (btnText.includes("PIX")) {
            priceMain.textContent = "R$ 510,30";
            priceCash.textContent = "10% de desconto aplicado";
          }
        }
      });
    });
  }

  // Solução Scroll Section (Scroll-triggered cards with sticky image)
  const solucaoSection = document.querySelector("[data-scroll-section]");
  if (solucaoSection) {
    const cards = solucaoSection.querySelectorAll("[data-scroll-card]");
    const indicators = solucaoSection.querySelectorAll(".solucao-scroll__indicator");
    const imageWrapper = solucaoSection.querySelector(".solucao-scroll__image-wrapper");
    const imageEl = imageWrapper?.querySelector("img");
    let currentIndex = 0;

    const setActiveCard = (index) => {
      if (index < 0) index = 0;
      if (index >= cards.length) index = cards.length - 1;

      currentIndex = index;

      cards.forEach((card, i) => {
        card.classList.toggle("is-active", i === index);
      });
      indicators.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
      });

      const nextImage = cards[index]?.getAttribute("data-image");
      if (imageEl && nextImage && imageEl.getAttribute("src") !== nextImage) {
        imageWrapper?.classList.add("is-swapping");
        imageEl.style.opacity = "0";
        window.setTimeout(() => {
          imageEl.setAttribute("src", nextImage);
        }, 120);

        const cleanup = () => {
          imageEl.style.opacity = "";
          imageWrapper?.classList.remove("is-swapping");
          imageEl.removeEventListener("load", cleanup);
        };
        imageEl.addEventListener("load", cleanup);
        window.setTimeout(cleanup, 400);
      }
    };

    // Click on card to activate
    cards.forEach((card, index) => {
      card.addEventListener("click", () => {
        setActiveCard(index);
      });
    });

    // Click on indicator dots
    indicators.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        setActiveCard(index);
      });
    });

    // Scroll-triggered activation using IntersectionObserver
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -25% 0px",
      threshold: 0
    };

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(cards).indexOf(entry.target);
          if (index !== -1) {
            setActiveCard(index);
          }
        }
      });
    }, observerOptions);

    cards.forEach(card => {
      cardObserver.observe(card);
    });

    // Initialize first card as active
    setActiveCard(0);
  }

  // Testimonials Navigation with Infinite Scroll
  const testimonialsGrid = document.querySelector("[data-testimonials-grid]");
  const prevBtn = document.querySelector("[data-testimonials-prev]");
  const nextBtn = document.querySelector("[data-testimonials-next]");

  if (testimonialsGrid && prevBtn && nextBtn) {
    const cards = testimonialsGrid.querySelectorAll(".testimonials__card");
    const cardCount = cards.length;
    let currentIndex = 0;
    let isTransitioning = false;

    // Clone cards for infinite effect
    const cloneCards = () => {
      // Clone first and last few cards
      cards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        testimonialsGrid.appendChild(clone);
      });
      cards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        testimonialsGrid.insertBefore(clone, testimonialsGrid.firstChild);
      });
    };

    cloneCards();

    // Get card width dynamically
    const getCardWidth = () => {
      const firstCard = testimonialsGrid.querySelector(".testimonials__card");
      if (!firstCard) return 340;
      const style = window.getComputedStyle(firstCard);
      const width = firstCard.offsetWidth;
      const marginRight = parseFloat(style.marginRight) || 0;
      const gap = 20; // gap from CSS
      return width + gap;
    };

    // Set initial position (after cloned cards)
    const setInitialPosition = () => {
      const cardWidth = getCardWidth();
      const offset = cardWidth * cardCount;
      const paddingLeft = parseFloat(window.getComputedStyle(testimonialsGrid).paddingLeft) || 0;
      testimonialsGrid.style.transition = "none";
      testimonialsGrid.style.transform = `translateX(${-(offset - paddingLeft)}px)`;
    };

    setInitialPosition();

    const updateScroll = (animate = true) => {
      const cardWidth = getCardWidth();
      const offset = cardWidth * (currentIndex + cardCount);
      const paddingLeft = parseFloat(window.getComputedStyle(testimonialsGrid).paddingLeft) || 0;
      testimonialsGrid.style.transition = animate ? "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" : "none";
      testimonialsGrid.style.transform = `translateX(${-(offset - paddingLeft)}px)`;
    };

    const handleTransitionEnd = () => {
      isTransitioning = false;
      const cardWidth = getCardWidth();

      // If we've scrolled past the original cards, jump back
      if (currentIndex >= cardCount) {
        currentIndex = 0;
        updateScroll(false);
      } else if (currentIndex < 0) {
        currentIndex = cardCount - 1;
        updateScroll(false);
      }
    };

    testimonialsGrid.addEventListener("transitionend", handleTransitionEnd);

    const scrollNext = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      updateScroll();
    };

    const scrollPrev = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      updateScroll();
    };

    nextBtn.addEventListener("click", scrollNext);
    prevBtn.addEventListener("click", scrollPrev);

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialsGrid.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    testimonialsGrid.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          scrollNext();
        } else {
          scrollPrev();
        }
      }
    }, { passive: true });

    // Reset on resize
    window.addEventListener("resize", () => {
      setInitialPosition();
      currentIndex = 0;
    });
  }

  // Modules Grid - Animated Light Pulse along connection lines
  const modulesGrid = document.querySelector("[data-modules-grid]");
  if (modulesGrid) {
    const svg = modulesGrid.querySelector(".modulos-grid__lines");
    const linesGroup = modulesGrid.querySelector(".modulos-grid__lines-group");
    const pulse = modulesGrid.querySelector(".modulos-grid__pulse");
    const cards = modulesGrid.querySelectorAll(".modulos-grid__card");

    if (svg && linesGroup && pulse && cards.length === 6) {
      let allPaths = [];
      const pulseTargets = new Map();

      const createLines = () => {
        // Limpar linhas existentes
        linesGroup.innerHTML = "";
        allPaths = [];

        const gridRect = modulesGrid.getBoundingClientRect();

        // Atualizar viewBox do SVG
        svg.setAttribute("viewBox", `0 0 ${gridRect.width} ${gridRect.height}`);
        svg.style.width = gridRect.width + "px";
        svg.style.height = gridRect.height + "px";

        // Obter posições dos cards
        const cardRects = Array.from(cards).map(card => {
          const rect = card.getBoundingClientRect();
          return {
            left: rect.left - gridRect.left,
            right: rect.right - gridRect.left,
            top: rect.top - gridRect.top,
            bottom: rect.bottom - gridRect.top,
            centerY: (rect.top + rect.bottom) / 2 - gridRect.top,
            centerX: (rect.left + rect.right) / 2 - gridRect.left
          };
        });

        // Criar conexões: 1→2, 2→3, 3→4, 4→5, 5→6
        const connections = [
          { from: 0, to: 1, type: "horizontal" },
          { from: 1, to: 2, type: "horizontal" },
          { from: 2, to: 3, type: "curve-down" },
          { from: 3, to: 4, type: "horizontal" },
          { from: 4, to: 5, type: "horizontal" }
        ];

        connections.forEach((conn, index) => {
          const fromCard = cardRects[conn.from];
          const toCard = cardRects[conn.to];
          let pathD = "";

          if (conn.type === "horizontal") {
            // Linha horizontal simples
            const startX = fromCard.right + 4;
            const endX = toCard.left - 4;
            const y = fromCard.centerY;
            pathD = `M ${startX} ${y} L ${endX} ${y}`;
          } else if (conn.type === "curve-down") {
            // Curva do card 3 para card 4 (descendo para próxima linha)
            const startX = fromCard.right - 24;
            const startY = fromCard.bottom + 4;
            const endX = toCard.left + 24;
            const endY = toCard.top - 4;
            const midY = (startY + endY) / 2;

            pathD = `M ${startX} ${startY}
                     L ${startX} ${midY}
                     Q ${startX} ${midY + 20} ${startX - 20} ${midY + 20}
                     L ${endX + 20} ${midY + 20}
                     Q ${endX} ${midY + 20} ${endX} ${midY}
                     L ${endX} ${endY}`;
          }

          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", pathD);
          path.setAttribute("class", "modulos-grid__line");
          path.setAttribute("fill", "none");
          path.setAttribute("stroke", "#FF6B35");
          path.setAttribute("stroke-width", "2.5");
          path.setAttribute("stroke-linecap", "round");
          path.setAttribute("stroke-linejoin", "round");
          linesGroup.appendChild(path);
          allPaths.push({ path, from: conn.from, to: conn.to });
        });
      };

      // Criar linhas inicialmente
      createLines();

      // Recriar ao redimensionar
      window.addEventListener("resize", createLines);

      // Animação do pulso de luz
      let currentPathIndex = 0;
      let progress = 0;
      const speed = 0.012;
      let animationRunning = false;

      const highlightCard = (index) => {
        const card = cards[index];
        if (!card) return;
        card.classList.add("is-pulse");
        const existing = pulseTargets.get(card);
        if (existing) window.clearTimeout(existing);
        const timeout = window.setTimeout(() => {
          card.classList.remove("is-pulse");
          pulseTargets.delete(card);
        }, 320);
        pulseTargets.set(card, timeout);
      };

      const animatePulse = () => {
        if (allPaths.length === 0 || !animationRunning) return;

        const currentPath = allPaths[currentPathIndex];
        const pathLength = currentPath.path.getTotalLength();
        const point = currentPath.path.getPointAtLength(progress * pathLength);

        pulse.setAttribute("cx", point.x);
        pulse.setAttribute("cy", point.y);
        pulse.style.opacity = "1";

        progress += speed;

        if (progress <= 0.06) {
          highlightCard(currentPath.from);
        } else if (progress >= 0.94) {
          highlightCard(currentPath.to);
        }

        if (progress >= 1) {
          progress = 0;
          currentPathIndex++;

          if (currentPathIndex >= allPaths.length) {
            // Reiniciar do começo após pausa
            currentPathIndex = 0;
            pulse.style.opacity = "0";
            setTimeout(() => {
              if (animationRunning) requestAnimationFrame(animatePulse);
            }, 1000);
            return;
          }

          // Pequena pausa entre segmentos
          pulse.style.opacity = "0.5";
        }

        requestAnimationFrame(animatePulse);
      };

      // Iniciar animação quando a seção estiver visível
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animationRunning) {
            animationRunning = true;
            animatePulse();
          } else if (!entry.isIntersecting) {
            animationRunning = false;
          }
        });
      }, { threshold: 0.2 });

      observer.observe(modulesGrid);
    }
  }
})();

