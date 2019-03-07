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
          .then(() => true)
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
          <meta property="og:title" content="Dope stuff nearby!">
          <meta property="og:image" itemprop="image" content="https://demo.cloudimg.io/width/300/n/${data.pictureUri}">
          <meta property="og:type" content="website" />
          <meta property="og:description" content="Look what I found...">
          

          <script src="https://cdn.jsdelivr.net/npm/siema@1.5.1/dist/siema.min.js"></script>
          <style>
          body {
            width: 100%;
            max-width: 800px;
            height: 100%;
            max-height: 800px;          
            margin: 0 auto;
          }
          
          img {
            width: 100%;
            height: 100%;
            image-orientation: from-image;
          }
          
          .siema {
            margin: 1rem 0;
          }
          
          .slide {
            position: relative;
          }

          .button {
            position: absolute;
            bottom: 10px;
            background-color: #555;
            color: white;
            font-size: 16px;
            padding: 12px 24px;
            border: none;
            cursor: pointer;
            border-radius: 5px;
          }          

          .map.button {
            right: 10px;
          }

          .picture.button {
            left: 10px;
          }

          </style>
        </head>
        <body>
          <div class="siema">
            <div class="slide">
              <img src="${data.pictureUri}" />
              <button class="map button">Map</button>
            </div>
            <div class="slide">
              <img src="
              https://maps.googleapis.com/maps/api/staticmap?size=900x900&zoom=18
              &markers=color:red%7C${data.coordinates.latitude},${data.coordinates.longitude}
              &key=AIzaSyDjX31I6z_T9CMu8v6ZXeLkbcIdese8B_s
              "/>
              <button class="picture button">Picture</button>
            </div>
          </div>
        </body>
        <script>
          var mySiema = new Siema({
            perPage: 1,
          });

          document.querySelector('.map.button')
          .addEventListener('click', () => mySiema.goTo(1));

          document.querySelector('.picture.button')
          .addEventListener('click', () => mySiema.goTo(0));



        </script>
      </html>
      `);
    })
});

exports.getItem = functions.https.onRequest(app);
