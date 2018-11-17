import React from 'react'

import { 
  View,
  Modal,
  TouchableOpacity, 
  StyleSheet,
} from 'react-native'

import EmojiSelector from 'react-native-emoji-selector'


export default ({
  visible,
  style,
  onEmojiSelected,
  onTapOutside,
}) => (
  <Modal
  transparent
  animationType='slide'
  onRequestClose={onTapOutside}
  visible={visible}>
    <TouchableOpacity 
    style={styles.container}
    onPress={onTapOutside}>
      <View
      style={style}>
        <EmojiSelector 
        onEmojiSelected={onEmojiSelected} />  
      </View>
    </TouchableOpacity>        
  </Modal>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff96',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
