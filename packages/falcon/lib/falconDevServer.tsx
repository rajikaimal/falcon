import { renderToReadableStream } from "react-dom/server";
import { getFiles } from "./utils/fs";
import { createElement } from "react";
import Watcher from "./watcher";
import Loader from "./loader";

export default class FalconDevServer {
  private _watcher: Watcher;
  private _dir: string;
  private _loader: Loader;

  constructor({
    watcher,
    dir,
    loader,
  }: {
    watcher: Watcher;
    dir: string;
    loader: Loader;
  }) {
    this._watcher = watcher;
    this._dir = dir;
    this._loader = loader;
  }

  async start() {
    try {
      this._watcher.start();

      const componentFiles = await getFiles(`/pages/`);

      if (!componentFiles) console.log("Pages directory is empty");

      const routes = componentFiles.map(
        (filePath) => filePath.split("pages/")[1].split(".tsx")[0]
      );

      console.log("Routes: \n");

      routes.forEach((route) => {
        console.log(`- /${route.toLowerCase()}`);
      });

      const dir = this._dir;
      const loader = this._loader;

      Bun.serve({
        async fetch(req) {
          const url = new URL(req.url);

          if (routes.find((route) => url.pathname === `/${route}`)) {
            const component = await import(`${dir}/pages${url.pathname}`);

            let loaderData = undefined;

            const loaderFn = component.loader;
            if (loaderFn) {
              loaderData = await loader.evalLoader(loaderFn);
            }

            const currentComponent = createElement(
              component.default,
              loaderData
            );
            const stream = await renderToReadableStream(currentComponent);

            return new Response(stream, {
              headers: { "Content-Type": "text/html" },
            });
          }
        },
      });
    } catch (err) {
      console.error("Error starting dev server");
    }
  }
}
