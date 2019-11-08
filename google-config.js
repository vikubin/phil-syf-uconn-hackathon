// admin
const admin = require('firebase-admin');

// For local testing
if(process.env.COMPUTERNAME === "DESKTOP-8HR6D8D"){
    // Only on dev, so its not in the repo. This is a little more critical than the 30mb redis cache
    const serviceAccount = require('./service-account.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}else{
    admin.initializeApp();
}


// db
const db = admin.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);


// And... export
module.exports.admin = admin;
module.exports.db = db;
