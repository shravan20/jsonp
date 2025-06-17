/* ========== Mode Selector ========== */
function switchMode(mode) {
  const sections = [
    "formatter",
    "compare",
    "codegen",
    "convert",
    "mockgen",
    "editor",
  ];
  sections.forEach((s) => {
    const section = document.getElementById(`${s}-section`);
    if (section) {
      section.style.display = "none";
    }
  });

  const targetSection = document.getElementById(`${mode}-section`);
  if (targetSection) {
    targetSection.style.display = "block";
  }

  // Update sidebar active state
  document.querySelectorAll(".feature-item").forEach((item) => {
    item.classList.remove("active");
  });
  document
    .querySelector(`.feature-item[onclick*="${mode}"]`)
    ?.classList.add("active");

  if (mode === "mockgen") {
    renderMockgenDocs();
  } else if (mode === "editor") {
    loadEditorGlobalState();
  }

  applyEditorTabDarkMode();
  saveGlobalState(); // Save state when mode changes
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
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "s") {
    e.preventDefault();
    const activeTab = document.querySelector(
      "#editor-tab-contents .json-tab-content.active"
    );
    if (activeTab) saveEditorContent(activeTab.id);
  }
});

/* ========== Initialization ========== */
window.addEventListener("load", () => {
  loadGlobalState();
  loadEditorGlobalState();
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

  if (document.getElementById("editor-tab-contents").children.length === 0) {
    addEditorTab();
    switchEditorTab("editor-tab-1");
  }
});

setInterval(() => {
  const editorVisible =
    document.getElementById("editor-section").style.display !== "none";
  const activeTab = document.querySelector(
    "#editor-tab-contents .json-tab-content.active"
  );

  if (!Swal.isVisible() && editorVisible && activeTab) {
    saveEditorContent(activeTab.id);
  }
}, 5000);
