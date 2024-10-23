import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

export const projRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const buildOutput = resolve(projRoot, "dist");
export const buildRoot = resolve(projRoot, "build");