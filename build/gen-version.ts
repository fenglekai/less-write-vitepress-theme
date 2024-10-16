import { writeFile } from "fs/promises";
import path from "path";
import pkg from "../package.json"; // need to be checked

function getVersion() {
  const tagVer = process.env.TAG_VERSION;
  if (tagVer) {
    return tagVer.startsWith("v") ? tagVer.slice(1) : tagVer;
  } else {
    return pkg.version;
  }
}

const version = getVersion();
const projRoot = path.resolve(__dirname, "..");
const buildRoot = path.resolve(projRoot, "build");

async function main() {
  console.info(`Version: ${version}`);
  await writeFile(
    path.resolve(buildRoot, 'version.ts'),
    `export const version = '${version}'\n`
  );
}

main();
