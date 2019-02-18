import React from 'react';

import {
  View,
  Button,
  StyleSheet
} from 'react-native'

export default ({
  onSignOut,
}) => {
  return (
  <View
  style={styles.container}>
    <View
    style={styles.container}>

    </View>
    <Button
    title='Signout'
    onPress={onSignOut}
    />
  </View>
)
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  
})