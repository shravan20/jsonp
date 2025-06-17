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
  enableTabReordering("compare-tabs-container");
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
  enableTabReordering("compare-tabs-container");
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
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
    });
  saveGlobalState();
}

function compareJSONs(tabId) {
  const tabContent = document.getElementById(tabId);
  const leftTA = tabContent.querySelector(".json-input-left");
  const rightTA = tabContent.querySelector(".json-input-right");
  const resultDiv = tabContent.querySelector(".compare-result");
  const leftText = leftTA.value;
  const rightText = rightTA.value;
  let leftObj;
  let rightObj;
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
  resultDiv.innerHTML = `
                  <div style="margin-bottom: 10px;">
                      <button class="copy-button" onclick="copyCompareLeft('${tabId}')">Copy Left</button>
                      <button class="copy-button" onclick="copyCompareRight('${tabId}')">Copy Right</button>
                  </div>
                  ${diffJSONsPreview(leftFormatted, rightFormatted)}
              `;
  leftTA.value = leftFormatted;
  rightTA.value = rightFormatted;
  saveGlobalState();
}

async function closeCompareTab(tabId, event) {
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

function copyCompareLeft(tabId) {
  const leftTA = document.querySelector(`#${tabId} .json-input-left`);
  copyToClipboard(leftTA.value, "Left JSON copied");
}

function copyCompareRight(tabId) {
  const rightTA = document.querySelector(`#${tabId} .json-input-right`);
  copyToClipboard(rightTA.value, "Right JSON copied");
}