#!/usr/bin/env node
require('please-upgrade-node')(require('../../package.json'))
require('./')()

/*
xtoni
 - please-upgrade-node -> package per comprovar versio node - molt enginyós (+ a npmjs)
 - require('./')() executa module_exports de index.js a .
*/