import React, {
  Component
} from 'react';

import {
  View,
  Alert,
  StyleSheet,
  Image,
} from 'react-native'

import {
  Text,
  Switch,
  Banner,
} from 'react-native-paper'

import { 
  MapView,
} from 'expo'

const DELTA = 0.005

export default class Settings extends Component {
  state={
    visible: true,
  }

  componentDidMount() {
    const {
      navigation
    } = this.props

    navigation.setParams({
      onMore: this.onMore,
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

  onMore = () => {
    const {
      showActionSheetWithOptions,
      auth: {
        onSignOut,
        user: {
          isAnonymous
        }
      }
    } = this.props

    const options = [
      isAnonymous ? 'Signup' : 'Logout', 
      'Delete account', 
      'Cancel'
    ];

    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;
  
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            return isAnonymous ? this.onSignUp() : onSignOut()
          case 1:
            return this.onDeleteAccount()
        }
      },
    );  
  }

  onSignUp = () => {
    this.props.navigation.navigate('ConvertAnonymousUser')
  }

  onDeleteAccount = () => {
    const {
      auth: {
        onDeleteUser
      }
    } = this.props
     
    Alert.alert(
      'Are you sure?',
      'You can\'t undo this action ',
      [
        {text: 'Delete account', onPress: onDeleteUser },
        {text: 'Cancel', style: 'cancel'},
      ],
    )
    
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
        isLoading,
      },
      auth: {
        user: {
          isAnonymous,
        },
      }
    } = this.props

    return (
      <View
      style={styles.container}>

        { isAnonymous && 
          <Banner
            visible={this.state.visible}
            actions={[
              {
                label: 'Later',
                onPress: () => this.setState({ visible: false }),
              },
              {
                label: 'Signup',
                onPress: this.onSignUp,
              },
            ]}
          >
          { `You're currently signed in as an anonymous user.\nSIGNUP to select a username and password.` }
          </Banner>
        }

        <View
        style={styles.innerContainer}>
          <View
          style={styles.optionRow}>
            <Text>Notify me when new stuff is posted</Text>
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
                { isLoading && <Text>Saving...</Text> }
              </View>
            </View>   
          }
        </View>
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