import React from 'react'

import { 
  Permissions, 
  Notifications, 
} from 'expo'

import {
  auth,
  db,
} from '../lib/firebase'

import FB from 'firebase'

import {
  getMetersBetweenPoints,
} from '../lib/geo'

const { firestore: { GeoPoint } } = FB

const { GeoFirestore } = require('geofirestore')

const NotificationContext = React.createContext({
  region: {},
  shouldNotify: false,
});

const geofirestore = new GeoFirestore(db);
const notificationPreferences = geofirestore.collection('notificationPreferences')


export default class NotificationContainer extends React.Component {

  componentDidMount = () => {
    this.unsubscribe = notificationPreferences.doc(auth.currentUser.uid)
      .onSnapshot(doc => {
        const data = doc.data()
        if (!data) return
        // if there's no location data yet, geofirestore won't parse the data from the 
        // nested data document, or whatever it's called. So we do it ourselves.
        this.setState(data.d ? data.d : data)
      })
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  async requestPermission() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    
    let finalStatus = existingStatus;
  
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
  
    console.log(finalStatus)
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return false
    }
  
    // Get the token that uniquely identifies this device
    const pushToken = await Notifications.getExpoPushTokenAsync();
    
    await notificationPreferences.doc(auth.currentUser.uid).set({
      pushToken
    }, {
      merge: true
    })

    return true
  }

  setRegion = async region => {
    const radius = getMetersBetweenPoints(region, {
      longitude: region.longitude + region.longitudeDelta,
      latitude: region.latitude + region.latitudeDelta,
    })

    await notificationPreferences.doc(auth.currentUser.uid)
      .set({
        region,
        radius: Math.round(radius),
      }, {
        customKey: 'region',
        merge: true
      })
  }

  setShouldNotify = async shouldNotify => {
    if (shouldNotify) {
      const hasPermission = await this.requestPermission()
      // console.log(hasPermission)
      // if (!hasPermission) return
    }

    await notificationPreferences.doc(auth.currentUser.uid)
      .set({
        shouldNotify
      }, {
        merge: true
      })
  }

  render() {
    return (
      <NotificationContext.Provider value={{
        notification: {
          ...this.state,
          setRegion: this.setRegion,
          setShouldNotify: this.setShouldNotify,
        }
      }}> 
        { this.props.children }
      </NotificationContext.Provider>
    );
  }
}

export const NotificationContainerHoc = (Component) => props => (
  <NotificationContext.Consumer>
    { context => <Component { ...context }  { ...props } /> }
  </NotificationContext.Consumer>
)