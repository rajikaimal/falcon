import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { makeDir, removeDir, writeStaticFile } from "./utils/fs";
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

      if (isTsx) {
        const component = await import(`${filePath}`);
        let loaderData = undefined;

        const loader = component.loader;
        if (loader) {
          loaderData = await this._loader.evalLoader(loader);
        }

        const styles = component.styles;
        const currentComponent = createElement(component.default, {
          ...loaderData,
          styles,
        });
        const body = renderToStaticMarkup(currentComponent);
        const fileName = filePath.split("pages/")[1].split(".tsx")[0];

        const html = `
<html>
  <head>
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
