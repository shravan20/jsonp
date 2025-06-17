/* ========== COPY FUNCTIONS ========== */
function copyToClipboard(text, successMessage) {
  (navigator.clipboard?.writeText
    ? navigator.clipboard.writeText(text)
    : new Promise((res, rej) => {
        try {
          const ta = Object.assign(document.createElement("textarea"), {
            value: text,
            style: "position:fixed;top:-1000px",
          });
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy") ? res() : rej();
          ta.remove();
        } catch (e) {
          rej(e);
        }
      })
  )
    .then(() => {
      Swal.fire({
        icon: "success",
        title: successMessage,
        toast: true,
        timer: 2000,
        position: "top-end",
        showConfirmButton: false,
      });
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
      Swal.fire({
        icon: "error",
        title: "Copy failed",
        toast: true,
        timer: 2000,
        position: "top-end",
        showConfirmButton: false,
      });
    });
}

function autoFormatTextarea(textarea) {
  try {
    const parsed = JSON.parse(textarea.value);
    textarea.value = JSON.stringify(parsed, null, 2);
  } catch (e) {
    // Do nothing if invalid
  }
}

function openTabRenameTooltip(tabId, mode) {
  let containerSelector;
  if (mode === "formatter") containerSelector = "#formatter-tabs-container";
  else if (mode === "compare") containerSelector = "#compare-tabs-container";
  else if (mode === "codegen") containerSelector = "#codegen-tabs-container";
  else containerSelector = "#editor-tabs-container";

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

/* ========== Mobile Sidebar Functions ========== */
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("active");

  // Close sidebar when clicking outside
  if (sidebar.classList.contains("active")) {
    const closeOnClickOutside = (e) => {
      if (
        !sidebar.contains(e.target) &&
        !e.target.matches(".mobile-sidebar-toggle")
      ) {
        sidebar.classList.remove("active");
        document.removeEventListener("click", closeOnClickOutside);
      }
    };
    // Add event listener with a slight delay to prevent immediate closing
    setTimeout(() => {
      document.addEventListener("click", closeOnClickOutside);
    }, 100);
  }
}

// Add touch event handling for better mobile experience
document.addEventListener("DOMContentLoaded", () => {
  let touchStartX = 0;
  let touchEndX = 0;
  const sidebar = document.querySelector(".sidebar");

  document.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    false
  );

  document.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    false
  );

  function handleSwipe() {
    const swipeThreshold = 50;
    const swipeLength = touchEndX - touchStartX;

    // Swipe right to open sidebar
    if (swipeLength > swipeThreshold && touchStartX < 30) {
      sidebar.classList.add("active");
    }
    // Swipe left to close sidebar
    else if (
      swipeLength < -swipeThreshold &&
      sidebar.classList.contains("active")
    ) {
      sidebar.classList.remove("active");
    }
  }
});

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

/* ========== Tab reordering ========== */
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
