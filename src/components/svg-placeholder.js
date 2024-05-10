const tpl = ({
  width = 300,
  height = 150,
  text = `${width}×${height}`,
  fontFamily = "sans-serif",
  fontWeight = "bold",
  fontSize = Math.floor(Math.min(width, height) * 0.2),
  dy = fontSize * 0.35,
  bgColor = "#ddd",
  textColor = "rgba(0,0,0,0.5)",
}) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect fill="${bgColor}" width="${width}" height="${height}"/>
<text fill="${textColor}" font-family="${fontFamily}" font-size="${fontSize}" dy="${dy}" font-weight="${fontWeight}" x="50%" y="50%" text-anchor="middle">${text}</text>
</svg>
`;

export default class SvgPlaceholder extends HTMLElement {
  connectedCallback() {
    let svg = tpl({ text: this.getAttribute("text") });
    svg = svg
      .replace(/[\t\n\r]/gim, "") // Strip newlines and tabs
      .replace(/\s\s+/g, " ") // Condense multiple spaces
      .replace(/'/gim, "\\i"); // Normalize quotes
    this.innerHTML = svg;
  }
}
