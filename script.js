/* =========================================
   BADAL STUDIO
   INTERACTIVE JAVASCRIPT
   Learn. Build. Grow.
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // 1. SELECT ELEMENTS
  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  // 2. AUTOMATIC FOOTER YEAR
  const year = new Date().getFullYear();
  const yearElement = $("#year");

  if (yearElement) {
    yearElement.textContent = year;
  }

  $$("[data-current-year]").forEach(element => {
    element.textContent = year;
  });

  // 3. SMOOTH SECTION NAVIGATION
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = $(href);
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      const nav = $(".nav");
      const menuButton = $("[data-menu-toggle]");

      if (nav && menuButton) {
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  });

  // 4. EXPLORE BUTTON
  const exploreButton = $("#exploreBtn");

  if (exploreButton) {
    exploreButton.addEventListener("click", () => {
      const destination =
        $("#samples") || $("#projects") || $("#tools");

      if (destination) {
        destination.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  }

  // 5. VIEW PROJECTS BUTTONS
  $$("button, a").forEach(button => {
    const label = (button.textContent || "")
      .trim()
      .toLowerCase();

    if (
      label === "view projects" ||
      label === "explore projects"
    ) {
      button.addEventListener("click", event => {
        const destination = $("#samples") || $("#projects");

        if (destination) {
          event.preventDefault();

          destination.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      });
    }
  });

  // 6. SAMPLE WEBSITE LINKS
  const sampleLinks = {
    tuition: "samples/tuition/index.html",
    shop: "samples/shop/index.html"
  };

  $$("[data-sample]").forEach(card => {
    const type = (
      card.getAttribute("data-sample") || ""
    ).toLowerCase();

    const url = sampleLinks[type];

    if (!url) return;

    const link = card.querySelector("a");

    if (link) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  });

  // 7. PROJECT CARD INTERACTIONS
  const projectCards = $$(".project");

  projectCards.forEach(card => {
    card.addEventListener("click", () => {
      projectCards.forEach(item => {
        item.classList.remove("active");
      });

      card.classList.add("active");
    });

    card.addEventListener("keydown", event => {
      if (
        (event.key === "Enter" || event.key === " ") &&
        event.target === card
      ) {
        event.preventDefault();
        card.click();
      }
    });
  });

  // 8. PROJECT FILTERS
  const filterButtons = $$("[data-filter]");
  const filterCards = $$("[data-category]");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const selected = (
        button.getAttribute("data-filter") || "all"
      ).toLowerCase();

      filterButtons.forEach(item => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      filterCards.forEach(card => {
        const categories = (
          card.getAttribute("data-category") || ""
        ).toLowerCase().split(/\s+/);

        card.hidden = !(
          selected === "all" ||
          categories.includes(selected)
        );
      });
    });
  });

  // 9. MOBILE MENU
  const menuToggle = $("[data-menu-toggle]");
  const navigation = $(".nav");

  if (menuToggle && navigation) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const isOpen =
        navigation.classList.toggle("is-open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });
  }

  // 10. SCROLL REVEAL ANIMATIONS
  const revealElements = $$(
    ".sample-card, .service-card, .tool-item, " +
    ".value-item, .about-card, .project"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach(element => {
      element.classList.add("reveal");
      observer.observe(element);
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add("is-visible");
    });
  }

  // 11. CONTACT EMAIL BUTTONS
  $$("[data-contact-email]").forEach(button => {
    button.addEventListener("click", () => {
      const email = button.getAttribute("data-contact-email");

      if (
        email &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        window.location.href = "mailto:" + email;
      }
    });
  });

  // 12. EXTERNAL LINKS
  $$('a[target="_blank"]').forEach(link => {
    link.setAttribute("rel", "noopener noreferrer");
  });

  // 13. STUDIO MESSAGE
  console.log(
    "%c BADAL STUDIO ",
    "background:#1769ff;color:#fff;padding:8px 12px;font-weight:bold;"
  );

  console.log("Learn. Build. Grow. — Studio ready.");
});
