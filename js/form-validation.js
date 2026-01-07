(function () {
  const form = document.querySelector('form[data-form="lead"]');
  if (!form) return;

  const status = form.querySelector(".form__status");

  const setFieldError = (field, message) => {
    const errorEl = field.closest(".field")?.querySelector(".field__error");
    if (errorEl) errorEl.textContent = message || "";
    field.setAttribute("aria-invalid", message ? "true" : "false");
  };

  const validators = {
    name: (value) => {
      const v = String(value || "").trim();
      if (v.length < 2) return "Informe seu nome.";
      return "";
    },
    email: (value) => {
      const v = String(value || "").trim();
      if (!v) return "Informe seu email.";
      const ok = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v);
      if (!ok) return "Email inválido.";
      return "";
    },
  };

  const validate = () => {
    let hasError = false;
    Object.keys(validators).forEach((name) => {
      const field = form.elements.namedItem(name);
      if (!(field instanceof HTMLElement)) return;
      const message = validators[name](field.value);
      setFieldError(field, message);
      if (message) hasError = true;
    });
    return !hasError;
  };

  form.addEventListener("input", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
    if (!Object.prototype.hasOwnProperty.call(validators, target.name)) return;
    const message = validators[target.name](target.value);
    setFieldError(target, message);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!status) return;

    status.textContent = "";
    status.classList.remove("is-success");

    const ok = validate();
    if (!ok) {
      status.textContent = "Revise os campos destacados.";
      return;
    }

    status.textContent = "Pronto! (Demonstração) Seus dados foram validados com sucesso.";
    status.classList.add("is-success");
    form.reset();
    Array.from(form.querySelectorAll(".field__input")).forEach((el) => {
      el.removeAttribute("aria-invalid");
      const err = el.closest(".field")?.querySelector(".field__error");
      if (err) err.textContent = "";
    });
  });
})();
