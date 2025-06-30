/**
 * DeviceFeatures - Utilitaire de détection des capacités navigateur et appareil
 * Utilisé dans les séquences 7 et 8 du DevHub
 *
 * Usage:
 * - Inclure ce fichier avant main.js
 * - Utiliser DeviceFeatures.propriété dans votre code
 */

const DeviceFeatures = {
  // ===== DÉTECTION TYPE D'APPAREIL =====

  /**
   * Détecte si l'appareil est mobile
   * @returns {boolean}
   */
  get isMobile() {
    return (
      window.innerWidth <= 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
    );
  },

  /**
   * Détecte si l'appareil est une tablette
   * @returns {boolean}
   */
  get isTablet() {
    return (
      window.innerWidth > 768 &&
      window.innerWidth <= 1024 &&
      navigator.maxTouchPoints &&
      navigator.maxTouchPoints > 0
    );
  },

  /**
   * Détecte si l'appareil est desktop
   * @returns {boolean}
   */
  get isDesktop() {
    return !this.isMobile && !this.isTablet;
  },

  /**
   * Détecte si l'appareil supporte le touch
   * @returns {boolean}
   */
  get isTouchDevice() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  },

  // ===== DÉTECTION SYSTÈME D'EXPLOITATION =====

  /**
   * Détecte iOS
   * @returns {boolean}
   */
  get isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  },

  /**
   * Détecte Android
   * @returns {boolean}
   */
  get isAndroid() {
    return /Android/.test(navigator.userAgent);
  },

  /**
   * Détecte Safari
   * @returns {boolean}
   */
  get isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  },

  // ===== SUPPORT DES APIs MODERNES =====

  /**
   * Vérifie le support d'Intersection Observer
   * Utilisé pour les animations au scroll (séquence 7)
   * @returns {boolean}
   */
  get supportsIntersectionObserver() {
    return (
      "IntersectionObserver" in window && "IntersectionObserverEntry" in window
    );
  },

  /**
   * Vérifie le support de Resize Observer
   * @returns {boolean}
   */
  get supportsResizeObserver() {
    return "ResizeObserver" in window;
  },

  /**
   * Vérifie le support de CSS Grid
   * @returns {boolean}
   */
  get supportsGrid() {
    return CSS && CSS.supports && CSS.supports("display", "grid");
  },

  /**
   * Vérifie le support des CSS Custom Properties (variables)
   * @returns {boolean}
   */
  get supportsCustomProperties() {
    return CSS && CSS.supports && CSS.supports("color", "var(--test)");
  },

  /**
   * Vérifie le support du localStorage
   * @returns {boolean}
   */
  get supportsLocalStorage() {
    try {
      return "localStorage" in window && window.localStorage !== null;
    } catch (e) {
      return false;
    }
  },

  /**
   * Vérifie le support de l'API Fetch
   * @returns {boolean}
   */
  get supportsFetch() {
    return "fetch" in window;
  },

  /**
   * Vérifie le support des Service Workers
   * @returns {boolean}
   */
  get supportsServiceWorker() {
    return "serviceWorker" in navigator;
  },

  // ===== DÉTECTION PRÉFÉRENCES UTILISATEUR =====

  /**
   * Détecte si l'utilisateur préfère les animations réduites
   * Important pour l'accessibilité (séquence 7)
   * @returns {boolean}
   */
  get prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  },

  /**
   * Détecte la préférence de thème sombre
   * @returns {boolean}
   */
  get prefersDarkMode() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  },

  /**
   * Détecte si l'utilisateur préfère moins de transparence
   * @returns {boolean}
   */
  get prefersReducedTransparency() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-transparency: reduce)").matches
    );
  },

  // ===== INFORMATIONS SUR LA CONNEXION =====

  /**
   * Détecte une connexion lente
   * @returns {boolean}
   */
  get isSlowConnection() {
    if ("connection" in navigator) {
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
      return (
        connection &&
        (connection.effectiveType === "slow-2g" ||
          connection.effectiveType === "2g" ||
          connection.saveData === true)
      );
    }
    return false;
  },

  /**
   * Obtient des informations sur la connexion
   * @returns {object|null}
   */
  get connectionInfo() {
    if ("connection" in navigator) {
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
      return connection
        ? {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            saveData: connection.saveData,
          }
        : null;
    }
    return null;
  },

  // ===== INFORMATIONS SUR L'ÉCRAN =====

  /**
   * Obtient la taille de l'écran
   * @returns {object}
   */
  get screenSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
    };
  },

  /**
   * Détecte un écran haute densité (Retina, etc.)
   * @returns {boolean}
   */
  get isHighDensityScreen() {
    return window.devicePixelRatio && window.devicePixelRatio > 1.5;
  },

  // ===== MÉTHODES UTILITAIRES =====

  /**
   * Initialise les listeners pour les changements de taille d'écran
   * @param {function} callback - Fonction appelée lors du resize
   */
  onResize(callback) {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(callback, 150); // Debounce
    });
  },

  /**
   * Initialise les listeners pour les changements de préférences
   * @param {function} callback - Fonction appelée lors du changement
   */
  onPreferenceChange(callback) {
    if (window.matchMedia) {
      // Écouter les changements de thème
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", callback);
      // Écouter les changements de préférence d'animation
      window
        .matchMedia("(prefers-reduced-motion: reduce)")
        .addEventListener("change", callback);
    }
  },

  /**
   * Retourne un résumé de toutes les détections
   * Utile pour le debugging
   * @returns {object}
   */
  getInfo() {
    return {
      device: {
        isMobile: this.isMobile,
        isTablet: this.isTablet,
        isDesktop: this.isDesktop,
        isTouchDevice: this.isTouchDevice,
        isIOS: this.isIOS,
        isAndroid: this.isAndroid,
        isSafari: this.isSafari,
      },
      support: {
        intersectionObserver: this.supportsIntersectionObserver,
        resizeObserver: this.supportsResizeObserver,
        grid: this.supportsGrid,
        customProperties: this.supportsCustomProperties,
        localStorage: this.supportsLocalStorage,
        fetch: this.supportsFetch,
        serviceWorker: this.supportsServiceWorker,
      },
      preferences: {
        reducedMotion: this.prefersReducedMotion,
        darkMode: this.prefersDarkMode,
        reducedTransparency: this.prefersReducedTransparency,
      },
      connection: {
        isSlowConnection: this.isSlowConnection,
        info: this.connectionInfo,
      },
      screen: this.screenSize,
    };
  },
};

// ===== INITIALISATION =====

// Log des informations de base au chargement (en mode développement)
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  console.log("🔍 DeviceFeatures détectées:", DeviceFeatures.getInfo());
}

// Export pour utilisation en module (optionnel)
if (typeof module !== "undefined" && module.exports) {
  module.exports = DeviceFeatures;
}

// Rendre DeviceFeatures disponible globalement
window.DeviceFeatures = DeviceFeatures;
