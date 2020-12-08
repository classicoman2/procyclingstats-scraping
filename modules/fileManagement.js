// Aqui hi ficaré un export default de la funció de descàrrega de fitxers


var fs = require("fs");
var path = require("path");
const request = require("request-promise");



/**
 * 
 * @param {*} uri 
 * @param {*} filename 
 * @param {*} callback 
 */
function downloadFileFromURI(uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    // console.log("content-type:", res.headers["content-type"]);
    // console.log("content-length:", res.headers["content-length"]);
    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

/**
 * 
 * @param {*} dir 
 */
function removeContentsOfDirectory(dir) {
  //Reads directories of files
  let dirents = fs.readdirSync("./" + dir);

  for (const dirent of dirents) {
    // mirar si és fitxer o directori

    if (fs.lstatSync(path.join(".", dir, dirent)).isFile())
      fs.unlinkSync(path.join(dir, dirent));
    else
      fs.rmdirSync(path.join(".", dir, dirent), {
        recursive: true,
      });
  }
}

exports.downloadFileFromURI = downloadFileFromURI;
exports.removeContentsOfDirectory = removeContentsOfDirectory;