let codegenTabCount = 0;

function addCodegenTab() {
  createCodegenTab();
  switchCodegenTab("codegenTab" + codegenTabCount);
  saveGlobalState();
}

function createCodegenTab() {
  codegenTabCount++;
  const tabId = "codegenTab" + codegenTabCount;
  // Create tab button
  const tabButton = document.createElement("button");
  tabButton.className = "tab-button";
  tabButton.setAttribute("data-tab", tabId);
  tabButton.onclick = () => switchCodegenTab(tabId);
  tabButton.innerHTML = `<span class="tab-name">Tab ${codegenTabCount}</span>
               <span class="close-tab" onclick="closeCodegenTab('${tabId}', event)">×</span>`;
  tabButton.addEventListener("dblclick", () =>
    openTabRenameTooltip(tabId, "codegen")
  );
  const tabsContainer = document.getElementById("codegen-tabs-container");
  const addButton = tabsContainer.querySelector(".add-tab-button");
  tabsContainer.insertBefore(tabButton, addButton);
  enableTabReordering("codegen-tabs-container");

  // Create tab content
  const tabContent = document.createElement("div");
  tabContent.id = tabId;
  tabContent.className = "json-tab-content";
  tabContent.innerHTML = `
               <textarea class="json-input" placeholder="Enter JSON here..."></textarea>
               <div style="margin-top:10px;">
                 <label for="lang-select-${tabId}">Select Language:</label>
                 <select id="lang-select-${tabId}">
                   <option value="typescript">TypeScript</option>
                   <option value="python">Python</option>
                   <option value="go">Go</option>
                 </select>
                 <button onclick="generateCode('${tabId}')">Generate Code</button>
                 <button class="copy-button" onclick="copyCodeOutput('${tabId}')">Copy Code</button>
               </div>
               <pre class="code-output" style="margin-top:10px; overflow:auto;"></pre>
             `;
  document.getElementById("codegen-tab-contents").appendChild(tabContent);
  const textarea = tabContent.querySelector(".json-input");
  textarea.addEventListener("paste", () =>
    setTimeout(() => autoFormatTextarea(textarea), 100)
  );
  textarea.addEventListener("blur", () => autoFormatTextarea(textarea));
  saveGlobalState();
}

function createCodegenTabWithData(tabData) {
  codegenTabCount++;
  const tabId = tabData.id;
  const tabButton = document.createElement("button");
  tabButton.className = "tab-button";
  tabButton.setAttribute("data-tab", tabId);
  tabButton.onclick = () => switchCodegenTab(tabId);

  const nameSpan = document.createElement("span");
  nameSpan.className = "tab-name";
  nameSpan.textContent = tabData.name;

  const closeSpan = document.createElement("span");
  closeSpan.className = "close-tab";
  closeSpan.textContent = "×";
  closeSpan.onclick = (e) => closeCodegenTab(tabId, e);

  tabButton.append(nameSpan, closeSpan);

  tabButton.addEventListener("dblclick", () =>
    openTabRenameTooltip(tabId, "codegen")
  );
  const tabsContainer = document.getElementById("codegen-tabs-container");
  const addButton = tabsContainer.querySelector(".add-tab-button");
  tabsContainer.insertBefore(tabButton, addButton);
  const tabContent = document.createElement("div");
  tabContent.id = tabId;
  tabContent.className = "json-tab-content";
  tabContent.innerHTML = `
               <textarea class="json-input" placeholder="Enter JSON here..."></textarea>
               <div style="margin-top:10px;">
                 <label for="lang-select-${tabId}">Select Language:</label>
                 <select id="lang-select-${tabId}">
                   <option value="typescript">TypeScript</option>
                   <option value="python">Python</option>
                   <option value="go">Go</option>
                 </select>
                 <button onclick="generateCode('${tabId}')">Generate Code</button>
               </div>
               <pre class="code-output" style="margin-top:10px; overflow:auto;"></pre>
             `;
  document.getElementById("codegen-tab-contents").appendChild(tabContent);
  const textarea = tabContent.querySelector(".json-input");
  textarea.value = tabData.input;
  const selectElem = document.getElementById("lang-select-" + tabId);
  selectElem.value = tabData.lang;
  textarea.addEventListener("paste", () =>
    setTimeout(() => autoFormatTextarea(textarea), 100)
  );
  textarea.addEventListener("blur", () => autoFormatTextarea(textarea));
  saveGlobalState();
  enableTabReordering("codegen-tabs-container");
}

function switchCodegenTab(tabId) {
  document
    .querySelectorAll("#codegen-tab-contents .json-tab-content")
    .forEach((tab) => tab.classList.remove("active"));
  const selectedTab = document.getElementById(tabId);
  if (selectedTab) selectedTab.classList.add("active");
  document
    .querySelectorAll("#codegen-tabs-container .tab-button[data-tab]")
    .forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
    });
  saveGlobalState();
}

function generateCode(tabId) {
  const tabContent = document.getElementById(tabId);
  const textarea = tabContent.querySelector(".json-input");
  const langSelect = document.getElementById("lang-select-" + tabId);
  const outputPre = tabContent.querySelector(".code-output");
  const inputText = textarea.value;
  const lang = langSelect.value;
  let obj;
  try {
    obj = JSON.parse(inputText);
  } catch (e) {
    outputPre.textContent = "Invalid JSON: " + e.message;
    return;
  }
  let code = "";
  if (lang === "typescript") code = generateTypeScript(obj, "Root");
  else if (lang === "python") code = generatePython(obj, "Root");
  else if (lang === "go") code = generateGo(obj, "Root");
  outputPre.textContent = code;
  saveGlobalState();
}

async function closeCodegenTab(tabId, event) {
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
    `#codegen-tabs-container .tab-button[data-tab="${tabId}"]`
  );
  const tabContent = document.getElementById(tabId);
  if (tabButton) tabButton.remove();
  if (tabContent) tabContent.remove();
  const remaining = document.querySelectorAll(
    "#codegen-tab-contents .json-tab-content"
  );
  if (remaining.length > 0)
    switchCodegenTab(remaining[remaining.length - 1].id);
  saveGlobalState();
}

function copyCodeOutput(tabId) {
  const codePre = document.querySelector(`#${tabId} .code-output`);
  copyToClipboard(codePre.textContent, "Code copied");
}

function generateTypeScript(obj, interfaceName) {
  let result = `interface ${interfaceName} {\n`;
  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) continue;
    const value = obj[key];
    if (value === null) {
      result += `  ${key}: any;\n`;
    } else if (Array.isArray(value)) {
      if (value.length > 0) {
        const elem = value[0];
        if (typeof elem === "object" && elem !== null) {
          const subInterface = interfaceName + capitalize(key);
          result += `  ${key}: ${subInterface}[];\n`;
          result += generateTypeScript(elem, subInterface);
        } else {
          result += `  ${key}: ${typeof elem}[];\n`;
        }
      } else {
        result += `  ${key}: any[];\n`;
      }
    } else if (typeof value === "object") {
      const subInterface = interfaceName + capitalize(key);
      result += `  ${key}: ${subInterface};\n`;
      result += generateTypeScript(value, subInterface);
    } else {
      result += `  ${key}: ${typeof value};\n`;
    }
  }
  result += "}\n";
  return result;
}

function generatePython(obj, className, isRoot = true) {
  let result = "";
  if (isRoot) {
    result +=
      "from dataclasses import dataclass\\nfrom typing import Any, List\\n\\n";
  }
  result += `@dataclass\\nclass ${className}:\\n`;
  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) continue;
    const value = obj[key];
    let pyType = "Any";
    if (value === null) {
      pyType = "Any";
    } else if (Array.isArray(value)) {
      if (value.length > 0) {
        const elem = value[0];
        if (typeof elem === "object" && elem !== null) {
          const subClass = className + capitalize(key);
          pyType = `List[${subClass}]`;
          result += "\\n" + generatePython(elem, subClass, false);
        } else {
          if (typeof elem === "number") pyType = "List[float]";
          else if (typeof elem === "string") pyType = "List[str]";
          else if (typeof elem === "boolean") pyType = "List[bool]";
          else pyType = "List[Any]";
        }
      } else {
        pyType = "List[Any]";
      }
    } else if (typeof value === "object") {
      const subClass = className + capitalize(key);
      pyType = subClass;
      result += "\\n" + generatePython(value, subClass, false);
    } else {
      if (typeof value === "number") pyType = "float";
      else if (typeof value === "string") pyType = "str";
      else if (typeof value === "boolean") pyType = "bool";
    }
    result += `    ${key}: ${pyType}\n`;
  }
  return result;
}

function generateGo(obj, structName) {
  let result = `type ${structName} struct {\n`;
  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) continue;
    const value = obj[key];
    let goType = "interface{}";
    if (value === null) {
      goType = "interface{}";
    } else if (Array.isArray(value)) {
      if (value.length > 0) {
        const elem = value[0];
        if (typeof elem === "object" && elem !== null) {
          const subStruct = structName + capitalize(key);
          goType = `[]${subStruct}`;
          result += generateGo(elem, subStruct);
        } else {
          if (typeof elem === "number") goType = "[]float64";
          else if (typeof elem === "string") goType = "[]string";
          else if (typeof elem === "boolean") goType = "[]bool";
          else goType = "[]interface{}";
        }
      } else {
        goType = "[]interface{}";
      }
    } else if (typeof value === "object") {
      const subStruct = structName + capitalize(key);
      goType = subStruct;
      result += generateGo(value, subStruct);
    } else {
      if (typeof value === "number") goType = "float64";
      else if (typeof value === "string") goType = "string";
      else if (typeof value === "boolean") goType = "bool";
    }
    const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
    result += `    ${fieldName} ${goType} \`json:"${key}"\`\n`;
  }
  result += "}\n";
  return result;
}
