// Core storage utilities will be placed here.

/* ========== Global Persistence Functions ========== */
function getActiveMode() {
  if (document.getElementById("formatter-section").style.display !== "none")
    return "formatter";
  if (document.getElementById("compare-section").style.display !== "none")
    return "compare";
  if (document.getElementById("codegen-section").style.display !== "none")
    return "codegen";
  return "formatter";
}

function saveGlobalState() {
  const state = {
    darkMode: document.body.classList.contains("dark-mode"),
    activeMode: getActiveMode(),
    formatter: {
      activeTab:
        document.querySelector(
          "#formatter-tab-contents .json-tab-content.active"
        )?.id || "",
      tabs: [],
    },
    compare: {
      activeTab:
        document.querySelector("#compare-tab-contents .json-tab-content.active")
          ?.id || "",
      tabs: [],
    },
    codegen: {
      activeTab:
        document.querySelector("#codegen-tab-contents .json-tab-content.active")
          ?.id || "",
      tabs: [],
    },
  };
  // Formatter tabs
  document
    .querySelectorAll("#formatter-tabs-container .tab-button[data-tab]")
    .forEach((btn) => {
      const tabId = btn.getAttribute("data-tab");
      const name = btn.querySelector(".tab-name").textContent;
      const color = btn.querySelector(".tab-color-picker")?.value || "#e0e0e0";
      const content =
        document.querySelector("#" + tabId + " .json-input")?.value || "";
      state.formatter.tabs.push({
        id: tabId,
        name,
        color,
        content,
      });
    });
  // Compare tabs
  document
    .querySelectorAll("#compare-tabs-container .tab-button[data-tab]")
    .forEach((btn) => {
      const tabId = btn.getAttribute("data-tab");
      const name = btn.querySelector(".tab-name").textContent;
      const leftContent =
        document.querySelector("#" + tabId + " .json-input-left")?.value || "";
      const rightContent =
        document.querySelector("#" + tabId + " .json-input-right")?.value || "";
      state.compare.tabs.push({
        id: tabId,
        name,
        leftContent,
        rightContent,
      });
    });
  // Codegen tabs
  document
    .querySelectorAll("#codegen-tabs-container .tab-button[data-tab]")
    .forEach((btn) => {
      const tabId = btn.getAttribute("data-tab");
      const name = btn.querySelector(".tab-name").textContent;
      const input =
        document.querySelector("#" + tabId + " .json-input")?.value || "";
      const lang =
        document.getElementById("lang-select-" + tabId)?.value || "typescript";
      state.codegen.tabs.push({
        id: tabId,
        name,
        input,
        lang,
      });
    });
  localStorage.setItem("jsonToolState", JSON.stringify(state));
}

function loadGlobalState() {
  const stateStr = localStorage.getItem("jsonToolState");
  if (!stateStr) return;
  const state = JSON.parse(stateStr);
  // Dark Mode
  if (state.darkMode) document.body.classList.add("dark-mode");
  else document.body.classList.remove("dark-mode");
  // Active Mode
  switchMode(state.activeMode || "formatter");

  // Load Formatter tabs
  const ftc = document.getElementById("formatter-tabs-container");
  ftc.querySelectorAll(".tab-button[data-tab]").forEach((btn) => btn.remove());
  document.getElementById("formatter-tab-contents").innerHTML = "";
  formatterTabCount = 0;
  state.formatter.tabs.forEach((tabData) => {
    createFormatterTab(tabData);
  });
  if (state.formatter.activeTab) switchFormatterTab(state.formatter.activeTab);

  // Load Compare tabs
  const ctc = document.getElementById("compare-tabs-container");
  ctc.querySelectorAll(".tab-button[data-tab]").forEach((btn) => btn.remove());
  document.getElementById("compare-tab-contents").innerHTML = "";
  compareTabCount = 0;
  state.compare.tabs.forEach((tabData) => {
    createCompareTabWithData(tabData);
  });
  if (state.compare.activeTab) switchCompareTab(state.compare.activeTab);

  // Load Codegen tabs
  const cgtc = document.getElementById("codegen-tabs-container");
  cgtc.querySelectorAll(".tab-button[data-tab]").forEach((btn) => btn.remove());
  document.getElementById("codegen-tab-contents").innerHTML = "";
  codegenTabCount = 0;
  state.codegen.tabs.forEach((tabData) => {
    createCodegenTabWithData(tabData);
  });
  if (state.codegen.activeTab) switchCodegenTab(state.codegen.activeTab);

  enableTabReordering("formatter-tabs-container");
  enableTabReordering("compare-tabs-container");
  enableTabReordering("codegen-tabs-container");
}
