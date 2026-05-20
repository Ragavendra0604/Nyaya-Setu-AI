const admin = require('firebase-admin');
const path = require('path');

// Load service account credentials from serviceAccount.json
const serviceAccount = require(path.join(__dirname, '../serviceAcount.json'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };
