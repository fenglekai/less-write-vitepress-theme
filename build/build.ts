import path from "path";
import { dest, parallel, series, src, TaskFunction } from "gulp";
import { rollup } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";
import VueMacros from "unplugin-vue-macros/rollup";
import vue from "@vitejs/plugin-vue";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import gulpPostcss from "gulp-postcss";
import cssnano from "cssnano";
import { glob } from "fast-glob";
import {
  writeBundles,
  withTaskName,
  generateExternal,
  excludeFiles,
} from "./utils.js";
import { buildOutput, projRoot } from "./constants.js";

const target = "esnext";

const moduleRoot = path.resolve(projRoot, "packages", "vitepress-theme");

const buildModules = async () => {
  const input = excludeFiles(
    await glob("**/*.{js,ts,vue}", {
      cwd: moduleRoot,
      absolute: true,
      onlyFiles: true,
    })
  );
  const bundle = await rollup({
    input,
    plugins: [
      {
        name: "less-write-alias-plugin",
        resolveId(id) {
          const sourceThemeChalk = `./styles`;
          if (!id.startsWith(sourceThemeChalk)) return;
          return {
            id: id,
            external: "absolute",
          };
        },
      },
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vue: vue({
            isProduction: true,
          }),
        },
      }),
      nodeResolve({
        extensions: [".mjs", ".js", ".json", ".ts"],
      }),
      postcss(),
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
      assetFileNames: `styles`,
    },
  ]);
};

const buildStyles = () => {
  return src(path.resolve(moduleRoot, "styles/*.css"))
    .pipe(gulpPostcss([cssnano()]))
    .pipe(dest(path.resolve(buildOutput, "styles")));
};

const copyBuildStylesFile = () => {
  return src(path.resolve(buildOutput, "styles/*"))
    .pipe(dest(path.resolve(buildOutput, "es", "styles")))
    .pipe(dest(path.resolve(buildOutput, "lib", "styles")));
};

const buildFullBundle: TaskFunction = series(
  parallel(
    withTaskName("buildStyles", buildStyles),
    withTaskName("buildModules", buildModules)
  ),
  withTaskName("copyBuildStylesFile", copyBuildStylesFile)
);

export default buildFullBundle;
