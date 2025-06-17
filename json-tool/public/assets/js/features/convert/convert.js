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
      // 1) None/True/False → null/true/false
      let json = input
        .replace(/\bNone\b/g, "null")
        .replace(/\bTrue\b/g, "true")
        .replace(/\bFalse\b/g, "false");
      // 2) remove trailing commas before } or ]
      json = json.replace(/,\s*(?=[}\]])/g, "");
      // 3) convert only quoted 'strings' → "strings"
      json = json.replace(/'([^']*?)'/g, '"$1"');

      const parsed = JSON.parse(json);
      output.textContent = JSON.stringify(parsed, null, 2);
    } else {
      // JSON → Python dict
      const obj = JSON.parse(input);
      let dictStr = JSON.stringify(obj, null, 2);
      // 1) only replace "quoted" strings → 'strings'
      dictStr = dictStr.replace(/"([^"]*?)"/g, "'$1'");
      // 2) true/false/null → True/False/None
      dictStr = dictStr
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
