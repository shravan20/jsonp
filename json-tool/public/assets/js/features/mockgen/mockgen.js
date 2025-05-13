/* ========== Mock data generator ========== */
let latestMockData = [];
const presets = {
  User: {
    id: "number|1000-9999",
    name: "name.fullName",
    email: "internet.email",
    isActive: "boolean",
  },
  Product: {
    id: "number|1-1000",
    title: "commerce.productName",
    price: "number|10-500",
    available: "boolean",
  },
};

function loadMockPreset(name) {
  if (presets[name]) {
    document.getElementById("mock-schema-input").value = JSON.stringify(
      presets[name],
      null,
      2
    );
  }
}

function generateMockData() {
  const input = document.getElementById("mock-schema-input").value;
  const count = parseInt(
    document.getElementById("mockgen-count").value || "1",
    10
  );
  const outputContainer = document.getElementById("mock-output-container");

  try {
    const schema = JSON.parse(input);
    latestMockData = Array.from({ length: count }, () => {
      try {
        return mockFromSchema(schema);
      } catch (err) {
        return { error: err.message };
      }
    });
    document.getElementById(
      "mock-stats"
    ).textContent = `Showing ${count} record(s)`;
    updateMockView();
  } catch (e) {
    outputContainer.innerHTML = `<pre class="code-output">❌ Error: ${e.message}</pre>`;
  }
}

function mockFromSchema(schema) {
  if (Array.isArray(schema)) {
    return schema.map((item) => mockFromSchema(item));
  } else if (typeof schema === "object") {
    const result = {};
    for (const [key, value] of Object.entries(schema)) {
      result[key] = mockFromSchema(value);
    }
    return result;
  } else if (typeof schema === "string") {
    if (schema === "boolean") return Math.random() < 0.5;
    if (schema.startsWith("number|")) {
      const [min, max] = schema.split("|")[1].split("-").map(Number);
      return faker.number.int({ min, max });
    }

    const fakerFn = schema.split(".");
    let val = faker;
    for (const part of fakerFn) {
      val = val?.[part];
    }
    if (typeof val === "function") return val();
    throw new Error(`Invalid faker path: "${schema}"`);
  } else {
    return schema;
  }
}

function updateMockView() {
  const mode = document.querySelector(
    'input[name="mock-view-mode"]:checked'
  ).value;
  const container = document.getElementById("mock-output-container");
  container.innerHTML = "";

  if (mode === "json") {
    const pre = document.createElement("pre");
    pre.className = "code-output";
    pre.textContent = JSON.stringify(
      latestMockData.length === 1 ? latestMockData[0] : latestMockData,
      null,
      2
    );
    container.appendChild(pre);
  } else {
    container.appendChild(renderTableFromJson(latestMockData));
  }
}

function renderTableFromJson(data) {
  const table = document.createElement("table");
  table.className = "mock-preview-table";

  if (
    !Array.isArray(data) ||
    data.length === 0 ||
    typeof data[0] !== "object"
  ) {
    table.innerHTML = "<tr><td>No tabular data available</td></tr>";
    return table;
  }

  const headers = [...new Set(data.flatMap((obj) => Object.keys(obj)))];
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headers.forEach((h) => {
    const th = document.createElement("th");
    th.textContent = h;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  data.forEach((row) => {
    const tr = document.createElement("tr");
    headers.forEach((key) => {
      const td = document.createElement("td");
      const val = row[key];
      if (val && typeof val === "object") {
        td.textContent = JSON.stringify(val);
      } else {
        td.textContent = val ?? "";
      }
      if (row.error) td.style.backgroundColor = "#ffe6e6";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
}

function copyMockOutput(format = "json") {
  let text = "";
  if (format === "json") {
    text = JSON.stringify(
      latestMockData.length === 1 ? latestMockData[0] : latestMockData,
      null,
      2
    );
  } else if (format === "csv") {
    if (!latestMockData.length || typeof latestMockData[0] !== "object") return;
    const keys = Object.keys(latestMockData[0]);
    const rows = latestMockData.map((obj) =>
      keys.map((k) => JSON.stringify(obj[k] ?? ""))
    );
    text = [keys.join(","), ...rows.map((r) => r.join(","))].join("\n");
  }

  copyToClipboard(text, `Copied ${format.toUpperCase()}!`);
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

let userInputValue = ""; // This variable will store filename input from user using the following event listener:

document.getElementById("userInput").addEventListener("input", function (e) {
  userInputValue = e.target.value;
});

function exportMockOutput(format = "json") {
  if (!Array.isArray(latestMockData) || latestMockData.length === 0) {
    console.error("No data available to export.");
    return;
  }

  let content = "";
  let filename = userInputValue !== "" ? userInputValue : "mock_data"; // Use user input if available

  if (format === "json") {
    content = JSON.stringify(
      latestMockData.length === 1 ? latestMockData[0] : latestMockData,
      null,
      2
    );
    filename += ".json";
    downloadFile(content, filename, "application/json");
  } else if (format === "csv") {
    if (!latestMockData.length || typeof latestMockData[0] !== "object") return;

    const keys = Object.keys(latestMockData[0]);
    const rows = latestMockData.map((obj) =>
      keys.map((k) => JSON.stringify(obj[k] ?? ""))
    );
    content = [keys.join(","), ...rows.map((r) => r.join(","))].join("\n");
    filename += ".csv";
    downloadFile(content, filename, "text/csv");
  }
}

const mockgenDocs = `
# 🧪 Mock Data Schema Format

## Supported Types

- \`"name.fullName"\`: Full name
- \`"internet.email"\`: Email address
- \`"number|10-50"\`: Custom range
- \`"boolean"\`: true / false
- Arrays: \`["lorem.word"]\`
- Nested: 

\`\`\`json
{
  "user": {
    "name": "name.fullName",
    "email": "internet.email"
  }
}
\`\`\`

## Example

\`\`\`json
{
  "id": "number|1000-9999",
  "name": "name.fullName",
  "email": "internet.email",
  "isActive": "boolean"
}
\`\`\`
`;

function switchMockTab(tab) {
  const schemaPanel = document.getElementById("mockgen-schema-panel");
  const docsPanel = document.getElementById("mockgen-docs-panel");

  document.getElementById("mock-tab-schema").classList.remove("active");
  document.getElementById("mock-tab-docs").classList.remove("active");

  if (tab === "schema") {
    schemaPanel.style.display = "block";
    docsPanel.style.display = "none";
    document.getElementById("mock-tab-schema").classList.add("active");
  } else {
    schemaPanel.style.display = "none";
    docsPanel.style.display = "block";
    document.getElementById("mock-tab-docs").classList.add("active");
    renderMockgenDocs();
  }
}

function renderMockgenDocs() {
  document.getElementById("mockgen-docs-preview").innerHTML =
    marked.parse(mockgenDocs);
}
