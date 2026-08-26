const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".nav");
const menuLabel = menuButton?.querySelector(".sr-only");

const setMenuState = (open) => {
  navigation?.classList.toggle("open", open);
  menuButton?.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);

  if (menuLabel) {
    menuLabel.textContent = open ? "Fechar menu" : "Abrir menu";
  }
};

menuButton?.addEventListener("click", () => {
  setMenuState(!navigation?.classList.contains("open"));
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    setMenuState(false);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation?.classList.contains("open")) {
    setMenuState(false);
    menuButton?.focus();
  }
});

document.addEventListener("click", (event) => {
  if (
    navigation?.classList.contains("open") &&
    !navigation.contains(event.target) &&
    !menuButton?.contains(event.target)
  ) {
    setMenuState(false);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    setMenuState(false);
  }
});

document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = String(form.get("name") || "");
  const company = String(form.get("company") || "");
  const challenge = String(form.get("challenge") || "");
  const subject = encodeURIComponent(`Contato pelo site Orenji — ${company || name}`);
  const body = encodeURIComponent(`Olá, sou ${name}${company ? `, da empresa ${company}` : ""}.\n\n${challenge}`);
  window.location.href = `mailto:orenjidatascience@gmail.com?subject=${subject}&body=${body}`;
});
