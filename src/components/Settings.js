import React, {
  Component
} from 'react';

import {
  View,
  Button,
  StyleSheet
} from 'react-native'

import { 
  MapView,
} from 'expo'

const DELTA = 0.001

export default class Settings extends Component {
  state={}

  componentDidMount() {
    const {
      navigation
    } = this.props



    navigation.setParams({
      onSave: this.onSave,
    })
  }

  render() {
    const {
      auth: {
        onSignOut,
        setNotificationRegion,
        user,
      }
    } = this.props

    return (
      <View
      style={styles.container}>
        <View
        style={styles.container}>
          <View
          style={styles.mapContainer}>
            <MapView 
            style={styles.map} 
            initialRegion={user.notificationRegion}
            showsUserLocation={true}
            zoomEnabled={true}
            showsScale={true}
            onRegionChangeComplete={setNotificationRegion}

            showsPointsOfInterest={false}
            showsMyLocationButton={false}
            showsBuildings={false}
            pitchEnabled={false}
            showsTraffic={false}
            showsCompass={false}
            showsIndoors={false}
            />
            <View 
            pointerEvents='none'
            style={styles.overlay}/>
          </View>   
        </View>
        <Button
        title='Signout'
        onPress={onSignOut}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  mapContainer: {
    aspectRatio: 1,
  },
  map: {
    ...StyleSheet.absoluteFill,
  }, 
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
    borderRadius: 500,
    borderWidth: 2,
    borderColor: '#69696980'
  }
})