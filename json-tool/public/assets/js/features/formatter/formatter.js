async function loadFormatterHTML() {
  try {
    const response = await fetch("assets/js/features/formatter/formatter.html");
    const html = await response.text();
    document.getElementById("formatter-section-container").innerHTML = html;
  } catch (error) {
    console.error("Error loading formatter HTML:", error);
  }
}
document.addEventListener("DOMContentLoaded", loadFormatterHTML);

let formatterTabCount = 0;

function addFormatterTab() {
  createFormatterTab();
  switchFormatterTab("formatterTab" + formatterTabCount);
  saveGlobalState();
}

function createFormatterTab(tabData = null) {
  formatterTabCount++;
  const tabId = "formatterTab" + formatterTabCount;

  // Create tab button
  const tabButton = document.createElement("button");
  tabButton.className = "tab-button";
  tabButton.setAttribute("data-tab", tabId);
  tabButton.onclick = () => switchFormatterTab(tabId);

  const tabName = tabData?.name || "Tab " + formatterTabCount;
  const tabColor = tabData?.color || "#e0e0e0";

  tabButton.innerHTML = `<span class="tab-name">${tabName}</span>
               <input type="color" class="tab-color-picker" value="${tabColor}" onchange="updateFormatterTabColor('${tabId}', this.value)">
               <span class="close-tab" onclick="closeFormatterTab('${tabId}', event)">×</span>`;

  tabButton.addEventListener("dblclick", () =>
    openTabRenameTooltip(tabId, "formatter")
  );

  const tabsContainer = document.getElementById("formatter-tabs-container");
  const addButton = tabsContainer.querySelector(".add-tab-button");
  if (tabsContainer && addButton) {
    tabsContainer.insertBefore(tabButton, addButton);
  }

  // Create tab content
  const tabContent = document.createElement("div");
  tabContent.id = tabId;
  tabContent.className = "json-tab-content";
  tabContent.innerHTML = `
               <textarea class="json-input" placeholder="Enter JSON here..."></textarea>
               <div class="search-container">
                 <input type="text" class="search-input" placeholder="Search keys or values..." />
                 <button onclick="searchFormatterJSON('${tabId}')">Search</button>
               </div>
               <div class="upload-download-container">
                 <input type="file" class="upload-json" style="display:none" onchange="uploadFormatterJSON('${tabId}', this)">
                 <button onclick="document.querySelector('#${tabId} .upload-json').click()">Upload JSON</button>
                 <button onclick="downloadFormatterJSON('${tabId}')">Download JSON</button>
               </div>
               <div class="tabs">
                 <button class="tab-button active" onclick="showFormatterPreviewTab('${tabId}', 'raw')">Raw JSON</button>
                 <button class="tab-button" onclick="showFormatterPreviewTab('${tabId}', 'tree')">Tree View</button>
                 <button class="tab-button" onclick="showFormatterPreviewTab('${tabId}', 'error')">Errors</button>
               </div>
               <div id="${tabId}-raw-preview" class="preview-section active">
                 <pre class="raw-json"></pre>
               </div>
               <div id="${tabId}-tree-preview" class="preview-section">
                 <div class="tree-view"></div>
               </div>
               <div id="${tabId}-error-preview" class="preview-section">
                 <div class="error-message"></div>
               </div>
               
               <div id="${tabId}-raw-preview" class="preview-section active">
                      <button class="copy-button" onclick="copyRawJSON('${tabId}')">Copy</button>
                      <pre class="raw-json"></pre>
                  </div>
                  <div id="${tabId}-tree-preview" class="preview-section">
                      <button class="copy-button" onclick="copyRawJSON('${tabId}')">Copy JSON</button>
                      <div class="tree-view"></div>
                  </div>
                  <pre class="code-output" style="margin-top:10px; overflow:auto;"></pre>
             `;
  document.getElementById("formatter-tab-contents").appendChild(tabContent);

  // Set content if provided
  if (tabData?.content) {
    tabContent.querySelector(".json-input").value = tabData.content;
  }

  const textarea = tabContent.querySelector(".json-input");
  textarea.addEventListener("paste", () =>
    setTimeout(() => autoFormatTextarea(textarea), 100)
  );
  textarea.addEventListener("blur", () => autoFormatTextarea(textarea));
  textarea.addEventListener("input", () => updateFormatterPreview(tabId));
  updateFormatterPreview(tabId);
  enableTabReordering("formatter-tabs-container");
}

function switchFormatterTab(tabId) {
  document
    .querySelectorAll("#formatter-tab-contents .json-tab-content")
    .forEach((tab) => tab.classList.remove("active"));
  const selectedTab = document.getElementById(tabId);
  if (selectedTab) selectedTab.classList.add("active");
  document
    .querySelectorAll("#formatter-tabs-container .tab-button[data-tab]")
    .forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
    });
  saveGlobalState();
}

function updateFormatterPreview(tabId) {
  const tabContent = document.getElementById(tabId);
  const textarea = tabContent.querySelector(".json-input");
  const rawPreview = tabContent.querySelector(".raw-json");
  const errorMessage = tabContent.querySelector(".error-message");
  try {
    const parsed = JSON.parse(textarea.value);
    const formatted = JSON.stringify(parsed, null, 2);
    rawPreview.textContent = formatted;
    createTreeView(parsed, tabContent.querySelector(".tree-view"));
    errorMessage.textContent = "";
    showFormatterPreviewTab(tabId, "raw");
    // Avoid resetting user cursor while typing
    if (document.activeElement !== textarea) {
      textarea.value = formatted;
    }
  } catch (e) {
    errorMessage.textContent = "Error: " + e.message;
    showFormatterPreviewTab(tabId, "error");
  }
  document.querySelectorAll(".tree-key").forEach((key) => {
    key.addEventListener("focus", () => {
      key.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  });
  saveGlobalState();
}

function showFormatterPreviewTab(tabId, previewType) {
  const tabContent = document.getElementById(tabId);
  const previews = tabContent.querySelectorAll(".preview-section");
  previews.forEach((section) => {
    section.classList.toggle(
      "active",
      section.id === `${tabId}-${previewType}-preview`
    );
  });
  const buttons = tabContent.querySelectorAll(".tabs .tab-button");
  buttons.forEach((btn) => {
    btn.classList.toggle(
      "active",
      btn.textContent.toLowerCase().includes(previewType)
    );
  });
}

function searchFormatterJSON(tabId) {
  const tabContent = document.getElementById(tabId);
  const searchInput = tabContent
    .querySelector(".search-input")
    .value.trim()
    .toLowerCase();
  const rawPreview = tabContent.querySelector(".raw-json");
  const treeView = tabContent.querySelector(".tree-view");
  tabContent.querySelectorAll(".highlight").forEach((el) => {
    const parent = el.parentNode;
    parent.replaceChild(document.createTextNode(el.textContent), el);
  });
  if (!searchInput) return;
  const regex = new RegExp(
    `(${searchInput.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  if (rawPreview.parentElement.classList.contains("active")) {
    const content = rawPreview.textContent;
    rawPreview.innerHTML = content.replace(
      regex,
      '<span class="highlight">$1</span>'
    );
  }
  if (treeView.parentElement.classList.contains("active")) {
    function highlightNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const matches = node.nodeValue.match(regex);
        if (matches) {
          const span = document.createElement("span");
          span.innerHTML = node.nodeValue.replace(
            regex,
            '<span class="highlight">$1</span>'
          );
          node.parentNode.replaceChild(span, node);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes) {
        node.childNodes.forEach((child) => highlightNode(child));
      }
    }
    treeView.childNodes.forEach((child) => highlightNode(child));
  }
  saveGlobalState();
}

function updateFormatterTabColor(tabId, colorValue) {
  saveGlobalState();
}

function uploadFormatterJSON(tabId, inputElement) {
  if (inputElement.files?.[0]) {
    const file = inputElement.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const tabContent = document.getElementById(tabId);
      const textarea = tabContent.querySelector(".json-input");
      textarea.value = content;
      updateFormatterPreview(tabId);
    };
    reader.readAsText(file);
    inputElement.value = "";
  }
}

function downloadFormatterJSON(tabId) {
  const tabContent = document.getElementById(tabId);
  const content = tabContent.querySelector(".json-input").value;
  const blob = new Blob([content], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = tabId + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function closeFormatterTab(tabId, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  const result = await Swal.fire({
    title: "Close tab?",
    text: "Are you sure you want to close this tab?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (!result.isConfirmed) return;

  const tabButton = document.querySelector(
    `#formatter-tabs-container .tab-button[data-tab="${tabId}"]`
  );
  const tabContent = document.getElementById(tabId);
  if (tabButton) tabButton.remove();
  if (tabContent) tabContent.remove();
  const remaining = document.querySelectorAll(
    "#formatter-tab-contents .json-tab-content"
  );
  if (remaining.length > 0)
    switchFormatterTab(remaining[remaining.length - 1].id);
  saveGlobalState();
}

function copyRawJSON(tabId) {
  const rawPre = document.querySelector(`#${tabId}-raw-preview .raw-json`);
  copyToClipboard(rawPre.textContent, "JSON copied to clipboard");
}

function createTreeView(data, parentElement) {
  parentElement.innerHTML = "";
  const focusedNode = null;

  function processNode(value, parent, key, path = []) {
    const node = document.createElement("div");
    node.className = "tree-node";
    const currentPath = [...path, key];
    const displayKey = key !== undefined ? key : "";

    if (typeof value === "object" && value !== null) {
      const isArray = Array.isArray(value);
      const keySpan = document.createElement("span");
      keySpan.className = `tree-key ${isArray ? "type-array" : "type-object"}`;
      keySpan.tabIndex = 0;

      const nameEl = document.createElement("span");
      nameEl.textContent = displayKey;
      const infoEl = document.createElement("span");
      infoEl.className = "node-info";
      infoEl.textContent = isArray
        ? `[${value.length}]`
        : `{${Object.keys(value).length}}`;
      keySpan.append(nameEl, infoEl);

      // Keyboard navigation
      keySpan.addEventListener("keydown", (e) => {
        switch (e.key) {
          case "ArrowRight":
            if (keySpan.classList.contains("collapsed")) toggleNode();
            break;
          case "ArrowLeft":
            if (!keySpan.classList.contains("collapsed")) toggleNode();
            break;
          case "ArrowDown":
            focusNextNode(keySpan);
            break;
          case "ArrowUp":
            focusPreviousNode(keySpan);
            break;
        }
      });

      // Context menu
      keySpan.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        showContextMenu(e, currentPath, value);
      });

      const children = document.createElement("div");
      children.className = "tree-children";
      children.style.display = "none";

      const toggleNode = () => {
        keySpan.classList.toggle("expanded");
        keySpan.classList.toggle("collapsed");
        children.style.display =
          children.style.display === "none" ? "block" : "none";
      };

      keySpan.addEventListener("click", toggleNode);

      if (isArray) {
        value.forEach((item, index) =>
          processNode(item, children, index, currentPath)
        );
      } else {
        Object.entries(value).forEach(([k, v]) =>
          processNode(v, children, k, currentPath)
        );
      }

      node.appendChild(keySpan);
      node.appendChild(children);
      parent.appendChild(node);
    } else {
      const valueSpan = document.createElement("span");

      const keyEl = document.createElement("span");
      keyEl.className = "tree-key";
      keyEl.textContent = `${key}: `;

      const valEl = document.createElement("span");
      valEl.className = getValueTypeClass(value);
      valEl.textContent = formatValue(value);

      valueSpan.append(keyEl, valEl);

      // Value context menu
      valueSpan.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        showContextMenu(e, currentPath, value);
      });

      node.appendChild(valueSpan);
      parent.appendChild(node);
    }

    return node;
  }

  function showContextMenu(e, path, value) {
    const menu = document.createElement("div");
    menu.className = "tree-context-menu";
    menu.style.left = `${e.pageX}px`;
    menu.style.top = `${e.pageY}px`;

    const copyPath = document.createElement("div");
    copyPath.className = "tree-context-menu-item";
    copyPath.textContent = "Copy Path";
    copyPath.onclick = () => navigator.clipboard.writeText(path.join("."));

    const copyValue = document.createElement("div");
    copyValue.className = "tree-context-menu-item";
    copyValue.textContent = "Copy Value";
    copyValue.onclick = () =>
      navigator.clipboard.writeText(JSON.stringify(value));

    menu.appendChild(copyPath);
    menu.appendChild(copyValue);
    document.body.appendChild(menu);

    const closeMenu = () => {
      document.body.removeChild(menu);
      document.removeEventListener("click", closeMenu);
    };

    document.addEventListener("click", closeMenu);
  }

  function focusNextNode(currentNode) {
    const allNodes = parentElement.querySelectorAll(".tree-key");
    const currentIndex = Array.from(allNodes).indexOf(currentNode);
    if (currentIndex < allNodes.length - 1) {
      allNodes[currentIndex + 1].focus();
    }
  }

  function focusPreviousNode(currentNode) {
    const allNodes = parentElement.querySelectorAll(".tree-key");
    const currentIndex = Array.from(allNodes).indexOf(currentNode);
    if (currentIndex > 0) {
      allNodes[currentIndex - 1].focus();
    }
  }

  processNode(data, parentElement);
}
