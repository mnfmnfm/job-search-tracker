const express = require('express');
const app = express();
const pug = require('pug');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const PORT = process.env.PORT || 3000;

const serviceAccount = require('./secrets/job-search-tracker-9e5f8-9ebf83110bc5.json');

initializeApp({
  credential: cert(serviceAccount)
});

// const db = getFirestore();

// const docRef = db.collection('companies').doc('meta');

// docRef.set({
//   name: 'Meta',
//   isHiring: 'maybe',
// });
// console.log('saved thing to doc?');
const homepageRenderer = pug.compileFile('pugTemplates/home.pug');
app.get('/', (req, res) => res.send(homepageRenderer({name: 'Erin'})));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
