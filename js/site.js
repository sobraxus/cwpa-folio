(function () {
  "use strict";

  var menu = document.getElementById("mobile-menu");
  var toggle = document.querySelector(".menu-toggle");

  if (menu && toggle) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  document.querySelectorAll(".media-card").forEach(function (card) {
    var button = card.querySelector(".media-face");
    if (!button) return;
    button.addEventListener("click", function () {
      var open = card.classList.toggle("open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  var navLinks = document.querySelectorAll(".nav-desktop a, .nav-mobile a");
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute("href");
    if (!id || id.charAt(0) !== "#") return;
    var section = document.querySelector(id);
    if (section) sections.push({ link: link, section: section });
  });

  function markActive() {
    var current = sections[0];
    sections.forEach(function (item) {
      if (item.section.getBoundingClientRect().top <= 120) current = item;
    });
    navLinks.forEach(function (link) { link.classList.remove("active"); });
    if (!current) return;
    document.querySelectorAll('a[href="' + current.link.getAttribute("href") + '"]').forEach(function (link) {
      link.classList.add("active");
    });
  }

  markActive();
  window.addEventListener("scroll", markActive, { passive: true });

  if ("IntersectionObserver" in window) {
    var bars = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        bars.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    document.querySelectorAll(".skill").forEach(function (el) { bars.observe(el); });
  } else {
    document.querySelectorAll(".skill").forEach(function (el) { el.classList.add("visible"); });
  }
})();
