import { appState } from "../core/appState.js";

export class PortfolioFilter {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.filterButtons = [];
    this.projectCards = [];
    this.activeFilter = "all";
    this.state = appState;
    this.unsubscribe = [];

    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.subscribeToState();
    this.setupInitialState();

    console.log("🔍 PortfolioFilter connected to state");
    console.log("🔍 PortfolioFilter initialized");
  }

  subscribeToState() {
    // Écouter les changements de filtre depuis d'autres composants
    const unsubFilter = this.state.subscribe(
      "currentFilter",
      (newFilter, oldFilter) => {
        if (newFilter !== oldFilter) {
          this.syncFilterWithState(newFilter);
        }
      },
      "PortfolioFilter"
    );

    // Écouter l'état de loading
    const unsubLoading = this.state.subscribe(
      "loading",
      (isLoading) => {
        this.handleLoadingState(isLoading);
      },
      "PortfolioFilter"
    );

    this.unsubscribe.push(unsubFilter, unsubLoading);
  }

  cacheElements() {
    this.filterButtons = document.querySelectorAll(".filter-btn");
    this.projectCards = document.querySelectorAll(".project-card");
    this.resultCount = document.querySelector(".results-count");

    // Validation des éléments critiques
    if (!this.filterButtons.length) {
      console.warn("❌ Aucun bouton de filtre trouvé");
      return false;
    }

    if (!this.projectCards.length) {
      console.warn("❌ Aucune carte de projet trouvée");
      return false;
    }

    return true;
  }

  bindEvents() {
    this.filterButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleFilterClick(btn);
      });

      // Support navigation clavier
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.handleFilterClick(btn);
        }
      });
    });

    // Raccourcis clavier globaux
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardShortcuts(e);
    });
  }

  handleFilterClick(clickedButton) {
    const newFilter = clickedButton.dataset.filter;

    this.state.setFilter(newFilter, "PortfolioFilter.handleFilterClick");

    if (newFilter === this.activeFilter) {
      console.log("🔄 Filtre déjà actif:", newFilter);
      return;
    }

    this.updateActiveButton(clickedButton);
    this.applyFilter(newFilter);
    this.activeFilter = newFilter;

    // Analytics/tracking
    this.trackFilterUsage(newFilter);
  }

  syncFilterWithState(filter) {
    // Synchroniser l'UI avec le state global
    this.updateActiveButton(filter);
    this.applyFilter(filter);
  }

  updateActiveButton(activeButton) {
    // Supprimer l'état actif de tous les boutons
    this.filterButtons.forEach((btn) => {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive.toString());
    });

    // Activer le bouton cliqué
    activeButton.classList.add("active");
    activeButton.setAttribute("aria-pressed", "true");

    // Animation de focus
    activeButton.style.transform = "scale(0.95)";
    setTimeout(() => {
      activeButton.style.transform = "";
    }, 150);
  }

  handleLoadingState(isLoading) {
    this.filterButtons.forEach((btn) => {
      btn.disabled = isLoading;
      if (isLoading) {
        btn.classList.add("loading");
      } else {
        btn.classList.remove("loading");
      }
    });
  }

  applyFilter(filterValue) {
    let visibleCount = 0;
    const animationDelay = 50; // Délai entre les animations

    // Première passe : masquer tous les éléments
    this.projectCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
      }, index * 20);
    });

    // Deuxième passe : afficher les éléments filtrés
    setTimeout(() => {
      this.projectCards.forEach((card, index) => {
        const shouldShow = this.shouldShowCard(card, filterValue);

        if (shouldShow) {
          setTimeout(() => {
            this.showCard(card);
            visibleCount++;
          }, index * animationDelay);
        } else {
          this.hideCard(card);
        }
      });

      // Mettre à jour le compteur après toutes les animations
      setTimeout(() => {
        this.updateResultCount(visibleCount, filterValue);
      }, this.projectCards.length * animationDelay + 200);
    }, 300);
  }

  shouldShowCard(card, filter) {
    if (filter === "all") return true;

    // Support multiple catégories par projet
    const categories = card.dataset.category || "";
    const technologies = card.dataset.technologies || "";

    return categories.includes(filter) || technologies.includes(filter);
  }

  showCard(card) {
    card.style.display = "block";
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    // Animation d'apparition
    requestAnimationFrame(() => {
      card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    });

    // Animer l'image si elle existe
    const img = card.querySelector("img");
    if (img) {
      img.style.transform = "scale(1.02)";
      setTimeout(() => {
        img.style.transform = "scale(1)";
      }, 300);
    }
  }

  hideCard(card) {
    card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    card.style.opacity = "0";
    card.style.transform = "translateY(-10px)";

    setTimeout(() => {
      card.style.display = "none";
    }, 300);
  }

  updateResultCount(count, filter) {
    if (!this.resultCount) return;

    const filterName = this.getFilterDisplayName(filter);
    const text =
      count === 0
        ? `Aucun projet trouvé pour "${filterName}"`
        : `${count} projet${count > 1 ? "s" : ""} • ${filterName}`;

    this.resultCount.textContent = text;

    // Animation du compteur
    this.resultCount.style.transform = "scale(0.9)";
    this.resultCount.style.opacity = "0.7";

    setTimeout(() => {
      this.resultCount.style.transform = "scale(1)";
      this.resultCount.style.opacity = "1";
    }, 100);
  }

  getFilterDisplayName(filter) {
    const displayNames = {
      all: "Tous les projets",
      "html-css": "HTML/CSS",
      javascript: "JavaScript",
      responsive: "Responsive Design",
      react: "React",
      api: "API Integration",
    };

    return displayNames[filter] || filter;
  }

  // Support raccourcis clavier
  handleKeyboardShortcuts(e) {
    // Raccourcis numériques pour les filtres
    const shortcuts = {
      1: "all",
      2: "html-css",
      3: "javascript",
      4: "responsive",
    };

    if (e.altKey && shortcuts[e.key]) {
      e.preventDefault();
      const targetButton = document.querySelector(
        `[data-filter="${shortcuts[e.key]}"]`
      );
      if (targetButton) {
        this.handleFilterClick(targetButton);
      }
    }
  }
  // Méthodes utilitaires
  trackFilterUsage(filter) {
    console.log(`📊 Filtre utilisé: ${filter}`);
    // Ici vous pourriez envoyer des analytics
  }

  reset() {
    this.activeFilter = "all";
    this.applyFilter("all");

    // Réactiver le bouton "Tous"
    const allButton = document.querySelector('[data-filter="all"]');
    if (allButton) {
      this.updateActiveButton(allButton);
    }
  }

  destroy() {
    // Nettoyer les subscriptions
    this.unsubscribe.forEach((unsub) => unsub());
    console.log("🔍 PortfolioFilter disconnected from state");
  }
}
