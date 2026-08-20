const { siteContent } = window;

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const assetPath = (path) => (path && !path.startsWith("http") ? `../${path}` : path);

const publicationLinkAttrs = (url) => url && url.startsWith("http") ? ' target="_blank" rel="noreferrer"' : "";

function setupThemeToggle() {
  const button = document.querySelector("#theme-toggle");
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.dataset.theme = saved;
  if (!button) return;

  button.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  });
}

function renderResearchPage() {
  const id = document.body.dataset.researchId;
  const detail = siteContent.researchDetails.find((item) => item.id === id);
  const publicationTitles = detail?.publicationTitles || (detail?.publicationTitle ? [detail.publicationTitle] : []);
  const publications = publicationTitles
    .map((title) => siteContent.publications.find((item) => item.title === title))
    .filter(Boolean);
  const root = document.querySelector("#research-page-root");
  if (!root || !detail) return;

  document.title = `${detail.title} | Zirui Li`;
  root.innerHTML = `
    <section class="research-page-hero" aria-labelledby="research-page-title">
      <a class="research-page-back" href="../index.html#research"><i data-lucide="arrow-left"></i><span>Research</span></a>
      <p class="section-kicker">${escapeHtml(detail.pillar)}</p>
      <h1 id="research-page-title">${escapeHtml(detail.title)}</h1>
      <div class="research-page-meta">
        <span>${escapeHtml(detail.pillar)}</span>
        ${detail.status ? `<span>${escapeHtml(detail.status)}</span>` : ""}
      </div>
    </section>

    <section class="research-page-section">
      <p class="section-kicker">Overview</p>
      <p class="research-page-overview">${escapeHtml(detail.text)}</p>
    </section>

    <section class="research-page-visual" aria-label="Research figure">
      <p class="section-kicker">Framework</p>
      <figure class="research-page-figure">
        <img src="${escapeHtml(assetPath(detail.image))}" alt="${escapeHtml(detail.title)}">
      </figure>
    </section>

    ${detail.highlights ? `
      <section class="research-page-section">
        <p class="section-kicker">Highlights</p>
        <ul class="research-page-highlights">
          ${detail.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </section>
    ` : ""}

    ${publications.length ? `
      <section class="research-page-section">
        <p class="section-kicker">Publications</p>
        <div class="research-page-publication-list">
          ${publications.map((publication) => `
            <article class="research-page-publication">
              ${publication.image ? `<img src="${escapeHtml(assetPath(publication.image))}" alt="${escapeHtml(publication.venue)} journal thumbnail">` : ""}
              <div>
                <h2>${escapeHtml(publication.title)}</h2>
                <p class="authors">${escapeHtml(publication.authors)}</p>
                <p class="venue">${escapeHtml(publication.venue)}</p>
                <div class="pill-row">${(publication.tags || []).filter((tag) => tag !== "Featured").map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}</div>
                ${publication.doi ? `<a class="research-page-resource" href="${escapeHtml(publication.doi)}"${publicationLinkAttrs(publication.doi)}>DOI / Link</a>` : ""}
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    ` : ""}
  `;
}

window.addEventListener("DOMContentLoaded", () => {
  renderResearchPage();
  setupThemeToggle();
  if (window.lucide) window.lucide.createIcons();
});
