export class TabSystem {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      console.warn("Tab container not found");
      return;
    }

    this.tabs = this.container.querySelectorAll('[role="tab"]');
    this.panels = this.container.querySelectorAll('[role="tabpanel"]');
    this.activeIndex = 0;

    this.init();
  }

  init() {
    this.setupAccessibility();
    this.bindEvents();
    this.activateTab(0);
  }

  setupAccessibility() {
    // Configuration ARIA pour les tabs
    this.tabs.forEach((tab, index) => {
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");
      tab.setAttribute("id", `tab-${index}`);

      // Association tab-panel
      const panel = this.panels[index];
      if (panel) {
        panel.setAttribute("aria-labelledby", `tab-${index}`);
        panel.setAttribute("hidden", "");
      }
    });

    // Premier tab focusable
    if (this.tabs[0]) {
      this.tabs[0].setAttribute("tabindex", "0");
    }
  }

  bindEvents() {
    this.tabs.forEach((tab, index) => {
      // Clic
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        this.activateTab(index);
      });

      // Navigation clavier
      tab.addEventListener("keydown", (e) => {
        this.handleKeydown(e, index);
      });
    });
  }

  handleKeydown(e, currentIndex) {
    let newIndex = currentIndex;

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        newIndex = (currentIndex + 1) % this.tabs.length;
        break;

      case "ArrowLeft":
        e.preventDefault();
        newIndex = (currentIndex - 1 + this.tabs.length) % this.tabs.length;
        break;

      case "Home":
        e.preventDefault();
        newIndex = 0;
        break;

      case "End":
        e.preventDefault();
        newIndex = this.tabs.length - 1;
        break;

      case "Enter":
      case " ":
        e.preventDefault();
        this.activateTab(currentIndex);
        return;

      default:
        return;
    }

    this.tabs[newIndex].focus();
  }

  activateTab(index) {
    if (index < 0 || index >= this.tabs.length) return;

    // Désactiver tous les tabs
    this.tabs.forEach((tab, i) => {
      const isActive = i === index;

      tab.setAttribute("aria-selected", isActive.toString());
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
      tab.classList.toggle("active", isActive);

      // Panels correspondants
      const panel = this.panels[i];
      if (panel) {
        if (isActive) {
          panel.removeAttribute("hidden");
          panel.classList.add("active");
        } else {
          panel.setAttribute("hidden", "");
          panel.classList.remove("active");
        }
      }
    });

    this.activeIndex = index;

    // Animation smooth si supportée
    if ("scrollBehavior" in document.documentElement.style) {
      this.panels[index]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }

  // API publique
  getActiveTab() {
    return this.activeIndex;
  }

  setActiveTab(index) {
    this.activateTab(index);
  }

  destroy() {
    this.tabs.forEach((tab) => {
      tab.removeEventListener("click", this.handleClick);
      tab.removeEventListener("keydown", this.handleKeydown);
    });
  }
}
