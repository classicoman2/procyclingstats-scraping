const updateNotifier = require("update-notifier");
const yargs = require("yargs");
const run = require("./run");
const pkg = require("../../package.json");

module.exports = function () {
  updateNotifier({ pkg }).notify();

  const argv = yargs
    .config("config")
    .usage("$0 [options] <source>")
    .options({
      port: {
        alias: "p",
        description: "Set port",
        default: 3001,
      },
      host: {
        alias: "H",
        description: "Set host",
        default: "localhost",
      },
      watch: {
        alias: "w",
        description: "Watch file(s)",
      }
    })
    .help("help")
    .alias("help", "h")
    .version(pkg.version)
    .alias("version", "v").argv
    

  run(argv);
};
