function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatValue(value) {
  if (value === null) return "null";
  if (typeof value === "string") return `"${value}"`;
  return value.toString();
}

function getValueTypeClass(value) {
  if (value === null) return "type-null";
  if (Array.isArray(value)) return "type-array";
  if (typeof value === "object") return "type-object";
  return `type-${typeof value}`;
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

