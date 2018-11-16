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
} from 'expo';

export default class CameraView extends React.Component {
  state = {
    hasCameraPermission: null,
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
      const picture = await this.camera.takePictureAsync({
        exif: true,
      });
      
      this.setPicture(picture)
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

  renderCamera = () => {
    return (
      <Camera
      style={styles.container}
      ratio='1:1'
      pictureSize='Medium'
      flashMode='auto'
      ref={ref => this.camera = ref } >
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
      return <View />

    if (hasCameraPermission === false)
      return <Text>No access to camera</Text>
    
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
  }

});
