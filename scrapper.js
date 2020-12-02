const request = require("request-promise");
const $ = require("cheerio");
var fs = require("fs");

const url = "https://www.procyclingstats.com/team/ag2r-la-mondiale-2020";

request(url)
  .then(function (html) {
    //success!

    let dadesCiclistes = [];

    // console.log(html);
    let numCiclistes = $(".tmCont1 > ul > li a", html).length;

    console.log(numCiclistes);
    //  console.log(  $(".tmCont1 > ul > li a", html)['0'] );

    for (let i = 0; i < numCiclistes - 1; i++) {
      let property = $(".tmCont1 > ul > li a", html)[i].attribs.style;
      const url_base = "https://www.procyclingstats.com/";

      let imageUrl = property.slice(
        property.indexOf("url") + 4,
        property.indexOf(".jpeg") + 5
      );

      dadesCiclistes.push(url_base + imageUrl);
    }

    //console.log(dadesCiclistes);

    let download = function (uri, filename, callback) {
      request.head(uri, function (err, res, body) {
        console.log("content-type:", res.headers["content-type"]);
        console.log("content-length:", res.headers["content-length"]);

        request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
      });
    };

    //xtoni  makedir per cada equip

    fs.mkdirSync('./agrlamondiale')


    // Download the images
    for (let i = 0; i < numCiclistes - 1; i++) {
      let fileName = dadesCiclistes[i].slice(
        dadesCiclistes[i].lastIndexOf("/") + 1
      );

      download(dadesCiclistes[i], "./agrlamondiale/"+fileName, function () {
        try {
          console.log("done");
        } catch (e) {
          console.error(e);
        }
      });
    }
  })

  .catch(function (err) {
    console.log(err);
    //handle error
  });
