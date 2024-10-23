---
title: 指南
---

# 快速开始

> 基于VitePress的主题，在开始前，你需要先安装VitePress。

## 安装

通过NPM、Yarn、pnpm等方式安装Less Write Vitepress Theme。

```shell
# NPM
$ npm install less-write-vitepress-theme

# Yarn
$ yarn add less-write-vitepress-theme

# pnpm
$ pnpm add less-write-vitepress-theme
```

## 导入主题与配置

```ts
// .vitepress/config.mts
import { defineConfig } from "vitepress";
import path from "path";
import Config from "less-write-vitepress-theme";


export default defineConfig({
  extends: Config({
    // 你的文档目录
    docRoot: path.resolve(__dirname, ".."),
  }),
  vite: {
    // 防止列出的依赖项在服务端渲染（SSR）时被外部化 https://github.com/vuejs/vitepress/issues/1465
    ssr: { noExternal: ["less-write-vitepress-theme"] },
    // ...
  }
  // ...
});
```

```ts
// .vitepress/theme/index.ts
import type { Theme } from "vitepress";
import CustomTheme from "less-write-vitepress-theme/es/theme";

export default {
  extends: CustomTheme,
  // ...
} satisfies Theme;
```

