export class MobileMenu {
  constructor(options = {}) {
    this.options = {
      toggleSelector: ".menu-toggle",
      menuSelector: ".navigation",
      breakpoint: 768,
      animationDuration: 300,
      ...options,
    };

    this.isOpen = false;
    this.init();
  }

  init() {
    this.toggle = document.querySelector(this.options.toggleSelector);
    this.menu = document.querySelector(this.options.menuSelector);

    if (!this.toggle || !this.menu) {
      console.warn("Menu elements not found");
      return;
    }

    this.setupElements();
    this.bindEvents();
    this.setupAccessibility();
  }

  setupElements() {
    // Configuration ARIA
    this.toggle.setAttribute("aria-expanded", "false");
    this.toggle.setAttribute("aria-controls", this.menu.id || "mobile-menu");

    if (!this.menu.id) {
      this.menu.id = "mobile-menu";
    }

    // Classes CSS initiales
    this.menu.classList.add("mobile-menu");
    this.toggle.classList.add("menu-toggle");
  }

  bindEvents() {
    // Clic sur le bouton
    this.toggle.addEventListener("click", (e) => {
      e.preventDefault();
      this.toggleMenu();
    });

    // Échappement clavier
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.closeMenu();
      }
    });

    // Clic extérieur
    document.addEventListener("click", (e) => {
      if (
        this.isOpen &&
        !this.menu.contains(e.target) &&
        !this.toggle.contains(e.target)
      ) {
        this.closeMenu();
      }
    });

    // Redimensionnement
    window.addEventListener("resize", () => {
      if (window.innerWidth > this.options.breakpoint && this.isOpen) {
        this.closeMenu();
      }
    });

    // Navigation au clavier dans le menu
    this.setupKeyboardNavigation();
  }

  setupKeyboardNavigation() {
    const menuLinks = this.menu.querySelectorAll("a, button");

    menuLinks.forEach((link, index) => {
      link.addEventListener("keydown", (e) => {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            const nextIndex = (index + 1) % menuLinks.length;
            menuLinks[nextIndex].focus();
            break;

          case "ArrowUp":
            e.preventDefault();
            const prevIndex = (index - 1 + menuLinks.length) % menuLinks.length;
            menuLinks[prevIndex].focus();
            break;

          case "Enter":
          case " ":
            if (e.target.tagName === "A") {
              this.closeMenu();
            }
            break;
        }
      });
    });
  }

  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.isOpen = true;
    this.menu.classList.add("menu-open");
    this.toggle.classList.add("menu-active");
    this.toggle.setAttribute("aria-expanded", "true");

    // Focus sur le premier élément du menu
    const firstLink = this.menu.querySelector("a, button");
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }

    // Empêcher le scroll du body
    document.body.style.overflow = "hidden";
  }

  closeMenu() {
    this.isOpen = false;
    this.menu.classList.remove("menu-open");
    this.toggle.classList.remove("menu-active");
    this.toggle.setAttribute("aria-expanded", "false");

    // Restaurer le scroll
    document.body.style.overflow = "";

    // Retour focus sur le bouton
    this.toggle.focus();
  }

  setupAccessibility() {
    // Annonce pour les lecteurs d'écran
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    document.body.appendChild(announcement);

    this.announcement = announcement;
  }
}
