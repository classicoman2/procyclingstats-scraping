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
npm install --save request request-promise cheerio puppeteer promise
```

## Webgraphy
 * https://www.donnywals.com/build-a-simple-web-scraper-with-node-js/
 * https://www.freecodecamp.org/news/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3/
 * Per descarregar imatges, https://stackoverflow.com/questions/12740659/downloading-images-with-node-js

## TODO
> Bugs:
- [ ] Normalize names of properties and variables (English)
- [ ] Parse dates using https://www.npmjs.com/package/date-and-time
- [ ] Pendent depurar error en promeses (surt en vermell)

> Upgrade:
- [ ] Create & Publish package: add bin.js, directory structure, SOLID principles, etc.
- [ ] Incorporar _delays_ entre les promises per tal d'evitar que el servidor ens tanqui la connexió

> Improve code:
- [ ] Linting
- [ ] Add automated Tests
- [ ] incloure excepcions en el codi en el tractament amb fitxers
- [ ] emprar modul 'path' per crear els paths als fitxers

> Done:
- [x] Afegida self-invoking function per evitar variables globals en el Global object i que puguin interferir amb les variables locals
- [x] Bug: linia 77, no agafa els elements img
- [x] Separar la funcio download en fitxer apart (funcions de fitxers)
