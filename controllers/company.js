
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const company = require('../models/company');

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
      name: req.oidc.user.name,
      companies: [newCompany]
    });
  } else {
    await docRef.update({
      companies: FieldValue.arrayUnion(newCompany)
    });
  }
  
  res.redirect('/dashboard');
};

module.exports = companyPostHandler;
