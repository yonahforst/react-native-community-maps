import React from 'react'

import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'

import { 
  TextInput,
  ActivityIndicator,
  HelperText,
  Button,
} from 'react-native-paper'

import { Header } from 'react-navigation';

export default class ConvertAnonymouseUser extends React.Component {
  state={
    username: null,
    email: null,
    password: null,
  }

  onConvert = async () => {
    const success = await this.props.auth.onConvertAnonymousUser(this.state)
    if (success)
      this.props.navigation.goBack()
  }

  render() {
    const {
      auth: {
        loading,
        error,
      }
    } = this.props

    const {
      username,
      email,
      password,
    } = this.state

    return (
      <KeyboardAvoidingView 
        keyboardVerticalOffset={ Platform.OS === 'android' ? Header.HEIGHT + 20 : Header.HEIGHT }
        style={styles.container}
        behavior="padding" 
        enabled>
        <View 
        style={styles.innerContainer}>
          <TextInput 
          style={styles.input}
          value={email}
          keyboardType='email-address'
          textContentType='username'
          placeholder='Email'
          onChangeText={email => this.setState({ email })} />

          <TextInput 
          style={styles.input}
          value={username}
          textContentType='username'
          placeholder='Username'
          onChangeText={username => this.setState({ username })} />

          <TextInput 
          secureTextEntry
          style={styles.input}
          value={password}
          textContentType='password'
          placeholder='Password'
          onChangeText={password => this.setState({ password })} />

          <HelperText
          type="error"
          visible={error}>
            { error && error.message }
          </HelperText>

          <Button
          mode='contained'
          disabled={loading}
          onPress={this.onConvert}>
          Signup
          </Button>

          <ActivityIndicator
          animating={loading} />

        </View>
      </KeyboardAvoidingView>
    )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    marginHorizontal: 40,
    justifyContent: 'center',
  },
  input: {
    marginVertical: 10,
  },
  error: {
    color: 'red',
    margin: 10,
  },
  loading: {
    opacity: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  }
})