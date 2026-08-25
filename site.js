const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".nav");

menuButton?.addEventListener("click", () => {
  const open = navigation?.classList.toggle("open") ?? false;
  menuButton.setAttribute("aria-expanded", String(open));
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = String(form.get("name") || "");
  const company = String(form.get("company") || "");
  const challenge = String(form.get("challenge") || "");
  const subject = encodeURIComponent(`Contato pelo site Orenji — ${company || name}`);
  const body = encodeURIComponent(`Olá, sou ${name}${company ? `, da empresa ${company}` : ""}.\n\n${challenge}`);
  window.location.href = `mailto:contato@orenji.com.br?subject=${subject}&body=${body}`;
});
