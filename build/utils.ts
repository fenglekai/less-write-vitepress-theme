import { spawn } from "child_process";
import chalk from "chalk";
import { resolve } from "path";
import type { OutputOptions, RollupBuild } from "rollup";
import type { ProjectManifest } from "@pnpm/types";
import { TaskFunction } from "gulp";

const projRoot = resolve("..");

export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map((option) => bundle.write(option)));
}

export function formatBundleFilename(
  name: string,
  minify: boolean,
  ext: string
) {
  return `${name}${minify ? ".min" : ""}.${ext}`;
}

export const withTaskName = (name: string, fn: TaskFunction): TaskFunction =>
  Object.assign(fn, { displayName: name });

export const run = async (command: string, cwd = projRoot) =>
  new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(" ");
    console.info(`run: ${chalk.green(`${cmd} ${args.join(" ")}`)}`);
    const app = spawn(cmd, args, {
      cwd,
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    const onProcessExit = () => app.kill("SIGHUP");

    app.on("close", (code) => {
      process.removeListener("exit", onProcessExit);

      if (code === 0) resolve(true);
      else
        reject(
          new Error(`Command failed. \n Command: ${command} \n Code: ${code}`)
        );
    });
    process.on("exit", onProcessExit);
  });

export const getPackageManifest = (pkgPath: string) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(pkgPath) as ProjectManifest;
};

export const getPackageDependencies = (
  pkgPath: string
): Record<"dependencies" | "peerDependencies", string[]> => {
  const manifest = getPackageManifest(pkgPath);
  const { dependencies = {}, peerDependencies = {} } = manifest;

  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies),
  };
};

export const generateExternal = async (options: { full: boolean }) => {
  const { dependencies, peerDependencies } = getPackageDependencies(
    resolve(projRoot, "package.json")
  );

  return (id: string) => {
    const packages: string[] = [...peerDependencies];
    if (!options.full) {
      packages.push("@vue", ...dependencies);
    }

    return [...new Set(packages)].some(
      (pkg) => id === pkg || id.startsWith(`${pkg}/`)
    );
  };
};

export const excludeFiles = (files: string[]) => {
  const excludes = [
    "node_modules",
  ];
  return files.filter(
    (path) => !excludes.some((exclude) => path.includes(exclude))
  );
};