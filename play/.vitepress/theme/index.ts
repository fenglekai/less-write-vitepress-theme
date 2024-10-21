// https://vitepress.dev/guide/custom-theme
import type { Theme } from "vitepress";
// dev
// import CustomTheme from "../../../packages/vitepress-theme/theme";
// preview
import CustomTheme from "../../../dist/es/theme.mjs";

export default {
  extends: CustomTheme,
  enhanceApp({ app, router, siteData }) {
    // ...
  },
} satisfies Theme;