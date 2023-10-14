import { renderToReadableStream } from "react-dom/server";
import { createElement } from "react";
import Watcher from "./watcher";
import Loader from "./loader";
import { FalconRouter } from "./router";
import CssParser, { Css } from "./cssParser";

export default class FalconDevServer {
  private _port: number;
  private _watcher: Watcher;
  private _dir: string;
  private _loader: Loader;
  private _router: FalconRouter;

  constructor({
    port,
    watcher,
    dir,
    loader,
    router,
    cssParser,
  }: {
    port: number;
    watcher: Watcher;
    dir: string;
    loader: Loader;
    router: FalconRouter;
    cssParser: CssParser;
  }) {
    this._port = port || 3000;
    this._watcher = watcher;
    this._dir = dir;
    this._loader = loader;
    this._router = router;
  }

  async start() {
    try {
      this._watcher.start();
      const routes = await this._router.getAllRoutes();

      console.log("Routes: \n");

      routes.forEach((route) => {
        console.log(`- /${route.toLowerCase()}`);
      });

      const dir = this._dir;
      const loader = this._loader;

      Bun.serve({
        port: 3000,
        async fetch(req) {
          const url = new URL(req.url);

          if (routes.find((route) => url.pathname === `/${route}`)) {
            const component = await import(`${dir}/pages${url.pathname}`);

            let loaderData = undefined;
            const loaderFn = component.loader;

            if (loaderFn) {
              loaderData = await loader.evalLoader(loaderFn);
            }

            const currentComponent = createElement(component.default, {
              ...loaderData,
              styles: {
                ...component.styles,
              },
            });
            const stream = await renderToReadableStream(currentComponent);

            return new Response(stream, {
              headers: { "Content-Type": "text/html" },
            });
          }
        },
      });

      console.log(`\n🚀 Dev server started at port: ${this._port}`);
    } catch (err) {
      console.error("Error starting dev server", err);
    }
  }
}
