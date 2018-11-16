import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';

import { 
  MapView,
  Location, 
  Permissions,
} from 'expo';

import {
  itemEmoji,
  userZoomEmoji,
} from '../lib/options'

const DELTA = 0.001

export default class App extends React.Component {
  state={
    userCoordinates: null,
  }

  async componentDidMount() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') return
    this.locationUnsubscribe = Location.watchPositionAsync({}, this.onUserLocationChange)
  }

  componentWillUnmount() {
    this.locationUnsubscribe && this.locationUnsubscribe()
  }

  onUserLocationChange = (res) => {
    const { coords } = res
    if (!this.state.userCoordinates)
      this.zoomToCoordinates(coords)

    this.setState({
      userCoordinates: coords
    })
  }


  renderMarker = id => {
    const {
      items,
    } = this.props
    
    const { 
      coordinates, 
      emoji, 
    } = items[id] 
    
    return (
      <MapView.Marker
      key={id}
      onPress={() => this.onShowItem(id) }
      coordinate={coordinates}>
        <Text 
        style={styles.emoji} 
        onPress={() => this.onShowItem(id) }>
          { emoji }
        </Text>
      </MapView.Marker>
    )
  }

  zoomToUser = () => {
    const {
      userCoordinates
    } = this.state

    if (!userCoordinates) return 

    this.zoomToCoordinates(userCoordinates)
  }

  zoomToCoordinates = (coordinates) => {
    if (!this.mapRef) return 

    this.mapRef.animateToRegion({
      ...coordinates,
      latitudeDelta: DELTA,
      longitudeDelta: DELTA,
    })
  }

  onAddItem = () => {
    const {
      userCoordinates,
    } = this.state

    this.props.navigation.navigate('AddItemScreen', { 
      coordinates: userCoordinates
    })
  }

  onShowItem = id => {
    this.props.navigation.navigate('ItemScreen', { 
      id
    })
  }

  render() {
    const { 
      userCoordinates,
    } = this.state
    
    const {
      items,
      loading,
    } = this.props
    
    const canAddItem = !loading && !!userCoordinates

    return (
      <View
      style={styles.container}> 

        <MapView 
        ref={r => this.mapRef = r}
        style={styles.map} 
        showsUserLocation={true}
        showsPointsOfInterest={false}>
          { Object.keys(items).map(this.renderMarker) }
        </MapView>

        <View
        pointerEvents={'box-none'}
        style={styles.buttonContainer}>
          <TouchableHighlight
          style={styles.button}
          disabled={!canAddItem}
          onPress={this.onAddItem}>
            {loading 
              ? <ActivityIndicator />
              : <Text 
                style={styles.emoji}>
                  { itemEmoji}
                </Text>
            }
          </TouchableHighlight>

          <TouchableHighlight
          style={styles.button}
          disabled={loading}
          onPress={this.zoomToUser}>
            <Text 
              style={styles.emoji}>
              { userZoomEmoji }
              </Text>
          </TouchableHighlight>
        </View>
        
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  map: {
   ...StyleSheet.absoluteFill,
  },
  buttonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: 'white',
    height: 56,
    width: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 4,
  },
  emoji: {
    fontSize: 30,
  }
});
