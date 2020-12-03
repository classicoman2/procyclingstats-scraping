var Promise = require("promise");
const request = require("request-promise");

//const url = "https://www.procyclingstats.com/team/ag2r-la-mondiale-2020";

const url = 'https://www.procyclingstats.com/teams.php';

//   An iterable of Promises.
//   Creates a Promise that is resolved with an array of results when all of the
// provided Promises resolve, or rejected when any Promise is rejected.

var promises = [];

// Afegim una url
promises.push(scrapePagina(url));

Promise.all(promises)
  .then(function (promiseResults) {
    console.log("\npromiseResults:");
    //promiseResults és un Array, cada element conté el HTML d'una pàgina sencera
    console.log(promiseResults[0].slice(0, 24));
  })
  .catch(function (error) {
    console.log(error);
  });

/**
 *
 */
function scrapePagina(url) {
  return new Promise(function (fulfil, reject) {
    request(url)
      .then(function (data) {
        console.log(data.slice(1, 400));

        fulfil(data);
      })
      .catch(function (err) {
        console.log("S'ha produit un error:\n" + err);
      });
  });
}
