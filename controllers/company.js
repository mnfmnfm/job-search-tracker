const pug = require('pug');
const company = require('../models/company');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('../secrets/job-search-tracker-9e5f8-9ebf83110bc5.json');
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const companyPostHandler = async (req, res) => {
  console.log('req.body', req.body);
  console.log('req.oidc.user', req.oidc.user);
  const newCompany = company(req.body.name, req.body.status, req.body.notes);
  const userId = req.oidc.user.sub;
  const docRef = db.collection('users').doc(userId);
  const doc = await docRef.get();
  if(!doc.exists) {
    // wow the user has added their first company!
    // we are so proud of them
    await docRef.set({
      name: req.oidc.user.name
    });
  }
  const companiesCollection = docRef.collection('companies');
  await companiesCollection.add(newCompany);

  res.redirect('/dashboard');
};


const dashboardRenderer = pug.compileFile('pugTemplates/dashboard.pug')
const dashboardHandler = async (req, res) => {
  // go get the data from firestore
  const userId = req.oidc.user.sub;
  const docRef = db.collection('users').doc(userId).collection('companies');
  const doc = await docRef.get();
  let companies = [];
  if(doc.empty) {
    console.log('there is no data');
  } else {
    companies = doc.docs.map(x => ({id: x.id, ...(x.data())}));
  }
  res.send(dashboardRenderer({user: req.oidc.user, companies}))
};

const companyRenderer = pug.compileFile('pugTemplates/company.pug');
const companyHandler = async(req, res) => {
  // ok so find the company
  const companyId = req.params.id;
  const userId = req.oidc.user.sub;
  const docRef = db.collection('users').doc(userId).collection('companies').doc(companyId);
  const doc = await docRef.get();
  if(doc.exists) {
    res.send(companyRenderer({user: req.oidc.user, company: doc.data(), companyId: doc.id}));
  } else {
    res.redirect('/dashboard');
  }
}

const companyDeleteHandler = async(req, res) => {
  // delete the company
  const companyId = req.params.id;
  const userId = req.oidc.user.sub;
  const docRef = db.collection('users').doc(userId).collection('companies').doc(companyId);
  await docRef.delete();
  res.redirect('/dashboard');
}

module.exports = {
  post: companyPostHandler,
  get: companyHandler,
  delete: companyDeleteHandler,
  dashboard: dashboardHandler
};
