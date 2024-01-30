import packageJson from "./package.json" assert { type: "json" };

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
  manifest_version: 3,
  name: "5sControl: LinkidIn",
  version: packageJson.version,
  description: packageJson.description,
  permissions: [
    // "offscreen",
    "storage",
    "sidePanel",
    "scripting",
    "tabs",
  ],
  side_panel: {
    default_path: "src/pages/sidepanel/index.html",
  },
  options_page: "src/pages/options/index.html",
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module",
  },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "icon48.png",
  },
  // chrome_url_overrides: {
  //   newtab: 'src/pages/newtab/index.html',
  // },
  icons: {
    16: "icon16.png",
    48: "icon48.png",
    128: "icon128.png"
  },
  content_scripts: [
    {
      matches: ["https://*.linkedin.com/*"],
      js: ["src/pages/content/index.js"],
      // KEY for cache invalidation
      // css: ['assets/css/contentStyle<KEY>.chunk.css'],
    },
  ],
  devtools_page: "src/pages/devtools/index.html",
  web_accessible_resources: [
    {
      resources: [
        "assets/js/*.js",
        "assets/css/*.css",
        "icon128.png",
        "icon48.png",
        "icon16.png",
      ],
      matches: ["*://*/*"],
    },
  ],
};

export default manifest;
