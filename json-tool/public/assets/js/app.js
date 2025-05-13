/* ========== Global Persistence Functions ========== */
function getActiveMode() {
  if (document.getElementById("formatter-section").style.display !== "none")
    return "formatter";
  if (document.getElementById("compare-section").style.display !== "none")
    return "compare";
  if (document.getElementById("codegen-section").style.display !== "none")
    return "codegen";
  if (document.getElementById("convert-section").style.display !== "none")
    return "convert";
  if (document.getElementById("mockgen-section").style.display !== "none")
    return "mockgen";
  return "formatter";
}

/* ========== Mode Selector ========== */
function switchMode(mode) {
  document.getElementById("formatter-section").style.display = "none";
  document.getElementById("compare-section").style.display = "none";
  document.getElementById("codegen-section").style.display = "none";
  document.getElementById("convert-section").style.display = "none";
  document.getElementById("mockgen-section").style.display = "none";

  document
    .querySelectorAll(".mode-selector button")
    .forEach((btn) => btn.classList.remove("active"));

  if (mode === "formatter") {
    document.getElementById("formatter-section").style.display = "block";
    document.getElementById("mode-formatter-btn").classList.add("active");
  } else if (mode === "compare") {
    document.getElementById("compare-section").style.display = "block";
    document.getElementById("mode-compare-btn").classList.add("active");
  } else if (mode === "codegen") {
    document.getElementById("codegen-section").style.display = "block";
    document.getElementById("mode-codegen-btn").classList.add("active");
  } else if (mode === "convert") {
    document.getElementById("convert-section").style.display = "block";
    document.getElementById("mode-convert-btn").classList.add("active");
  } else if (mode === "mockgen") {
    document.getElementById("mockgen-section").style.display = "block";
    document.getElementById("mode-mockgen-btn").classList.add("active");
    renderMockgenDocs();
  }

  saveGlobalState();
}

/* ========== Shortcut Modal & Dark Mode ========== */
function toggleShortcutModal() {
  const modal = document.getElementById("shortcut-modal");
  modal.style.display = modal.style.display === "block" ? "none" : "block";
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  saveGlobalState();
  // If the Compare section is visible, update all diff previews
  if (document.getElementById("compare-section").style.display !== "none") {
    document
      .querySelectorAll("#compare-tab-contents .json-tab-content")
      .forEach((tab) => {
        compareJSONs(tab.id);
      });
  }
}

/* ========== Keyboard Shortcuts ========== */
document.addEventListener("keydown", (e) => {
  if (
    e.ctrlKey &&
    e.key.toLowerCase() === "t" &&
    document.getElementById("formatter-section").style.display !== "none"
  ) {
    e.preventDefault();
    addFormatterTab();
  }
  if (
    e.ctrlKey &&
    e.key.toLowerCase() === "w" &&
    document.getElementById("formatter-section").style.display !== "none"
  ) {
    e.preventDefault();
    const activeTab = document.querySelector(
      "#formatter-tab-contents .json-tab-content.active"
    );
    if (activeTab) closeFormatterTab(activeTab.id);
  }
  if (e.ctrlKey && (e.key === "/" || e.key === "?")) {
    e.preventDefault();
    toggleShortcutModal();
  }
  if (e.key === "Escape") {
    const modal = document.getElementById("shortcut-modal");
    if (modal.style.display === "block") toggleShortcutModal();
  }
});

/* ========== Initialization ========== */
window.addEventListener("load", () => {
  loadGlobalState();

  // If no saved state, create a default tabs.
  if (document.getElementById("formatter-tab-contents").children.length === 0) {
    addFormatterTab();
  }

  if (document.getElementById("compare-tab-contents").children.length === 0) {
    addCompareTab();
  }

  if (document.getElementById("codegen-tab-contents").children.length === 0) {
    addCodegenTab();
  }
});
