import { defineConfig } from "vitepress";
import path from "path";
import { fileURLToPath } from "url";
// dev
import Config from "../../packages/vitepress-theme/config";
// preview
// import Config from "less-write-vitepress-theme";
// import Config from "../../dist/es/config.mjs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: Config({
    docRoot: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
  }),
  title: "Less Write Theme",
  description: "A Vitepress Theme",
  base: "/less-write-vitepress-theme/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "指南", link: "/guide" },
      {
        text: `less-write`,
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
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
        text: "指南",
        link: "/guide",
      },
      {
        text: "选项",
        link: "/option",
      },
      {
        text: "Demo组件",
        link: "/use-demo",
      },
      {
        text: "组件",
        items: [
          {
            text: "Button 按钮",
            link: "/component/button",
          },
        ],
      },

      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/fenglekai/less-write-vitepress-theme" },
    ],
  },
});
