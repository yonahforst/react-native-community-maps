const functions = require('firebase-functions')
const { GeoFirestore } = require('geofirestore')

const { sendPushNotification } = require('./expo')

const express = require('express');

const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore()
const geofirestore = new GeoFirestore(firestore);
const notificationPreferences = geofirestore.collection('notificationPreferences')


exports.onCreateItem = functions.firestore
  .document('items/{itemId}')
  .onCreate((snap, context) => {
    const data = snap.data()

    // get nearby users
    return notificationPreferences
      // this doesnt work for some reason. the link that it returns to create the requried index does nothing.
      // .where('shouldNotify', '==', true)
      .near({ center: data.coordinates, radius: 10000 })
      .get()
      .then(result => {

        const notificationQueue = []
        
        // filter users that should be notified
        result.docs.forEach(doc => {
          const { 
            shouldNotify, 
            pushToken, 
            radius,
          } = doc.data()

          if (
            shouldNotify && // do they want to be notified?
            pushToken && // do we have a push token for them?
            doc.distance*1000 < radius // is this item within the their notification radius?
          ) notificationQueue.push(pushToken) // if so, add it to the queue.
        })

        const promises = notificationQueue.map(token =>
          sendPushNotification({
            to: token,
            title: "New item available",
            data,
          })  
        )

        return Promise.all(promises)
      })
  })


const app = express();
app.get('/:id', (req, res) => {
  return firestore
    .collection('items')
    .doc(req.params.id)
    .get()
    .then(doc => {
      if (!doc.exists)
        return res.status(404).send('You just got 404\'d!!')
      const data = doc.data()
      res.status(200).send(`
      <!doctype html>
        <head>
          <title>Nice find!</title>
        </head>
        <body>
          <img src="${data.pictureUri}" />
        </body>
      </html>
      `);
    })
});

exports.getItem = functions.https.onRequest(app);
