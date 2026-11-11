/**
 * EmadulAi Tool Visit Tracker
 * Tracks tool usage client-side for the "Recently Used Tools" section.
 */
(function() {
  "use strict";
  const toolId = document.documentElement.getAttribute("data-current-tool");
  if (!toolId) return;

  try {
    let history = JSON.parse(localStorage.getItem("emadul_history") || "[]");
    // Remove if already present to shift to the front
    history = history.filter(id => id !== toolId);
    history.unshift(toolId);
    // Limit to 6 items
    if (history.length > 6) {
      history = history.slice(0, 6);
    }
    localStorage.setItem("emadul_history", JSON.stringify(history));
  } catch (e) {
    // Fail gracefully if storage is restricted
  }
})();
