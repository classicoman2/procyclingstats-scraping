# web-scrapping
A script to scrap data from UCI cycling teams in Procycling Stats.

Disclaimer: I use the scrapped data for teaching purposes only.

## Usage
```bash
# Scrap Images and data from teams, from 1st to 9th team
npm start true true 0 9
```

## Dependencies
```bash
npm i
```

## Webgraphy
 * https://www.donnywals.com/build-a-simple-web-scraper-with-node-js/
 * https://www.freecodecamp.org/news/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3/
 * Howto download images, https://stackoverflow.com/questions/12740659/downloading-images-with-node-js

## TODO
> BUGS
- [ ] Parse dates using https://www.npmjs.com/package/date-and-time
- [x] Debug errors in promises (when all data is required in a single execution) --> SOLVED: avoid sending all requests simultaneously
- [x] Normalize names of properties and variables (English)

> UPGRADE:
- [ ] Now is making a request for all team ids everytime it looks for info for 1 team only in `index.js`. Should make the team ids requests only once
- [ ] Create a `/server` directory with scrapping data and open a web server to show scrapped data with code in a `/client` folder.
- [ ] Create & Publish package: add bin.js, directory structure, SOLID principles, etc.
- [x] Set _delays_ between promises to avoid massive sending of simultaneous async Requests 
- [x] Added a property `image:` with the name of image file

> REFACTORING:
- [ ] Linting
- [ ] Automate Tests
- [ ] Include exceptions in file functions
- [ ] Use `path` module to standarize paths

> DONE:
- [x] Added a self-invoking function to avoid creating variables in Global object and interferences with local vars
- [x] Bug: linia 77, no agafa els elements img
- [x] File functions should be in separated file
