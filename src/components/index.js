import Navigation from "./navigation.js";
import Slide from "./slide.js";
import Panel from "./panel.js";
import Panels from "./panels.js";
import ImageUpload from "./image-upload.js";
import DateRange from "./date-range.js";
import AdPreview from "./ad-preview.js";
import SvgPlaceholder from "./svg-placeholder.js";

window.customElements.define("pi-navigation", Navigation);
window.customElements.define("pi-slide", Slide);
window.customElements.define("pi-panel", Panel);
window.customElements.define("pi-panels", Panels);

window.customElements.define("image-upload", ImageUpload);
window.customElements.define("date-range", DateRange);
window.customElements.define("ad-preview", AdPreview);
window.customElements.define("svg-placeholder", SvgPlaceholder);
