(function () {
  const root = document.querySelector("[data-countdown]");
  if (!root) return;

  const daysEl = root.querySelector("[data-days]");
  const hoursEl = root.querySelector("[data-hours]");
  const minutesEl = root.querySelector("[data-minutes]");
  const secondsEl = root.querySelector("[data-seconds]");
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const storageKey = "buyside_deadline_v1";
  const hours = Number(root.getAttribute("data-duration-hours")) || 24;
  const now = Date.now();

  let deadline = Number(localStorage.getItem(storageKey));
  if (!deadline || Number.isNaN(deadline) || deadline < now) {
    deadline = now + hours * 60 * 60 * 1000;
    localStorage.setItem(storageKey, String(deadline));
  }

  const pad2 = (n) => String(n).padStart(2, "0");

  const render = () => {
    const diff = Math.max(0, deadline - Date.now());
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hoursLeft = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = pad2(days);
    hoursEl.textContent = pad2(hoursLeft);
    minutesEl.textContent = pad2(minutes);
    secondsEl.textContent = pad2(seconds);

    if (totalSeconds <= 0) {
      clearInterval(timer);
      root.classList.add("is-expired");
    }
  };

  render();
  const timer = setInterval(render, 1000);
})();

