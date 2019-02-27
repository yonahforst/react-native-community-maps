import React from 'react';

import { 
  StyleSheet, 
  Text, 
  View,
  TouchableHighlight,
  ImageBackground,
} from 'react-native';

import { 
  Camera,
  Permissions, 
  Linking,
} from 'expo';

import { 
  MaterialIcons,
} from '@expo/vector-icons';

export default class CameraView extends React.Component {
  state = {
    hasCameraPermission: null,
    shouldFlash: false,
  };

  async componentDidMount() {
    const { 
      status 
    } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({ 
      hasCameraPermission: status === 'granted' 
    });
  }

  snap = async () => {
    if (this.camera) {
      this.camera.pausePreview();

      await this.camera.takePictureAsync({
        exif: true,
        onPictureSaved: this.setPicture
      });

    }
  };

  setPicture = picture => {
    this.setState({
      picture,
    })

    this.props.onSetPicture(picture)
  }

  clearPicture = () => {
    this.setPicture()
  }

  renderPicture = () => {
    const {
      picture
    } = this.state

    return (
      <ImageBackground 
      style={styles.container}
      resizeMode='cover'
      source={picture}>
        <TouchableHighlight 
        onPress={this.clearPicture}
        style={[ styles.button, styles.clearPicture ]}>
          <Text>X</Text>
        </TouchableHighlight>
      </ImageBackground>
    )
  }

  toggleFlash = () => {
    this.setState({
      shouldFlash: !this.state.shouldFlash
    })
  }

  openSettings = () => Linking.openURL('app-settings:')

  renderCamera = () => {
    const {
      shouldFlash
    } = this.state

    return (
      <Camera
      style={styles.container}
      ratio='1:1'
      pictureSize='Small'
      flashMode={shouldFlash ? 'on' : 'off'}
      ref={ref => this.camera = ref } >
        <TouchableHighlight 
        onPress={this.toggleFlash}
        style={styles.toggleFlash}>
          <MaterialIcons name={shouldFlash ? 'flash-on' : 'flash-off'} size={24} color="white" />
        </TouchableHighlight>

        <TouchableHighlight 
        onPress={this.snap}
        style={[ styles.button, styles.snapButton ]}>
          <View/>
        </TouchableHighlight>
      </Camera>
    )
  }

  render() {
    const { 
      hasCameraPermission, 
      picture,
    } = this.state;
    
    const { 
      style, 
    } = this.props

    if (hasCameraPermission === null)
      return <View style={style}/>

    if (!hasCameraPermission)
      return (
        <View style={[ style, styles.cameraAlert ]}>
          <Text>Oops! We don't have permission to access your camera.</Text> 
          <TouchableHighlight 
          style={styles.settingsButton}
          onPress={this.openSettings}>
            <Text>Open Settings</Text>
          </TouchableHighlight>
        </View>
      )
    
    return (
      <View style={style}>
        { picture 
          ? this.renderPicture()
          : this.renderCamera()
        }
        </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  snapButton: {
    margin: 10,
    backgroundColor: 'red',
    borderColor: 'white',
    borderWidth: 2,
  },

  toggleFlash: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 5,
    borderRadius: 25,
    opacity: 0.7,
  },

  clearPicture: {
    margin: 10,
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 2,
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

  cameraAlert: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  settingsButton: {
    backgroundColor: 'white',
    padding: 10,
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
  }
});
