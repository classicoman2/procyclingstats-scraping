# web-scrapping
A script to scrap data from UCI cycling teams in Procycling Stats.

Disclaimer: I use the scrapped data for teaching purposes only.

## Table of contents

<!-- toc -->

- [Usage](#usage)
- [Dependencies](#dependencies)
- [Webgraphy](#webgraphy)
- [TODO](#todo)

<!-- tocstop -->

## Usage
```bash
# Scrap Images and data from teams, from 4th to 9th team, current season
npm run scrap true true 3 9 
```

```bash
# Scrap Images and data from all teams of season 2005
npm run scrap true true 0 99 2005
```

## Dependencies
```bash
npm i
```

## Webgraphy
 * https://www.donnywals.com/build-a-simple-web-scraper-with-node-js/
 * https://www.freecodecamp.org/news/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3/
 * Howto download images, https://stackoverflow.com/questions/12740659/downloading-images-with-node-js
 * https://stackoverflow.com/questions/42706584/eslint-error-parsing-error-the-keyword-const-is-reserved

## TODO
> PREVI VERSIO
- [ ] Change name of repository to `procyclingstats-scrapper`

> BUGS
- [ ] Can't specify port number with `--port`, some mistake when capturing argv 
- [x] Debug errors in promises (when all data is required in a single execution) --> SOLVED: avoid sending all requests simultaneously
- [x] Normalize names of properties and variables (English)

> UPGRADE:
- [ ] [Tor request](https://www.npmjs.com/package/tor-request) to avoid being detected
- [x] Add `season` to get cyclists for every year
- [ ] Now is making a request for all team ids everytime it looks for info for 1 team only in `index.js`. Should make the team ids requests only once
- [x] Create a `/server` directory with scrapping data and open a web server to show scrapped data with code in a `/public` folder.
- [ ] Create & Publish package: add bin.js, directory structure, SOLID principles, etc. + `babel-node`, etc.
- [x] Set _delays_ between promises to avoid massive sending of simultaneous async Requests 
- [x] Added a property `image:` with the name of image file
- [ ] Parse dates using https://www.npmjs.com/package/date-and-time
- [x] Created an `/api` route to get json from files inside `_output` directory.

> REFACTORING:
- [x] Linting
- [ ] Automate Tests
- [ ] Include exceptions in file functions
- [ ] Use `path` module to standarize paths

> DONE:
- [x] Added a self-invoking function to avoid creating variables in Global object and interferences with local vars
- [x] Bug: linia 77, no agafa els elements img
- [x] File functions should be in separated file
- [x] toc generator (markdown-toc package)
