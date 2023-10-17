import { renderToReadableStream, renderToString } from "react-dom/server";
import { createElement } from "react";
import Watcher from "./watcher";
import Loader from "./loader";
import { FalconRouter } from "./router";
import CssParser, { Css } from "./cssParser";
import { LiveReload } from "./liveReload";

export default class Dev {
  private _port: number;
  private _watcher: Watcher;
  private _dir: string;
  private _loader: Loader;
  private _router: FalconRouter;
  private _liveReload: LiveReload;

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
    this._liveReload = new LiveReload();
  }

  async start() {
    try {
      const io = this._liveReload.createServer();
      this._watcher.start(io);
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
            delete require.cache[
              require.resolve(`${dir}/pages${url.pathname}`)
            ];

            const component = await import(`${dir}/pages${url.pathname}`);

            let loaderData = undefined;
            const loaderFn = component.loader;

            if (loaderFn) {
              loaderData = await loader.evalLoader(loaderFn);
            }

            const socketIOScript = `
                <script
                  src="https://cdn.socket.io/4.6.0/socket.io.min.js"
                  integrity="sha384-c79GN5VsunZvi+Q/WObgk2in0CbZsHnjEqvFxC5DxHn9lTfNce2WW6h2pH6u/kF+"
                  crossorigin="anonymous"
                ></script>
                <script>
                  const socket = io('http://localhost:3001');
                  socket.on('reload', (res) => { if(res.route === window.location.pathname) { console.log('reloading'); window.location.reload(true); } });
                </script>
            `;

            const currentComponent = createElement(component.default, {
              data: loaderData?.data,
              styles: {
                ...component.styles,
              },
            });
            const body = renderToString(currentComponent);
            const html = `
              <body style="margin: 0">
                ${body}
                ${socketIOScript}
              </body>
            `;

            return new Response(html, {
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
