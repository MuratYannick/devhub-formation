export class AppState {
  constructor() {
    this.state = {
      currentFilter: "all",
      activeProject: null,
      modalOpen: false,
      loading: false,
      projects: [],
      filters: ["all", "html-css", "javascript", "responsive"],
    };

    this.listeners = new Map();
    this.history = [];

    console.log("🏪 AppState initialized");
  }

  // Getter pour accéder au state
  getState(key = null) {
    return key ? this.state[key] : { ...this.state };
  }

  // Setter pour modifier le state
  setState(updates, source = "unknown") {
    const previousState = { ...this.state };

    // Merge des updates
    this.state = { ...this.state, ...updates };

    // Historique pour debug
    this.history.push({
      timestamp: Date.now(),
      source,
      updates,
      previousState,
      newState: { ...this.state },
    });

    // Notifier les listeners
    this.notifyListeners(updates, previousState);

    console.log("🔄 State updated by:", source, updates);
  }

  // Subscribe aux changements d'état
  subscribe(key, callback, componentName = "anonymous") {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }

    const listener = { callback, componentName };
    this.listeners.get(key).push(listener);

    console.log(`👂 ${componentName} listening to '${key}'`);

    // Retourner une fonction de désabonnement
    return () => {
      const listeners = this.listeners.get(key);
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
        console.log(`🔇 ${componentName} unsubscribed from '${key}'`);
      }
    };
  }

  // Notifier tous les listeners
  notifyListeners(updates, previousState) {
    Object.keys(updates).forEach((key) => {
      const listeners = this.listeners.get(key);
      if (listeners) {
        listeners.forEach(({ callback, componentName }) => {
          try {
            callback(this.state[key], previousState[key]);
          } catch (error) {
            console.error(
              `❌ Error in ${componentName} listener for '${key}':`,
              error
            );
          }
        });
      }
    });
  }

  // Actions spécifiques métier
  setFilter(filter, source = "FilterComponent") {
    if (this.state.currentFilter === filter) return;

    this.setState(
      {
        currentFilter: filter,
        loading: true,
      },
      source
    );

    // Simuler un délai de filtrage
    setTimeout(() => {
      this.setState({ loading: false }, source);
    }, 300);
  }

  openProject(project, source = "ProjectCard") {
    this.setState(
      {
        activeProject: project,
        modalOpen: true,
      },
      source
    );
  }

  closeProject(source = "Modal") {
    this.setState(
      {
        activeProject: null,
        modalOpen: false,
      },
      source
    );
  }

  loadProjects(projects, source = "DataLoader") {
    this.setState(
      {
        projects,
        loading: false,
      },
      source
    );
  }

  // Utilitaires de debug
  getHistory() {
    return this.history;
  }

  getStateSnapshot() {
    return {
      state: this.getState(),
      listeners: Array.from(this.listeners.entries()).map(
        ([key, listeners]) => ({
          key,
          listenersCount: listeners.length,
          components: listeners.map((l) => l.componentName),
        })
      ),
      historyLength: this.history.length,
    };
  }

  reset() {
    this.setState(
      {
        currentFilter: "all",
        activeProject: null,
        modalOpen: false,
        loading: false,
      },
      "AppState.reset"
    );
  }
}

// Instance singleton
export const appState = new AppState();
