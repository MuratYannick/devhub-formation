import { UIComponents } from "./ui-components.js";
import { MobileMenu } from "./mobile-menu.js";
import { TabSystem } from "./tab-system.js";

class DevHubApp {
  constructor() {
    this.ui = new UIComponents();
    this.init();
  }

  async init() {
    try {
      // Attendre le DOM
      await this.waitForDOM();

      // Enregistrer les composants
      this.registerComponents();

      // Initialiser tout
      await this.ui.initAll();

      // Setup global features
      this.setupGlobalFeatures();

      console.log("🚀 DevHub App initialized successfully");
    } catch (error) {
      console.error("❌ App initialization failed:", error);
    }
  }

  waitForDOM() {
    return new Promise((resolve) => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
      } else {
        resolve();
      }
    });
  }

  registerComponents() {
    this.ui.register("mobile-menu", MobileMenu);
    this.ui.register("tab-system", TabSystem);
  }

  setupGlobalFeatures() {
    // Performance monitoring
    this.setupPerformanceTracking();

    // Error handling global
    this.setupErrorHandling();

    // Accessibility enhancements
    this.setupA11yFeatures();
  }

  setupPerformanceTracking() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === "largest-contentful-paint") {
            console.log("LCP:", entry.startTime);
          }
        });
      });

      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    }
  }

  setupErrorHandling() {
    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      event.preventDefault();
    });
  }

  setupA11yFeatures() {
    // Skip links
    const skipLink = document.querySelector(".skip-link");
    if (skipLink) {
      skipLink.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute("href"));
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    // Focus management
    this.setupFocusManagement();
  }

  setupFocusManagement() {
    let lastFocusedElement = null;

    document.addEventListener("focusin", (e) => {
      lastFocusedElement = e.target;
    });

    // Restaurer le focus après modal/menu
    window.addEventListener("modal-closed", () => {
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    });
  }
}

// Auto-init
const app = new DevHubApp();
export default app;
