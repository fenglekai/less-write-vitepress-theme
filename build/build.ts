import path from "path";
import { parallel, TaskFunction } from "gulp";
import { rollup } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";
import VueMacros from "unplugin-vue-macros/rollup";
import vue from "@vitejs/plugin-vue";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { glob } from "fast-glob";
import {
  writeBundles,
  formatBundleFilename,
  withTaskName,
  generateExternal,
  excludeFiles,
} from "./utils.js";
import { version } from "./version";
import { buildOutput, projRoot } from "./constants.js";

const target = "esnext";
const banner = `#!/usr/bin/env node\n/*! Less Write Changelog v${version} */\n`;

const moduleRoot = path.resolve(projRoot, "packages", "vitepress-theme");
const fullRoot = path.resolve(moduleRoot, "index.ts");

async function buildFullEntry() {
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
    nodePolyfills(),
    commonjs(),
    postcss({ plugins: [] }),
    nodeResolve({ extensions: [".mjs", ".js", ".json", ".ts"] }),
    esbuild({
      exclude: [],
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

  const bundle = await rollup({
    input: fullRoot,
    plugins,
    treeshake: true,
    external: await generateExternal({ full: true }),
  });
  await writeBundles(bundle, [
    {
      format: "umd",
      file: path.resolve(
        buildOutput,
        "dist",
        formatBundleFilename("index", false, "js")
      ),
      exports: "named",
      name: "LessWriteVitepressTheme",
      globals: {
        vue: "Vue",
        vitepress: "Vitepress",
        "vitepress/theme": "DefaultTheme",
      },
      banner,
    },
    {
      format: "esm",
      file: path.resolve(
        buildOutput,
        "dist",
        formatBundleFilename("index", false, "mjs")
      ),
      banner,
    },
  ]);
}

const buildModules = async () => {
  const input = excludeFiles(
    await glob("**/*.{js,ts,vue,css}", {
      cwd: moduleRoot,
      absolute: true,
      onlyFiles: true,
    })
  );
  const bundle = await rollup({
    input,
    plugins: [
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vue: vue({
            isProduction: true,
          }),
        },
      }),
      postcss({ plugins: [] }),
      nodePolyfills(),
      nodeResolve({
        extensions: [".mjs", ".js", ".json", ".ts"],
      }),
      commonjs(),
      esbuild({
        target,
        loaders: {
          ".vue": "ts",
        },
      }),
    ],
    external: await generateExternal({ full: false }),
    treeshake: false,
  });
  await writeBundles(bundle, [
    {
      format: "esm",
      dir: path.resolve(buildOutput, "es"),
      preserveModules: true,
      preserveModulesRoot: moduleRoot,
      entryFileNames: `[name].mjs`,
    },
    {
      format: "cjs",
      dir: path.resolve(buildOutput, "lib"),
      exports: "named",
      preserveModules: true,
      preserveModulesRoot: moduleRoot,
      entryFileNames: `[name].js`,
    },
  ]);
};

const buildFullBundle: TaskFunction = parallel(
  withTaskName("buildFull", buildFullEntry),
  withTaskName("buildModules", buildModules)
);

export default buildFullBundle;
