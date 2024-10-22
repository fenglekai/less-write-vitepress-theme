import { UserConfig } from "vitepress";
import { mdPlugin, MarkdownTransform } from "./plugins";
import path from "path";
import { fileURLToPath } from "url";

export type Config = { docRoot?: string; rainbowAnimation?: boolean };

const mergeConfig = (config: Config) => {
  let defaultConfig = {
    docRoot: path.resolve(__dirname),
    rainbowAnimation: true,
  };
  const merge = { ...defaultConfig, ...config };
  return merge;
};

// https://vitepress.dev/reference/site-config
export default (config: Config): UserConfig => {
  const { docRoot, rainbowAnimation } = mergeConfig(config);

  const alias: any[] = [];
  if (rainbowAnimation) {
    alias.push({
      find: /^.*\/VPNavScreen\.vue$/,
      replacement: fileURLToPath(
        new URL("./components/VPNavScreen.vue", import.meta.url)
      ),
    });
    alias.push({
      find: /^.*\/VPNavBar\.vue$/,
      replacement: fileURLToPath(
        new URL("./components/VPNavBar.vue", import.meta.url)
      ),
    });
    alias.push({
      find: /^.*\/VPNavBarExtra\.vue$/,
      replacement: fileURLToPath(
        new URL("./components/VPNavBarExtra.vue", import.meta.url)
      ),
    });
  }

  return {
    markdown: {
      config: (md) => mdPlugin(md, docRoot),
    },
    vite: {
      plugins: [MarkdownTransform(docRoot)],
      resolve: {
        alias,
      },
    },
  };
};
