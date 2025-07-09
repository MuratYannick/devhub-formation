export class PortfolioFilterTests {
  constructor() {
    this.filter = null;
    this.testResults = [];
  }

  async runAllTests() {
    console.log("🧪 Démarrage des tests PortfolioFilter...");

    try {
      await this.setupTestEnvironment();

      this.testInitialization();
      this.testFilterLogic();
      this.testAccessibility();
      this.testPerformance();

      this.displayResults();
    } catch (error) {
      console.error("❌ Erreur lors des tests:", error);
    }
  }

  setupTestEnvironment() {
    // Créer un environnement de test minimal
    const testHTML = `
          <div class="portfolio-filters">
              <button class="filter-btn active" data-filter="all">Tous</button>
              <button class="filter-btn" data-filter="javascript">JavaScript</button>
          </div>
          <div class="portfolio-grid">
              <div class="project-card" data-category="javascript"></div>
              <div class="project-card" data-category="html-css"></div>
          </div>
          <div class="results-count"></div>
      `;

    document.body.insertAdjacentHTML("beforeend", testHTML);
    this.filter = new PortfolioFilter(".portfolio-filters");
  }

  testInitialization() {
    const passed =
      this.filter &&
      this.filter.filterButtons.length > 0 &&
      this.filter.projectCards.length > 0;

    this.addTestResult("Initialisation", passed);
  }

  testFilterLogic() {
    // Test filtre "JavaScript"
    const jsCard = document.querySelector('[data-category="javascript"]');
    const shouldShow = this.filter.shouldShowCard(jsCard, "javascript");

    this.addTestResult("Logique de filtrage", shouldShow === true);
  }

  testAccessibility() {
    const activeButton = document.querySelector(".filter-btn.active");
    const hasAriaPressed = activeButton.getAttribute("aria-pressed") === "true";

    this.addTestResult("Accessibilité ARIA", hasAriaPressed);
  }

  testPerformance() {
    const start = performance.now();
    this.filter.applyFilter("javascript");
    const duration = performance.now() - start;

    this.addTestResult("Performance (<50ms)", duration < 50);
  }

  addTestResult(testName, passed) {
    this.testResults.push({ name: testName, passed });
    console.log(`${passed ? "✅" : "❌"} ${testName}`);
  }

  displayResults() {
    const passed = this.testResults.filter((t) => t.passed).length;
    const total = this.testResults.length;

    console.log(`\n🎯 Tests terminés: ${passed}/${total} réussis`);

    if (passed === total) {
      console.log("🎉 Tous les tests passent !");
    } else {
      console.warn("⚠️ Certains tests ont échoué");
    }
  }
}
