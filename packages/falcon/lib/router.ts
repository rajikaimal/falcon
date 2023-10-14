import { getFiles } from "./utils/fs";

export class FalconRouter {
  private _dir: string;

  constructor({ dir }: { dir: string }) {
    this._dir = dir;
  }

  public async getAllRoutes(): Promise<string[]> {
    const pages = await getFiles("/pages");

    if (!pages) console.warn("Pages directory is empty");

    const filePaths = pages
      .filter((page) => page.includes("tsx"))
      .map((filePath: string) => filePath.split("pages/")[1].split(".tsx")[0]);

    return filePaths;
  }

  public async getAllFiles(): Promise<string[]> {
    const files = await getFiles("/pages");

    if (!files) console.warn("Pages directory is empty");

    return files;
  }

  public async getAllCss(): Promise<string[]> {
    const files = await getFiles("/pages");

    if (!files) console.warn("Pages directory is empty");

    const cssFiles = files.filter((file) => file.includes(".css"));

    return cssFiles;
  }

  public async getCss({
    route,
  }: {
    route: string;
  }): Promise<string | undefined> {
    const files = await getFiles("/pages");

    if (!files) console.warn("Pages directory is empty");

    const cssFile = files.filter(
      (file) => file.includes(route) && file.includes(".css")
    );

    if (cssFile.length) {
      return cssFile[0];
    }

    return undefined;
  }
}
