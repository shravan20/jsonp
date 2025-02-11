
/* ========== Global Persistence Functions ========== */
function getActiveMode() {
    if (
        document.getElementById("formatter-section").style.display !== "none"
    )
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
            tabs: []
        },
        compare: {
            activeTab:
                document.querySelector(
                    "#compare-tab-contents .json-tab-content.active"
                )?.id || "",
            tabs: []
        },
        codegen: {
            activeTab:
                document.querySelector(
                    "#codegen-tab-contents .json-tab-content.active"
                )?.id || "",
            tabs: []
        }
    };
    // Formatter tabs
    document
        .querySelectorAll("#formatter-tabs-container .tab-button[data-tab]")
        .forEach((btn) => {
            const tabId = btn.getAttribute("data-tab");
            const name = btn.querySelector(".tab-name").textContent;
            const color =
                btn.querySelector(".tab-color-picker")?.value || "#e0e0e0";
            const content =
                document.querySelector("#" + tabId + " .json-input")?.value || "";
            state.formatter.tabs.push({ id: tabId, name, color, content });
        });
    // Compare tabs
    document
        .querySelectorAll("#compare-tabs-container .tab-button[data-tab]")
        .forEach((btn) => {
            const tabId = btn.getAttribute("data-tab");
            const name = btn.querySelector(".tab-name").textContent;
            const leftContent =
                document.querySelector("#" + tabId + " .json-input-left")
                    ?.value || "";
            const rightContent =
                document.querySelector("#" + tabId + " .json-input-right")
                    ?.value || "";
            state.compare.tabs.push({
                id: tabId,
                name,
                leftContent,
                rightContent
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
                document.getElementById("lang-select-" + tabId)?.value ||
                "typescript";
            state.codegen.tabs.push({ id: tabId, name, input, lang });
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
    ftc
        .querySelectorAll(".tab-button[data-tab]")
        .forEach((btn) => btn.remove());
    document.getElementById("formatter-tab-contents").innerHTML = "";
    formatterTabCount = 0;
    state.formatter.tabs.forEach((tabData) => {
        createFormatterTab(tabData);
    });
    if (state.formatter.activeTab)
        switchFormatterTab(state.formatter.activeTab);

    // Load Compare tabs
    const ctc = document.getElementById("compare-tabs-container");
    ctc
        .querySelectorAll(".tab-button[data-tab]")
        .forEach((btn) => btn.remove());
    document.getElementById("compare-tab-contents").innerHTML = "";
    compareTabCount = 0;
    state.compare.tabs.forEach((tabData) => {
        createCompareTabWithData(tabData);
    });
    if (state.compare.activeTab) switchCompareTab(state.compare.activeTab);

    // Load Codegen tabs
    const cgtc = document.getElementById("codegen-tabs-container");
    cgtc
        .querySelectorAll(".tab-button[data-tab]")
        .forEach((btn) => btn.remove());
    document.getElementById("codegen-tab-contents").innerHTML = "";
    codegenTabCount = 0;
    state.codegen.tabs.forEach((tabData) => {
        createCodegenTabWithData(tabData);
    });
    if (state.codegen.activeTab) switchCodegenTab(state.codegen.activeTab);
}

/* ========== Mode Selector ========== */
function switchMode(mode) {
    document.getElementById("formatter-section").style.display = "none";
    document.getElementById("compare-section").style.display = "none";
    document.getElementById("codegen-section").style.display = "none";
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
    }
    saveGlobalState();
}

/* ========== Formatter Functions ========== */
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
    tabButton.innerHTML = `<span class="tab-name">${tabData && tabData.name ? tabData.name : "Tab " + formatterTabCount
        }</span>
    <input type="color" class="tab-color-picker" value="${tabData && tabData.color ? tabData.color : "#e0e0e0"
        }" onchange="updateFormatterTabColor('${tabId}', this.value)">
    <span class="close-tab" onclick="closeFormatterTab('${tabId}', event)">×</span>`;
    tabButton.addEventListener("dblclick", () =>
        openTabRenameTooltip(tabId, "formatter")
    );
    const tabsContainer = document.getElementById(
        "formatter-tabs-container"
    );
    const addButton = tabsContainer.querySelector(".add-tab-button");
    tabsContainer.insertBefore(tabButton, addButton);
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
    `;
    document
        .getElementById("formatter-tab-contents")
        .appendChild(tabContent);
    // Set content if provided
    if (tabData && tabData.content) {
        tabContent.querySelector(".json-input").value = tabData.content;
    }
    const textarea = tabContent.querySelector(".json-input");
    textarea.addEventListener("paste", () =>
        setTimeout(() => autoFormatTextarea(textarea), 100)
    );
    textarea.addEventListener("blur", () => autoFormatTextarea(textarea));
    textarea.addEventListener("input", () => updateFormatterPreview(tabId));
    updateFormatterPreview(tabId);
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
            btn.classList.toggle(
                "active",
                btn.getAttribute("data-tab") === tabId
            );
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
        textarea.value = formatted;
    } catch (e) {
        errorMessage.textContent = "Error: " + e.message;
        showFormatterPreviewTab(tabId, "error");
    }
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
    if (rawPreview.classList.contains("active")) {
        const content = rawPreview.textContent;
        rawPreview.innerHTML = content.replace(
            regex,
            '<span class="highlight">$1</span>'
        );
    }
    if (treeView.classList.contains("active")) {
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
    // If needed, update visual indicators here.
    saveGlobalState();
}
function uploadFormatterJSON(tabId, inputElement) {
    if (inputElement.files && inputElement.files[0]) {
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
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = tabId + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
function closeFormatterTab(tabId, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    if (!confirm("Are you sure you want to close this tab?")) return;
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

/* ========== Compare Functions ========== */
let compareTabCount = 0;
function addCompareTab() {
    createCompareTab();
    switchCompareTab("compareTab" + compareTabCount);
    saveGlobalState();
}
function createCompareTab() {
    compareTabCount++;
    const tabId = "compareTab" + compareTabCount;
    // Create tab button
    const tabButton = document.createElement("button");
    tabButton.className = "tab-button";
    tabButton.setAttribute("data-tab", tabId);
    tabButton.onclick = () => switchCompareTab(tabId);
    tabButton.innerHTML = `<span class="tab-name">Tab ${compareTabCount}</span>
    <span class="close-tab" onclick="closeCompareTab('${tabId}', event)">×</span>`;
    tabButton.addEventListener("dblclick", () =>
        openTabRenameTooltip(tabId, "compare")
    );
    const tabsContainer = document.getElementById("compare-tabs-container");
    const addButton = tabsContainer.querySelector(".add-tab-button");
    tabsContainer.insertBefore(tabButton, addButton);
    // Create tab content
    const tabContent = document.createElement("div");
    tabContent.id = tabId;
    tabContent.className = "json-tab-content";
    tabContent.innerHTML = `
    <div style="display:flex; gap:10px;">
        <textarea class="json-input-left" placeholder="Enter Left JSON" style="width:48%; height:200px;"></textarea>
        <textarea class="json-input-right" placeholder="Enter Right JSON" style="width:48%; height:200px;"></textarea>
    </div>
    <button onclick="compareJSONs('${tabId}')">Compare JSONs</button>
    <div class="compare-result" style="margin-top:10px;"></div>
    `;
    document.getElementById("compare-tab-contents").appendChild(tabContent);
    const leftTA = tabContent.querySelector(".json-input-left");
    const rightTA = tabContent.querySelector(".json-input-right");
    leftTA.addEventListener("paste", () =>
        setTimeout(() => autoFormatTextarea(leftTA), 100)
    );
    leftTA.addEventListener("blur", () => autoFormatTextarea(leftTA));
    rightTA.addEventListener("paste", () =>
        setTimeout(() => autoFormatTextarea(rightTA), 100)
    );
    rightTA.addEventListener("blur", () => autoFormatTextarea(rightTA));
    saveGlobalState();
}
// Create Compare tab using saved data
function createCompareTabWithData(tabData) {
    compareTabCount++;
    const tabId = tabData.id;
    const tabButton = document.createElement("button");
    tabButton.className = "tab-button";
    tabButton.setAttribute("data-tab", tabId);
    tabButton.onclick = () => switchCompareTab(tabId);
    tabButton.innerHTML = `<span class="tab-name">${tabData.name}</span>
    <span class="close-tab" onclick="closeCompareTab('${tabId}', event)">×</span>`;
    tabButton.addEventListener("dblclick", () =>
        openTabRenameTooltip(tabId, "compare")
    );
    const tabsContainer = document.getElementById("compare-tabs-container");
    const addButton = tabsContainer.querySelector(".add-tab-button");
    tabsContainer.insertBefore(tabButton, addButton);
    const tabContent = document.createElement("div");
    tabContent.id = tabId;
    tabContent.className = "json-tab-content";
    tabContent.innerHTML = `
    <div style="display:flex; gap:10px;">
        <textarea class="json-input-left" placeholder="Enter Left JSON" style="width:48%; height:200px;"></textarea>
        <textarea class="json-input-right" placeholder="Enter Right JSON" style="width:48%; height:200px;"></textarea>
    </div>
    <button onclick="compareJSONs('${tabId}')">Compare JSONs</button>
    <div class="compare-result" style="margin-top:10px;"></div>
    `;
    document.getElementById("compare-tab-contents").appendChild(tabContent);
    const leftTA = tabContent.querySelector(".json-input-left");
    const rightTA = tabContent.querySelector(".json-input-right");
    leftTA.value = tabData.leftContent;
    rightTA.value = tabData.rightContent;
    leftTA.addEventListener("paste", () =>
        setTimeout(() => autoFormatTextarea(leftTA), 100)
    );
    leftTA.addEventListener("blur", () => autoFormatTextarea(leftTA));
    rightTA.addEventListener("paste", () =>
        setTimeout(() => autoFormatTextarea(rightTA), 100)
    );
    rightTA.addEventListener("blur", () => autoFormatTextarea(rightTA));
    saveGlobalState();
}
function switchCompareTab(tabId) {
    document
        .querySelectorAll("#compare-tab-contents .json-tab-content")
        .forEach((tab) => tab.classList.remove("active"));
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) selectedTab.classList.add("active");
    document
        .querySelectorAll("#compare-tabs-container .tab-button[data-tab]")
        .forEach((btn) => {
            btn.classList.toggle(
                "active",
                btn.getAttribute("data-tab") === tabId
            );
        });
    saveGlobalState();
}
function compareJSONs(tabId) {
    const tabContent = document.getElementById(tabId);
    const leftTA = tabContent.querySelector(".json-input-left");
    const rightTA = tabContent.querySelector(".json-input-right");
    const resultDiv = tabContent.querySelector(".compare-result");
    let leftText = leftTA.value;
    let rightText = rightTA.value;
    let leftObj, rightObj;
    try {
        leftObj = JSON.parse(leftText);
    } catch (e) {
        resultDiv.textContent = "Left JSON Error: " + e.message;
        return;
    }
    try {
        rightObj = JSON.parse(rightText);
    } catch (e) {
        resultDiv.textContent = "Right JSON Error: " + e.message;
        return;
    }
    const leftFormatted = JSON.stringify(leftObj, null, 2);
    const rightFormatted = JSON.stringify(rightObj, null, 2);
    resultDiv.innerHTML = diffJSONsPreview(leftFormatted, rightFormatted);
    leftTA.value = leftFormatted;
    rightTA.value = rightFormatted;
    saveGlobalState();
}

function diffJSONsPreview(leftText, rightText) {
    const isDarkMode = document.body.classList.contains("dark-mode");
    // Choose a diff color based on the theme:
    // For light mode, use a light red; for dark mode, use a darker or more muted red.
    const diffStyle = isDarkMode
        ? "background-color:#662222;"
        : "background-color:#ddd;";

    const leftLines = leftText.split("\n");
    const rightLines = rightText.split("\n");
    const maxLines = Math.max(leftLines.length, rightLines.length);
    let html = "<table style='width:100%; border-collapse:collapse;'>";
    for (let i = 0; i < maxLines; i++) {
        const lLine = leftLines[i] || "";
        const rLine = rightLines[i] || "";
        // Apply diffStyle if the lines differ
        const style = lLine === rLine ? "" : diffStyle;
        html += `<tr>
            <td style="width:50%; padding:2px; border:1px solid #ddd; ${style}">
                <pre style="margin:0;">${lLine}</pre>
            </td>
            <td style="width:50%; padding:2px; border:1px solid #ddd; ${style}">
                <pre style="margin:0;">${rLine}</pre>
            </td>
        </tr>`;
    }
    html += "</table>";
    return html;
}

function closeCompareTab(tabId, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    if (!confirm("Are you sure you want to close this tab?")) return;
    const tabButton = document.querySelector(
        `#compare-tabs-container .tab-button[data-tab="${tabId}"]`
    );
    const tabContent = document.getElementById(tabId);
    if (tabButton) tabButton.remove();
    if (tabContent) tabContent.remove();
    const remaining = document.querySelectorAll(
        "#compare-tab-contents .json-tab-content"
    );
    if (remaining.length > 0)
        switchCompareTab(remaining[remaining.length - 1].id);
    saveGlobalState();
}

/* ========== CodeGen Functions ========== */
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
    tabButton.innerHTML = `<span class="tab-name">${tabData.name}</span>
    <span class="close-tab" onclick="closeCodegenTab('${tabId}', event)">×</span>`;
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
            btn.classList.toggle(
                "active",
                btn.getAttribute("data-tab") === tabId
            );
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
function closeCodegenTab(tabId, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    if (!confirm("Are you sure you want to close this tab?")) return;
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

/* ========== Utility Functions ========== */
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
    function processNode(value, parent, key) {
        const node = document.createElement("div");
        node.className = "tree-node";
        if (typeof value === "object" && value !== null) {
            const keySpan = document.createElement("span");
            keySpan.className = "tree-key collapsed";
            keySpan.textContent =
                key !== undefined
                    ? key
                    : Array.isArray(value)
                        ? `[${value.length}]`
                        : `{${Object.keys(value).length}}`;
            keySpan.onclick = () => {
                keySpan.classList.toggle("collapsed");
                keySpan.classList.toggle("expanded");
                children.classList.toggle("hidden");
            };
            const children = document.createElement("div");
            children.className = "tree-children";
            if (Array.isArray(value)) {
                value.forEach((item, index) =>
                    processNode(item, children, index)
                );
            } else {
                Object.entries(value).forEach(([k, v]) =>
                    processNode(v, children, k)
                );
            }
            node.appendChild(keySpan);
            node.appendChild(children);
            parent.appendChild(node);
        } else {
            node.textContent = key + ": " + value;
            parent.appendChild(node);
        }
    }
    processNode(data, parentElement);
}
function openTabRenameTooltip(tabId, mode) {
    let containerSelector;
    if (mode === "formatter")
        containerSelector = "#formatter-tabs-container";
    else if (mode === "compare")
        containerSelector = "#compare-tabs-container";
    else if (mode === "codegen")
        containerSelector = "#codegen-tabs-container";
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
function generateTypeScript(obj, interfaceName) {
    let result = `interface ${interfaceName} {\n`;
    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
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
    result += `}\n`;
    return result;
}
function generatePython(obj, className) {
    let result = `from dataclasses import dataclass\nfrom typing import Any, List\n\n`;
    result += `@dataclass\nclass ${className}:\n`;
    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
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
                    result += `\n` + generatePython(elem, subClass);
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
            result += `\n` + generatePython(value, subClass);
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
    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        const value = obj[key];
        let goType = "interface{ }";
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
                    else goType = "[]interface{ }";
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
    result += `}\n`;
    return result;
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/* ========== Shortcut Modal & Dark Mode ========== */
function toggleShortcutModal() {
    const modal = document.getElementById("shortcut-modal");
    modal.style.display =
        modal.style.display === "block" ? "none" : "block";
}
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    saveGlobalState();
    // If the Compare section is visible, update all diff previews
    if (
        document.getElementById("compare-section").style.display !== "none"
    ) {
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
    // If no saved state, create a default Formatter tab.
    if (
        document.getElementById("formatter-tab-contents").children.length ===
        0
    ) {
        addFormatterTab();
    }
});
