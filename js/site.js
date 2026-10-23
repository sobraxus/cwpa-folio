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

  var cards = document.querySelectorAll(".media-card");
  cards.forEach(function (card) {
    var button = card.querySelector(".media-face");
    if (!button) return;
    button.addEventListener("click", function () {
      var willOpen = !card.classList.contains("open");
      cards.forEach(function (other) {
        var otherButton = other.querySelector(".media-face");
        other.classList.remove("open");
        if (otherButton) otherButton.setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        card.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.querySelectorAll(".cipher").forEach(function (heading) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var text = heading.textContent;
    var glyphs = "%^#@$&*+=~<>?/\\|{}[]";
    var letters = [];
    heading.textContent = "";
    for (var i = 0; i < text.length; i++) {
      var span = document.createElement("span");
      var character = text.charAt(i);
      span.textContent = character;
      span.setAttribute("aria-hidden", "true");
      heading.appendChild(span);
      if (character !== " ") letters.push({ span: span, character: character, busy: false });
    }

    function flicker() {
      if (document.hidden) return;
      var pool = letters.filter(function (item) { return !item.busy; });
      if (!pool.length) return;
      var count = Math.min(pool.length, 1 + Math.floor(Math.random() * 2));
      for (var n = 0; n < count; n++) {
        var pick = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
        pick.busy = true;
        pick.span.textContent = glyphs.charAt(Math.floor(Math.random() * glyphs.length));
        pick.span.classList.add("on");
        window.setTimeout(function (item) {
          item.span.textContent = item.character;
          item.span.classList.remove("on");
          item.busy = false;
        }, 320 + Math.floor(Math.random() * 480), pick);
      }
    }

    window.setInterval(flicker, 900);
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
