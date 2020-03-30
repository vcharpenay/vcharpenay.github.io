/**
 * $ npm install vcharpenay/uRDF.js vcharpenay/STTL.js
 * $ node render.js
 */
const fs = require('fs');
const urdf = require('urdf');
const sttl = require('sttl');

const vcharpenay = fs.readFileSync('vcharpenay.jsonld', 'utf-8');
const bib = fs.readFileSync('bib.jsonld', 'utf-8');
const blog = fs.readFileSync('blog.jsonld', 'utf-8');
const opts = { format: 'application/ld+json' };

const me = {
    type: 'uri',
    'value': 'https://www.vcharpenay.link/#me'
};

const tpl = fs.readFileSync('templates.sparql', 'utf-8');
sttl.register(tpl);

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
.then(() => urdf.load(blog, opts))
.then(() => sttl.callTemplate('https://www.vcharpenay.link/#index', me))
.then(html => fs.writeFileSync('index.html', html));