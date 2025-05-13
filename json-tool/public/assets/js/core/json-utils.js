// Core JSON processing utilities will be placed here.

/* ========== JSON Utilities ========== */
function autoFormatTextarea(textarea) {
  try {
    const parsed = JSON.parse(textarea.value);
    textarea.value = JSON.stringify(parsed, null, 2);
  } catch (e) {
    // Do nothing if invalid
  }
}

function createTreeView(data, parentElement) {
  parentElement.innerHTML = "";
  let focusedNode = null;

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
      keySpan.innerHTML = `
                <span>${displayKey}</span>
                <span class="node-info">${
                  isArray
                    ? `[${value.length}]`
                    : `{${Object.keys(value).length}}`
                }</span>
            `;

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
      valueSpan.innerHTML = `
                <span class="tree-key">${key}: </span>
                <span class="${getValueTypeClass(value)}">${formatValue(
        value
      )}</span>
            `;

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

  function getValueTypeClass(value) {
    if (value === null) return "type-null";
    if (Array.isArray(value)) return "type-array";
    if (typeof value === "object") return "type-object";
    return `type-${typeof value}`;
  }

  function formatValue(value) {
    if (value === null) return "null";
    if (typeof value === "string") return `"${value}"`;
    return value.toString();
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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
