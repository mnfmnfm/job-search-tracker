const express = require('express');
const app = express();
require('dotenv').config()
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

const { auth, requiresAuth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: 'http://localhost:3000',
  clientID: 'SAMV3XkhTcdEMK4eBZLBzzIvM5UJWPyj',
  issuerBaseURL: 'https://dev-pv-70kd5.us.auth0.com',
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

const homepageRenderer = pug.compileFile('pugTemplates/home.pug');
app.get('/', (req, res) => res.send(homepageRenderer({name: 'Erin'})));

app.get('/dashboard', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
