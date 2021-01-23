const express = require("express");
const cors = require('cors');

const path = require("path");

const chalk = require("chalk");

const load = require("./utils/load");

// El servidor
const jsonServer = require("../server");

module.exports = function (argv) {
  console.log();
  console.log(chalk.cyan("  \\{^_^}/ hi!"));
  console.log();

  //Create the express server
  const port = argv.port || 3000;
  const app = jsonServer.create();
  const server = app.listen(port);

  //Mostra public
  //  app.get  (express.static('../../public'))

  // respond with "hello world" when a GET request is made to the homepage

  /*
  app.get("/", function (req, res) {
    res.send("hello world");
  });
*/

  app.use(cors())
  app.use(express.static("public"))

  app.get("/", function (req, res) {
    res.sendFile(path.dirname(path.dirname(__dirname)) + "/public/index.html");
  });

  console.log(chalk.green(` Running in http://localhost:${port}`));
  console.log(chalk.green(` Running in http://localhost:${port}/api`));

  // Get dades dels fitxers
  app.get("/api", function (req, res) {
    //xtoni -> passar a constant
    res.json(load("/_output"));
  });

  // Catch and handle any error occurring in the server process
  process.on("uncaughtException", (error) => {
    if (error.errno === "EADDRINUSE")
      console.log(
        chalk.red(
          `Cannot bind to the port ${error.port}. Please specify another port number either through --port argument or through the json-server.json configuration file`
        )
      );
    else console.log("Some error occurred", error);
    process.exit(1);
  });
};
