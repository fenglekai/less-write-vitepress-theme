import { UserConfig } from "vitepress";
import { mdPlugin, MarkdownTransform } from "./plugins";

// https://vitepress.dev/reference/site-config
export default (config: { docRoot: string }): UserConfig => {
  const { docRoot } = config;
  return {
    markdown: {
      config: (md) => mdPlugin(md, docRoot),
    },
    vite: {
      plugins: [MarkdownTransform(docRoot)],
    },
  };
};
