class ComponentFactory {
  static createCard({ title, description, image, link, tags = [] }) {
    const card = ContentManager.createElement("article", {
      classes: ["portfolio-card", "card"],
      attributes: { "data-component": "portfolio-card" },
    });

    const cardContent = `
          <div class="card-image">
              <img src="${image}" alt="${title}" loading="lazy">
          </div>
          <div class="card-content">
              <h3 class="card-title">${title}</h3>
              <p class="card-description">${description}</p>
              <div class="card-tags">
                  ${tags
                    .map((tag) => `<span class="tag">${tag}</span>`)
                    .join("")}
              </div>
              <a href="${link}" class="card-link">Voir le projet</a>
          </div>
      `;

    card.innerHTML = cardContent;
    return card;
  }

  static createTabPanel({ id, title, content, active = false }) {
    const panel = ContentManager.createElement("div", {
      classes: ["tab-panel", active ? "active" : "hidden"],
      attributes: {
        id: id,
        role: "tabpanel",
        "aria-labelledby": `${id}-tab`,
      },
    });

    panel.innerHTML = `
          <h3 class="tab-title">${title}</h3>
          <div class="tab-content">${content}</div>
      `;

    return panel;
  }
}
