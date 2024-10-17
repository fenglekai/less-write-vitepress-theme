import { resolve } from "path";

export const projRoot = resolve(__dirname, "..");
export const buildOutput = resolve(projRoot, "dist");
export const buildRoot = resolve(projRoot, "build");