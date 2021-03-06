const functions = require('firebase-functions');

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


////////////////////////////file update func///////////////////
var ref2 = db.ref("TEST_FILE_STORE");
exports.connFileUpdate = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

        if (req.method !== 'POST') {
            return res.status(500).json({
                message: 'Not allowed'
            })
        } else {
            return ref2.set(
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
////////////////////////////file update func is over/////////////

////////////////////////////file request func///////////////////
var ref3 = db.ref("News");
exports.connFileRequest = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        //const usersRef = ref3.child("test");

        if (req.method !== 'POST') {
            return res.status(500).json({
                message: 'Not allowed'
            })
        } else {
            return ref3.push(
                {
                    "description": "First Pairing",
                    "priority": 1,
                    "title": "Test pairing",
                    "device1ID": "QaA6FrpGZKariA7xFAdcb5rjfXi2",
                    "device1SSID": "G3112",
                    "device2ID": "nmRvoJeiC6ZvzRQ1LRh7KqBzQj83",
                    "device2SSID": "[Phone] Isuru Nuwanthilaka ",
                    "fileName": `${req.body.fileName}`
                }
            ).then(() => {
                res.status(200).json({
                    downloadState: 1,
                    url: "gs://fyp-cloud-83c3b.appspot.com/images.jpg"
                });
                return res.status(200)
            }).catch(error => {
                return res.status(500).send(error);
            })
        }
    })

});
////////////////////////////file update func is over/////////////

///////////////////////////////Cloud Messagging//////////////////////////////////////////////////////////

exports.sendAdminNotification = functions.database.ref('/News/{pushId}').onCreate((snap, context) => {
    const item = snap.val();
    if (item.priority === 1) {
        const payload = {
            notification: {
                title: `${item.title}`,
                body: `${item.description}`
            },
            data: {
                device1ID: `${item.device1ID}`,
                device1SSID: `${item.device1SSID}`,
                device2ID: `${item.device2ID}`,
                device2SSID: `${item.device2SSID}`,
                fileName: `${item.fileName}`
            }
        };

        return admin.messaging().sendToTopic("News", payload)
            .then(function (response) {
                console.log('Notification sent successfully:', response);
                return null
            })
            .catch(function (error) {
                console.log('Notification sent failed:', error);
            });
    }
});
