// =========================
// Seren Cem Portfolio JS
// Dynamic Scroll Experience
// =========================

class PortfolioApp {
  constructor() {
    this.root = document.documentElement;
    this.themeToggle = document.getElementById("themeToggle");
    this.menuToggle = document.getElementById("menuToggle");
    this.mobileNav = document.getElementById("mobileNav");
    this.contactForm = document.getElementById("contactForm");
    this.yearEl = document.getElementById("year");
    this.progressBar = document.getElementById("progressBar");
    this.sections = [...document.querySelectorAll("main section[id]")];
    this.navLinks = [
      ...document.querySelectorAll(".nav a"),
      ...document.querySelectorAll(".mobile-nav a"),
    ];

    this.init();
  }

  init() {
    this.setYear();
    this.loadTheme();
    this.bindEvents();
    this.initRevealAnimation();
    this.initDynamicContentAnimation();
    this.initScrollEffects();
    requestAnimationFrame(() => {
      this.updateProgress();
      this.updateActiveNavLink();
    });
  }

  loadTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      this.root.setAttribute("data-theme", "light");
    }
    this.updateThemeIcon();
  }

  toggleTheme() {
    const isLight = this.root.getAttribute("data-theme") === "light";
    if (isLight) {
      this.root.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
    } else {
      this.root.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
    this.updateThemeIcon();
  }

  updateThemeIcon() {
    const icon = this.themeToggle?.querySelector(".icon");
    if (!icon) return;
    icon.textContent =
      this.root.getAttribute("data-theme") === "light" ? "☀️" : "🌙";
  }

  toggleMobileMenu() {
    if (!this.mobileNav) return;
    const isHidden = this.mobileNav.hasAttribute("hidden");
    if (isHidden) {
      this.mobileNav.removeAttribute("hidden");
      this.menuToggle?.setAttribute("aria-expanded", "true");
    } else {
      this.closeMobileMenu();
    }
  }

  closeMobileMenu() {
    if (!this.mobileNav) return;
    this.mobileNav.setAttribute("hidden", "");
    this.menuToggle?.setAttribute("aria-expanded", "false");
  }

  setYear() {
    if (this.yearEl) this.yearEl.textContent = String(new Date().getFullYear());
  }

  updateProgress() {
    if (!this.progressBar) return;
    const scrollTop = window.scrollY;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    this.progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  initRevealAnimation() {
    const targets = document.querySelectorAll(".reveal-up");
    if (!("IntersectionObserver" in window) || targets.length === 0) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    targets.forEach((el) => revealObserver.observe(el));
  }

  initDynamicContentAnimation() {
    const blocks = document.querySelectorAll(
      ".panel, .hero__card, .skill-card",
    );
    if (!("IntersectionObserver" in window) || blocks.length === 0) {
      this.fillProgressBars(document);
      this.animateCounters(document);
      return;
    }

    const blockObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          this.fillProgressBars(entry.target);
          this.animateCounters(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );

    blocks.forEach((block) => blockObserver.observe(block));
  }

  fillProgressBars(scope) {
    scope.querySelectorAll("[data-progress]").forEach((bar) => {
      if (bar.dataset.animated === "true") return;
      const percent = Number(bar.dataset.progress || "0");
      bar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
      bar.dataset.animated = "true";
    });
  }

  animateCounters(scope) {
    scope.querySelectorAll("[data-count]").forEach((counterEl) => {
      if (counterEl.dataset.animated === "true") return;

      const target = Number(counterEl.dataset.count || "0");
      const duration = 850;
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min(1, (now - startTime) / duration);
        counterEl.textContent = String(Math.floor(progress * target));
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counterEl.textContent = String(target);
          counterEl.dataset.animated = "true";
        }
      };

      requestAnimationFrame(step);
    });
  }

  updateActiveNavLink() {
    if (this.sections.length === 0 || this.navLinks.length === 0) return;

    const scrollRef = window.scrollY + 120;
    let current = this.sections[0].id;
    this.sections.forEach((section) => {
      if (scrollRef >= section.offsetTop) current = section.id;
    });

    this.navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return;
      const isActive = href === `#${current}`;
      link.classList.toggle("is-active", isActive);
    });
  }

  initScrollEffects() {
    window.addEventListener(
      "scroll",
      () => {
        this.updateProgress();
        this.updateActiveNavLink();
      },
      { passive: true },
    );
  }

  bindEvents() {
    this.themeToggle?.addEventListener("click", () => this.toggleTheme());
    this.menuToggle?.addEventListener("click", () => this.toggleMobileMenu());

    this.mobileNav?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => this.closeMobileMenu());
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) this.closeMobileMenu();
      this.updateActiveNavLink();
      this.updateProgress();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.closeMobileMenu();
    });

    this.contactForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const submitBtn = this.contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const previousText = submitBtn.textContent;
        submitBtn.textContent = "Mesaj alindi";
        submitBtn.setAttribute("disabled", "true");
        setTimeout(() => {
          submitBtn.textContent = previousText;
          submitBtn.removeAttribute("disabled");
        }, 1800);
      }
      this.contactForm.reset();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new PortfolioApp();
});
