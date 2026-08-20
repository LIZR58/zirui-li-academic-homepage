const { siteContent } = window;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const linkAttrs = (url) => url.startsWith("http") ? ' target="_blank" rel="noreferrer"' : "";

const renderLinks = (links = []) => {
  if (!links.length) return "";
  return `<div class="card-links">${links.map((link) => `<a href="${escapeHtml(link.url)}"${linkAttrs(link.url)}>${escapeHtml(link.label)}</a>`).join("")}</div>`;
};

const formatDate = (date) => escapeHtml(date).replace(/; /g, ";<br>");

const renderResearchPapers = (link) => {
  if (link.papers?.length) {
    return `
      <div class="research-paper-row" aria-label="Related publications">
        ${link.papers.map((paper) => `
          <a class="research-paper-chip" href="${escapeHtml(paper.url)}"${linkAttrs(paper.url)}>
            <span>${escapeHtml(paper.label)}</span>
          </a>
        `).join("")}
      </div>
    `;
  }

  if (link.paperNote) {
    return `
      <div class="research-paper-row" aria-label="Publication status">
        <span class="research-paper-chip research-paper-chip-muted">${escapeHtml(link.paperNote)}</span>
      </div>
    `;
  }

  return "";
};

const researchCardHeadline = (theme) => ({
  "Infrastructure Resilience": "Modeling resilience and recovery in socio-technical infrastructure",
  "AI for Engineering Management": "Learning from multimodal and scarce engineering data",
  "Human Factor Engineering": "Recognizing human states for safer engineering systems"
}[theme.title] || theme.text);

function renderResearchThemes() {
  const root = document.querySelector("#research-themes");
  root.innerHTML = siteContent.researchThemes
    .map((theme, themeIndex) => `
      <article class="theme-card research-pillar">
        <div class="research-card-title">
          <p class="card-kicker">${escapeHtml(theme.title)}</p>
        </div>
        <div class="pillar-media">
          <img src="${escapeHtml(theme.image)}" alt="${escapeHtml(theme.title)}">
          <span>${String(themeIndex + 1).padStart(2, "0")}</span>
        </div>
        <div class="pillar-copy">
          <h3>${escapeHtml(researchCardHeadline(theme))}</h3>
          ${theme.links ? `
            <ul class="research-focus-list">
              ${theme.links.map((link) => `
                <li class="research-focus-item${link.url ? "" : " research-focus-item-muted"}">
                  <div>
                    ${link.url ? `
                      <a class="research-focus-title" href="${escapeHtml(link.url)}">${escapeHtml(link.title)}</a>
                    ` : `
                      <span class="research-focus-title">${escapeHtml(link.title)}</span>
                    `}
                    ${link.note ? `<em class="research-focus-note">(${escapeHtml(link.note).toLowerCase()})</em>` : ""}
                  </div>
                </li>
              `).join("")}
            </ul>
          ` : ""}
          <div class="method-row">${(theme.methods || theme.points || []).map((point) => `<span>${escapeHtml(point)}</span>`).join("")}</div>
        </div>
      </article>
    `)
    .join("");
}

function renderProjects() {
  const root = document.querySelector("#project-grid");
  root.innerHTML = siteContent.projects
    .map((project) => {
      const isLeadProjectGroup = /Research Projects - Lead/i.test(project.category || "");
      return `
      <section class="project-section">
        <div class="project-section-head">
          <span class="project-icon"><i data-lucide="${escapeHtml(project.icon || "folder-kanban")}"></i></span>
          <div>
            <h3>${escapeHtml(project.category)}</h3>
          </div>
        </div>
        <div class="project-content">
          <div class="project-items">
            ${project.items.map((item) => {
        const hasStudentLeader = /\bstudent leader\b/i.test(item.meta || "");
        const meta = hasStudentLeader
          ? item.meta
              .replace(/\s*\|\s*Student leader\s*\|\s*/i, " | ")
              .replace(/\s*\|\s*Student leader\s*$/i, "")
              .replace(/^Student leader\s*\|\s*/i, "")
          : item.meta;

        return `
          <div class="project-item${item.logo ? " project-item-with-logo" : ""}">
            <div class="project-item-head">
              <div class="project-tag-row">
                <span class="project-period">${escapeHtml(item.period)}</span>
                ${item.level ? `<span class="project-level">${escapeHtml(item.level)}</span>` : ""}
                ${isLeadProjectGroup ? `<span class="project-role-tag">Leader</span>` : ""}
                ${hasStudentLeader ? `<span class="project-role-tag">Student leader</span>` : ""}
              </div>
            </div>
            <div class="project-item-body">
              <div class="project-title-row">
                <strong>${escapeHtml(item.title)}</strong>
              </div>
              <small>${escapeHtml(meta)}</small>
            </div>
            ${item.logo ? `<img class="project-sponsor-logo" src="${escapeHtml(item.logo)}" alt="${escapeHtml(item.logoAlt || item.title)}">` : ""}
          </div>
        `;
      }).join("")}
          </div>
          ${project.image ? `<img class="project-group-image" src="${escapeHtml(project.image)}" alt="${escapeHtml(project.imageAlt || project.category)}">` : ""}
        </div>
      </section>
    `;
    })
    .join("");
}

function publicationTemplate(pub) {
  const tags = pub.tags
    .filter((tag) => tag !== "Featured")
    .map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`)
    .join("");
  const doiLink = pub.doi ? `<a href="${escapeHtml(pub.doi)}"${linkAttrs(pub.doi)}>DOI / Link</a>` : "";
  const pdfLink = "";
  const image = pub.image ? `<img src="${escapeHtml(pub.image)}" alt="${escapeHtml(pub.venue)} journal thumbnail">` : "";
  const insight = pub.abstract || pub.highlightImage ? `
    <details class="publication-insight">
      <summary>Abstract & Figure</summary>
      <div class="publication-insight-panel">
        ${pub.abstract ? `<p>${escapeHtml(pub.abstract)}</p>` : ""}
        ${pub.highlightImage ? `<img src="${escapeHtml(pub.highlightImage)}" alt="${escapeHtml(pub.title)} highlight figure">` : ""}
      </div>
    </details>
  ` : "";
  return `
    <article class="publication" data-categories="${escapeHtml(pub.categories.join(" "))}">
      <div class="pub-media">
        ${image}
        <span class="pub-year">${escapeHtml(pub.year)}</span>
      </div>
      <div>
        <h3>${escapeHtml(pub.title)}</h3>
        <p class="authors">${escapeHtml(pub.authors)}</p>
        <p class="venue">${escapeHtml(pub.venue)}</p>
        <div class="publication-meta-row">
          <div class="pill-row">${tags}</div>
          <div class="publication-actions">${doiLink}${pdfLink}</div>
        </div>
        ${insight}
      </div>
    </article>
  `;
}

function renderPublications() {
  const root = document.querySelector("#publication-list");
  const additionalOrder = [
    "A feature-level fusion-based multimodal analysis of recognition and classification of awkward working postures in construction",
    "Critical success factors for the implementation of urban regeneration REITs in China: A TISM-MICMAC based approach",
    "Leadership under building information modeling-enabled construction projects (BECPs): An examination of owners' leadership behaviors",
    "Defect trigger identification in a construction digital twin using quality linked data and iterative deviation computation",
    "A vision-based approach to assessing worker ergonomics in low-light construction environments",
    "Knowledge management in construction quality management: Current state, challenges, and future directions",
    "Physical Fatigue Assessment (PFA) for Construction Workers with AI and Sensory Techniques",
    "Optimizing resilience for urban metro system via deep reinforcement learning: A socio-technical perspective",
    "Developing joint-level scoring models tailored to whole-body ergonomic assessment of construction workers"
  ];
  const primary = siteContent.publications
    .filter((pub) => pub.primaryRank)
    .sort((a, b) => a.primaryRank - b.primaryRank);
  const additional = siteContent.publications
    .filter((pub) => !pub.primaryRank)
    .sort((a, b) => additionalOrder.indexOf(a.title) - additionalOrder.indexOf(b.title));

  root.innerHTML = `
    <div class="publication-group">
      ${primary.map(publicationTemplate).join("")}
    </div>
    <details class="publication-details">
      <summary>Additional co-authored publications and conference/book outputs</summary>
      <div class="publication-group compact-publications">
        ${additional.map(publicationTemplate).join("")}
      </div>
    </details>
  `;
}

function renderNews() {
  const root = document.querySelector("#news-grid");
  const card = (item) => {
    const images = item.images && item.images.length ? item.images : [item.image];
    const gallery = images.length > 1
      ? `<div class="news-gallery">${images.slice(1, 5).map((image) => `<img src="${escapeHtml(image)}" alt="${escapeHtml(item.title)} supporting image">`).join("")}</div>`
      : "";
    return `
      <article class="news-card">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
        <div>
          <span class="news-date">${escapeHtml(item.date)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
          ${gallery}
        </div>
      </article>
    `;
  };
  const visibleItems = siteContent.news.slice(0, 6);
  const hiddenItems = siteContent.news.slice(6);
  root.innerHTML = `
    ${visibleItems.map(card).join("")}
    ${hiddenItems.length ? `
      <details class="news-more">
        <summary>More News & Academic Activities</summary>
        <div class="news-more-grid">
          ${hiddenItems.map(card).join("")}
        </div>
      </details>
    ` : ""}
  `;
}

function renderTimeline() {
  const root = document.querySelector("#timeline");
  const groups = siteContent.timeline.reduce((acc, item) => {
    const group = item.group || "Experience";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  root.innerHTML = Object.entries(groups)
    .map(([group, items]) => `
      <section class="timeline-group">
        <h3>${escapeHtml(group)}</h3>
        <div class="timeline-items">
          ${items.map((item) => {
            const logo = item.logo ? `<img class="timeline-logo" src="${escapeHtml(item.logo)}" alt="${escapeHtml(item.logoAlt || item.organization)}">` : "";
            return `
              <article class="timeline-item">
                <div class="timeline-brand">${logo}</div>
                <div class="timeline-content">
                  <h4>${escapeHtml(item.title)}</h4>
                  <p><strong>${escapeHtml(item.organization)}</strong></p>
                  <p>${escapeHtml(item.text)}</p>
                </div>
                <div class="timeline-date">${formatDate(item.date)}</div>
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `)
    .join("");
}

function renderRecognitionLegacyUnused() {
  const root = document.querySelector("#recognition-grid");
  const groups = siteContent.recognitionSections.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  root.innerHTML = Object.entries(groups)
    .map(([category, items]) => `
      <section class="recognition-group">
        <div class="recognition-group-head">
          <span>${escapeHtml(category)}</span>
          <strong>${items.length}</strong>
        </div>
        <div class="recognition-items">
          ${items.map((item) => `
            <article class="recognition-item ${category === "Honors & Awards" ? "award-list-item" : ""}">
              <div class="recognition-copy">
                <div class="recognition-meta">
                  <small>${escapeHtml(item.period)}</small>
                </div>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.detail)}</p>
                ${renderLinks(item.links)}
              </div>
              ${category === "Honors & Awards" ? "" : `
                <div class="recognition-images">
                  ${(item.images || []).slice(0, 4).map((image) => `<img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}">`).join("")}
                </div>
              `}
            </article>
          `).join("")}
          ${category === "Honors & Awards" ? `
            <section class="award-certificate-gallery" aria-label="Award certificates">
              <div class="award-gallery-heading">
                <span>Award Certificates</span>
                <p>Selected certificate evidence for listed honors and awards.</p>
              </div>
              <div class="award-gallery-grid">
                ${items.flatMap((item) => (item.images || []).map((image) => `
                  <figure>
                    <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}">
                    <figcaption>${escapeHtml(item.period)} · ${escapeHtml(item.title)}</figcaption>
                  </figure>
                `)).join("")}
              </div>
            </section>
          ` : ""}
        </div>
      </section>
    `)
    .join("");
}

function renderRecognition() {
  const root = document.querySelector("#recognition-grid");
  root.innerHTML = siteContent.recognitionSections
    .map((item) => `
      <section class="recognition-group recognition-feature ${item.journals ? "service-feature" : "honor-feature"}">
        <div class="recognition-copy">
          <h3>${escapeHtml(item.title)}</h3>
          ${item.detail ? `<p>${escapeHtml(item.detail)}</p>` : ""}
          ${item.bullets ? `
            <ul class="recognition-bullets">
              ${item.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
            </ul>
          ` : ""}
          ${item.journals ? `
            <ul class="journal-list">
              ${item.journals.map((journal) => `
                <li class="journal-item">
                  <strong>${escapeHtml(journal.name)}</strong>
                  <span>${escapeHtml(journal.metric)}</span>
                </li>
              `).join("")}
            </ul>
          ` : ""}
        </div>
        <figure class="recognition-visual">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt || item.title)}">
        </figure>
      </section>
    `)
    .join("");
}

function renderSkills() {
  const root = document.querySelector("#skill-tags");
  if (!root) return;
  root.innerHTML = siteContent.skills.map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join("");
}

function setupThemeToggle() {
  const button = document.querySelector("#theme-toggle");
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.dataset.theme = saved;
  button.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  renderResearchThemes();
  renderProjects();
  renderPublications();
  renderNews();
  renderTimeline();
  renderRecognition();
  renderSkills();
  setupThemeToggle();
  document.querySelector("#year").textContent = new Date().getFullYear();
  if (window.lucide) window.lucide.createIcons();
});
