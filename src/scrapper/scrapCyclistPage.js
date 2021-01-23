const $ = require('cheerio')
const path = require('path')


module.exports = function (html) {

    data = {}

    data.name = $("span.main-title", html)[0] ? $("span.main-title", html)[0].children[0].data : undefined;

    // birthdate
    let day = $(".rdr-info-cont > b", html)[0] ? $(".rdr-info-cont > b", html)[0].children[0].parent.next.data : "";
    let mesany = $(".rdr-info-cont > sup", html)[0]
      ? $(".rdr-info-cont > sup", html)[0].children[0].parent.next.data
      : "";
    // birthdate
    data.birthdate = `${day.trim()}/${mesany.split(" ")[1]}/${mesany.split(" ")[2]}`;

    // check if weight is in the html page
    data.weight = $(".rdr-info-cont > span > b", html)[0]
      ? $(".rdr-info-cont > span > b", html)[0].children[0].parent.next.data.split(" ")[1]
      : "";

    // check if altura is in the html page
    data.height = $(".rdr-info-cont > span > span > b", html)[0]
      ? $(".rdr-info-cont > span > span > b", html)[0].children[0].parent.next.data.split(" ")[1]
      : "";

    // get image
    let image = $(".rdr-img-cont img", html)[0]
      ? $(".rdr-img-cont img", html)[0]
      : "";
    data.image = (image != "") ? path.basename(image.attribs.src) : "";

    return data;
}