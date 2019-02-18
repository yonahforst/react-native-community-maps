import React from 'react';

import {
  View,
  Button,
  StyleSheet
} from 'react-native'

import Login from './Login'

export default ({
  onSignOut,
  currentUser,
  onConvertAnonymousUser,
  loading,
  error,
}) => {
  return (
  <View
  style={styles.container}>
    <View
    style={styles.container}>

    { currentUser.isAnonymous &&
        <Login
        error={error}
        loading={loading}
        canLogin={false}
        canAnonymouslyLogin={false}
        onSignup={onConvertAnonymousUser}
        />
    }

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