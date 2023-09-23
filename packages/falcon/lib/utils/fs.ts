import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { rmdirSync, mkdirSync } from "node:fs";

export const currentDir = process.cwd();

export async function getFiles(directoryPath: string): Promise<string[]> {
  try {
    const fileNames = await readdir(`${currentDir}${directoryPath}`);
    const filePaths = fileNames.map((fn) =>
      join(`${currentDir}${directoryPath}`, fn)
    );
    return filePaths;
  } catch (err) {
    console.error(err);
    return [] as string[];
  }
}

export async function writeStaticFile(path: string, content: string) {
  try {
    await writeFile(path, content);
  } catch (err) {
    console.error(err);
  }
}

export function removeDir(path: string) {
  try {
    rmdirSync(path, { recursive: true });
  } catch (err) {
    console.log(`Error purging ${path}`);
  }
}

export function makeDir(path: string) {
  try {
    mkdirSync(path);
  } catch (err) {
    console.log(`Error creating ${path}`);
  }
}
