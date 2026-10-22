/* ============================================================
   site.js — behaviour for every page.
   The reference portfolio keeps this in one inline script:
   theme, local clock, scroll progress, reveal, arrow draw,
   stat count-up, and an experience accordion.
   Edit copy in the HTML. Edit motion here.
   ============================================================ */

(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var query = new URLSearchParams(location.search).get("theme");
  var saved = localStorage.getItem("theme");
  var theme = query === "dark" || query === "light" ? query : (saved || "light");
  applyTheme(theme);

  document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
    button.addEventListener("click", function () {
      applyTheme(root.classList.contains("dark") ? "light" : "dark");
    });
  });

  function applyTheme(next) {
    root.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "dark" ? "#10110f" : "#f6f3ec");
  }

  var clock = document.getElementById("local-clock");
  if (clock) {
    var zone = clock.getAttribute("data-timezone") || "Europe/London";
    var suffix = clock.getAttribute("data-suffix") || "";
    var tick = function () {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: zone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }).formatToParts(new Date());
      var bag = {};
      parts.forEach(function (part) { bag[part.type] = part.value; });
      clock.textContent = bag.hour + ":" + bag.minute + " " + String(bag.dayPeriod || "").toLowerCase() + (suffix ? " " + suffix : "");
    };
    tick();
    setInterval(tick, 30000);
  }

  var bar = document.getElementById("scroll-progress");
  if (bar) {
    var onScroll = function () {
      var height = root.scrollHeight - window.innerHeight;
      var amount = height > 0 ? (window.scrollY / height) * 100 : 0;
      bar.style.width = amount + "%";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if ("IntersectionObserver" in window) {
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        reveal.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { reveal.observe(el); });

    var arrows = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("drawn");
        arrows.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll(".draw-arrow").forEach(function (el) { arrows.observe(el); });

    var counts = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        counts.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll("[data-count]").forEach(function (el) { counts.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
  }

  function runCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var start = performance.now();
    var duration = 1100;
    function frame(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  document.querySelectorAll(".exp-item").forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      document.querySelectorAll(".exp-item").forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  if (window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) {
    document.querySelectorAll("[data-magnetic]").forEach(function (wrap) {
      var button = wrap.querySelector("a, button");
      if (!button) return;
      wrap.addEventListener("mousemove", function (event) {
        var rect = wrap.getBoundingClientRect();
        var x = (event.clientX - rect.left - rect.width / 2) * 0.22;
        var y = (event.clientY - rect.top - rect.height / 2) * 0.22;
        button.style.transform = "translate(" + x + "px, " + y + "px)";
      });
      wrap.addEventListener("mouseleave", function () {
        button.style.transform = "";
      });
    });
  }
})();
