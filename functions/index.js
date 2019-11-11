const functions = require('firebase-functions');
// const gcs = require('@google-cloud/storage')();
// const os = require("os");
// const path = require("path");
const cors = require("cors")({ origin: true });
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fyp-cloud-83c3b.firebaseio.com"
});
var db = admin.database();
var ref = db.ref("deviceDataStore");

 exports.connData = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
      const usersRef = ref.child(`${req.body.deviceID}`);

      if (req.method !== 'POST') {
          return res.status(500).json({
              message: 'Not allowed'
          })
      } else {
          return usersRef.set(
            req.body
          ).then(() => {
              res.status(200).json({
                  message: req.body
              });
              return res.status(200)
          }).catch(error => {
              return res.status(500).send(error);
          })
      }
  })

});