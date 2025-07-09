export class UIComponents {
  constructor() {
    this.components = new Map();
    this.eventManager = new EventManager();
  }

  // Registre des composants
  register(name, component) {
    if (this.components.has(name)) {
      console.warn(`Component ${name} already registered`);
      return false;
    }

    this.components.set(name, component);
    return true;
  }

  // Initialisation automatique
  initAll() {
    const promises = [];

    this.components.forEach((Component, name) => {
      try {
        const selector = `[data-component="${name}"]`;
        const elements = document.querySelectorAll(selector);

        elements.forEach((element) => {
          const instance = new Component(element, this.eventManager);
          promises.push(instance.init?.() || Promise.resolve());
        });

        console.log(`✅ Component ${name} initialized`);
      } catch (error) {
        console.error(`❌ Failed to initialize ${name}:`, error);
      }
    });

    return Promise.all(promises);
  }

  // Nettoyage
  destroy() {
    this.eventManager.removeAllListeners();
    this.components.clear();
  }
}
