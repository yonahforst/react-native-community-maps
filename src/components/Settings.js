import React, {
  Component
} from 'react';

import {
  View,
  StyleSheet,
} from 'react-native'

import {
  Text,
  Switch,
  Button,
} from 'react-native-paper'

import { 
  MapView,
} from 'expo'

const DELTA = 0.005

export default class Settings extends Component {
  state={}

  componentDidMount() {
    const {
      navigation
    } = this.props

    navigation.setParams({
      onSave: this.onSave,
    })

    const {
      longitude,
      latitude,
    } = navigation.getParam('coordinates')
    
    this.setState({
      userRegion: {
        longitude,
        latitude,
        longitudeDelta: DELTA,
        latitudeDelta: DELTA,
      }
    })
  }

  render() {
    const {
      userRegion
    } = this.state

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
        style={styles.innerContainer}>
          <View
          style={styles.optionRow}>
            <Text>Notify me on new stuff</Text>
            <Switch
            onValueChange={setShouldNotify}
            value={shouldNotify} />
          </View>

          { shouldNotify && 
            <View
            style={styles.mapContainer}>
              <MapView 
              style={styles.map} 
              initialRegion={region || userRegion}
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
                <Text>Move to set notification area</Text>
              </View>
            </View>   
          }
        </View>
        <Button onPress={onSignOut}>
          Signout
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
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
    borderColor: '#696969',
    alignItems: 'center',
    opacity: 0.5,
    padding: 20,
  }
})