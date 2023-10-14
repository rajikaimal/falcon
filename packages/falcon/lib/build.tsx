import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import {
  getFiles,
  makeDir,
  removeDir,
  writeStaticFile,
  getFile,
} from "./utils/fs";
import Loader from "./loader";
import { FalconRouter } from "./router";

export default class StaticBuilder {
  private _dir: string;
  private _loader: Loader;
  private _router: FalconRouter;

  constructor({
    dir,
    loader,
    router,
  }: {
    dir: string;
    loader: Loader;
    router: FalconRouter;
  }) {
    this._dir = dir;
    this._loader = loader;
    this._router = router;
  }

  async build() {
    const defaultOutputDir = `${this._dir}/build/`;
    const routes = await this._router.getAllFiles();

    removeDir(defaultOutputDir);
    makeDir(defaultOutputDir);

    routes?.forEach(async (filePath) => {
      const isTsx = filePath.includes(".tsx");
      const isCss = filePath.includes(".css");

      if (isCss) return;

      const tsxFile = filePath.split("/");
      const tsxFileName = tsxFile[tsxFile.length - 1].split(".")[0];
      const hasStyleSheet = routes
        .filter((file) => file.includes(".css"))
        .find((file) => {
          const filePathArr = file.split("/");
          const fileNameArr = filePathArr[filePathArr.length - 1].split(".");
          const cssFileName = fileNameArr[0];

          if (cssFileName === tsxFileName) return true;
        });

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

        let inlineCss;
        if (hasStyleSheet) {
          inlineCss = await getFile(hasStyleSheet);
        }

        const html = `
<html>
  <head>
    ${inlineCss ? `<style>${inlineCss}</style>` : ""}
  </head>
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
