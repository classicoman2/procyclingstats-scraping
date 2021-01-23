const $ = require("cheerio");
const path = require("path");

module.exports = {
  scrapCyclistPage: scrapCyclistPage,
  scrapTeamsDirectories: scrapTeamsDirectories,
  scrapCyclistsUrls: scrapCyclistsUrls,
  scrapImagesUrls: scrapImagesUrls,
};

function scrapImagesUrls(html, url_base) {
  let urlsImages = [];
  let numCiclistes = $(".tmCont1 > ul > li a", html).length;

  for (let i = 0; i < numCiclistes - 1; i++) {
    let property = $(".tmCont1 > ul > li a", html)[i].attribs.style;
    // jpg or jpeg?
    let end = property.indexOf('jpeg')== -1 ? 4 :5
    let imageUrl = property.slice(property.indexOf("url") + 4, property.indexOf(".jp") + end);
    urlsImages.push(url_base + "/" + imageUrl);
  }

  return urlsImages
}

function scrapCyclistsUrls(html, url_base) {
  // scrap
  let riders = $("a.rider", html);

  let riders_urls = [];

  // Compose urls of cyclists pages
  for (let i = 0; i < riders.length; i++) {
    riders_urls[i] = url_base + "/" + riders[i].attribs.href;
  }

  return riders_urls;
}

function scrapTeamsDirectories(html) {
  let dirs = [];
  // Obte tots els elements HTML que compleixen el patró emprant cheerio
  let divTeams = $("ul.list a", html);

  // Obté els directoris d'equips
  for (i in divTeams) {
    if (divTeams[i].attribs !== undefined) dirs.push(divTeams[i].attribs.href.slice(5));
  }

  return dirs;
}

function scrapCyclistPage(html) {
  data = {};

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
  let image = $(".rdr-img-cont img", html)[0] ? $(".rdr-img-cont img", html)[0] : "";
  data.image = image != "" ? path.basename(image.attribs.src) : "";

  return data;
}
