import { FSWatcher, watch } from "fs";

export default class Watcher {
  watcher: FSWatcher;

  start() {
    this.watcher = watch(
      import.meta.dir,
      { recursive: true },
      (event, filename) => {
        console.log(`Detected ${event} in ${filename}`);
      }
    );

    process.on("SIGINT", () => {
      // close watcher when Ctrl-C is pressed
      console.log("Closing watcher...");
      this.watcher.close();

      process.exit(0);
    });

    return this.watcher;
  }
}
