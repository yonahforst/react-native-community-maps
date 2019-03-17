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

import UsernameGenerator from '../lib/usernameGenerator'

export default class Login extends React.Component {
  state={
    username: null,
    email: null,
    password: null,
    screen: 'signup',
    usernamePlaceholder: null,
  }

  componentDidMount = () => {
    this.setState({
      usernamePlaceholder: UsernameGenerator.generate()
    })
  }

  onLogin = () => this.props.auth.onLogin(this.state)
  onSignup = () => this.props.auth.onSignup(this.state)
  onAnonymousLogin = () => this.props.auth.onAnonymousLogin()

  renderScene = () => {
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
      screen,
      usernamePlaceholder,
    } = this.state

    switch (screen) {
      case 'login':
        return (
          <View
          style={styles.innerContainer}>
            <TextInput 
            style={styles.input}
            value={email}
            keyboardType='email-address'
            textContentType='username'
            label='Email'
            onChangeText={email => this.setState({ email })} />

            <TextInput 
            secureTextEntry
            style={styles.input}
            value={password}
            textContentType='password'
            label='Password'
            onChangeText={password => this.setState({ password })} />

            <HelperText
            type="error"
            visible={error}>
            { error && error.message }
            </HelperText>

            <Button
            mode='contained'
            disabled={loading}
            onPress={this.onLogin}>
            Login
            </Button>

            <Button
            disabled={loading}
            color='grey'
            onPress={this.onAnonymousLogin}>
            Use anonymously
            </Button>

            <ActivityIndicator
            animating={loading} />
          </View>
        )

      case 'signup':
        return (
          <View 
          style={styles.innerContainer}>
            <TextInput 
            style={styles.input}
            value={email}
            keyboardType='email-address'
            textContentType='username'
            label='Email'
            onChangeText={email => this.setState({ email })} />

            <TextInput 
            style={styles.input}
            value={username}
            textContentType='username'
            label='Username'
            placeholder={'e.g. ' + usernamePlaceholder}
            onChangeText={username => this.setState({ username })} />

            <TextInput 
            secureTextEntry
            style={styles.input}
            value={password}
            textContentType='password'
            label='Password'
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

            <Button
            disabled={loading}
            color='grey'
            onPress={this.onAnonymousLogin}>
            Use anonymously
            </Button>

            <ActivityIndicator
            animating={loading} />

          </View>
        )
    }
  }

  render() {
    const {
      screen
    } = this.state

    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior="padding" 
        enabled>
        { this.renderScene() }

        <View
        style={styles.buttonGroup}>
          <Button 
          style={styles.button}
          disabled={screen === 'signup'}
          onPress={() => this.setState({ screen: 'signup' })}>
          Signup
          </Button>
          <Button 
          style={styles.button}
          disabled={screen === 'login'}
          onPress={() => this.setState({ screen: 'login' })}>
          Login
          </Button>
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
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    padding: 10,
  }
})