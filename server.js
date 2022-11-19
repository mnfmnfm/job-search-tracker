const express = require('express');
const app = express();
require('dotenv').config()
const pug = require('pug');


const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

const { auth, requiresAuth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  clientID: 'SAMV3XkhTcdEMK4eBZLBzzIvM5UJWPyj',
  issuerBaseURL: 'https://dev-pv-70kd5.us.auth0.com',
  routes: {
    login: false
  }
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

const homepageRenderer = pug.compileFile('pugTemplates/home.pug');

app.get('/login', (req, res) => res.oidc.login({ returnTo: '/dashboard' }));

app.get('/', (req, res) => res.send(homepageRenderer({user: req.oidc.user})));

const companyHandlers = require('./controllers/company');

app.get('/dashboard', requiresAuth(), companyHandlers.dashboard);
app.get('/companies/:id', requiresAuth(), companyHandlers.get);
app.post('/companies', requiresAuth(), companyHandlers.post);
app.post('/companies/:id/update', requiresAuth(), companyHandlers.update)
app.post('/companies/:id/delete', requiresAuth(), companyHandlers.delete);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
