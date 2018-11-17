import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
} from 'react-native';

import { 
  MapView,
} from 'expo';

import {
  itemEmoji,
  noEmojiPicker,
} from '../lib/options'

import CameraView from './CameraView'
import EmojiOverlay from './EmojiOverlay'

const DELTA = 0.001

export default class AddItemScreen extends React.Component {
  state = {
    emoji: itemEmoji,
    showEmojiPicker: false,
  }

  componentDidMount() {
    const {
      navigation
    } = this.props

    const {
      longitude,
      latitude,
    } = navigation.getParam('coordinates')

    this.setState({
      coordinates: {
        longitude,
        latitude,
      },
      initialRegion: {
        longitude,
        latitude,
        latitudeDelta: DELTA,
        longitudeDelta: DELTA,
      },
      didMount: true,
    })

    navigation.setParams({
      onSave: this.onSave,
    })
  }

  onRegionChangeComplete = ({ longitude, latitude }) => {
    this.setState({
      coordinates: {
        longitude,
        latitude,
      }
    })
  }

  onEmojiSelected = emoji => {
    this.setState({
      emoji,
      showEmojiPicker: false,
    })
  }

  onCancel = () => {
    this.props.onCancel()
  }

  onSetPicture = picture => {
    this.setState({ 
      picture 
    }) 

    this.props.navigation.setParams({
      canSave: !!picture,
    })
  }

  toggleEmojiPicker = () => {
    const {
      showEmojiPicker,
    } = this.state

    this.setState({
      showEmojiPicker: !showEmojiPicker,
    })
  }

  onSave = () => {
    const {
      picture,
      emoji,
      coordinates,
    } = this.state

    this.props.addNewItem({
      picture,
      emoji,
      coordinates,
    })

    this.props.navigation.goBack()
  }

  render() {
    const { 
      initialRegion,
      coordinates,
      didMount,
      showEmojiPicker,
      emoji,
      picture,
    } = this.state

    if (!didMount) return <View/>

    return (
      <View
      style={styles.container}>

        <CameraView
        style={styles.camera} 
        onSetPicture={this.onSetPicture}/>
        <View
        style={styles.mapContainer}>
          <MapView 
          style={styles.map} 
          initialRegion={initialRegion}
          showsPointsOfInterest={false}
          zoomEnabled={false}
          pitchEnabled={false}
          onRegionChangeComplete={this.onRegionChangeComplete}/>
          <Text 
          style={styles.emoji}
          onPress={this.toggleEmojiPicker}>
            {emoji}
          </Text>
        </View>            
        <EmojiOverlay 
        style={styles.emojiPicker}
        visible={!noEmojiPicker && showEmojiPicker}
        onTapOutside={this.toggleEmojiPicker}
        onEmojiSelected={this.onEmojiSelected}/>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFill,
  },  
  camera: {
    flex: 1,
  },
  emojiPicker: {
    height: 400,
  },
  emoji: {
    fontSize: 50,
  },
});
