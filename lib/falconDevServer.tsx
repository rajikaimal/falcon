import { renderToReadableStream } from "react-dom/server";
import { getFiles } from "./utils/fs";
import { createElement } from "react";
import Watcher from "./watcher";

export default class FaclonDevServer {
  watcher: Watcher;

  constructor({ watcher }: { watcher: Watcher }) {
    this.watcher = watcher;
  }

  async start(dir: string) {
    try {
      this.watcher.start();

      const componentFiles = await getFiles(`/pages/`);

      if (!componentFiles) console.log("Pages directory is empty");

      const routes = componentFiles.map(
        (filePath) => filePath.split("pages/")[1].split(".tsx")[0]
      );

      console.log("Routes: \n");

      routes.forEach((route) => {
        console.log(`- /${route.toLowerCase()}`);
      });

      Bun.serve({
        async fetch(req) {
          const url = new URL(req.url);

          if (routes.find((route) => url.pathname === `/${route}`)) {
            const component = await import(`${dir}/pages${url.pathname}`);

            const currentComponent = createElement(component.default);
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
