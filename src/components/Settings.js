import React, {
  Component
} from 'react';

import {
  View,
  Button,
  StyleSheet,
  Switch,
  Text,
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
      notification: {
        region,
        shouldNotify,
        setRegion,
        setShouldNotify,
      },
      auth: {
        onSignOut,
      }
    } = this.props

    return (
      <View
      style={styles.container}>
        <View
        style={styles.container}>
          <View
          style={styles.optionRow}>
            <Text>Receive push notifications</Text>
            <Switch
            onValueChange={setShouldNotify}
            value={shouldNotify} />
          </View>

          { shouldNotify && 
            <View
            style={styles.mapContainer}>
              <MapView 
              style={styles.map} 
              initialRegion={region}
              showsUserLocation={true}
              zoomEnabled={true}
              showsScale={true}
              onRegionChangeComplete={setRegion}

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
              style={styles.overlay}>
                <Text>Set notification area</Text>
              </View>
            </View>   
          }
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
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  map: {
    aspectRatio: 1,
  }, 
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
    borderRadius: 500,
    borderWidth: 2,
    borderColor: '#69696980',
    alignItems: 'center',
    padding: 10,
  }
})