(function () {
  const track = document.querySelector("[data-reviews]");
  if (!track) return;

  const leftCard = track.querySelector(".reviews__card--left");
  const centerCard = track.querySelector(".reviews__card--center");
  const rightCard = track.querySelector(".reviews__card--right");
  if (!(leftCard instanceof HTMLElement) || !(centerCard instanceof HTMLElement) || !(rightCard instanceof HTMLElement)) {
    return;
  }

  const leftButton = track.querySelector(".reviews__arrow--left");
  const rightButton = track.querySelector(".reviews__arrow--right");
  if (!(leftButton instanceof HTMLElement) || !(rightButton instanceof HTMLElement)) {
    return;
  }

  const reviews = [
    {
      name: "Eduardo Costa",
      role: "Diretora Comercial",
      image: "/worker1.png",
    },
    {
      name: "Rodrigo Azevedo",
      role: "Head de Vendas B2B",
      image: "/worker2.png",
    },
    {
      name: "Amanda Pires",
      role: "Integrador Solar",
      image: "/worker3.png",
    },
  ];

  let centerIndex = 1;
  let isAnimating = false;

  const updateCard = (card, item) => {
    const img = card.querySelector(".reviews__photo");
    const name = card.querySelector(".reviews__name");
    const role = card.querySelector(".reviews__role");
    if (img instanceof HTMLImageElement) {
      img.src = item.image;
      img.alt = `Foto de ${item.name}`;
    }
    if (name) name.textContent = item.name;
    if (role) role.textContent = item.role;
  };

  const render = () => {
    const total = reviews.length;
    const leftIndex = (centerIndex - 1 + total) % total;
    const rightIndex = (centerIndex + 1) % total;
    updateCard(leftCard, reviews[leftIndex]);
    updateCard(centerCard, reviews[centerIndex]);
    updateCard(rightCard, reviews[rightIndex]);
  };

  const spin = (direction) => {
    if (isAnimating) return;
    isAnimating = true;

    const className = direction === "right" ? "is-rotating-right" : "is-rotating-left";
    track.classList.remove("is-rotating-left", "is-rotating-right");
    track.classList.add(className);

    window.setTimeout(() => {
      const delta = direction === "right" ? 1 : -1;
      centerIndex = (centerIndex + delta + reviews.length) % reviews.length;
      render();
    }, 180);

    window.setTimeout(() => {
      track.classList.remove(className);
      isAnimating = false;
    }, 520);
  };

  leftButton.addEventListener("click", () => spin("left"));
  rightButton.addEventListener("click", () => spin("right"));

  render();
})();
