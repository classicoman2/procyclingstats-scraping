const request = require("request-promise");
const fs = require("fs");
const fm = require("./fileManagement");
const chalk = require("chalk");

const scrapCyclistPage = require("./scrapData").scrapCyclistPage;
const scrapTeamsDirectories = require("./scrapData").scrapTeamsDirectories;
const scrapCyclistsUrls = require("./scrapData").scrapCyclistsUrls;
const scrapImagesUrls = require("./scrapData").scrapImagesUrls;

/**
 * Fent scrapping, obté els directoris de fotos dels equips
 *
 * @param {string} output_dir On se guarden les dades escrapejades
 * @param {string} url_base  La url base de la web
 * @param {boolean} getCyclistImages  Se descarreguen les imatges?
 * @param {boolean} getCyclistsData Se descarreguen les dates dels ciclistes?
 * @param {string}  teamStart  Posicio inicial directori de teams
 * @param {string}  teamEnd  Posicio final directori de teams; si val 99, agafa valor màxim
 * @param {string}  season   2021 by default
 */
module.exports = function (
  output_dir,
  url_base,
  getCyclistImages = true,
  getCyclistsData = true,
  teamStart = 0,
  teamEnd = 99,
  season = 2021
) {
  //xtoni - Posar a configuració, potser a .env?
  let CYCLISTS_PER_TEAM = 2;

  let url_request = url_base + `/teams.php?year=${season}&filter=Filter`;

  // request a la url on hi ha tots els equips llistats
  request(url_request)
    .then(function (html) {
      // Scrap teams directories
      let directoris = scrapTeamsDirectories(html);

      if (getCyclistsData) {
        //Array de promises de tots els equips --> 1 promesa per equip
        let promises = [];
        directoris.slice(teamStart, teamEnd < 99 ? teamEnd : directoris.length).forEach((directori) => {
          promises.push(scrapCyclistDataFromTeam(url_base, url_base + "/team/" + directori, CYCLISTS_PER_TEAM));
        });

        //Array de promises: Executa totes les promeses per obtenir dades de l'equip
        Promise.all(promises)
          .then(function (result) {
            fs.writeFile(
              `${output_dir}/peloton-teams_${teamStart}-to-${teamEnd}-${season}.json`,
              JSON.stringify(result),
              function (err) {
                if (err) {
                  console.log("Error en escriure dades a fitxer .json", err);
                }
              }
            );

            console.log(chalk.grey(`Test: 1st cyclist from 1st team is ${result[0].ciclistes[0].nom}`));

            console.log("Promeses de dades de pagines d'equips ciclistes -> Success");
          })
          .catch(function (error) {
            console.log("Error en Promise.all equip ciclista", error);
          });
      }

      /**
       * Obte les imatges dels equips
       */
      if (getCyclistImages) {
        // Crea un array de promises amb peticions de fotos de cada equip
        let promises = [];
        directoris.slice(teamStart, teamEnd < 99 ? teamEnd : directoris.length - 1).forEach((directori) => {
          promises.push(scrapImagesFromTeam(output_dir, url_base, directori));
        });

        // Executa totes les promeses per obtenir les imatges
        Promise.all(promises)
          .then(function (result) {
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
};

/**
 * Captura dades dels ciclistes
 *
 * @param {string} url_base url base de la pàgina de ProCycling Stats
 * @param {string} url_team  url de l'equip
 * @param {string} numCyclists scrap first numCyclist riders of the team
 * @return {string}  JSON data
 */
function scrapCyclistDataFromTeam(url_base, url_team, numCyclists = 99) {
  // Request del html de la pàgina de l'equip
  return new Promise(function (fulfil, reject) {
    request(url_team)
      .then(function (html) {
        // get url of riders' pages
        let riders_urls = scrapCyclistsUrls(html, url_base);

        let num = numCyclists == 99 ? riders_urls.length : numCyclists;

        //Array of promises: 1 promise per cyclist page
        let promises = [];
        riders_urls.slice(0, num).forEach((rider_url) => {
          promises.push(scrapCyclistData(rider_url));
        });

        // Executa totes les promeses de scrap de dades de ciclistes
        Promise.all(promises)
          .then(function (result) {
            // result = Array amb els resultats de totes les promeses =
            // informació de tots els ciclistes de l'equip.
            fulfil({
              team: url_team.slice(url_team.lastIndexOf("/") + 1),
              ciclistes: result,
            });

            console.log("Fulfilled all the promises of cyclists of: " + url_team);
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
        // Scrap cyclist page
        data = scrapCyclistPage(html);

        //fulfil promise with cyclist data
        fulfil({
          nom: data.name,
          naixement: data.birthdate,
          pes: data.weight,
          altura: data.height,
          imatge: data.image,
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
 * @param {string} output_dir On se guarden les dades escrapejades
 * @param{string} url_base
 * @param{string} teamDirectory   El directori de l'equip
 *
 * @return {undefined}
 */
function scrapImagesFromTeam(output_dir, url_base, teamDirectory) {
  //Crea una promesa
  return new Promise(function (fulfil, reject) {
    request(url_base + "/team/" + teamDirectory)
      .then(function (html) {

        // scrap urls of the images
        urlsImages = scrapImagesUrls(html, url_base)

        // Create a dir for every team if doesn't exist
        if (!fs.existsSync(output_dir + "/" + teamDirectory)) fs.mkdirSync(output_dir + "/" + teamDirectory);

        // Numero de fitxers descarregats
        var n = 0;

        // Download the images
        for (let i = 0; i < urlsImages.length - 1; i++) {
          let fileName = urlsImages[i].slice(urlsImages[i].lastIndexOf("/") + 1);

          if (fileName.length == 0) {
            n++;
          } else {
            fm.downloadFileFromURI(urlsImages[i], output_dir + "/" + teamDirectory + "/" + fileName, function () {
              try {
                n++;
                if (n == urlsImages.length) {
                  // Promise must be fulfilled
                  fulfil(html);
                  console.log("promise fulfilled");
                }
              } catch (e) {
                console.log("No he pogut descarregar la imatge");
              }
            });
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
