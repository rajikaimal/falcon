import cac from "cac";

const cli = cac("create-falcon-app");
const pkgFile = Bun.file("./package.json");
const pkgJson = await pkgFile.json();
const version = pkgJson.version;

const run = () => {
  cli
    .command("[out-dir]", "Generate in a custom directory or current directory")
    .option("--verbose", "Show debug logs")
    .action((outDir = ".") => {
      console.log(outDir);
    });

  cli.version(version);
  cli.help();
  cli.parse();
};

try {
  run();
} catch (err) {
  console.trace(err);
}
