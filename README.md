# web-scrapping
Proves de web scrapping amb node.js

## usage

```js 
    # Scrap Images and data from teams, from 1st to 9th team
    node scrapper true true 0 9
```

## dependencies

```js 
    npm install --save request request-promise cheerio puppeteer promise
```

## webgraphy
 * https://www.donnywals.com/build-a-simple-web-scraper-with-node-js/
 * https://www.freecodecamp.org/news/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3/
 * Per descarregar imatges, https://stackoverflow.com/questions/12740659/downloading-images-with-node-js



## todo

> Bugs:

- [ ] Pendent depurar error en promeses (surt en vermell)

> Upgrade:

- [ ] Incorporar _delays_ entre les promises per tal d'evitar que el servidor ens tanqui la connexió

> Improve code:

- [ ] Create unity tests & integration tests
- [ ] incloure excepcions en el codi en el tractament amb fitxers
- [ ] emprar modul 'path' per crear els paths als fitxers

> Done:

- [x] Afegida self-invoking function per evitar variables globals en el Global object i que puguin interferir amb les variables locals
- [x] Bug: linia 77, no agafa els elements img
- [x] Separar la funcio download en fitxer apart (funcions de fitxers)
