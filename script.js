/* =========================================
   BADAL STUDIO
   MAIN JAVASCRIPT
========================================= */

// Page load hone ke baad code run hoga
document.addEventListener("DOMContentLoaded", () => {

  // Smooth scrolling for navigation links
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {

    link.addEventListener("click", (event) => {

      const targetId = link.getAttribute("href");

      // Sirf valid section links ke liye
      if (targetId && targetId !== "#") {

        const target = document.querySelector(targetId);

        if (target) {
          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    });

  });


  // Current year automatically footer mein show karna
  const year = new Date().getFullYear();

  const footerYear = document.querySelector("#year");

  if (footerYear) {
    footerYear.textContent = year;
  }


  // Project cards par small interaction
  const projects = document.querySelectorAll(".project");

  projects.forEach(project => {

    project.addEventListener("click", () => {

      projects.forEach(item => {
        item.classList.remove("active");
      });

      project.classList.add("active");

    });

  });

});
