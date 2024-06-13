import Navigation from "./navigation.js";
import Slide from "./slide.js";
import Panel from "../structure/panel.js";
import PanelManager from "./panel_manager.js";
import ImageUpload from "./upload/image-upload.js";
import DateRange from "./date-range.js";
import AdPreview from "./ad-preview.js";
import SvgPlaceholder from "./svg-placeholder.js";
import Preview from "./preview.js";

window.customElements.define("pi-navigation", Navigation);
window.customElements.define("pi-slide", Slide);
window.customElements.define("pi-panel", Panel);
window.customElements.define("pi-preview", Preview);
window.customElements.define("pi-panel-manager", PanelManager);

// window.customElements.define("image-upload", ImageUpload);
window.customElements.define("date-range", DateRange);
window.customElements.define("ad-preview", AdPreview);
window.customElements.define("svg-placeholder", SvgPlaceholder);
