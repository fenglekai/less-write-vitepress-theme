import path from "path";
import { Project } from "ts-morph";
import type { CompilerOptions, SourceFile } from "ts-morph";
import consola from "consola";
import { glob } from "fast-glob";
import * as vueCompiler from "vue/compiler-sfc";
import { mkdir, readFile, writeFile } from "fs/promises";
import chalk from "chalk";
import { buildOutput, projRoot } from "./constants";
import { excludeFiles } from "./utils";

const TSCONFIG_PATH = path.resolve(projRoot, "tsconfig.build.json");
const outDir = path.resolve(buildOutput, "types");
const themeRoot = path.resolve(projRoot, "packages", "vitepress-theme");

export const generateTypesDefinitions = async () => {
  const compilerOptions: CompilerOptions = {
    emitDeclarationOnly: true,
    outDir,
    baseUrl: projRoot,
    preserveSymlinks: true,
    skipLibCheck: true,
    noImplicitAny: false,
  };
  const project = new Project({
    compilerOptions,
    tsConfigFilePath: TSCONFIG_PATH,
    skipAddingFilesFromTsConfig: true,
  });

  const sourceFiles = await addSourceFiles(project);
  consola.success("Added source files");

  typeCheck(project);
  consola.success("Type check passed!");

  await project.emit({
    emitOnlyDtsFiles: true,
  });

  const tasks = sourceFiles.map(async (sourceFile) => {
    const relativePath = path.relative(themeRoot, sourceFile.getFilePath());
    consola.trace(
      chalk.yellow(
        `Generating definition for file: ${chalk.bold(relativePath)}`
      )
    );

    const emitOutput = sourceFile.getEmitOutput();
    const emitFiles = emitOutput.getOutputFiles();
    if (emitFiles.length === 0) {
      throw new Error(`Emit no file: ${chalk.bold(relativePath)}`);
    }

    const subTasks = emitFiles.map(async (outputFile) => {
      const filepath = outputFile.getFilePath().replace("/packages/vitepress-theme", "");

      await mkdir(path.dirname(filepath), {
        recursive: true,
      });

      await writeFile(filepath, outputFile.getText(), "utf8");

      consola.success(
        chalk.green(
          `Definition for file: ${chalk.bold(relativePath)} generated`
        )
      );
    });

    await Promise.all(subTasks);
  });

  await Promise.all(tasks);
};

async function addSourceFiles(project: Project) {
  project.addSourceFileAtPath(path.resolve(projRoot, "share.d.ts"));

  const filePaths = excludeFiles(
    await glob("**/*.{js,ts,vue}", {
      cwd: themeRoot,
      absolute: true,
      onlyFiles: true,
    })
  );
  const sourceFiles: SourceFile[] = [];
  await Promise.all([
    ...filePaths.map(async (file) => {
      if (file.endsWith(".vue")) {
        const { parse, compileScript, compileTemplate } = vueCompiler;
        const content = await readFile(file, "utf-8");

        const sfc = parse(content);
        const { script, scriptSetup } = sfc.descriptor;

        if (script || scriptSetup) {
          let content = script?.content ?? "";

          if (scriptSetup) {
            const compiled = compileScript(sfc.descriptor, {
              id: "xxx",
            });
            content += compiled.content;
          }

          const lang = scriptSetup?.lang || script?.lang || "js";
          const sourceFile = project.createSourceFile(
            `${path.relative(process.cwd(), file)}.${lang}`,
            content
          );
          sourceFiles.push(sourceFile);
        } else {
          const { code } = compileTemplate({
            source: sfc.descriptor.template?.content ?? "",
            filename: sfc.descriptor.filename,
            id: "xxx",
          });
          const defaultExport = `${code}\nexport default { render }`;

          const sourceFile = project.createSourceFile(
            `${path.relative(process.cwd(), file)}.ts`,
            defaultExport
          );
          sourceFiles.push(sourceFile);
        }
      } else {
        const sourceFile = project.addSourceFileAtPath(file);
        sourceFiles.push(sourceFile);
      }
    }),
  ]);

  return sourceFiles;
}

function typeCheck(project: Project) {
  const diagnostics = project.getPreEmitDiagnostics();
  if (diagnostics.length > 0) {
    consola.error(project.formatDiagnosticsWithColorAndContext(diagnostics));
    const err = new Error("Failed to generate dts.");
    consola.error(err);
    throw err;
  }
}
