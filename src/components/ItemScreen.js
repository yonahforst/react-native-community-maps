import React from 'react';
import { Header } from 'react-navigation';

import { 
  StyleSheet, 
  Text, 
  View,
  TouchableHighlight,
  Dimensions,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import {
  Image,
} from 'react-native-expo-image-cache'

import ImageZoom from 'react-native-image-pan-zoom'

import Comments from './Comments'

const { height, width } = Dimensions.get('window')

const SIZE = Math.min(height, width)

export default class ItemScreen extends React.Component {
  state = {
    id: null,
    body: null,
    loading: false,
    shouldShowModal: false,
  }

  componentDidMount() {
    const {
      navigation,
      data: {
        setChatRoom,
      },
    } = this.props 

    const id = navigation.getParam('id')

    setChatRoom(id)

    this.setState({
      id
    })

  }
  
  onLike = () => {
    const { 
      id,
    } = this.state
   
    const {
      data: {
        items,
      },
    } = this.props
   
    setLikes(id, items[id].likes + 1)
  }

  onDislike = () => {
    const { 
      id,
    } = this.state
   
    const {
      data: {
        items,
        setDislikes,
      },
    } = this.props
   
    setDislikes(id, items[id].dislikes + 1)
  }

  onSendMessage = async message => {
    const { 
      id,
    } = this.state
   
    const {
      data: {
        sendMessage,
      },
    } = this.props
    
    await sendMessage(id, message)
  }

  onToggleModal = () => {
    const {
      shouldShowModal,
    } = this.state

    this.setState({
      shouldShowModal: !shouldShowModal,
    })
  }



  render() {
    
    const {
      id,
      shouldShowModal,
    } = this.state

    if (!id) return <View/>

    const {
      data: {
        messages,
        items,
        users,
      },
    } = this.props

    const item = items[id]
    
    if (!item) return <View/>

    const {
      picturePreview,
      pictureUri,
    } = item

    return (
      <KeyboardAvoidingView 
      keyboardVerticalOffset={ Platform.OS === 'android' ? Header.HEIGHT + 20 : null }
      behavior='padding'
      style={styles.container}>
        <TouchableHighlight
        style={styles.image}
        onPress={this.onToggleModal}>
          <Image
          style={styles.image}
          resizeMode='cover'
          preview={{
            uri: 'data:image/png;base64,' + picturePreview,
          }}
          uri={pictureUri}
          />
        </TouchableHighlight>  

        <Comments
        style={styles.messages}
        messages={messages}
        users={users}
        onSubmit={this.onSendMessage}
        />

        <Modal
        animationType='fade'
        onRequestClose={this.onToggleModal}
        visible={shouldShowModal}>
          <ImageZoom 
          cropWidth={width}
          cropHeight={height}
          imageWidth={SIZE}
          imageHeight={SIZE}
          enableSwipeDown={true}
          onSwipeDown={this.onToggleModal}>
            <Image
            style={styles.image}
            resizeMode='cover'
            preview={{
              uri: 'data:image/png;base64,' + picturePreview,
            }}
            uri={pictureUri}
            />
          </ImageZoom>
          <TouchableHighlight
          style={[ styles.button, styles.closeButton ]}
          onPress={this.onToggleModal}>
            <Text> X </Text>
          </TouchableHighlight>
        </Modal>

      </KeyboardAvoidingView>
    )    
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  image: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  messages: {
    flex: 1,
  },
  dislikeButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  likeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  emoji: {
    fontSize: 40,
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
