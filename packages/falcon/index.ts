import StaticBuilder from "./lib/build";
import FalconDevServer from "./lib/falconDevServer";
import Loader from "./lib/loader";
import { FalconRouter } from "./lib/router";
import Watcher from "./lib/watcher";

const argv = Bun.argv.slice(2);

const devMode = !!argv.find((arg) => arg === "--dev");
const buildMode = !!argv.find((arg) => arg === "--build");

const dir = import.meta.dir;
const loader = new Loader();

if (devMode) {
  const watcher = new Watcher();
  const router = new FalconRouter({ dir });

  const devServer = new FalconDevServer({ watcher, dir, loader, router });
  devServer.start();
}

if (!devMode && buildMode) {
  const builder = new StaticBuilder({ dir, loader });
  builder.build();
}
