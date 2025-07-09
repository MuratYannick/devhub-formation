class ContentManager {
  static updateText(element, text) {
    if (element && typeof text === "string") {
      element.textContent = text;
      return true;
    }
    return false;
  }

  static updateHTML(element, html) {
    if (element && typeof html === "string") {
      // Sanitization en production recommandée
      element.innerHTML = html;
      return true;
    }
    return false;
  }

  static createElement(tag, options = {}) {
    const element = document.createElement(tag);

    // Attributs
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    // Classes
    if (options.classes) {
      element.classList.add(...options.classes);
    }

    // Contenu
    if (options.text) element.textContent = options.text;
    if (options.html) element.innerHTML = options.html;

    return element;
  }
}
