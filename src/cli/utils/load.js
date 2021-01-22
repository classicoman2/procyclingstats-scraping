// Retorna l'objecte amb tots els equips i els seus ciclistes
const fs = require("fs");
const path = require("path");

module.exports = function (dir) {
  //xtoni
  // Read json files from a directory

  // Llegir tots els fitxers

  let basedir = path.dirname(path.dirname(path.dirname(__dirname)));

  let data = [];

  fs.readdirSync(basedir + dir).forEach((file) => {
    //llegeix fitxer

    //xtoni - mirar si acaba per json
    if (file.slice(-4) == "json") {
      let rawdata = fs.readFileSync(basedir + dir + "/" + file);
      // parse
      let teamsData = JSON.parse(rawdata);
      //  console.log(teamsData[0].ciclistes[0]);

      /* TEAMS - Guarda noms d'equips */
      teamsData.forEach((t) => {
        data.push(t);
      });
    }
  });
  return data;
};
