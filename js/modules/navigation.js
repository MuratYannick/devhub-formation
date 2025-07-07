import { SELECTORS, CLASSES } from "../config/constants.js";
import { $, debounce } from "../utils/helpers.js";

class Navigation {
  constructor() {
    this.nav = $(SELECTORS.navigation);
    this.toggle = $(SELECTORS.menuToggle);
    this.isOpen = false;

    this.init();
  }

  init() {
    this.bindEvents();
    this.setActiveLink();
    this.handleScroll();
  }

  bindEvents() {
    this.toggle?.addEventListener("click", () => this.toggleMenu());

    // Fermer le menu lors du clic sur un lien
    this.nav.addEventListener("click", (e) => {
      if (e.target.classList.contains("nav-link")) {
        this.closeMenu();
      }
    });

    // Fermer le menu en dehors de la navigation
    document.addEventListener("click", (e) => {
      if (!this.nav.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Gérer le scroll pour le header sticky
    window.addEventListener(
      "scroll",
      debounce(() => {
        this.handleScroll();
      }, 10)
    );
  }

  toggleMenu() {
    console.log(`Toggle menu called`);

    this.isOpen = !this.isOpen;

    // 1. Console groups pour organiser les logs
    console.group("🧭 Navigation Debug");
    console.log("Current path:", window.location.pathname);
    console.log("Menu state:", this.isOpen);
    console.groupEnd();

    // 2. Console table pour les arrays/objets
    const links = [...document.querySelectorAll(".nav-link")].map((link) => ({
      text: link.textContent,
      href: link.href,
      active: link.classList.contains("nav-link--active"),
    }));
    console.table(links);

    // 3. Console time pour mesurer les performances
    console.time("Menu animation");
    this.nav.classList.add("nav--animating");
    setTimeout(() => {
      console.timeEnd("Menu animation"); // Affiche le temps écoulé
    }, 300);

    // 4. Console trace pour voir la call stack
    const debugNavigation = () => {
      console.trace("Navigation call stack");
    };

    // 5. Console assert pour les tests
    console.assert(this.nav !== null, "Navigation element not found!");
    console.assert(this.isOpen === false, "Menu should be closed by default");

    // 6. Conditional logging
    const DEBUG = true;
    DEBUG && console.log("🔍 Debug mode active");

    // 7. Pretty print objects
    console.log(
      "Navigation state:",
      JSON.stringify(
        {
          isOpen: this.isOpen,
          hasToggle: !!this.toggle,
          linksCount: this.nav.querySelectorAll(".nav-link").length,
        },
        null,
        2
      )
    );
    
    this.nav.classList.toggle(CLASSES.open, this.isOpen);

    if (this.isOpen) {
      debugger;
    }

    this.toggle.setAttribute("aria-expanded", this.isOpen);

    // Prévenir le scroll en arrière-plan sur mobile
    document.body.style.overflow = this.isOpen ? "hidden" : "";
  }

  closeMenu() {
    if (this.isOpen) {
      this.isOpen = false;
      this.nav.classList.remove(CLASSES.open);
      this.toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  }

  setActiveLink() {
    const currentPath = window.location.pathname;
    const links = this.nav.querySelectorAll(".nav-link");

    links.forEach((link) => {
      const href = link.getAttribute("href");
      const isActive =
        currentPath === href || (href !== "/" && currentPath.includes(href));
      link.classList.toggle(`nav-link--${CLASSES.active}`, isActive);
    });
  }

  handleScroll() {
    const header = this.nav.closest(".site-header");
    const scrolled = window.scrollY > 50;
    header?.classList.toggle("header--scrolled", scrolled);
  }

}

export default Navigation;

// Exports nommés supplémentaires
export const BREAKPOINTS = {
  mobile: "768px",
  tablet: "1024px",
  desktop: "1200px",
};
