/**
 * $ npm install vcharpenay/uRDF.js vcharpenay/STTL.js
 * $ node render.js
 */
const fs = require('fs');
const urdf = require('urdf');
const sttl = require('sttl');

const vcharpenay = fs.readFileSync('vcharpenay.jsonld', 'utf-8');
const bib = fs.readFileSync('bib.jsonld', 'utf-8');
const opts = { format: 'application/ld+json' };

const me = {
    type: 'uri',
    'value': 'https://vcharpenay.github.io/#me'
};

fs.readFileSync('templates.sparql', 'utf-8')
.split('---')
.forEach(tpl => sttl.register(tpl));

sttl.connect(q => {
    return urdf.query(q)
    .then(bindings => ({
        results: {
            bindings: bindings
        }
    }));
});

urdf.load(vcharpenay, opts)
.then(() => urdf.load(bib, opts))
.then(() => sttl.callTemplate('https://vcharpenay.github.io/#index', me))
.then(html => fs.writeFileSync('index.html', html));