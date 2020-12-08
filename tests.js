fs = require('fs');
fs = require('path');

const PATH = './teams';

//Reads the contents of the directory
let dirents = fs.readdirSync( PATH );
    
for (const dirent of dirents) {
  // is it a File?
  if (fs.lstatSync(path.join(".", TEAMS_DIRECTORY, dirent)).isFile())
    fs.unlinkSync(path.join(TEAMS_DIRECTORY, dirent));
  else
    fs.rmdirSync(path.join(".", TEAMS_DIRECTORY, dirent), { recursive: true });
}