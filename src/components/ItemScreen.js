import React from 'react';
import { Header } from 'react-navigation';

import { 
  StyleSheet, 
  View,
  TouchableHighlight,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Share,
  Alert,
} from 'react-native';

import { Modal, Portal } from 'react-native-paper';

import {
  Image,
} from 'react-native-expo-image-cache'

import ImageZoom from 'react-native-image-pan-zoom'

import Comments from './Comments'

import {
  shareUrl
} from '../lib/options'

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
        addToViewedBy,
      },
    } = this.props 

    const id = navigation.getParam('id')

    setChatRoom(id)
    addToViewedBy(id)

    this.setState({
      id
    })

    navigation.setParams({
      onMore: this.onMore,
    })
  }

  onMore = () => {
    const options = ['Share', 'Flag', 'Cancel'];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;
  
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            return this.onShare()
          case 1:
            return this.onFlag()
        }
      },
    );  
  }

  onFlag = () => {
    const options = ['Item is missing', 'Spam', 'Offensive content', 'Cancel'];
    const cancelButtonIndex = 3;
  
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      buttonIndex => {
        if (buttonIndex !== cancelButtonIndex)
          Alert.alert('Flagged', 'Thanks for letting us know 🤓')
      },
    );  
  }
  
  onShare = () => {
    const { 
      id,
    } = this.state

    Share.share({
      message: 'Check out this dope stuff! ' + shareUrl.replace('{id}', id),
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
      keyboardVerticalOffset={ Platform.OS === 'android' ? Header.HEIGHT + 20 : Header.HEIGHT }
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
        <Portal>
        <Modal
        // animationType='fade'
        onDismiss={this.onToggleModal}
        visible={shouldShowModal}>
          <ImageZoom 
          cropWidth={width}
          cropHeight={height}
          imageWidth={SIZE}
          imageHeight={SIZE}
          enableSwipeDown={true}
          onClick={this.onToggleModal}
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
        </Modal>
        </Portal>
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
