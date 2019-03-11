import React from 'react'

import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native'

import { 
  TextInput,
  ActivityIndicator,
  HelperText,
  Button,
} from 'react-native-paper'


export default class ConvertAnonymouseUser extends React.Component {
  state={
    username: null,
    email: null,
    password: null,
  }

  onConvert = () => this.props.auth.onConvertAnonymousUser(this.state)

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
          onPress={this.onSignup}>
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