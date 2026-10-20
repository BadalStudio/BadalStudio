/* BadalStudio interactions — vanilla JS, no libraries */
(() => {
  const intro = document.getElementById("intro");
  const menuButton = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav-links");
  const progress = document.getElementById("scroll-progress");
  const year = document.getElementById("year");
  const pointerGlow = document.querySelector(".pointer-glow");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Opening sequence: never leave the page covered if animation code is interrupted.
  const closeIntro = () => intro?.classList.add("is-done");
  if (reduceMotion) closeIntro();
  else window.addEventListener("load", () => window.setTimeout(closeIntro, 1050), { once: true });
  window.setTimeout(closeIntro, 2600);

  if (year) year.textContent = new Date().getFullYear();

  // Scroll reveal
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 65}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Mobile navigation
  const closeMenu = () => {
    nav?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("menu-open");
  };
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav?.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  });
  nav?.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });

  // Scroll progress bar, passive and lightweight
  let scrollQueued = false;
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = `${pct}%`;
    scrollQueued = false;
  };
  window.addEventListener("scroll", () => {
    if (!scrollQueued) {
      scrollQueued = true;
      window.requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  updateProgress();

  // Desktop pointer ambience only
  if (pointerGlow && window.matchMedia("(pointer:fine)").matches && !reduceMotion) {
    window.addEventListener("pointermove", event => {
      pointerGlow.style.left = `${event.clientX}px`;
      pointerGlow.style.top = `${event.clientY}px`;
      pointerGlow.style.opacity = "1";
    }, { passive: true });
    document.addEventListener("pointerleave", () => { pointerGlow.style.opacity = "0"; });
  }

  // Gentle card tilt on mouse-capable devices, disabled on touch/reduced motion
  if (window.matchMedia("(pointer:fine)").matches && !reduceMotion) {
    document.querySelectorAll(".project-card").forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const image = card.querySelector(".project-image");
        if (image) image.style.transform = `perspective(900px) rotateX(${-y * 2.5}deg) rotateY(${x * 2.5}deg)`;
      });
      card.addEventListener("pointerleave", () => {
        const image = card.querySelector(".project-image");
        if (image) image.style.transform = "";
      });
    });
  }
})();
