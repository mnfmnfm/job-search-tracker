
const pug = require('pug');

const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const db = getFirestore();

// const docRef = db.collection('companies').doc('meta');

// docRef.set({
//   name: 'Meta',
//   isHiring: 'maybe',
// });
// console.log('saved thing to doc?');

const dashboardRenderer = pug.compileFile('pugTemplates/dashboard.pug')
const dashboardHandler = async (req, res) => {
  // go get the data from firestore
  console.log('user data:');
  console.log(req.oidc.user);
  const userId = req.oidc.user.sub;
  const docRef = db.collection('users').doc(userId);
  const doc = await docRef.get();
  let companies = [];
  if(!doc.exists) {
    console.log('there is no data');
  } else {
    console.log(doc.data());
    companies = doc.data().companies;
  }
  res.send(dashboardRenderer({user: req.oidc.user, companies}))
};

module.exports = dashboardHandler;
