import React from 'react';

import { 
  StyleSheet, 
  Alert, 
  View,
  TouchableHighlight,
  ImageBackground,
} from 'react-native';

import { 
  Camera,
  Permissions, 
  Linking,
  ImagePicker,
} from 'expo';

import { 
  IconButton,
  HelperText,
  Button,
  FAB,
} from 'react-native-paper'

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

  onSelectImage = async () => {
    const { 
      status 
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status !== 'granted')
     return Alert.alert(
        'Camera roll permissions', 
        'Oops! We need permission to access your camera roll. Go to settings to enable it',
        [{ 
            text: 'Cancel', 
            type: 'cancel',
          }, { 
            text: 'Open Settings', 
            onPress: () => Linking.openURL('app-settings:'),
          }]
      )

    const picture = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    })

    if (!picture.cancelled)
      this.setPicture(picture)
  }

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
        <FAB
        style={styles.clearPicture}
        icon="clear"
        onPress={this.clearPicture}/> 
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

        <IconButton
        icon={shouldFlash ? 'flash-on' : 'flash-off'}
        color='white'
        size={24}
        onPress={this.toggleFlash}
        style={styles.toggleFlash}/>

        <IconButton
        icon='photo-library'
        color='white'
        size={24}
        onPress={this.onSelectImage}
        style={styles.selectImage}/>

        <FAB
        style={styles.snapButton}
        icon="photo-camera"
        onPress={this.snap}/>

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
          <HelperText
          type="error">
            Oops! We don't have permission to access your camera.
          </HelperText> 
          <Button 
          onPress={this.openSettings}>
            Open Settings
          </Button>
          
          <Button 
          onPress={this.onSelectImage}>
            Upload a picture from library
          </Button>
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
  },

  toggleFlash: {
    position: 'absolute',
    top: 5,
    left: 5,
    borderRadius: 25,
    opacity: 0.7,
  },

  selectImage: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    borderRadius: 25,
    opacity: 0.7,
  },

  clearPicture: {
    margin: 10,
  },

  cameraAlert: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
