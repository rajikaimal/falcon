import { FSWatcher, watch } from "fs";

export default class Watcher {
  private _dir: string;
  watcher: FSWatcher;

  constructor({ dir }: { dir: string }) {
    this._dir = dir;
  }

  start() {
    this.watcher = watch(this._dir, { recursive: true }, (event, filename) => {
      console.log(`Detected ${event} in ${filename}`);
    });

    process.on("SIGINT", () => {
      // close watcher when Ctrl-C is pressed
      console.log("Closing watcher...");
      this.watcher.close();

      process.exit(0);
    });

    return this.watcher;
  }
}
