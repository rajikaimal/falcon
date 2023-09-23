import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { getFiles, makeDir, removeDir, writeStaticFile } from "./utils/fs";
import Loader from "./loader";

export default class StaticBuilder {
  private _dir: string;
  private _loader: Loader;

  constructor({ dir, loader }: { dir: string; loader: Loader }) {
    this._dir = dir;
    this._loader = loader;
  }

  async build() {
    const defaultOutputDir = `${this._dir}/build/`;
    const componentFiles = await getFiles("/pages");

    removeDir(defaultOutputDir);
    makeDir(defaultOutputDir);

    componentFiles?.forEach(async (filePath) => {
      const isTsx = filePath.includes("tsx");

      if (isTsx) {
        const component = await import(`${filePath}`);
        let loaderData = undefined;

        const loader = component.loader;
        if (loader) {
          loaderData = await this._loader.evalLoader(loader);
        }

        const currentComponent = createElement(component.default, loaderData);
        const body = renderToStaticMarkup(currentComponent);
        const fileName = filePath.split("pages/")[1].split(".tsx")[0];
        // const hasStyleSheet = this.hasStyleSheet(filePath);

        const html = `
<html>
  <header>
  </header>
  <body>
    ${body}
  </body>
</html>
        `;

        await writeStaticFile(`${defaultOutputDir}${fileName}.html`, html);
      }
    });
  }

  hasStyleSheet(filePath: string) {
    console.log(filePath);
  }
}
