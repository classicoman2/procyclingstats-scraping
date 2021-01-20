/*
 * Required Modules
 */

const { getTeamsData } = require("./modules/getTeamsData");

//xtoni
const OUTPUT_DIR = "_output";
/* MAIN */

(function () {
  const url_base = "https://www.procyclingstats.com";
  //Obté directoris dels equips
  let scrapImages = process.argv[2] == "true" ? true : false;
  let scrapData = process.argv[3] == "true" ? true : false;

  let teamStart = process.argv[4];
  let teamEnd = process.argv[5];

  getTeamsData(OUTPUT_DIR, url_base, scrapImages, scrapData, teamStart, teamEnd);
})();


