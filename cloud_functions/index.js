const functions = require('firebase-functions')
const { GeoFirestore } = require('geofirestore')

const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore()
const geofirestore = new GeoFirestore(firestore);
const locations = geofirestore.collection('locations')

exports.onWriteResource = functions.firestore
  .document('{resource}/{resourceId}')
  .onWrite((change, context) => {
    // dont track updates to yourself.
    if (context.params.resource == 'locations')
      return null

    // Get an object with the current document value.
    // If the document does not exist, it has been deleted.
    const data = change.after.exists ? change.after.data() : null;
    
    // if the document or its coodinates have been deleted, remove it from locations
    if (!data || !data.coordinates)
      return locations.doc(context.params.resourceId).delete()
      
    // Get an object with the previous document value (for update or delete)
    const previousData = change.before.data();

    // if the coordinated havent changed, do nothing
    if (previousData && data.coordinates == previousData.coordinates)
      return null;

    // otherwise write the new location and the type of resource
    return locations.doc(context.params.resourceId).set({
      resource: context.params.resource,
      coordinates: data.coordinates
    })
  })

exports.onUpdateItemLocation = functions.firestore
  .document('locations/{resourceId}')
  .onWrite((change, context) => {
    // Get an object with the current document value.
    // If the document does not exist, it has been deleted.
    const data = change.after.exists ? change.after.data() : null;
    
    // Get an object with the previous document value (for update or delete)
    const previousData = change.before.data();

    if (
      !data || // if the document has been deleted
      !data.coordinates || // or is empty
      data.resource !== 'item' // or does not belong to an item
      (previousData && data.coordinates == previousData.coordinates) // or hasn't changed
    ) return null // do nothing
      

    // get nearby users
    const query = locations
    .where('resource', '==', 'users')
    .near({ center: data.coordinates, radius: 100 })

    // Get query (as Promise)
    query.get().then((value) => {
      console.log(value.keys); // All docs returned by GeoQuery
    });
    
    


  })