import StaticBuilder from "./lib/build";
import FalconDevServer from "./lib/falconDevServer";
import Watcher from "./lib/watcher";

const argv = Bun.argv.slice(2);

const devMode = !!argv.find((arg) => arg === "--dev");
const buildMode = !!argv.find((arg) => arg === "--build");

const dir = import.meta.dir;

if (devMode) {
  const watcher = new Watcher();

  const devServer = new FalconDevServer({ watcher, dir });
  devServer.start();
}

if (!devMode && buildMode) {
  const builder = new StaticBuilder({ dir });
  builder.build();
}
