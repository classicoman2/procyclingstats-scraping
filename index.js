const fs = require("fs");
const { getTeamsData } = require("./modules/getTeamsData");

const OUTPUT_DIR = "_output";

(function () {
  const url_base = "https://www.procyclingstats.com";
  //Obté directoris dels equips
  let scrapImages = process.argv[2] == "true" ? true : false;
  let scrapData = process.argv[3] == "true" ? true : false;

  let teamStart = process.argv[4];
  let teamEnd = process.argv[5];

  //Create output dir if doesn't exist
  if (scrapImages || scrapImages) {
    if (!fs.existsSync("./" + OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    }
  }

  getTeamsData(OUTPUT_DIR, url_base, scrapImages, scrapData, teamStart, teamEnd);
})();
