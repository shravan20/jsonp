let editorTabCount = 0;
const editorInstances = {};

function addEditorTab(tabData = null) {
  let tabId;
  if (tabData?.id) {
    tabId = tabData.id;
    const match = tabId.match(/editor-tab-(\d+)/);
    if (match && Number.parseInt(match[1], 10) > editorTabCount) {
      editorTabCount = Number.parseInt(match[1], 10);
    }
  } else {
    editorTabCount++;
    tabId = `editor-tab-${editorTabCount}`;
  }

  const tabButton = document.createElement("button");
  tabButton.className = "tab-button";
  tabButton.setAttribute("data-tab", tabId);
  tabButton.innerHTML = `<span class="tab-name">${
    tabData?.title || `Note ${editorTabCount}`
  }</span><span class="close-tab" onclick="deleteEditorTab('${tabId}', event)">×</span>`;
  tabButton.onclick = () => switchEditorTab(tabId);
  tabButton.addEventListener("dblclick", () =>
    openTabRenameTooltip(tabId, "editor")
  );

  document
    .getElementById("editor-tabs-container")
    .insertBefore(
      tabButton,
      document.querySelector("#editor-tabs-container .add-tab-button")
    );

  const tabContent = document.createElement("div");
  tabContent.id = tabId;
  tabContent.className = "json-tab-content";
  tabContent.innerHTML = `
      <div id="${tabId}-editor"></div>
      <div style="margin-top:10px;">
        <button onclick="saveEditorContent('${tabId}')">💾 Save</button>
      </div>
    `;

  document.getElementById("editor-tab-contents").appendChild(tabContent);

  const editor = new toastui.Editor({
    el: document.getElementById(`${tabId}-editor`),
    height: "400px",
    initialEditType: "markdown",
    previewStyle: "vertical",
  });
  editorInstances[tabId] = editor;

  const saved = localStorage.getItem(tabId);
  if (saved) editor.setMarkdown(saved);

  enableTabReordering("editor-tabs-container");
  applyEditorTabDarkMode();
}

function switchEditorTab(tabId) {
  document
    .querySelectorAll("#editor-tab-contents .json-tab-content")
    .forEach((el) => el.classList.remove("active"));
  document.getElementById(tabId)?.classList.add("active");

  document
    .querySelectorAll("#editor-tabs-container .tab-button")
    .forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
    });
  updateEditorGlobalState();
}

function saveEditorContent(tabId, silent = false) {
  const content = editorInstances[tabId].getMarkdown();
  localStorage.setItem(tabId, content);
  updateEditorGlobalState();
  if (!silent) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Saved!", // Changed from Autosaved to Saved!
      showConfirmButton: false,
      timer: 1500,
    });
  }
}

async function deleteEditorTab(tabId, event) {
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

  localStorage.removeItem(tabId);
  editorInstances[tabId]?.destroy();
  delete editorInstances[tabId];
  document
    .querySelector(`#editor-tabs-container .tab-button[data-tab="${tabId}"]`)
    ?.remove();
  document.getElementById(tabId)?.remove();
  const remaining = document.querySelectorAll(
    "#editor-tab-contents .json-tab-content"
  );
  if (remaining.length > 0) switchEditorTab(remaining[0].id);
  updateEditorGlobalState();
}

function updateEditorGlobalState() {
  const state = {
    activeTab:
      document.querySelector("#editor-tab-contents .json-tab-content.active")
        ?.id || "",
    tabs: [],
  };
  document
    .querySelectorAll("#editor-tabs-container .tab-button[data-tab]")
    .forEach((btn) => {
      const tabId = btn.getAttribute("data-tab");
      const title = btn.querySelector(".tab-name").textContent;
      state.tabs.push({ id: tabId, title });
    });
  localStorage.setItem("editorState", JSON.stringify(state));
}

function loadEditorGlobalState() {
  const stateStr = localStorage.getItem("editorState");
  const container = document.getElementById("editor-tabs-container");
  container
    .querySelectorAll(".tab-button[data-tab]")
    .forEach((btn) => btn.remove());
  document.getElementById("editor-tab-contents").innerHTML = "";
  editorTabCount = 0;

  if (!stateStr) {
    addEditorTab();
    return;
  }

  const state = JSON.parse(stateStr);
  state.tabs.forEach((tabData) => addEditorTab(tabData));

  if (state.activeTab && document.getElementById(state.activeTab)) {
    switchEditorTab(state.activeTab);
  } else if (state.tabs.length > 0) {
    switchEditorTab(state.tabs[0].id);
  }
}

function applyEditorTabDarkMode() {
  const container = document.getElementById("editor-tabs-container");
  container.querySelectorAll(".tab-button").forEach((btn) => {
    if (document.body.classList.contains("dark-mode")) {
      btn.style.backgroundColor = "#2c2c2c";
      btn.style.color = "#eee";
      btn.style.borderColor = "#444";
    } else {
      btn.style.backgroundColor = "";
      btn.style.color = "";
      btn.style.borderColor = "";
    }
  });
}
