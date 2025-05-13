// Core DOM manipulation utilities will be placed here.

/* ========== DOM Utilities ========== */
function enableTabReordering(containerId) {
  const container = document.getElementById(containerId);
  const tabButtons = container.querySelectorAll(".tab-button[data-tab]");

  tabButtons.forEach((button) => {
    button.draggable = true;

    button.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", button.getAttribute("data-tab"));
      button.classList.add("dragging");
    });

    button.addEventListener("dragend", () => {
      button.classList.remove("dragging");
      container
        .querySelectorAll(".tab-button")
        .forEach((b) => b.classList.remove("drag-over"));
    });

    button.addEventListener("dragover", (e) => {
      e.preventDefault();
      button.classList.add("drag-over");
    });

    button.addEventListener("dragleave", () => {
      button.classList.remove("drag-over");
    });

    button.addEventListener("drop", (e) => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData("text/plain");
      const draggedBtn = container.querySelector(`[data-tab="${draggedId}"]`);

      button.classList.remove("drag-over");

      if (draggedBtn && draggedBtn !== button) {
        container.insertBefore(draggedBtn, button);
        saveGlobalState();
      }
    });
  });
}

function openTabRenameTooltip(tabId, mode) {
  let containerSelector;
  if (mode === "formatter") containerSelector = "#formatter-tabs-container";
  else if (mode === "compare") containerSelector = "#compare-tabs-container";
  else if (mode === "codegen") containerSelector = "#codegen-tabs-container";
  const tabButton = document.querySelector(
    containerSelector + ` .tab-button[data-tab="${tabId}"]`
  );
  const existingTooltip = document.querySelector(".tab-rename-tooltip");
  if (existingTooltip) existingTooltip.remove();
  const tooltip = document.createElement("div");
  tooltip.className = "tab-rename-tooltip";
  const rect = tabButton.getBoundingClientRect();
  tooltip.style.left = rect.left + "px";
  tooltip.style.top = rect.bottom + window.scrollY + 5 + "px";
  const input = document.createElement("input");
  input.type = "text";
  input.value = tabButton.querySelector(".tab-name").textContent;
  input.style.width = "150px";
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finalizeRename();
    else if (e.key === "Escape") tooltip.remove();
  });
  input.addEventListener("blur", finalizeRename);
  tooltip.appendChild(input);
  document.body.appendChild(tooltip);
  input.focus();

  function finalizeRename() {
    const newName = input.value.trim();
    if (newName) {
      tabButton.querySelector(".tab-name").textContent = newName;
    }
    tooltip.remove();
    saveGlobalState();
  }
}

function copyToClipboard(text, successMessage) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert(successMessage);
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
      alert("Copy failed");
    });
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
