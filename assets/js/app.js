/**
 * EmadulAi - Core Application Engine
 */

(function () {
  "use strict";

  // State
  let activeCategory = "all";
  let searchQuery = "";
  let activeSort = "popular";

  // DOM Elements
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const menuToggleBtn = document.getElementById("menu-toggle-btn");
  const sidebarCloseBtn = document.getElementById("sidebar-close-btn");
  const sidebar = document.getElementById("app-sidebar");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const globalSearchInput = document.getElementById("global-search-input");
  const searchClearBtn = document.getElementById("search-clear-btn");
  const searchMeta = document.getElementById("search-results-meta");
  const categoryChipsContainer = document.getElementById("category-chips-container");
  const sidebarCategoryList = document.getElementById("sidebar-category-list");
  
  // Section Containers
  const allToolsGrid = document.getElementById("all-tools-grid");
  const featuredToolsGrid = document.getElementById("featured-tools-grid");
  const popularToolsGrid = document.getElementById("popular-tools-grid");
  const recentToolsGrid = document.getElementById("recent-tools-grid");
  const favoritesGrid = document.getElementById("favorites-grid");
  const favoritesSection = document.getElementById("favorites-section");
  const recentSection = document.getElementById("recent-section");

  // LocalStorage Helpers
  const Storage = {
    getFavorites: function () {
      try {
        return JSON.parse(localStorage.getItem("emadul_favorites") || "[]");
      } catch (e) {
        return [];
      }
    },
    setFavorites: function (favs) {
      try {
        localStorage.setItem("emadul_favorites", JSON.stringify(favs));
      } catch (e) {}
    },
    getHistory: function () {
      try {
        return JSON.parse(localStorage.getItem("emadul_history") || "[]");
      } catch (e) {
        return [];
      }
    },
    getTheme: function () {
      return localStorage.getItem("emadul_theme") || "system";
    },
    setTheme: function (theme) {
      localStorage.setItem("emadul_theme", theme);
    }
  };

  // Theme Management
  function initTheme() {
    const savedTheme = Storage.getTheme();
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme === "dark" || (savedTheme === "system" && systemPrefersDark);

    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    updateThemeIcon(isDark);

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (Storage.getTheme() === "system") {
        document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
        updateThemeIcon(e.matches);
      }
    });
  }

  function updateThemeIcon(isDark) {
    if (!themeToggleBtn) return;
    themeToggleBtn.innerHTML = isDark ? EMADUL_ICONS.sun : EMADUL_ICONS.moon;
    themeToggleBtn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    Storage.setTheme(nextTheme);
    updateThemeIcon(nextTheme === "dark");
  }

  // Sidebar Controls
  function toggleSidebar(open) {
    if (!sidebar || !sidebarOverlay) return;
    const isOpen = open !== undefined ? open : !sidebar.classList.contains("open");
    sidebar.classList.toggle("open", isOpen);
    sidebarOverlay.classList.toggle("active", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  // Build Tool Card HTML
  function renderToolCard(tool) {
    const isFav = Storage.getFavorites().includes(tool.id);
    const iconSvg = EMADUL_ICONS[tool.icon] || EMADUL_ICONS.code;
    const favIconSvg = isFav ? EMADUL_ICONS["heart-filled"] : EMADUL_ICONS.heart;
    const isAvailable = tool.status === "available";

    return `
      <article class="tool-card" data-tool-id="${tool.id}">
        <div class="tool-card-header">
          <div class="tool-icon-wrapper">${iconSvg}</div>
          <button type="button" class="tool-fav-btn ${isFav ? "favorited" : ""}" data-fav-id="${tool.id}" aria-label="Add ${tool.name} to favorites">
            ${favIconSvg}
          </button>
        </div>
        <h3 class="tool-name">
          ${isAvailable 
            ? `<a href="${tool.url}">${tool.name}</a>` 
            : `<span>${tool.name}</span>`
          }
        </h3>
        <p class="tool-desc">${tool.description}</p>
        <div class="tool-card-footer">
          <span class="tool-category-badge">${tool.category}</span>
          <span class="badge-status ${isAvailable ? "badge-available" : "badge-coming-soon"}">
            ${isAvailable ? "Ready" : "Coming Soon"}
          </span>
        </div>
      </article>
    `;
  }

  // Categories Setup
  function getCategoryCounts() {
    const counts = {};
    EMADUL_TOOLS_REGISTRY.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }

  function renderCategoryFilters() {
    if (!categoryChipsContainer) return;
    const counts = getCategoryCounts();
    const categories = Object.keys(counts).sort();

    let html = `
      <button type="button" class="category-chip ${activeCategory === "all" ? "active" : ""}" data-category="all">
        All Tools <span class="count">${EMADUL_TOOLS_REGISTRY.length}</span>
      </button>
    `;

    categories.forEach(cat => {
      html += `
        <button type="button" class="category-chip ${activeCategory === cat ? "active" : ""}" data-category="${cat}">
          ${cat} <span class="count">${counts[cat]}</span>
        </button>
      `;
    });

    categoryChipsContainer.innerHTML = html;

    // Render Sidebar Category Navigation
    if (sidebarCategoryList) {
      let sbHtml = "";
      categories.forEach(cat => {
        sbHtml += `
          <li class="sidebar-item">
            <a href="#all-tools-section" data-sidebar-cat="${cat}">
              <span>${cat}</span>
              <span class="sidebar-count">${counts[cat]}</span>
            </a>
          </li>
        `;
      });
      sidebarCategoryList.innerHTML = sbHtml;
    }
  }

  // Filtering Engine
  function getFilteredTools() {
    return EMADUL_TOOLS_REGISTRY.filter(tool => {
      const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchName = tool.name.toLowerCase().includes(q);
      const matchDesc = tool.description.toLowerCase().includes(q);
      const matchCat = tool.category.toLowerCase().includes(q);
      const matchTags = tool.tags.some(tag => tag.toLowerCase().includes(q));

      return matchName || matchDesc || matchCat || matchTags;
    });
  }

  // Render Grid Sections
  function renderAllSections() {
    const filtered = getFilteredTools();

    if (allToolsGrid) {
      if (filtered.length === 0) {
        allToolsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
            <p style="font-size: 1.1rem; font-weight: 500;">No tools match your query.</p>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">Try adjusting your search criteria or switching categories.</p>
          </div>
        `;
      } else {
        allToolsGrid.innerHTML = filtered.map(renderToolCard).join("");
      }
    }

    if (searchMeta) {
      if (searchQuery.trim()) {
        searchMeta.textContent = `Found ${filtered.length} tool${filtered.length === 1 ? "" : "s"} for "${searchQuery}"`;
      } else {
        searchMeta.textContent = "";
      }
    }

    // Featured Tools
    if (featuredToolsGrid) {
      const featured = EMADUL_TOOLS_REGISTRY.filter(t => t.featured);
      featuredToolsGrid.innerHTML = featured.map(renderToolCard).join("");
    }

    // Popular Tools
    if (popularToolsGrid) {
      const popular = EMADUL_TOOLS_REGISTRY.filter(t => t.popular);
      popularToolsGrid.innerHTML = popular.map(renderToolCard).join("");
    }

    // Favorites Section
    if (favoritesGrid && favoritesSection) {
      const favIds = Storage.getFavorites();
      const favTools = EMADUL_TOOLS_REGISTRY.filter(t => favIds.includes(t.id));
      if (favTools.length > 0) {
        favoritesSection.style.display = "block";
        favoritesGrid.innerHTML = favTools.map(renderToolCard).join("");
      } else {
        favoritesSection.style.display = "none";
      }
    }

    // Recently Visited Section
    if (recentToolsGrid && recentSection) {
      const historyIds = Storage.getHistory();
      const recentTools = historyIds
        .map(id => EMADUL_TOOLS_REGISTRY.find(t => t.id === id))
        .filter(Boolean);

      if (recentTools.length > 0) {
        recentSection.style.display = "block";
        recentToolsGrid.innerHTML = recentTools.map(renderToolCard).join("");
      } else {
        recentSection.style.display = "none";
      }
    }
  }

  // Favorites Toggle Action
  function toggleFavorite(id) {
    let favs = Storage.getFavorites();
    if (favs.includes(id)) {
      favs = favs.filter(item => item !== id);
    } else {
      favs.push(id);
    }
    Storage.setFavorites(favs);
    renderAllSections();
  }

  // Event Listeners Binding
  function bindEvents() {
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", toggleTheme);
    }

    if (menuToggleBtn) {
      menuToggleBtn.addEventListener("click", () => toggleSidebar(true));
    }

    if (sidebarCloseBtn) {
      sidebarCloseBtn.addEventListener("click", () => toggleSidebar(false));
    }

    if (sidebarOverlay) {
      sidebarOverlay.addEventListener("click", () => toggleSidebar(false));
    }

    if (globalSearchInput) {
      globalSearchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        if (searchClearBtn) {
          searchClearBtn.classList.toggle("visible", searchQuery.length > 0);
        }
        renderAllSections();
      });

      globalSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          globalSearchInput.value = "";
          searchQuery = "";
          searchClearBtn.classList.remove("visible");
          renderAllSections();
        }
      });
    }

    if (searchClearBtn) {
      searchClearBtn.addEventListener("click", () => {
        globalSearchInput.value = "";
        searchQuery = "";
        searchClearBtn.classList.remove("visible");
        globalSearchInput.focus();
        renderAllSections();
      });
    }

    // Category Filter Clicks
    if (categoryChipsContainer) {
      categoryChipsContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".category-chip");
        if (!btn) return;
        activeCategory = btn.getAttribute("data-category");
        renderCategoryFilters();
        renderAllSections();
      });
    }

    // Sidebar Category Filter Clicks
    if (sidebarCategoryList) {
      sidebarCategoryList.addEventListener("click", (e) => {
        const link = e.target.closest("[data-sidebar-cat]");
        if (!link) return;
        activeCategory = link.getAttribute("data-sidebar-cat");
        renderCategoryFilters();
        renderAllSections();
        toggleSidebar(false);
      });
    }

    // Delegation for tool favorites
    document.addEventListener("click", (e) => {
      const favBtn = e.target.closest("[data-fav-id]");
      if (favBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = favBtn.getAttribute("data-fav-id");
        toggleFavorite(id);
      }
    });

    // FAQ Accordion Click Support
    document.querySelectorAll(".faq-question").forEach(q => {
      q.addEventListener("click", () => {
        const answer = q.nextElementSibling;
        const isHidden = answer.style.display === "none";
        document.querySelectorAll(".faq-answer").forEach(a => a.style.display = "none");
        if (isHidden) {
          answer.style.display = "block";
        }
      });
    });
  }

  // Initialization
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    renderCategoryFilters();
    renderAllSections();
    bindEvents();
  });
})();
