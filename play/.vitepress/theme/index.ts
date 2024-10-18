// https://vitepress.dev/guide/custom-theme
import type { Theme } from "vitepress";
import CustomTheme from "../../../packages/vitepress-theme/theme";

export default {
  extends: CustomTheme,
  enhanceApp({ app, router, siteData }) {
    // ...
  },
} satisfies Theme;