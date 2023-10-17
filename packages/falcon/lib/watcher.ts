import { FSWatcher, watch } from "fs";
import { Server } from "socket.io";

export default class Watcher {
  private _dir: string;
  watcher: FSWatcher;

  constructor({ dir }: { dir: string }) {
    console.log("DIR", dir);
    this._dir = dir;
  }

  start(io: Server) {
    this.watcher = watch(this._dir, { recursive: true }, (event, filename) => {
      console.log(`Detected ${event} ${filename}`);

      if (filename) {
        io.emit("reload", { route: `/${filename.split(".")[0]}` });
      }
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
