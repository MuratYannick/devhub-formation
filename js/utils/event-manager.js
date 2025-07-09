class EventManager {
  constructor() {
    this.listeners = new Map();
    this.setupGlobalListeners();
  }

  // Ajout d'événement avec nettoyage automatique
  addListener(element, event, handler, options = {}) {
    if (!element || !event || typeof handler !== "function") {
      console.warn("Invalid parameters for event listener");
      return false;
    }

    const wrappedHandler = (e) => {
      try {
        handler(e);
      } catch (error) {
        console.error("Event handler error:", error);
      }
    };

    element.addEventListener(event, wrappedHandler, options);

    // Stockage pour nettoyage ultérieur
    const key = `${element.tagName}-${event}`;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners
      .get(key)
      .push({ element, event, handler: wrappedHandler, options });

    return true;
  }

  // Event delegation pour les éléments dynamiques
  delegate(parent, selector, event, handler) {
    const delegatedHandler = (e) => {
      const target = e.target.closest(selector);
      if (target && parent.contains(target)) {
        handler.call(target, e);
      }
    };

    this.addListener(parent, event, delegatedHandler);
  }

  // Nettoyage des événements
  removeAllListeners() {
    this.listeners.forEach((listeners) => {
      listeners.forEach(({ element, event, handler, options }) => {
        element.removeEventListener(event, handler, options);
      });
    });
    this.listeners.clear();
  }

  setupGlobalListeners() {
    // Gestion globale des erreurs
    window.addEventListener("error", (e) => {
      console.error("Global error:", e.error);
    });

    // Optimisation performance sur scroll
    let scrollTimeout;
    window.addEventListener(
      "scroll",
      () => {
        if (scrollTimeout) return;

        scrollTimeout = setTimeout(() => {
          this.handleScroll();
          scrollTimeout = null;
        }, 16); // 60fps
      },
      { passive: true }
    );
  }

  handleScroll() {
    // Logique de scroll optimisée
    const scrollY = window.pageYOffset;
    document.documentElement.style.setProperty("--scroll-y", `${scrollY}px`);
  }
}
