import { defineConfig } from "vitepress";
import Config from "../../packages/vitepress-theme/config";
import path from "node:path";

const projRoot = path.resolve(__dirname, "..", "..");

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: Config({
    docRoot: path.resolve(projRoot, "play"),
  }),
  title: "Playground",
  description: "Theme playground",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
      {
        text: `less-write`,
        items: [
          {
            text: "Markdown Examples", link: "/markdown-examples"
          },
          {
            component: "VPMenuRainbowAnimationSwitcher",
            props: {
              text: "Rainbow Animation",
            },
          },
        ],
      },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
