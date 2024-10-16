import { series } from "gulp";
import { copyFile, mkdir } from "fs/promises";
import path from "path";
import { withTaskName, run } from "./utils";
import buildFullBundle from "./build";

export const copyFiles = () =>
  Promise.all([
    copyFile(
      path.resolve("..", "package.json"),
      path.resolve("..", "dist", "package.json")
    ),
    copyFile(
      path.resolve("..", "README.md"),
      path.resolve("..", "dist", "README.md")
    ),
  ]);

export default series(
  withTaskName("clean", () => run("pnpm run clean")),
  withTaskName("createOutput", () =>
    mkdir(path.resolve("..", "dist"), { recursive: true })
  ),
  withTaskName("buildFullBundle", buildFullBundle),
  withTaskName("copyFile", copyFiles)
);
