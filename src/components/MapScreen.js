import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  TouchableHighlight,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';

import { 
  MapView,
  Location, 
  Permissions,
} from 'expo'

import { 
  FAB,
} from 'react-native-paper'

const DELTA = 0.001

export default class App extends React.Component {
  state={
    userCoordinates: null,
  }

  async componentDidMount() {


    this.props.navigation.setParams({
      onShowSettings: this.onShowSettings,
    })

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    this.setState({
      permissionStatus: status,
    })

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
      auth: {
        user,
      },
      data: {
        items,
      }={},
    } = this.props
    
    const { 
      coordinates, 
      emoji, 
      viewedBy=[],
    } = items[id] 

    
    
    return (
      <MapView.Marker
      key={id}
      onPress={() => this.onShowItem(id) }
      coordinate={coordinates}>
        <Text 
        style={[
          styles.emoji,
          viewedBy.includes(user.id) && styles.viewed,
        ]} 
        onPress={() => this.onShowItem(id) }>
          { emoji }
        </Text>
      </MapView.Marker>
    )
  }

  zoomToUser = () => {
    const {
      userCoordinates,
      permissionStatus,
    } = this.state

    if (permissionStatus !== 'granted') {
      this.alertPermissions()
      return 
    }

    if (!userCoordinates)
      return
      
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
      permissionStatus,
    } = this.state

    if (permissionStatus !== 'granted') {
      this.alertPermissions()
      return 
    }

    if (!userCoordinates)
      return

    this.props.navigation.navigate('AddItemScreen', { 
      coordinates: userCoordinates
    })
  }

  alertPermissions = () => {
    Alert.alert(
      'Location permissions', 
      'Oops! we need your location first. Go to settings to enable it',
      [{ 
          text: 'Cancel', 
          type: 'cancel',
        }, { 
          text: 'Open Settings', 
          onPress: () => Linking.openURL('app-settings:'),
        }]
    )
  }

  onShowItem = id => {
    this.props.navigation.navigate('ItemScreen', { 
      id
    })
  }

  onShowSettings = () => {
    const {
      userCoordinates,
    } = this.state

    this.props.navigation.navigate('Settings', { 
      coordinates: userCoordinates
    })
  }

  render() {
    const { 
      userCoordinates,
    } = this.state

    const {
      data: {
        items,
        loading,
      }={},
    } = this.props
    
    return (
      <View
      style={styles.container}> 

        <MapView 
        ref={r => this.mapRef = r}
        style={styles.map} 
        showsCompass={false}
        showsUserLocation={true}
        showsPointsOfInterest={false}>
          { Object.keys(items).map(this.renderMarker) }
        </MapView>

        <FAB
        style={styles.addItemFab}
        disabled={loading}
        icon="add"
        onPress={this.onAddItem}
        />

        <FAB
        style={styles.myLocationFab}
        disabled={!userCoordinates}
        icon="near-me"
        small
        onPress={this.zoomToUser}
        />
        
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
   ...StyleSheet.absoluteFill,
  },
  myLocationFab: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  addItemFab: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  },
  emoji: {
    fontSize: 30,
    zIndex: 1,
  },
  viewed: {
    opacity: 0.65,
    zIndex: 0,
  },
});
