import { Modal } from "./Modal.js";
import { appState } from "../core/appState.js";


export class ProjectModal extends Modal {
  constructor() {
    super({
      closeOnOverlay: true,
      closeOnEscape: true,
      animationDuration: 400,
    });

    this.currentProject = null;
    this.imageGallery = null;

    this.state = appState;
    this.unsubscribe = [];
    this.setupProjectModal();
    this.subscribeToState();
  }

  subscribeToState() {
    // Écouter l'ouverture/fermeture de modal
    const unsubModal = this.state.subscribe(
      "modalOpen",
      (isOpen) => {
        if (isOpen && this.state.getState("activeProject")) {
          this.showProject(this.state.getState("activeProject"));
        } else if (!isOpen && this.isOpen) {
          this.close();
        }
      },
      "ProjectModal"
    );

    this.unsubscribe.push(unsubModal);
  }

  setupProjectModal() {
    // Ajouter des classes spécifiques
    this.modal.classList.add("project-modal");

    // Event listeners pour navigation par clavier
    this.modal.addEventListener("keydown", (e) => {
      this.handleProjectNavigation(e);
    });
  }

  showProject(projectData) {
    this.currentProject = projectData;
    const content = this.generateProjectContent(projectData);
    this.open(content, projectData.title);

    // Setup de la galerie après ouverture
    setTimeout(() => {
      this.setupImageGallery();
    }, this.options.animationDuration + 100);
  }

  generateProjectContent(project) {
    return `
            <div class="project-modal__content">
                <div class="project-modal__header">
                    <div class="project-meta">
                        <span class="project-category">${this.formatCategory(
                          project.category
                        )}</span>
                        <span class="project-date">${
                          project.date || "Récent"
                        }</span>
                    </div>
                    <div class="project-technologies">
                        ${project.technologies
                          .map(
                            (tech) => `<span class="tech-tag">${tech}</span>`
                          )
                          .join("")}
                    </div>
                </div>
                
                <div class="project-modal__body">
                    <div class="project-image-section">
                        <div class="project-main-image">
                            <img src="${project.image}" alt="${
      project.title
    }" loading="lazy">
                            <div class="image-overlay">
                                <button class="btn-zoom" aria-label="Agrandir l'image">
                                    <span class="sr-only">Voir en grand</span>
                                    🔍
                                </button>
                            </div>
                        </div>
                        ${
                          project.gallery
                            ? this.generateGallery(project.gallery)
                            : ""
                        }
                    </div>
                    
                    <div class="project-details-section">
                        <div class="project-description">
                            <h3>Description</h3>
                            <p>${project.description}</p>
                        </div>
                        
                        ${
                          project.details
                            ? this.generateDetailsSection(project.details)
                            : ""
                        }
                        
                        <div class="project-links">
                            ${
                              project.demoUrl
                                ? `<a href="${project.demoUrl}" class="btn btn-primary" target="_blank" rel="noopener">
                                <span>Voir le projet</span>
                                <span aria-hidden="true">↗</span>
                            </a>`
                                : ""
                            }
                            
                            ${
                              project.codeUrl
                                ? `<a href="${project.codeUrl}" class="btn btn-secondary" target="_blank" rel="noopener">
                                <span>Code source</span>
                                <span aria-hidden="true">⚡</span>
                            </a>`
                                : ""
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  generateDetailsSection(details) {
    return `
            <div class="project-details">
                <h3>Détails du projet</h3>
                <dl class="details-list">
                    ${
                      details.duration
                        ? `
                        <dt>Durée</dt>
                        <dd>${details.duration}</dd>
                    `
                        : ""
                    }
                    
                    ${
                      details.role
                        ? `
                        <dt>Rôle</dt>
                        <dd>${details.role}</dd>
                    `
                        : ""
                    }
                    
                    ${
                      details.challenges
                        ? `
                        <dt>Défis relevés</dt>
                        <dd>${details.challenges}</dd>
                    `
                        : ""
                    }
                    
                    ${
                      details.learned
                        ? `
                        <dt>Apprentissages</dt>
                        <dd>${details.learned}</dd>
                    `
                        : ""
                    }
                </dl>
            </div>
        `;
  }

  generateGallery(gallery) {
    return `
            <div class="project-gallery">
                <h4>Captures d'écran</h4>
                <div class="gallery-grid">
                    ${gallery
                      .map(
                        (img, index) => `
                        <button class="gallery-item" data-index="${index}">
                            <img src="${img.thumb || img.url}" alt="${
                          img.alt || `Capture ${index + 1}`
                        }" loading="lazy">
                        </button>
                    `
                      )
                      .join("")}
                </div>
            </div>
        `;
  }

  setupImageGallery() {
    const galleryItems = this.modal.querySelectorAll(".gallery-item");

    galleryItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        this.openLightbox(index);
      });
    });
  }

  openLightbox(index) {
    // Implémentation simple de lightbox
    const images = this.currentProject.gallery;
    if (!images || !images[index]) return;

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = `
            <div class="lightbox__backdrop"></div>
            <div class="lightbox__content">
                <img src="${images[index].url}" alt="${
      images[index].alt || ""
    }">
                <button class="lightbox__close" aria-label="Fermer">&times;</button>
                <div class="lightbox__nav">
                    <button class="lightbox__prev" aria-label="Image précédente">‹</button>
                    <span class="lightbox__counter">${index + 1} / ${
      images.length
    }</span>
                    <button class="lightbox__next" aria-label="Image suivante">›</button>
                </div>
            </div>
        `;

    document.body.appendChild(lightbox);

    // Events pour la lightbox
    lightbox.querySelector(".lightbox__close").addEventListener("click", () => {
      lightbox.remove();
    });

    lightbox
      .querySelector(".lightbox__backdrop")
      .addEventListener("click", () => {
        lightbox.remove();
      });

    requestAnimationFrame(() => {
      lightbox.classList.add("lightbox--open");
    });
  }

  handleProjectNavigation(e) {
    // Navigation entre projets avec flèches
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      this.showPreviousProject();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      this.showNextProject();
    }
  }

  showPreviousProject() {
    // TODO À implémenter selon votre logique de navigation
    console.log("🡸 Projet précédent");
  }

  showNextProject() {
    // TODO À implémenter selon votre logique de navigation
    console.log("🡺 Projet suivant");
  }

  formatCategory(category) {
    const categories = {
      "html-css": "HTML/CSS",
      javascript: "JavaScript",
      responsive: "Responsive",
      react: "React",
      api: "API",
    };

    return categories[category] || category;
  }

  close() {
    super.close();
    // Mettre à jour le state global
    this.state.closeProject("ProjectModal.close");
  }

  destroy() {
    this.unsubscribe.forEach((unsub) => unsub());
    super.destroy();
    console.log("📱 ProjectModal disconnected from state");
  }
}
