const express = require('express');
const app = express();

const pug = require('pug');

const homepageRenderer = pug.compileFile('pugTemplates/home.pug');
app.get('/', (req, res) => res.send(homepageRenderer({name: 'Erin'})));

app.listen(3000);
