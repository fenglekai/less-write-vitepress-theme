import { dest, parallel, series, src, TaskFunction } from "gulp";
import { copyFile, mkdir } from "fs/promises";
import path from "path";
import { withTaskName, run } from "./utils";
import buildFullBundle from "./build";
import { buildOutput, projRoot } from "./constants";
import { generateTypesDefinitions } from "./gen-types";

const copyFiles = () =>
  Promise.all([
    copyFile(
      path.resolve(projRoot, "package.json"),
      path.resolve(buildOutput, "package.json")
    ),
    copyFile(
      path.resolve(projRoot, "README.md"),
      path.resolve(buildOutput, "README.md")
    ),
    copyFile(
      path.resolve(projRoot, "LICENSE"),
      path.resolve(buildOutput, "LICENSE")
    ),
  ]);

const copyTypesFile = () => {
  return src(path.resolve(buildOutput, "types/**/*"))
    .pipe(dest(path.resolve(buildOutput, "lib")))
    .pipe(
      dest((file) => {
        file.extname.replace(".ts", ".mts");
        return path.resolve(buildOutput, "es");
      })
    );
};

export default series(
  withTaskName("clean", () => run("pnpm run clean")),
  withTaskName("createOutput", () =>
    mkdir(path.resolve(buildOutput), { recursive: true })
  ),

  parallel(
    withTaskName("buildFullBundle", buildFullBundle),
    withTaskName("generateTypesDefinitions", generateTypesDefinitions)
  ),
  withTaskName("copyTypesFile", copyTypesFile),

  withTaskName("copyFile", copyFiles)
) as TaskFunction;
