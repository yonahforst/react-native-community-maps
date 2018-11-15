import React from 'react'

import { 
  Permissions, 
  Notifications, 
} from 'expo'

import {
  auth,
  db,
} from '../lib/firebase'

export default class PushContainer extends React.Component {

  async componentDidMount() {
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
  
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }
  
    // Get the token that uniquely identifies this device
    const pushToken = await Notifications.getExpoPushTokenAsync();
    const user = auth.currentUser;
    
    db.collection('users').doc(user.uid).set({
      pushToken
    }, {
      merge: true
    })
  }

  render() {
    return this.props.children
  }
}