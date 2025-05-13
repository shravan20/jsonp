/* ========== Convert to Dict Functions ========== */
let currentConvertMode = "dict-to-json";

function switchConvertDirection(mode) {
  currentConvertMode = mode;
  document.querySelectorAll("#convert-section .tab-button").forEach((btn) => {
    btn.classList.toggle(
      "active",
      btn.textContent.includes("Dict") === (mode === "dict-to-json")
    );
  });
  document.getElementById("convert-input").value = "";
  document.getElementById("convert-output").textContent = "";
}

function convert() {
  const input = document.getElementById("convert-input").value;
  const output = document.getElementById("convert-output");

  try {
    if (currentConvertMode === "dict-to-json") {
      // Convert Python dict string → JSON
      const jsonCompatible = input
        .replace(/'/g, '"')
        .replace(/\bTrue\b/g, "true")
        .replace(/\bFalse\b/g, "false")
        .replace(/\bNone\b/g, "null");
      const parsed = JSON.parse(jsonCompatible);
      output.textContent = JSON.stringify(parsed, null, 2);
    } else {
      // Convert JSON → Python dict string
      const parsed = JSON.parse(input);
      let dictStr = JSON.stringify(parsed, null, 2)
        .replace(/"/g, "'")
        .replace(/\btrue\b/g, "True")
        .replace(/\bfalse\b/g, "False")
        .replace(/\bnull\b/g, "None");
      output.textContent = dictStr;
    }
  } catch (e) {
    output.textContent = "Error: " + e.message;
  }
}

function copyConvertOutput() {
  const output = document.getElementById("convert-output").textContent;
  copyToClipboard(output, "Copied!");
}
