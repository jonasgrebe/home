(function () {
  const content = window.SITE_CONTENT;
  const publicationGrid = document.querySelector("#publication-grid");
  const filters = document.querySelector("#publication-filters");
  const count = document.querySelector("#archive-count");
  const themeToggle = document.querySelector(".theme-toggle");
  const newsList = document.querySelector("#news-list");
  const lifecycleMap = document.querySelector("#lifecycle-map");
  const projectMapToggle = document.querySelector(".project-map-toggle");
  const workSection = document.querySelector("#work");
  const archivePulseLayer = document.querySelector(".archive-pulse-layer");
  const progress = document.querySelector("#scroll-progress");
  const heroWorld = document.querySelector(".hero-world");
  const heroDeck = document.querySelector("#hero-deck");
  const fogwoodSection = document.querySelector("#fogwood");
  const fogwoodEnvironment = document.querySelector("#fogwood .fogwood-environment");
  const fogwoodReel = document.querySelector("#fogwood-reel");
  const experiencePath = document.querySelector(".experience-path");
  const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
  const mobileNavPanel = document.querySelector(".mobile-nav-panel");
  const activePublicationFilters = new Set();
  const thumperTimers = new WeakMap();

  function renderNews() {
    if (!content.news.length) {
      newsList.innerHTML = `
        <div class="news-empty">
          <span class="news-date">Open log</span>
          <span class="news-rail" aria-hidden="true"></span>
          <div>
            <span class="news-kind">Awaiting update</span>
            <h3>The next milestone will appear here.</h3>
          </div>
        </div>
      `;
      return;
    }

    function newsEntryTemplate(item, index, prominent = false) {
      const externalAttributes = item.external
        ? `target="_blank" rel="noreferrer"`
        : "";
      const arrow = item.external ? "↗" : "↓";

      return `
        <a class="news-entry${prominent && index === 0 ? " is-featured" : ""}" href="${item.url}" ${externalAttributes}>
          <time class="news-date">${item.date}</time>
          <span class="news-rail" aria-hidden="true"></span>
          <div class="news-copy">
            <div class="news-meta">
              <span class="news-kind">${item.type}</span>
              <span class="news-location">${item.location}</span>
            </div>
            <h3>${item.title}</h3>
            <p>${item.detail}</p>
          </div>
          <span class="news-arrow" aria-hidden="true">${arrow}</span>
        </a>
      `;
    }

    const featuredNews = content.news.filter((item) => item.featured);
    const compactNews = featuredNews.length ? featuredNews : content.news.slice(0, 3);
    const remainingNews = content.news.filter((item) => !compactNews.includes(item));
    const remainingLabel = String(remainingNews.length).padStart(2, "0");

    newsList.innerHTML = `
      <div class="news-primary">
        ${compactNews.map((item, index) => newsEntryTemplate(item, index, true)).join("")}
      </div>
      ${remainingNews.length ? `
        <details class="news-more">
          <summary>
            <span class="news-summary-dot" aria-hidden="true">+</span>
            <span>
              <small>${remainingLabel} further updates</small>
              <b class="news-summary-closed">Show all news</b>
              <b class="news-summary-open">Collapse news</b>
            </span>
          </summary>
          <div class="news-more-list">
            ${remainingNews.map((item, index) => newsEntryTemplate(item, index)).join("")}
          </div>
        </details>
      ` : ""}
    `;
  }

  function publicationTemplate(publication) {
    const links = (publication.links || []).map((link) =>
      `<a href="${link.url}" target="_blank" rel="noreferrer">${link.label} ↗</a>`
    ).join("");
    const publicationLinks = links
      ? `<div class="publication-links">${links}</div>`
      : `<div class="publication-links publication-links-pending"><span>Details to follow</span></div>`;
    const motifs = (publication.motifs || []).map((motif) =>
      `<span class="venue-motif venue-motif-${motif.type}" aria-hidden="true">${motif.glyph}</span>`
    ).join("");
    const secondaryVenue = publication.secondaryVenue
      ? `<span class="secondary-venue">${publication.secondaryVenue}</span>`
      : "";
    const distinction = publication.distinction
      ? `<span class="publication-distinction">${publication.distinction}</span>`
      : "";
    const detailLabel = publication.stealth ? "Project note" : "Abstract preview";

    return `
      <article class="publication-card${publication.stealth ? " is-stealth" : ""}" id="publication-${publication.id}" data-publication-id="${publication.id}" data-tags="${publication.tags.map((tag) => tag.toLowerCase()).join("|")}">
        <div class="publication-card-inner">
          <div class="publication-face publication-front">
            <div class="publication-art ${publication.art}" aria-hidden="true">
              <span class="art-label">${publication.artLabel}</span>
              <i class="art-shape-a"></i>
              <i class="art-shape-b"></i>
              ${motifs ? `<span class="venue-motifs">${motifs}</span>` : ""}
            </div>
            <div class="publication-body">
              <div class="publication-meta">
                <span>${publication.index} / ${publication.year}</span>
                <span class="venue-stack">
                  <span class="venue-primary">
                    <strong class="venue-badge ${publication.venueType}">${publication.venue}</strong>
                    ${distinction}
                  </span>
                  ${secondaryVenue}
                </span>
              </div>
              <h3>${publication.title}</h3>
              <p class="publication-authors">${publication.authors}</p>
              <p class="publication-summary">${publication.summary}</p>
              <div class="publication-tags">${publication.tags.map((tag) => `<span data-tag="${tag.toLowerCase()}">${tag}</span>`).join("")}</div>
              ${publicationLinks}
              <button class="publication-flip-toggle" type="button" aria-label="Flip card" aria-expanded="false">
                <b aria-hidden="true">↻</b>
              </button>
            </div>
          </div>
          <div class="publication-face publication-back" aria-hidden="true">
            <div class="publication-meta">
              <span>${publication.index} / ${publication.year}</span>
              <span class="venue-primary">
                <strong class="venue-badge ${publication.venueType}">${publication.venue}</strong>
                ${distinction}
              </span>
            </div>
            <span class="publication-detail-label">${detailLabel}</span>
            <h3>${publication.title}</h3>
            <p class="publication-detail-copy">${publication.abstractExcerpt}</p>
            <div class="publication-tags">${publication.tags.map((tag) => `<span data-tag="${tag.toLowerCase()}">${tag}</span>`).join("")}</div>
            ${publicationLinks}
            <button class="publication-flip-toggle" type="button" aria-label="Flip card back">
              <b aria-hidden="true">↻</b>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function renderLifecycle() {
    if (!lifecycleMap || !content.lifecycle) return;
    const publicationById = new Map(content.publications.map((publication) => [publication.id, publication]));
    const stages = content.lifecycle.stages.map((stage) => `
      <div
        class="lifecycle-stage lifecycle-stage-${stage.kind}"
        data-stage="${stage.id}"
        style="--stage-x:${stage.x}%; --stage-mx:${stage.mx}%; --stage-my:${stage.my}%"
      >
        <span class="lifecycle-stage-core" aria-hidden="true"></span>
        <strong>${stage.label}</strong>
        ${stage.detail ? `<small>${stage.detail}</small>` : ""}
      </div>
    `).join("");

    const projects = content.lifecycle.projects.map((project) => {
      const publication = publicationById.get(project.id);
      const title = publication ? publication.title : project.label;
      const tags = publication ? publication.tags.join("|").toLowerCase() : "";
      const venueLabel = publication
        ? publication.venueType === "conference"
          ? publication.venue.split("·")[0].trim().replace(/\s20(\d{2})$/, " '$1")
          : publication.stealth || publication.venue.toLowerCase().includes("progress")
            ? "WIP"
            : publication.venue.toLowerCase().startsWith("arxiv")
              ? "arXiv"
              : "Preprint"
        : "";
      return `
        <a
          class="lifecycle-project"
          href="#publication-${project.id}"
          data-lifecycle-project="${project.id}"
          data-targets="${project.targets.join("|")}"
          data-tags="${tags}"
          data-note="${project.note}"
          style="--project-x:${project.x}%; --project-y:${project.y}%; --project-mx:${project.mx}%; --project-my:${project.my}%"
          aria-label="${title}. ${project.note}"
        >
          <span>${project.label}</span>
          ${venueLabel ? `<small>${venueLabel}</small>` : ""}
        </a>
      `;
    }).join("");

    lifecycleMap.innerHTML = `
      <section class="lifecycle-map" aria-labelledby="lifecycle-title">
        <header class="lifecycle-heading">
          <div>
            <p class="section-kicker">Archive overview</p>
            <h3 id="lifecycle-title">Project map.</h3>
          </div>
          <div class="lifecycle-legend" aria-label="Diagram legend">
            <span><i class="legend-state"></i> Phase</span>
            <span><i class="legend-operation"></i> Transition</span>
          </div>
        </header>
        <div class="lifecycle-plot">
          <div class="lifecycle-axis" aria-hidden="true"></div>
          <div class="lifecycle-connections" aria-hidden="true"></div>
          <div class="lifecycle-stages">${stages}</div>
          <div class="lifecycle-projects">${projects}</div>
        </div>
        <div class="lifecycle-readout" aria-live="polite">
          <strong>Project map</strong>
          <span>Select a title to open its archive card.</span>
        </div>
      </section>
    `;
  }

  function enableLifecycleInteractions() {
    if (!lifecycleMap || !content.lifecycle) return;
    const plot = lifecycleMap.querySelector(".lifecycle-plot");
    const connectionLayer = lifecycleMap.querySelector(".lifecycle-connections");
    const projectLinks = [...lifecycleMap.querySelectorAll(".lifecycle-project")];
    const stageElements = [...lifecycleMap.querySelectorAll(".lifecycle-stage")];
    const readout = lifecycleMap.querySelector(".lifecycle-readout");
    let resizeFrame = 0;

    function drawConnections() {
      if (lifecycleMap.hidden) return;
      const plotBounds = plot.getBoundingClientRect();
      connectionLayer.innerHTML = "";

      projectLinks.forEach((projectLink) => {
        const sourceBounds = projectLink.getBoundingClientRect();
        const sourceX = sourceBounds.left + sourceBounds.width / 2 - plotBounds.left;
        const sourceY = sourceBounds.top + sourceBounds.height / 2 - plotBounds.top;

        projectLink.dataset.targets.split("|").forEach((targetId, targetIndex) => {
          const target = lifecycleMap.querySelector(`[data-stage="${targetId}"]`);
          if (!target) return;
          const targetBounds = target.getBoundingClientRect();
          const targetX = targetBounds.left + targetBounds.width / 2 - plotBounds.left;
          const targetY = targetBounds.top + targetBounds.height / 2 - plotBounds.top;
          const distance = Math.hypot(targetX - sourceX, targetY - sourceY);
          const angle = Math.atan2(targetY - sourceY, targetX - sourceX) * 180 / Math.PI;
          const connection = document.createElement("span");
          connection.className = `lifecycle-connection${targetIndex ? " is-secondary" : ""}`;
          connection.dataset.connectionProject = projectLink.dataset.lifecycleProject;
          connection.style.left = `${sourceX}px`;
          connection.style.top = `${sourceY}px`;
          connection.style.width = `${distance}px`;
          connection.style.transform = `rotate(${angle}deg)`;
          connectionLayer.append(connection);
        });
      });
    }

    function setActiveProject(projectLink) {
      const projectId = projectLink ? projectLink.dataset.lifecycleProject : "";
      const targets = projectLink ? projectLink.dataset.targets.split("|") : [];
      lifecycleMap.classList.toggle("has-active-project", Boolean(projectLink));
      projectLinks.forEach((item) => item.classList.toggle("is-active", item === projectLink));
      stageElements.forEach((stage) => stage.classList.toggle("is-active", targets.includes(stage.dataset.stage)));
      lifecycleMap.querySelectorAll(".lifecycle-connection").forEach((connection) => {
        connection.classList.toggle("is-active", connection.dataset.connectionProject === projectId);
      });

      if (projectLink) {
        readout.querySelector("strong").textContent = projectLink.textContent.trim();
        readout.querySelector("span").textContent = projectLink.dataset.note;
      } else {
        readout.querySelector("strong").textContent = "Project map";
        readout.querySelector("span").textContent = "Select a title to open its archive card.";
      }
    }

    projectLinks.forEach((projectLink) => {
      projectLink.addEventListener("pointerenter", () => setActiveProject(projectLink));
      projectLink.addEventListener("focus", () => setActiveProject(projectLink));
      projectLink.addEventListener("blur", () => setActiveProject(null));
      projectLink.addEventListener("click", () => setFilter("all"));
    });
    plot.addEventListener("pointerleave", () => setActiveProject(null));
    document.addEventListener("publicationcartography", (event) => {
      const projectId = event.detail?.projectId || "";
      const projectLink = projectId
        ? lifecycleMap.querySelector(`[data-lifecycle-project="${projectId}"]`)
        : null;
      setActiveProject(projectLink);
      projectMapToggle?.classList.toggle("is-cartography-active", Boolean(projectLink));
    });

    function scheduleConnectionDraw() {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(drawConnections);
    }

    window.addEventListener("resize", scheduleConnectionDraw, { passive: true });
    if (document.fonts?.ready) document.fonts.ready.then(scheduleConnectionDraw);
    scheduleConnectionDraw();
  }

  function enableProjectMapToggle() {
    if (!projectMapToggle || !lifecycleMap) return;

    projectMapToggle.addEventListener("click", () => {
      const willOpen = lifecycleMap.hidden;
      lifecycleMap.hidden = !willOpen;
      projectMapToggle.setAttribute("aria-expanded", String(willOpen));
      projectMapToggle.querySelector("span").textContent = willOpen ? "Close map" : "Open map";
      projectMapToggle.querySelector("b").textContent = willOpen ? "↖" : "↘";
      if (willOpen) requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    });
  }

  function renderPublications() {
    publicationGrid.innerHTML = content.publications.map(publicationTemplate).join("");
  }

  function setFilter(filterId) {
    if (filterId === "all") {
      activePublicationFilters.clear();
    } else if (activePublicationFilters.has(filterId)) {
      activePublicationFilters.delete(filterId);
    } else {
      activePublicationFilters.add(filterId);
    }

    const cards = [...publicationGrid.querySelectorAll(".publication-card")];
    let visible = 0;

    cards.forEach((card) => {
      const tags = card.dataset.tags.split("|");
      const matches = activePublicationFilters.size === 0
        || [...activePublicationFilters].every((filter) => tags.includes(filter));
      card.hidden = !matches;
      card.querySelectorAll(".publication-tags [data-tag]").forEach((tag) => {
        tag.classList.toggle("is-filter-match", activePublicationFilters.has(tag.dataset.tag));
      });
      if (matches) visible += 1;
    });

    lifecycleMap?.querySelectorAll(".lifecycle-project").forEach((project) => {
      const tags = project.dataset.tags.split("|");
      const matches = activePublicationFilters.size === 0
        || [...activePublicationFilters].every((filter) => tags.includes(filter));
      project.classList.toggle("is-filtered-out", !matches);
    });

    filters.querySelectorAll("button").forEach((button) => {
      const pressed = button.dataset.filter === "all"
        ? activePublicationFilters.size === 0
        : activePublicationFilters.has(button.dataset.filter);
      button.setAttribute("aria-pressed", String(pressed));
    });

    const activeLabel = activePublicationFilters.size
      ? ` · ${String(activePublicationFilters.size).padStart(2, "0")} active`
      : "";
    count.textContent = `${String(visible).padStart(2, "0")} records${activeLabel}`;
  }

  function triggerArchivePulse(sourceButton) {
    if (!workSection || !archivePulseLayer) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const sourceBounds = sourceButton.getBoundingClientRect();
    const workBounds = workSection.getBoundingClientRect();
    const sourceX = sourceBounds.left + sourceBounds.width / 2 - workBounds.left;
    const sourceY = sourceBounds.top + sourceBounds.height / 2 - workBounds.top;
    const matchingCards = [...publicationGrid.querySelectorAll(".publication-card:not([hidden])")];

    archivePulseLayer.querySelector(".archive-pulse")?.remove();

    const cornerDistances = [
      Math.hypot(sourceX, sourceY),
      Math.hypot(workBounds.width - sourceX, sourceY),
      Math.hypot(sourceX, workBounds.height - sourceY),
      Math.hypot(workBounds.width - sourceX, workBounds.height - sourceY)
    ];
    const maximumDistance = Math.max(...cornerDistances, 1);

    const pulse = document.createElement("span");
    pulse.className = "archive-pulse";
    pulse.style.left = `${sourceX}px`;
    pulse.style.top = `${sourceY}px`;
    pulse.style.width = `${maximumDistance * 2}px`;
    pulse.style.height = `${maximumDistance * 2}px`;
    archivePulseLayer.append(pulse);
    pulse.addEventListener("animationend", () => pulse.remove(), { once: true });

    matchingCards.forEach((card) => {
      const bounds = card.getBoundingClientRect();
      const cardX = bounds.left + bounds.width / 2 - workBounds.left;
      const cardY = bounds.top + bounds.height / 2 - workBounds.top;
      const distance = Math.hypot(cardX - sourceX, cardY - sourceY);
      const delay = 90 + distance / maximumDistance * 680;
      const existingTimer = thumperTimers.get(card);
      if (existingTimer) clearTimeout(existingTimer);
      card.classList.remove("is-thumper-hit");
      card.style.setProperty("--thumper-delay", `${delay}ms`);
      void card.offsetWidth;
      card.classList.add("is-thumper-hit");
      thumperTimers.set(card, setTimeout(() => {
        card.classList.remove("is-thumper-hit");
        thumperTimers.delete(card);
      }, delay + 620));
    });
  }

  function renderFilters() {
    filters.innerHTML = content.publicationFilters.map((filter) => `
      <button class="filter-button" type="button" data-filter="${filter.id}" aria-pressed="${filter.id === "all"}">
        ${filter.label}
      </button>
    `).join("");

    filters.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter]");
      if (button) {
        setFilter(button.dataset.filter);
        triggerArchivePulse(button);
      }
    });
  }

  function enablePublicationInteractions() {
    const cards = [...publicationGrid.querySelectorAll(".publication-card")];

    function setFaceInteractive(face, interactive) {
      face.querySelectorAll("a, button").forEach((element) => {
        if (interactive) element.removeAttribute("tabindex");
        else element.setAttribute("tabindex", "-1");
      });
    }

    function setPublicationFlipped(card, flipped) {
      const front = card.querySelector(".publication-front");
      const back = card.querySelector(".publication-back");
      const frontToggle = front.querySelector(".publication-flip-toggle");
      card.classList.toggle("is-flipped", flipped);
      front.setAttribute("aria-hidden", String(flipped));
      back.setAttribute("aria-hidden", String(!flipped));
      frontToggle.setAttribute("aria-expanded", String(flipped));
      setFaceInteractive(front, !flipped);
      setFaceInteractive(back, flipped);
    }

    cards.forEach((card) => {
      setPublicationFlipped(card, false);
      const traceProject = (active) => {
        document.dispatchEvent(new CustomEvent("publicationcartography", {
          detail: { projectId: active ? card.dataset.publicationId : "" }
        }));
      };
      card.addEventListener("pointerenter", () => traceProject(true));
      card.addEventListener("pointerleave", () => traceProject(false));
      card.addEventListener("focusin", () => traceProject(true));
      card.addEventListener("focusout", (event) => {
        if (!card.contains(event.relatedTarget)) traceProject(false);
      });
      card.addEventListener("click", (event) => {
        if (event.target.closest("a")) return;
        setPublicationFlipped(card, !card.classList.contains("is-flipped"));
      });
    });
  }

  function enableOrnithopterFlights() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const craft = [...document.querySelectorAll(".ornithopter")];
    const random = (minimum, maximum) => minimum + Math.random() * (maximum - minimum);
    const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));
    const routes = [
      () => ({ startX: -14, startY: random(58, 94), x: random(130, 150), y: random(-98, -42) }),
      () => ({ startX: 108, startY: random(46, 88), x: random(-150, -128), y: random(-88, -28) }),
      () => ({ startX: random(8, 42), startY: -12, x: random(62, 112), y: random(116, 138) }),
      () => ({ startX: random(62, 92), startY: 108, x: random(-112, -58), y: random(-132, -112) })
    ];

    async function runFlights(item, index) {
      let previousRoute = index * 2;
      await wait(index === 0 ? 2400 : 14000);

      while (document.documentElement.contains(item)) {
        let routeIndex = Math.floor(Math.random() * routes.length);
        if (routeIndex === previousRoute) routeIndex = (routeIndex + 1) % routes.length;
        previousRoute = routeIndex;

        const route = routes[routeIndex]();
        const movementX = route.x * innerWidth;
        const movementY = route.y * innerHeight;
        const rotation = Math.atan2(movementY, movementX) * 180 / Math.PI + 90;
        const startScale = random(.72, .88);
        const endScale = random(.94, 1.08);
        const opacity = random(.13, .19);
        item.style.left = `${route.startX}vw`;
        item.style.top = `${route.startY}vh`;
        const transformAt = (progress, scale) =>
          `translate3d(${route.x * progress}vw, ${route.y * progress}vh, 0) rotate(${rotation}deg) scale(${scale})`;

        const animation = item.animate([
          { opacity: 0, transform: transformAt(0, startScale) },
          { opacity, offset: .1, transform: transformAt(.1, startScale + (endScale - startScale) * .1) },
          { opacity, offset: .88, transform: transformAt(.88, startScale + (endScale - startScale) * .88) },
          { opacity: 0, transform: transformAt(1, endScale) }
        ], {
          duration: random(22000, 31000),
          easing: "linear"
        });

        try {
          await animation.finished;
        } catch {
          return;
        }
        await wait(random(16000, 32000));
      }
    }

    craft.forEach((item, index) => {
      runFlights(item, index);
    });
  }

  function enableMotion() {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    window.addEventListener("scroll", () => {
      const scrollable = document.documentElement.scrollHeight - innerHeight;
      const amount = scrollable > 0 ? scrollY / scrollable : 0;
      progress.style.transform = `scaleX(${amount})`;
    }, { passive: true });

    heroWorld.addEventListener("pointermove", (event) => {
      const bounds = heroWorld.getBoundingClientRect();
      heroWorld.style.setProperty("--pointer-x", `${(event.clientX - bounds.left) / bounds.width - .5}`);
      heroWorld.style.setProperty("--pointer-y", `${(event.clientY - bounds.top) / bounds.height - .5}`);
    });

    heroWorld.addEventListener("pointerleave", () => {
      heroWorld.style.setProperty("--pointer-x", "0");
      heroWorld.style.setProperty("--pointer-y", "0");
    });

    heroDeck.addEventListener("pointermove", (event) => {
      const bounds = heroDeck.getBoundingClientRect();
      const horizontal = (event.clientX - bounds.left) / bounds.width - .5;
      const vertical = (event.clientY - bounds.top) / bounds.height - .5;
      heroDeck.style.setProperty("--deck-front-x", `${horizontal * 3}px`);
      heroDeck.style.setProperty("--deck-front-y", `${vertical * 3}px`);
      heroDeck.style.setProperty("--deck-back-x", `${horizontal * -9}px`);
      heroDeck.style.setProperty("--deck-back-y", `${vertical * -7}px`);
      heroDeck.style.setProperty("--deck-back-rotate", `${horizontal * -.8}deg`);
      heroDeck.style.setProperty("--deck-far-x", `${horizontal * -14}px`);
      heroDeck.style.setProperty("--deck-far-y", `${vertical * -10}px`);
      heroDeck.style.setProperty("--deck-far-rotate", `${horizontal * -1.2}deg`);
    });

    heroDeck.addEventListener("pointerleave", () => {
      heroDeck.style.setProperty("--deck-front-x", "0px");
      heroDeck.style.setProperty("--deck-front-y", "0px");
      heroDeck.style.setProperty("--deck-back-x", "0px");
      heroDeck.style.setProperty("--deck-back-y", "0px");
      heroDeck.style.setProperty("--deck-back-rotate", "0deg");
      heroDeck.style.setProperty("--deck-far-x", "0px");
      heroDeck.style.setProperty("--deck-far-y", "0px");
      heroDeck.style.setProperty("--deck-far-rotate", "0deg");
    });

    publicationGrid.addEventListener("pointermove", (event) => {
      const card = event.target.closest(".publication-card");
      if (!card) return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${event.clientX - bounds.left}px`);
      card.style.setProperty("--mouse-y", `${event.clientY - bounds.top}px`);
    });
  }

  function enableFogwoodEnvironment() {
    if (!fogwoodSection || !fogwoodEnvironment) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let pointerFrame = 0;
    let scrollFrame = 0;
    let sporeIdleTimer = 0;

    function resetPointer() {
      fogwoodEnvironment.style.setProperty("--fog-x", "0px");
      fogwoodEnvironment.style.setProperty("--fog-y", "0px");
      fogwoodEnvironment.style.setProperty("--fog-x-reverse", "0px");
      fogwoodEnvironment.style.setProperty("--fog-y-reverse", "0px");
      fogwoodEnvironment.style.setProperty("--spore-energy", ".08");
    }

    function updateScroll() {
      if (reducedMotion.matches) {
        fogwoodEnvironment.style.setProperty("--fog-scroll", "0px");
        return;
      }
      const bounds = fogwoodSection.getBoundingClientRect();
      const progress = (innerHeight - bounds.top) / Math.max(1, innerHeight + bounds.height);
      fogwoodEnvironment.style.setProperty("--fog-scroll", `${(progress - .5) * 24}px`);
    }

    fogwoodSection.addEventListener("pointermove", (event) => {
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        if (reducedMotion.matches) return;
        const bounds = fogwoodSection.getBoundingClientRect();
        const horizontal = (event.clientX - bounds.left) / bounds.width - .5;
        const vertical = (event.clientY - bounds.top) / bounds.height - .5;
        const sporeX = Math.max(0, Math.min(bounds.width, event.clientX - bounds.left));
        const sporeY = Math.max(0, Math.min(bounds.height, event.clientY - bounds.top));
        const energy = Math.min(1, Math.hypot(event.movementX, event.movementY) / 16);

        fogwoodEnvironment.style.setProperty("--fog-x", `${horizontal * 16}px`);
        fogwoodEnvironment.style.setProperty("--fog-y", `${vertical * 10}px`);
        fogwoodEnvironment.style.setProperty("--fog-x-reverse", `${horizontal * -11}px`);
        fogwoodEnvironment.style.setProperty("--fog-y-reverse", `${vertical * -7}px`);
        fogwoodEnvironment.style.setProperty("--spore-x", `${sporeX}px`);
        fogwoodEnvironment.style.setProperty("--spore-y", `${sporeY}px`);
        fogwoodEnvironment.style.setProperty("--spore-energy", String(Math.max(.2, energy)));

        clearTimeout(sporeIdleTimer);
        sporeIdleTimer = setTimeout(() => {
          fogwoodEnvironment.style.setProperty("--spore-energy", ".08");
        }, 180);
      });
    }, { passive: true });

    fogwoodSection.addEventListener("pointerleave", resetPointer);
    addEventListener("scroll", () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(updateScroll);
    }, { passive: true });
    reducedMotion.addEventListener("change", () => {
      resetPointer();
      updateScroll();
    });
    updateScroll();
  }

  function enableFogwoodReel() {
    if (!fogwoodReel) return;
    const slides = [...fogwoodReel.querySelectorAll("[data-fogwood-slide]")];
    const kicker = fogwoodReel.querySelector("#fogwood-reel-kicker");
    const label = fogwoodReel.querySelector("#fogwood-reel-label");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const cycleDuration = 9500;
    let active = 0;
    let cycleTimer = 0;
    let cycleStartedAt = null;
    let cycleRemaining = cycleDuration;
    let focusInside = false;

    function animateCaption(element) {
      if (!element || reducedMotion.matches) return;
      element.classList.remove("is-entering");
      void element.offsetWidth;
      element.classList.add("is-entering");
    }

    function showSlide(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === active;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });
      kicker.textContent = slides[active].dataset.kicker;
      label.textContent = slides[active].dataset.label;
      animateCaption(kicker);
      animateCaption(label);
    }

    function clearCycleTimer() {
      clearTimeout(cycleTimer);
      cycleTimer = 0;
    }

    function pauseCycle() {
      clearCycleTimer();
      if (cycleStartedAt !== null) {
        cycleRemaining = Math.max(0, cycleRemaining - (performance.now() - cycleStartedAt));
        cycleStartedAt = null;
      }
      fogwoodReel.classList.add("is-paused");
    }

    function resumeCycle() {
      if (reducedMotion.matches || document.hidden || focusInside) {
        fogwoodReel.classList.add("is-paused");
        return;
      }
      fogwoodReel.classList.remove("is-paused");
      cycleStartedAt = performance.now();
      cycleTimer = setTimeout(() => {
        showSlide(active + 1);
        restartCycle();
      }, cycleRemaining);
    }

    function restartCycle() {
      clearCycleTimer();
      cycleStartedAt = null;
      cycleRemaining = cycleDuration;
      fogwoodReel.classList.remove("is-cycling");
      fogwoodReel.classList.remove("is-paused");
      if (reducedMotion.matches) return;
      void fogwoodReel.offsetWidth;
      fogwoodReel.classList.add("is-cycling");
      resumeCycle();
    }

    fogwoodReel.addEventListener("focusin", () => {
      focusInside = true;
      pauseCycle();
    });
    fogwoodReel.addEventListener("focusout", (event) => {
      if (fogwoodReel.contains(event.relatedTarget)) return;
      focusInside = false;
      resumeCycle();
    });
    reducedMotion.addEventListener("change", () => {
      if (reducedMotion.matches) {
        pauseCycle();
        fogwoodReel.classList.remove("is-cycling");
        return;
      }
      restartCycle();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pauseCycle();
      else resumeCycle();
    });
    showSlide(0);
    restartCycle();
  }

  function enableExperiencePath() {
    if (!experiencePath) return;
    const lineLayer = experiencePath.querySelector(".experience-path-lines");
    const details = experiencePath.querySelector(".experience-more");
    let drawFrame = 0;

    function drawPath() {
      cancelAnimationFrame(drawFrame);
      drawFrame = requestAnimationFrame(() => {
        const bounds = experiencePath.getBoundingClientRect();
        const nodes = [...experiencePath.querySelectorAll(".record-index, .experience-summary-dot")]
          .filter((node) => details?.open || !node.closest(".background-grid-continuation"))
          .filter((node) => node.getClientRects().length)
          .map((node) => {
            const nodeBounds = node.getBoundingClientRect();
            return {
              x: nodeBounds.left - bounds.left + nodeBounds.width / 2,
              y: nodeBounds.top - bounds.top + nodeBounds.height / 2
            };
          });

        lineLayer.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
        lineLayer.replaceChildren(...nodes.slice(0, -1).map((start, index) => {
          const end = nodes[index + 1];
          const verticalControl = Math.max(20, (end.y - start.y) * .46);
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("class", "experience-path-line");
          path.setAttribute("d", `M ${start.x} ${start.y} C ${start.x} ${start.y + verticalControl}, ${end.x} ${end.y - verticalControl}, ${end.x} ${end.y}`);
          return path;
        }));
      });
    }

    details?.addEventListener("toggle", drawPath);
    addEventListener("resize", drawPath, { passive: true });
    if ("ResizeObserver" in window) new ResizeObserver(drawPath).observe(experiencePath);
    document.fonts?.ready.then(drawPath);
    drawPath();
  }

  function enableHeroDeck() {
    if (!heroDeck) return;
    const cards = [...heroDeck.querySelectorAll("[data-deck-card]")];
    const status = document.querySelector("#hero-deck-status");
    const previous = document.querySelector("[data-deck-prev]");
    const next = document.querySelector("[data-deck-next]");
    const interactionRegion = heroDeck.closest(".hero-visual-stack");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let active = 0;
    let autoCycleTimer;
    let pointerInside = false;
    let focusInside = false;

    function showCard(index) {
      active = (index + cards.length) % cards.length;
      cards.forEach((card, cardIndex) => {
        const position = (cardIndex - active + cards.length) % cards.length;
        card.dataset.position = String(position);
        card.setAttribute("aria-hidden", String(position !== 0));
      });
      status.textContent = `${String(active + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    }

    function stopAutoCycle() {
      clearTimeout(autoCycleTimer);
    }

    function scheduleAutoCycle() {
      stopAutoCycle();
      if (reducedMotion.matches || document.hidden || pointerInside || focusInside) return;
      autoCycleTimer = setTimeout(() => {
        showCard(active + 1);
        scheduleAutoCycle();
      }, 10000);
    }

    function navigateBy(offset) {
      showCard(active + offset);
      scheduleAutoCycle();
    }

    previous.addEventListener("click", () => navigateBy(-1));
    next.addEventListener("click", () => navigateBy(1));
    interactionRegion.addEventListener("pointerenter", () => {
      pointerInside = true;
      stopAutoCycle();
    });
    interactionRegion.addEventListener("pointerleave", () => {
      pointerInside = false;
      scheduleAutoCycle();
    });
    interactionRegion.addEventListener("focusin", () => {
      focusInside = true;
      stopAutoCycle();
    });
    interactionRegion.addEventListener("focusout", (event) => {
      if (interactionRegion.contains(event.relatedTarget)) return;
      focusInside = false;
      scheduleAutoCycle();
    });
    reducedMotion.addEventListener("change", scheduleAutoCycle);
    document.addEventListener("visibilitychange", scheduleAutoCycle);
    showCard(0);
    scheduleAutoCycle();
  }

  function enableNewsArchiveLinks() {
    newsList.addEventListener("click", (event) => {
      const archiveLink = event.target.closest('a[href^="#publication-"]');
      if (archiveLink) setFilter("all");
    });
  }

  function enableActiveNavigation() {
    const navLinks = [...document.querySelectorAll(".topbar nav a")];
    const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((section) => observer.observe(section));
  }

  function enableMobileNavigation() {
    if (!mobileNavToggle || !mobileNavPanel) return;

    function setOpen(open) {
      mobileNavPanel.hidden = !open;
      mobileNavToggle.setAttribute("aria-expanded", String(open));
      mobileNavToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    }

    mobileNavToggle.addEventListener("click", () => {
      setOpen(mobileNavToggle.getAttribute("aria-expanded") !== "true");
    });

    mobileNavPanel.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("click", (event) => {
      if (
        mobileNavToggle.getAttribute("aria-expanded") === "true"
        && !event.target.closest(".topbar")
      ) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && mobileNavToggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        mobileNavToggle.focus();
      }
    });

    addEventListener("resize", () => {
      if (innerWidth > 720) setOpen(false);
    }, { passive: true });
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
    themeToggle.querySelector(".theme-text").textContent = isDark ? "Light" : "Dark";
    document.querySelector('meta[name="theme-color"]').setAttribute("content", isDark ? "#181917" : "#e8dfce");
  }

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  });

  renderNews();
  renderLifecycle();
  renderPublications();
  renderFilters();
  enableLifecycleInteractions();
  enableProjectMapToggle();
  enablePublicationInteractions();
  enableOrnithopterFlights();
  enableHeroDeck();
  enableFogwoodEnvironment();
  enableFogwoodReel();
  enableExperiencePath();
  enableNewsArchiveLinks();
  enableMotion();
  enableActiveNavigation();
  enableMobileNavigation();
  setFilter("all");
  applyTheme(document.documentElement.dataset.theme || "light");
})();
