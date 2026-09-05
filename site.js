const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".nav");
const menuLabel = menuButton?.querySelector(".sr-only");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const setMenuState = (open) => {
  navigation?.classList.toggle("open", open);
  menuButton?.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
  if (menuLabel) menuLabel.textContent = open ? "Fechar menu" : "Abrir menu";
};

menuButton?.addEventListener("click", () => {
  setMenuState(!navigation?.classList.contains("open"));
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
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
  if (window.innerWidth > 760) setMenuState(false);
});

const siteHeader = document.querySelector(".site-header");
const setHeaderState = () => siteHeader?.classList.toggle("is-scrolled", window.scrollY > 24);
window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

const solutionGrid = document.querySelector(".solution-grid");
const solutionCards = [...document.querySelectorAll(".solution-card")];
const solutionDots = [...document.querySelectorAll(".solution-dot")];
const solutionCount = document.querySelector(".solution-counter span");

const setActiveSolution = (activeIndex) => {
  solutionDots.forEach((dot, index) => {
    const active = index === activeIndex;
    dot.classList.toggle("active", active);
    dot.setAttribute("aria-current", active ? "true" : "false");
  });
  if (solutionCount) solutionCount.textContent = String(activeIndex + 1).padStart(2, "0");
};

const updateSolutionDots = () => {
  if (!solutionGrid || window.innerWidth > 760) return;
  const activeIndex = solutionCards.reduce((closest, card, index) => {
    const currentDistance = Math.abs(card.offsetLeft - solutionGrid.scrollLeft);
    const closestDistance = Math.abs(solutionCards[closest].offsetLeft - solutionGrid.scrollLeft);
    return currentDistance < closestDistance ? index : closest;
  }, 0);
  setActiveSolution(activeIndex);
};

solutionGrid?.addEventListener("scroll", updateSolutionDots, { passive: true });
solutionDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    solutionCards[index]?.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth",
      block: "nearest",
      inline: "start",
    });
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
  window.location.href = `mailto:orenjidatascience@gmail.com?subject=${subject}&body=${body}`;
});

const initDataCanvas = () => {
  const canvas = document.querySelector(".data-canvas");
  const hero = document.querySelector(".hero");
  if (!canvas || !hero || reducedMotion.matches) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  let width = 0;
  let height = 0;
  let frame = 0;
  let active = true;
  let points = [];
  const pointer = { x: 0, y: 0, active: false };

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    const bounds = hero.getBoundingClientRect();
    width = Math.max(1, Math.round(bounds.width));
    height = Math.max(1, Math.round(bounds.height));
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = window.innerWidth <= 760 ? 20 : 42;
    points = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      radius: index % 7 === 0 ? 2.2 : 1.2,
    }));
  };

  const draw = () => {
    if (!active || document.hidden) {
      frame = requestAnimationFrame(draw);
      return;
    }
    context.clearRect(0, 0, width, height);
    points.forEach((point, index) => {
      point.x += point.vx;
      point.y += point.vy;
      if (point.x < 0 || point.x > width) point.vx *= -1;
      if (point.y < 0 || point.y > height) point.vy *= -1;

      context.beginPath();
      context.fillStyle = index % 4 === 0 ? "rgba(16,178,166,.48)" : "rgba(255,122,0,.45)";
      context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      context.fill();

      for (let next = index + 1; next < points.length; next += 1) {
        const other = points[next];
        const dx = point.x - other.x;
        const dy = point.y - other.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 135) {
          context.beginPath();
          context.strokeStyle = `rgba(31,31,36,${0.075 * (1 - distance / 135)})`;
          context.lineWidth = 1;
          context.moveTo(point.x, point.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      }

      if (pointer.active) {
        const dx = point.x - pointer.x;
        const dy = point.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 165) {
          context.beginPath();
          context.strokeStyle = `rgba(255,122,0,${0.19 * (1 - distance / 165)})`;
          context.moveTo(point.x, point.y);
          context.lineTo(pointer.x, pointer.y);
          context.stroke();
        }
      }
    });
    frame = requestAnimationFrame(draw);
  };

  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
  }, { passive: true });
  hero.addEventListener("pointerleave", () => { pointer.active = false; });
  new IntersectionObserver(([entry]) => { active = entry.isIntersecting; }).observe(hero);
  window.addEventListener("resize", resize, { passive: true });
  resize();
  draw();
  window.addEventListener("pagehide", () => cancelAnimationFrame(frame), { once: true });
};

const initMotion = () => {
  if (!window.gsap || !window.ScrollTrigger) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("motion-ready");

  if (window.Lenis && window.matchMedia("(min-width: 761px) and (pointer: fine)").matches) {
    const lenis = new window.Lenis({
      anchors: { offset: -82 },
      duration: 1.05,
      smoothWheel: true,
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => gsap.set(".scroll-progress span", { scaleX: self.progress }),
  });

  if (!reducedMotion.matches) {
    const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });
    heroTimeline
      .from(".hero .text-mask > span", { yPercent: 115, duration: 1.15, stagger: 0.11 }, 0.15)
      .from(".hero-sequence", { y: 24, opacity: 0, duration: 0.75, stagger: 0.11 }, 0.5)
      .from(".hero-logo-mask", { clipPath: "inset(0 100% 0 0 round 2px)", duration: 1.25 }, 0.35)
      .from(".hero-logo-frame", { scale: 1.12, xPercent: 6, duration: 1.45 }, 0.35)
      .from(".hero-orbit", { scale: 0.72, opacity: 0, duration: 1.1, stagger: 0.12 }, 0.7)
      .from(".hero-index", { opacity: 0, x: 20, duration: 0.7 }, 0.95);

    gsap.to(".hero-logo-frame", {
      yPercent: 7,
      scale: 1.025,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.1 },
    });

    gsap.utils.toArray(".motion-reveal").forEach((element) => {
      gsap.from(element, {
        y: 54,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 84%", once: true },
      });
    });

    gsap.utils.toArray("[data-reveal-group]").forEach((group) => {
      gsap.from(group.children, {
        y: 42,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: group, start: "top 82%", once: true },
      });
    });

    gsap.to(".about-mark", {
      yPercent: -15,
      rotation: -3,
      ease: "none",
      scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: 1 },
    });
    gsap.to(".about-network", {
      yPercent: 12,
      rotation: 5,
      ease: "none",
      scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: 1.2 },
    });
  }

  const media = gsap.matchMedia();
  media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
    const viewport = document.querySelector(".solutions-viewport");
    const track = document.querySelector(".solution-grid");
    if (!viewport || !track) return undefined;
    const travel = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
    const horizontalTween = gsap.to(track, {
      x: () => -travel(),
      ease: "none",
      scrollTrigger: {
        trigger: viewport,
        start: "top 18%",
        end: () => `+=${travel() + window.innerWidth * 0.18}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => setActiveSolution(Math.min(3, Math.round(self.progress * 3))),
      },
    });
    return () => horizontalTween.kill();
  });

  const cursor = document.querySelector(".cursor-orbit");
  if (cursor && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion.matches) {
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.28, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.28, ease: "power3" });
    window.addEventListener("pointermove", (event) => { xTo(event.clientX); yTo(event.clientY); }, { passive: true });
    document.querySelectorAll("[data-cursor]").forEach((target) => {
      target.addEventListener("pointerenter", () => {
        cursor.querySelector("span").textContent = target.dataset.cursor || "Explore";
        cursor.classList.add("is-visible");
      });
      target.addEventListener("pointerleave", () => cursor.classList.remove("is-visible"));
    });
  }

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
};

initDataCanvas();
initMotion();
