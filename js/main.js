/*
===============================================
DevHub - Scripts principaux
Auteur: Yannick MURAT
Date: 2025
Description: Scripts pour navigation responsive et interactions
===============================================
*/

/*
===============================================
SYSTÈME DE VALIDATION DE FORMULAIRES
===============================================

VALIDATION HYBRIDE :
- HTML5 : Validation native pour UX mobile
- JavaScript : Validation temps réel avancée
- CSS : États visuels et animations

RÈGLES DE VALIDATION :
- required : Champs obligatoires
- pattern : Expressions régulières
- minLength/maxLength : Longueur de texte
- email : Format email

FEEDBACK UTILISATEUR :
- Temps réel : validation pendant la saisie
- Visuel : couleurs, animations, icônes
- Accessible : ARIA live regions, focus management

OPTIMISATIONS MOBILE :
- Claviers adaptatifs (inputmode)
- Zoom prevention sur iOS
- Viewport adaptation
- Touch-friendly zones

PERFORMANCE :
- Debounce sur validation temps réel
- Validation asynchrone pour API
- Animation hardware-accelerated
- Memory cleanup
*/

// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", function () {
  // ===== INITIALISATION MOBILE-FIRST =====
  initFormValidation();
  initMobileFormOptimizations();
  initMobileNavigation();
  updateActiveNavigation();
  initSmoothScroll();
  // initTouchOptimizations();
  // initPortfolioFilters();
  initScrollAnimations();
  // initPerformanceMonitoring();

  if (window.location.pathname.endsWith("/contact.html")) {
    document
      .getElementById("contactForm")
      .addEventListener("submit", (e) => e.preventDefault());
  }

  console.log("✅ DevHub scripts initialisés (Mobile-First + Animations)");
  console.log("📱 Device features:", DeviceFeatures);

  console.log(
    "📝 Form validation:",
    document.getElementById("contactForm") ? "Activé" : "Non trouvé"
  );

  debugNavigation();
});

/**
 * Initialise la navigation mobile avec menu hamburger
 */
function initMobileNavigation() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-navigation");
  const menuOverlay = document.querySelector(".menu-overlay");
  const body = document.body;

  if (!menuToggle || !navigation || !menuOverlay) {
    console.warn("⚠️ Éléments de navigation mobile non trouvés");
    return;
  }

  // Fonction pour ouvrir le menu
  function openMenu() {
    menuToggle.classList.add("active");
    navigation.classList.add("active");
    menuOverlay.style.display = "block";
    menuOverlay.classList.add("active");
    body.classList.add("menu-open");

    // Accessibilité
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Fermer le menu de navigation");

    // Focus sur le premier lien de navigation
    const firstNavLink = navigation.querySelector(".nav-link");
    if (firstNavLink) {
      setTimeout(() => firstNavLink.focus(), 300);
    }
  }

  // Fonction pour fermer le menu
  function closeMenu() {
    menuToggle.classList.remove("active");
    navigation.classList.remove("active");
    menuOverlay.classList.remove("active");
    body.classList.remove("menu-open");

    // Masquer l'overlay après l'animation
    setTimeout(() => {
      menuOverlay.style.display = "none";
    }, 300);

    // Accessibilité
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu de navigation");
  }

  // Toggle du menu au clic sur le bouton hamburger
  menuToggle.addEventListener("click", function () {
    const isOpen = navigation.classList.contains("active");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Fermer le menu au clic sur l'overlay
  menuOverlay.addEventListener("click", closeMenu);

  // Fermer le menu au clic sur un lien de navigation
  const navLinks = navigation.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      // Fermer le menu après un petit délai pour voir l'effet
      setTimeout(closeMenu, 150);
    });
  });

  // Fermer le menu avec la touche Échap
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navigation.classList.contains("active")) {
      closeMenu();
      menuToggle.focus(); // Remettre le focus sur le bouton
    }
  });

  // Fermer le menu si on redimensionne vers desktop
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768 && navigation.classList.contains("active")) {
      closeMenu();
    }
  });

  console.log("✅ Navigation mobile initialisée");
}

/**
 * Met à jour les états actifs de navigation selon la page actuelle
 */
function updateActiveNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash;

  navLinks.forEach((link) => {
    link.classList.remove("active");

    const href = link.getAttribute("href");

    // Page d'accueil
    if (
      (currentPath.endsWith("/") || currentPath.endsWith("/index.html")) &&
      href === "#accueil"
    ) {
      link.classList.add("active");
    }
    // Page portfolio
    else if (
      currentPath.includes("portfolio.html") &&
      href.includes("portfolio.html")
    ) {
      link.classList.add("active");
    }
    // Sections avec ancres
    else if (href.startsWith("#") && currentHash === href) {
      link.classList.add("active");
    }
  });

  // Observer pour les sections visibles (scroll spy)
  if ("IntersectionObserver" in window) {
    initScrollSpy();
  }

  console.log("✅ États actifs de navigation mis à jour");
}

/**
 * Initialise le scroll spy pour mettre à jour la navigation selon la section visible
 */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentSection = entry.target.id;

          // Mettre à jour les liens de navigation
          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSection}`) {
              link.classList.add("active");
            }
          });
        }
      });
    },
    {
      threshold: 0.6,
      rootMargin: "-20% 0px -20% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));

  console.log("✅ Scroll spy initialisé");
}

/**
 * Initialise les animations au scroll avec Intersection Observer
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".animate-on-scroll"); // Cible maintenant les éléments avec cette classe

  if (animatedElements.length === 0) {
    console.log(
      "ℹ️ Aucun élément à animer trouvé avec la classe '.animate-on-scroll'."
    );
    return;
  }

  const observerOptions = {
    root: null, // Le viewport est le root
    rootMargin: "0px", // Pas de marge supplémentaire
    threshold: 0.1, // L'élément est considéré visible à 10% de sa hauteur dans le viewport
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // L'élément est visible
        entry.target.classList.add("is-visible");
        // Optionnel: Arrêter d'observer une fois l'animation déclenchée pour des animations non répétitives
        observer.unobserve(entry.target);
      } else {
        // L'élément n'est plus visible (peut être utile pour des animations qui se réinitialisent)
        // Si vous voulez que l'animation se joue une seule fois, ne mettez pas cette ligne
        // Si vous voulez que l'animation se rejoue à chaque fois que l'élément entre/sort du viewport:
        entry.target.classList.remove("is-visible");
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  // Animation spéciale pour la timeline
  const timelineItems = document.querySelectorAll(".timeline li");
  timelineItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.2}s`;

    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("is-visible");
            }, index * 200);
            timelineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    timelineObserver.observe(item);
  });

  console.log(
    "✅ Animations au scroll initialisées avec Intersection Observer."
  );
}

/**
 * Initialise le smooth scroll pour les liens d'ancrage
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Ignorer les liens vides ou "#"
      if (!href || href === "#") return;

      const targetSection = document.querySelector(href);

      if (targetSection) {
        e.preventDefault();

        // Calculer la position avec offset du header
        const headerHeight =
          document.querySelector(".site-header").offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;

        // Smooth scroll
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Mettre à jour l'URL sans recharger
        if (history.pushState) {
          history.pushState(null, null, href);
        }
      }
    });
  });

  console.log("✅ Smooth scroll initialisé");
}

/**
 * Utilitaire pour débugger la navigation
 */
function debugNavigation() {
  console.log("🔍 Debug Navigation:");
  console.log("- Current path:", window.location.pathname);
  console.log("- Current hash:", window.location.hash);
  console.log("- Active links:", document.querySelectorAll(".nav-link.active"));
}

// Fonction globale pour débugger (accessible depuis la console)
window.debugNavigation = debugNavigation;

/**
 * Initialise la validation de formulaire
 */

function initFormValidation() { 
  const form = document.getElementById("contactForm");
  if (!form) return;

  // Éléments du formulaire
  const submitBtn = document.getElementById("submitBtn");
  const resetBtn = document.getElementById("resetBtn");
  // const formStatus = document.getElementById("formStatus");
  const messageTextarea = document.getElementById("message");
  const messageCount = document.getElementById("messageCount");

  // Configuration de validation
  const validationRules = {
    firstName: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-ZÀ-ÿ\s-']+$/,
      errorMessages: {
        required: "Le prénom est obligatoire",
        minLength: "Le prénom doit contenir au moins 2 caractères",
        pattern: "Le prénom ne peut contenir que des lettres",
      },
    },
    lastName: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-ZÀ-ÿ\s-']+$/,
      errorMessages: {
        required: "Le nom est obligatoire",
        minLength: "Le nom doit contenir au moins 2 caractères",
        pattern: "Le nom ne peut contenir que des lettres",
      },
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errorMessages: {
        required: "L'adresse email est obligatoire",
        pattern: "Veuillez saisir une adresse email valide",
      },
    },
    phone: {
      required: false,
      pattern: /^[\d\s\-\+\(\)\.]+$/,
      errorMessages: {
        pattern: "Veuillez saisir un numéro de téléphone valide",
      },
    },
    projectType: {
      required: true,
      errorMessages: {
        required: "Veuillez sélectionner un type de projet",
      },
    },
    subject: {
      required: true,
      minLength: 5,
      maxLength: 100,
      errorMessages: {
        required: "Le sujet est obligatoire",
        minLength: "Le sujet doit contenir au moins 5 caractères",
        maxLength: "Le sujet ne peut pas dépasser 100 caractères",
      },
    },
    message: {
      required: true,
      minLength: 20,
      maxLength: 1000,
      errorMessages: {
        required: "Le message est obligatoire",
        minLength: "Le message doit contenir au moins 20 caractères",
        maxLength: "Le message ne peut pas dépasser 1000 caractères",
      },
    },
    consent: {
      required: true,
      errorMessages: {
        required:
          "Vous devez accepter l'utilisation de vos données personnelles",
      },
    },
  };

  // Validation en temps réel
  Object.keys(validationRules).forEach((fieldName) => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (!field) return;

    // Validation à la perte de focus
    field.addEventListener("blur", () =>
      validateField(field, validationRules[fieldName])
    );

    // Validation pendant la saisie (debounced)
    if (field.type !== "checkbox" && field.type !== "select-one") {
      field.addEventListener(
        "input",
        // debounce(() => {
        //   if (field.value.length > 0) {
        //     validateField(field, validationRules[fieldName]);
        //   }
        // }, 300) 
        // TODO
        console.log("debounce")
      );
    } else {
      field.addEventListener("change", () =>
        validateField(field, validationRules[fieldName])
      );
    }
  });

  // Compteur de caractères pour le message
  if (messageTextarea && messageCount) {
    messageTextarea.addEventListener("input", () => {
      const count = messageTextarea.value.length;
      messageCount.textContent = count;

      const countElement = messageCount.parentElement;
      countElement.classList.remove("warning", "error");

      if (count > 800) {
        countElement.classList.add("warning");
      }
      if (count > 950) {
        countElement.classList.add("error");
      }
    });
  }

  // Soumission du formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (submitBtn.classList.contains("loading")) return;

    // Validation complète du formulaire
    const isFormValid = validateForm(form, validationRules);

    if (!isFormValid) {
      showFormStatus(
        "error",
        "Veuillez corriger les erreurs avant de soumettre le formulaire"
      );

      // Focus sur le premier champ en erreur
      const firstError = form.querySelector(
        ".field-error input, .field-error select, .field-error textarea"
      );
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Simulation de soumission
    await submitForm(form, submitBtn);
  });

  // Reset du formulaire
  resetBtn.addEventListener("click", () => {
    setTimeout(() => {
      clearAllErrors(form);
      hideFormStatus();
      if (messageCount) messageCount.textContent = "0";
    }, 10);
  });

  console.log("✅ Validation de formulaire initialisée");
}


/**
 * Valide un champ individuel
 */

function validateField(field, rules) {
  const fieldContainer = field.closest(".form-field");
  const errorElement = fieldContainer.querySelector(".form-error");
  const value = field.type === "checkbox" ? field.checked : field.value.trim();

  // Nettoyer l'état précédent
  clearFieldError(fieldContainer);

  // Validation required
  if (rules.required) {
    if (!value || value === "" || value === false) {
      showFieldError(
        fieldContainer,
        errorElement,
        rules.errorMessages.required
      );
      return false;
    }
  }

  // Si le champ est vide et non requis, pas d'autres validations
  if (!value && !rules.required) {
    showFieldSuccess(fieldContainer);
    return true;
  }

  // Validation minLength
  if (rules.minLength && value.length < rules.minLength) {
    showFieldError(fieldContainer, errorElement, rules.errorMessages.minLength);
    return false;
  }

  // Validation maxLength
  if (rules.maxLength && value.length > rules.maxLength) {
    showFieldError(fieldContainer, errorElement, rules.errorMessages.maxLength);
    return false;
  }

  // Validation pattern
  if (rules.pattern && !rules.pattern.test(value)) {
    showFieldError(fieldContainer, errorElement, rules.errorMessages.pattern);
    return false;
  }

  // Validation réussie
  showFieldSuccess(fieldContainer);
  return true;
}

/**
 * Valide le formulaire complet
 */

function validateForm(form, validationRules) {
  let isValid = true;

  Object.keys(validationRules).forEach((fieldName) => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (field) {
      const fieldValid = validateField(field, validationRules[fieldName]);
      if (!fieldValid) isValid = false;
    }
  });

  return isValid;
}


/**
 * Affiche une erreur sur un champ
 */

function showFieldError(fieldContainer, errorElement, message) {
  fieldContainer.classList.add("field-error");
  fieldContainer.classList.remove("field-success");

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}


/**
 * Affiche le succès sur un champ
 */

function showFieldSuccess(fieldContainer) {
  fieldContainer.classList.add("field-success");
  fieldContainer.classList.remove("field-error");

  const errorElement = fieldContainer.querySelector(".form-error");
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }
}


/**
 * Nettoie l'erreur d'un champ
 */

function clearFieldError(fieldContainer) {
  fieldContainer.classList.remove("field-error", "field-success");

  const errorElement = fieldContainer.querySelector(".form-error");
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }
}


/**
 * Nettoie toutes les erreurs du formulaire
 */

function clearAllErrors(form) {
  const fieldContainers = form.querySelectorAll(".form-field");
  fieldContainers.forEach((container) => {
    clearFieldError(container);
  });
}


/**
 * Affiche un statut global du formulaire
 */

function showFormStatus(type, message) {
  const formStatus = document.getElementById("formStatus");
  if (!formStatus) return;

  formStatus.className = `form-status ${type}`;
  formStatus.textContent = message;
  formStatus.style.display = "block";

  // Scroll vers le message
  formStatus.scrollIntoView({ behavior: "smooth", block: "center" });

  // Focus pour les lecteurs d'écran
  formStatus.setAttribute("tabindex", "-1");
  formStatus.focus();

  setTimeout(() => {
    formStatus.removeAttribute("tabindex");
  }, 100);
}


/**
 * Masque le statut du formulaire
 */

function hideFormStatus() {
  const formStatus = document.getElementById("formStatus");
  if (formStatus) {
    formStatus.style.display = "none";
  }
}


/**
 * Simule la soumission du formulaire
 */

async function submitForm(form, submitBtn) {
  try {
    // État de chargement
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;
    showFormStatus("loading", "Envoi de votre message en cours...");

    // Simuler une requête réseau
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulation : 90% de succès
    const success = Math.random() > 0.1;

    if (success) {
      // Succès
      showFormStatus(
        "success",
        "✅ Votre message a été envoyé avec succès ! Je vous répondrai dans les 24h."
      );
      form.reset();
      clearAllErrors(form);

      // Reset du compteur de caractères
      const messageCount = document.getElementById("messageCount");
      if (messageCount) messageCount.textContent = "0";

      // Suivi analytics (si implémenté)
      console.log("📊 Formulaire soumis avec succès");
    } else {
      // Erreur simulée
      showFormStatus(
        "error",
        "❌ Une erreur est survenue lors de l'envoi. Veuillez réessayer ou me contacter directement par email."
      );
    }
  } catch (error) {
    console.error("Erreur lors de la soumission:", error);
    showFormStatus(
      "error",
      "❌ Une erreur technique est survenue. Veuillez réessayer plus tard."
    );
  } finally {
    // Restaurer l'état du bouton
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;
  }
}

// Gestion du clavier virtuel mobile
function initMobileFormOptimizations() {
  if (!DeviceFeatures.isMobile) return;
  
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  // Adaptation viewport pour iOS quand le clavier apparaît
  const viewport = document.querySelector('meta[name=viewport]');
  const originalViewport = viewport.getAttribute('content');
  
  form.addEventListener('focusin', (e) => {
      if (e.target.matches('input, textarea, select')) {
          // Empêcher le zoom sur iOS
          viewport.setAttribute('content', 
              'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
          
          // Scroll vers le champ avec délai pour le clavier
          setTimeout(() => {
              e.target.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center' 
              });
          }, 300);
      }
  });
  
  form.addEventListener('focusout', (e) => {
      if (e.target.matches('input, textarea, select')) {
          // Restaurer le viewport
          setTimeout(() => {
              viewport.setAttribute('content', originalViewport);
          }, 300);
      }
  });
  
  console.log('📱 Optimisations mobile formulaire activées');
}



