export class Modal {
  constructor(options = {}) {
    this.options = {
      closeOnOverlay: true,
      closeOnEscape: true,
      showCloseButton: true,
      animationDuration: 300,
      focusTrap: true,
      ...options,
    };

    this.isOpen = false;
    this.previousFocus = null;
    this.modal = null;
    this.focusableElements = [];

    this.createModal();
    this.bindEvents();
  }

  createModal() {
    this.modal = document.createElement("div");
    this.modal.className = "modal";
    this.modal.setAttribute("role", "dialog");
    this.modal.setAttribute("aria-modal", "true");
    this.modal.setAttribute("aria-hidden", "true");

    this.modal.innerHTML = `
          <div class="modal__backdrop"></div>
          <div class="modal__container">
              <div class="modal__content">
                  ${
                    this.options.showCloseButton
                      ? '<button class="modal__close" aria-label="Fermer la modal">&times;</button>'
                      : ""
                  }
                  <div class="modal__body"></div>
              </div>
          </div>
      `;

    document.body.appendChild(this.modal);

    // Cache elements
    this.backdrop = this.modal.querySelector(".modal__backdrop");
    this.container = this.modal.querySelector(".modal__container");
    this.content = this.modal.querySelector(".modal__content");
    this.body = this.modal.querySelector(".modal__body");
    this.closeButton = this.modal.querySelector(".modal__close");
  }

  bindEvents() {
    // Fermeture par clic sur backdrop
    if (this.options.closeOnOverlay) {
      this.backdrop.addEventListener("click", () => this.close());
    }

    // Fermeture par bouton
    if (this.closeButton) {
      this.closeButton.addEventListener("click", () => this.close());
    }

    // Fermeture par Escape
    if (this.options.closeOnEscape) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) {
          this.close();
        }
      });
    }

    // Gestion du focus trap
    if (this.options.focusTrap) {
      this.modal.addEventListener("keydown", (e) => {
        this.handleFocusTrap(e);
      });
    }
  }

  open(content, title = "") {
    if (this.isOpen) return;

    // Stocker le focus actuel
    this.previousFocus = document.activeElement;

    // Définir le contenu
    this.setContent(content, title);

    // Prévenir le scroll de la page
    document.body.style.overflow = "hidden";

    // Afficher la modal
    this.modal.setAttribute("aria-hidden", "false");
    this.modal.classList.add("modal--opening");

    // Animation d'ouverture
    requestAnimationFrame(() => {
      this.modal.classList.add("modal--open");
      this.modal.classList.remove("modal--opening");
    });

    this.isOpen = true;

    // Focus management
    setTimeout(() => {
      this.setupFocusTrap();
      this.focusFirstElement();
    }, this.options.animationDuration);

    // Event pour tracking
    this.dispatchEvent("modal:opened");
  }

  close() {
    if (!this.isOpen) return;

    // Animation de fermeture
    this.modal.classList.add("modal--closing");
    this.modal.classList.remove("modal--open");

    setTimeout(() => {
      this.modal.setAttribute("aria-hidden", "true");
      this.modal.classList.remove("modal--closing");

      // Restaurer le scroll
      document.body.style.overflow = "";

      // Restaurer le focus
      if (this.previousFocus) {
        this.previousFocus.focus();
      }

      this.isOpen = false;

      // Event pour tracking
      this.dispatchEvent("modal:closed");
    }, this.options.animationDuration);
  }

  setContent(content, title = "") {
    if (title) {
      this.modal.setAttribute("aria-labelledby", "modal-title");
      this.body.innerHTML = `
              <h2 id="modal-title" class="modal__title">${title}</h2>
              <div class="modal__content-body">${content}</div>
          `;
    } else {
      this.body.innerHTML = content;
    }
  }

  setupFocusTrap() {
    // Trouve tous les éléments focusables
    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "textarea:not([disabled])",
      "select:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ");

    this.focusableElements = Array.from(
      this.modal.querySelectorAll(focusableSelectors)
    );
  }

  handleFocusTrap(e) {
    if (e.key !== "Tab" || this.focusableElements.length === 0) return;

    const firstElement = this.focusableElements[0];
    const lastElement =
      this.focusableElements[this.focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  focusFirstElement() {
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
  }

  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    this.modal.dispatchEvent(event);
  }

  destroy() {
    if (this.modal && this.modal.parentNode) {
      this.modal.parentNode.removeChild(this.modal);
    }
  }
}
