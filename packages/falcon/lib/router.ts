import { getFiles } from "./utils/fs";

export class FalconRouter {
  private _dir: string;

  constructor({ dir }: { dir: string }) {
    this._dir = dir;
  }

  public async getAllRoutes(): Promise<string[]> {
    const pages = await getFiles("/pages");

    const filePaths = pages.map(
      (filePath: string) => filePath.split("pages/")[1].split(".tsx")[0]
    );

    return filePaths;
  }
}
