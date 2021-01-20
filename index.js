/*
 * Required Modules
 */

const request = require("request-promise");
const $ = require("cheerio");
var fs = require("fs");

const fm = require("./modules/fileManagement");

const OUTPUT_DIR = "_output";

/* MAIN */

(function () {
  const url_base = "https://www.procyclingstats.com";
  //Obté directoris dels equips
  let scrapImages = process.argv[2] == "true" ? true : false;
  let scrapData = process.argv[3] == "true" ? true : false;

  let teamStart = process.argv[4];
  let teamEnd = process.argv[5];

  getTeamsData(url_base, scrapImages, scrapData, teamStart, teamEnd);
})();

/**
 * Fent scrapping, obté els directoris de fotos dels equips
 *
 * @param {string} url_base  La url base de la web
 * @param {boolean} getCyclistImages  Se descarreguen les imatges?
 * @param {boolean} getCyclistsData Se descarreguen les dates dels ciclistes?
 * @param {string}  teamStart  Posicio inicial directori de teams
 * @param {string}  teamEnd  Posicio final directori de teams; si val 99, agafa valor màxim
 */
function getTeamsData(
  url_base,
  getCyclistImages,
  getCyclistsData,
  teamStart,
  teamEnd
) {
  //Array de directoris amb fotos en la url
  let directoris = [];

  // request a la url on hi ha tots els equips llistats
  request(url_base + "/teams")
    .then(function (html) {
      // Obte tots els elements HTML que compleixen el patró emprant cheerio
      let divTeams = $(".teamOvShirt", html);
      // Obté els directoris d'equips
      for (property in divTeams) {
        if (divTeams[property].attribs !== undefined)
          directoris.push(divTeams[property].attribs.href.slice(5));
      }

      if (getCyclistsData) {
        //Array de promises de tots els equips
        let promises = [];

        // 1 promesa per equip
        directoris
          .slice(teamStart, teamEnd < 99 ? teamEnd : directoris.length)
          .forEach((directori) => {
            promises.push(
              scrapCyclistDataFromTeam(
                url_base,
                url_base + "/team/" + directori
              )
            );
          });

        //Array de promises: Executa totes les promeses per obtenir dades de l'equip
        Promise.all(promises)
          .then(function (promiseResults) {
            fs.writeFile(
              `${OUTPUT_DIR}/peloton-teams_${teamStart}-to-${teamEnd}.json`,
              JSON.stringify(promiseResults),
              function (err) {
                if (err) {
                  console.log(err);
                }
              }
            );

            console.log(
              "Test: el primer ciclista del primer equip es " +
                promiseResults[0].ciclistes[0].nom
            );

            console.log(
              "Promeses de dades de pagines d'equips ciclistes -> Success"
            );
          })
          .catch(function (error) {
            console.log("Error en Promise.all equip ciclista");
          });
      }

      /**
       * Obte les imatges dels equips
       */
      if (getCyclistImages) {
        // Si existeix el directori de l'equip esborra el seu contingut. xtoni zzzzz
        /*     if (fs.existsSync("./" + OUTPUT_DIR)) {
          // return;

          fm.removeContentsOfDirectory(OUTPUT_DIR);
        }
   */
        // Crea un array de promises amb peticions de fotos de cada equip
        let promises = [];
        directoris
          .slice(teamStart, teamEnd < 99 ? teamEnd : directoris.length - 1)
          .forEach((directori) => {
            promises.push(scrapImagesFromTeam(url_base, directori));
          });

        // Executa totes les promeses per obtenir les imatges
        Promise.all(promises)
          .then(function (promiseResults) {
            console.log("Les promeses de les imatges han anat be");
          })
          .catch(function (error) {
            console.log("Error en Promise.all");
          });
      }
    })
    .catch(function (err) {
      console.log(err);
      //handle error
    });
}

/**
 * Captura dades dels ciclistes
 *
 * @param {string} url_base url base de la pàgina de ProCycling Stats
 * @param {string} url_team  url de l'equip
 *
 * @return {string}  JSON data
 */
function scrapCyclistDataFromTeam(url_base, url_team) {
  // Request del html de la pàgina de l'equip
  return new Promise(function (fulfil, reject) {
    request(url_team)
      .then(function (html) {
        //success!

        let riders = [];
        let riders_urls = [];

        // console.log(html);
        riders = $("a.rider", html);

        for (let i = 0; i < riders.length; i++) {
          // Promise per accedir a dades de ciclista

          riders_urls[i] = url_base + "/" + riders[i].attribs.href;
        }

        //Array de promises
        let promises = [];

        // 1 promesa per ciclista
        riders_urls.forEach((rider_url) => {
          promises.push(scrapCyclistData(rider_url));
        });

        //Array de promises

        // Executa totes les promeses de scrap de dades de ciclistes
        Promise.all(promises)
          .then(function (promiseResults) {
            // promiseResults = Array amb els resultats de totes les promeses =
            // informació de tots els ciclistes de l'equip.
            fulfil({
              team: url_team.slice(url_team.lastIndexOf("/") + 1),
              ciclistes: promiseResults,
            });

            console.log(
              "Fulfilled all the promises of cyclists of: " + url_team
            );
          })
          .catch(function (error) {
            console.log("Error en Promise.all");
          });
      })

      .catch(function (err) {
        console.log("error en descarregar imatges d'aquest equip");
        console.log(err);
        //handle error
      });
  });
}

/**
 *
 * @param {string} rider_url Url de la pàgina del cicllista
 */
function scrapCyclistData(rider_url) {
  // Request del html de la pàgina de l'equip
  return new Promise(function (fulfil, reject) {
    request(rider_url)
      .then(function (html) {
        // name
        let name = $("span.main-title", html)[0]
          ? $("span.main-title", html)[0].children[0].data
          : undefined;

        // birthdate
        let day = $(".rdr-info-cont > b", html)[0]
          ? $(".rdr-info-cont > b", html)[0].children[0].parent.next.data
          : "";
        let mesany = $(".rdr-info-cont > sup", html)[0]
          ? $(".rdr-info-cont > sup", html)[0].children[0].parent.next.data
          : "";
        // birthdate
        let birthdate = `${day.trim()}/${mesany.split(" ")[1]}/${
          mesany.split(" ")[2]
        }`;

        // check if weight is in the html page
        let weight = $(".rdr-info-cont > span > b", html)[0]
          ? $(".rdr-info-cont > span > b", html)[0].children[0].parent.next.data
          : undefined;
        weight = weight.split(" ")[1];

        // check if altura is in the html page
        let height = $(".rdr-info-cont > span > span > b", html)[0]
          ? $(".rdr-info-cont > span > span > b", html)[0].children[0].parent
              .next.data
          : undefined;
        height = height.split(" ")[1];

        //fulfil promise with the data of the cyclist
        fulfil({
          nom: name,
          naixement: birthdate,
          pes: weight,
          altura: height,
        });
      })
      .catch(function (err) {
        console.log("error en promesa - scrapCyclistData - " + rider_url);
        console.log(err);
      });
  });
}

/**
 * Retorna una promesa d'una request que
 * captura les imatges d'un equip i les guarda en un directori
 * amb el nom del directori de l'equip
 **
 * @param{string} url_base
 * @param{string} teamDirectory   El directori de l'equip
 *
 * @return {undefined}
 */
function scrapImagesFromTeam(url_base, teamDirectory) {
  //Crea una promesa
  return new Promise(function (fulfil, reject) {
    request(url_base + "/team/" + teamDirectory)
      .then(function (html) {
        let dadesCiclistes = [];
        let numCiclistes = $(".tmCont1 > ul > li a", html).length;

        for (let i = 0; i < numCiclistes - 1; i++) {
          let property = $(".tmCont1 > ul > li a", html)[i].attribs.style;

          let imageUrl = property.slice(
            property.indexOf("url") + 4,
            property.indexOf(".jpeg") + 5
          );

          dadesCiclistes.push(url_base + "/" + imageUrl);
        }

        // Create a dir for every team if doesn't exist
        if (!fs.existsSync(OUTPUT_DIR + "/" + teamDirectory))
          fs.mkdirSync(OUTPUT_DIR + "/" + teamDirectory);

        // Numero de fitxers descarregats
        var n = 0;

        // Download the images
        for (let i = 0; i < numCiclistes - 1; i++) {
          let fileName = dadesCiclistes[i].slice(
            dadesCiclistes[i].lastIndexOf("/") + 1
          );

          if (fileName.length == 0) {
            n++;
          } else {
            fm.downloadFileFromURI(
              dadesCiclistes[i],
              OUTPUT_DIR + "/" + teamDirectory + "/" + fileName,
              function () {
                try {
                  n++;
                  if (n == numCiclistes) {
                    // Promise must be fulfilled
                    fulfil(html);
                    console.log("promise fulfilled");
                  }
                } catch (e) {
                  console.log("No he pogut descarregar la imatge");
                }
              }
            );
          }
        }
      })

      .catch(function (err) {
        console.log("error en promesa - imatges d'un equip");
        console.log(err);
        //handle error
      });
  });
}
