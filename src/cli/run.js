const chalk = require("chalk");
const express = require("express");
const path = require("path");

const load = require('./utils/load')

// El servidor
const jsonServer = require("../server");

module.exports = function (argv) {
  console.log(argv);

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

  app.use(express.static(__dirname + "/public"));

  app.get("/", function (req, res) {
    res.sendFile(path.dirname(path.dirname(__dirname)) + "/public/index.html");
  });
  
  console.log(chalk.green(` Running in http://localhost:${port}`));
  console.log(chalk.green(` Running in http://localhost:${port}/api`));

  // Get dades dels fitxers
  app.get("/api", function (req, res)  {
    //xtoni -> passar a constant
    res.json(load("/_output"));
  });
};
