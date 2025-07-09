class StyleManager {
  static toggleClass(element, className, force = null) {
    if (!element || !className) return false;

    if (force !== null) {
      element.classList.toggle(className, force);
    } else {
      element.classList.toggle(className);
    }

    return element.classList.contains(className);
  }

  static setStyles(element, styles) {
    if (!element || typeof styles !== "object") return false;

    Object.entries(styles).forEach(([property, value]) => {
      element.style[property] = value;
    });

    return true;
  }

  static resetStyles(element, properties) {
    if (!element) return false;

    properties.forEach((prop) => {
      element.style[prop] = "";
    });

    return true;
  }
}
