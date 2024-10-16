import path from "path";
import { parallel, type TaskFunction } from "gulp";
import { rollup } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import esbuild, { minify as minifyPlugin } from "rollup-plugin-esbuild";
import VueMacros from "unplugin-vue-macros/rollup";
import vue from "@vitejs/plugin-vue";
import styles from "rollup-plugin-styles";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import {
  writeBundles,
  formatBundleFilename,
  withTaskName,
  generateExternal,
} from "./utils.js";
import { version } from "./version";

export const target = "esnext";
export const banner = `#!/usr/bin/env node\n/*! Less Write Changelog v${version} */\n`;

async function buildFullEntry(minify: boolean) {
  const plugins = [
    VueMacros({
      setupComponent: false,
      setupSFC: false,
      plugins: {
        vue: vue({
          isProduction: true,
        }),
      },
    }),
    styles(),
    commonjs(),
    nodeResolve(),
    esbuild({
      exclude: [],
      sourceMap: minify,
      target,
      treeShaking: true,
      legalComments: "eof",
      loaders: {
        ".vue": "ts",
      },
      define: {
        "process.env.NODE_ENV": JSON.stringify("production"),
      },
    }),
  ];
  if (minify) {
    plugins.push(
      minifyPlugin({
        target,
        sourceMap: true,
      })
    );
  }

  const bundle = await rollup({
    input: path.resolve("..", "index.ts"),
    plugins,
    treeshake: true,
    external: await generateExternal({ full: true }),
  });
  await writeBundles(bundle, [
    {
      format: "esm",
      file: path.resolve(
        "..",
        "dist",
        formatBundleFilename("index", minify, "js")
      ),
      sourcemap: minify,
      banner,
    },
  ]);
}

const buildFullBundle: TaskFunction = parallel(
  withTaskName("buildFullMinified", () => buildFullEntry(true)),
  withTaskName("buildFull", () => buildFullEntry(false))
);

export default buildFullBundle;
