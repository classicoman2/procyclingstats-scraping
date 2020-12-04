const request = require("request-promise");
const $ = require("cheerio");
var fs = require("fs");

const url_base = 'https://www.procyclingstats.com';

//const url = 'https://www.procyclingstats.com/team/ag2r-la-mondiale-2020';
const url = "https://www.procyclingstats.com/teams.php";

//const url_base = "https://www.procyclingstats.com/team/";

//Obté directoris dels equips
getTeamsData(url_base, true, true);

/**
 * Captura dades dels ciclistes
 *
 * @param {string} url_base
 * @param {string} teamDirectory   El directori de l'equip
 *
 * @returns {string}  JSON data
 */
function scrapCyclistDataFromTeam(url_base, teamDirectory) {
  // Url de l'equip
  let url = url_base + teamDirectory;

  // Request del html de la pàgina de l'equip
  request(url)
    .then(function (html) {
      //success!

      let riders = [];

      // console.log(html);
      riders = $("a.rider", html);

      for (let i = 0; i < riders.length; i++) {
        // Promise per accedir a dades de ciclista

        //zzzzz

        console.log(riders[i].attribs.href);
      }
    })

    .catch(function (err) {
      console.log("error en descarregar imatges d'aquest equip");
      console.log(err);
      //handle error
    });

  //xtoni
}

/**
 * Retorna una promesa d'una request que
 * captura les imatges d'un equip i les guarda en un directori
 * amb el nom del directori de l'equip
 *
 * xtoni --> codi basat en el de function getImagesFromTeam(url_base, teamDirectory)
 *
 * @param{string} url_base 
 * @param{string} teamDirectory   El directori de l'equip
 *
 * @returns no return
 */
function scrapImagesFromTeam(url_base, teamDirectory) {

  //xtoni -> Afegit per poder fer Promise.all
  return new Promise(function (fulfil, reject) {

    request(url_base + '/team/' + teamDirectory)
      .then(function (html) {
        let dadesCiclistes = [];
        let numCiclistes = $(".tmCont1 > ul > li a", html).length;

        for (let i = 0; i < numCiclistes - 1; i++) {
          let property = $(".tmCont1 > ul > li a", html)[i].attribs.style;

          let imageUrl = property.slice(
            property.indexOf("url") + 4,
            property.indexOf(".jpeg") + 5
          );

          dadesCiclistes.push( url_base+'/'+imageUrl );

        }


        let download = function (uri, filename, callback) {
          request.head(uri, function (err, res, body) {
            // console.log("content-type:", res.headers["content-type"]);
            // console.log("content-length:", res.headers["content-length"]);

            request(uri)
              .pipe(fs.createWriteStream(filename))
              .on("close", callback);
          });
        };

        //xtoni  makedir per cada equip

        fs.mkdirSync("./teams/" + teamDirectory);

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
            download(
              dadesCiclistes[i],
              "./teams/" + teamDirectory + "/" + fileName,
              function () {
                try {
                  n++;
                  if (n == numCiclistes) {
                    //xtoni -> Afegit per poder fer Promise.all
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
        console.log("error en promesa");
        console.log( err );
        //handle error
      });

    //xtoni -> Afegit per poder fer Promise.all
  });
}

/**
 * Captura les imatges d'un equip i les guarda en un directori
 * amb el nom del directori de l'equip
 *
 * @param teamDirectory   El directori de l'equip
 *
 * @returns res
 */
function getImagesFromTeam(url_base, teamDirectory) {
  let url = url_base + teamDirectory;

  request(url)
    .then(function (html) {

      let dadesCiclistes = [];
      let numCiclistes = $(".tmCont1 > ul > li a", html).length;

      for (let i = 0; i < numCiclistes - 1; i++) {
        let property = $(".tmCont1 > ul > li a", html)[i].attribs.style;
        const url_base = "https://www.procyclingstats.com/";

        let imageUrl = property.slice(
          property.indexOf("url") + 4,
          property.indexOf(".jpeg") + 5
        );

        dadesCiclistes.push(url_base + imageUrl);
      }

      let download = function (uri, filename, callback) {
        request.head(uri, function (err, res, body) {
          console.log("content-type:", res.headers["content-type"]);
          console.log("content-length:", res.headers["content-length"]);

          request(uri)
            .pipe(fs.createWriteStream(filename))
            .on("close", callback);
        });
      };

      //xtoni  makedir per cada equip

      fs.mkdirSync("./agrlamondiale");
      // Download the images
      for (let i = 0; i < numCiclistes - 1; i++) {
        let fileName = dadesCiclistes[i].slice(
          dadesCiclistes[i].lastIndexOf("/") + 1
        );

        download(dadesCiclistes[i], "./agrlamondiale/" + fileName, function () {
          try {
            //console.log("done");
          } catch (e) {
            console.error(
              "Error 'Unhandled rejection RequestError: Error: read ECONNRESET' anb fitxer: " +
                fileName
            );
          }
        });
      }
    })

    .catch(function (err) {
      console.log("error en descarregar imatges d'aquest equip");
      //handle error
    });
}

/**
 * Fent scrapping, obté els directoris de fotos dels equips
 *
 * @param {string} url_base  La url base de la web
 * @param {boolean} images  Se descarreguen les imatges?
 * @param {boolean} cyclistData Se descarreguen les dates dels ciclistes?
 *
 */
function getTeamsData(url_base, images, cyclistData) {
  //Array de directoris amb fotos en la url
  let directoris = [];

  //Obté html de la url
  request(url_base + '/teams')
    .then(function (html) {
      // Obte tots els elements HTML que compleixen el patró
      // emprant cheerio
      let divTeams = $(".teamOvShirt", html);

      //Omple array amb directoris amb les fotos
      for (property in divTeams) {
        if (divTeams[property].attribs !== undefined)
          directoris.push(divTeams[property].attribs.href.slice(5));
      }

      /**
       * xtoni
       *
       * Obté la informació dels ciclistes
       *
       */
      if (cyclistData) {
        //Array de promises
        let promises = [];

        // xtoni --> provo només amb 1 equip de moment
        directoris.slice(0, 1).forEach((directori) => {
          promises.push(scrapCyclistDataFromTeam(url_base+'/team/'+ directori));
        });
      }

      /**
       * Obte les imatges dels equips
       */
      if (images) {
        //Array de promises
        let promises = [];

        directoris.forEach((directori) => {
          promises.push(scrapImagesFromTeam(url_base, directori));
        });

        // Executa totes les promeses per obtenir les imatges
        Promise.all(promises)
          .then(function (promiseResults) {
            console.log("Success!!");
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
