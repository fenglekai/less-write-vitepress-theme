import { defineConfig } from "vitepress";
import { fileURLToPath, URL } from "node:url";
import { mdPlugin, MarkdownTransform } from "./plugins";

// https://vitepress.dev/reference/site-config
export default (docRoot: string) => {
  return defineConfig({
    markdown: {
      config: (md) => mdPlugin(md, docRoot),
    },
    vite: {
      // resolve: {
      //   alias: [
      //     {
      //       find: /^.*\/VPHomeHero\.vue$/,
      //       replacement: fileURLToPath(
      //         new URL("./components/VPHomeHero.vue", import.meta.url)
      //       ),
      //     },
      //   ],
      // },
      plugins: [MarkdownTransform(docRoot)],
    },
  });
};
