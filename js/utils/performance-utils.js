class PerformanceUtils {
  static throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;

    return function (...args) {
      const currentTime = Date.now();

      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  static debounce(func, delay) {
    let timeoutId;

    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Intersection Observer pour lazy loading
  static createLazyLoader(options = {}) {
    const defaultOptions = {
      root: null,
      rootMargin: "50px",
      threshold: 0.1,
    };

    const config = { ...defaultOptions, ...options };

    return new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;

          // Images lazy loading
          if (element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute("data-src");
          }

          // Animations on scroll
          if (element.dataset.animate) {
            element.classList.add("animate-in");
          }

          // Stop observing once loaded
          observer.unobserve(element);
        }
      });
    }, config);
  }
}
