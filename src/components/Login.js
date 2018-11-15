import React from 'react'

import {
  View,
  TextInput,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
} from 'react-native'

const Loading = () => (
  <View style={styles.loading}>
    <ActivityIndicator />
  </View>
)
export default class Login extends React.Component {
  state={
    screen: 'signup',
    username: null,
    email: null,
    password: null,
  }

  showLogin = () => this.setState({ screen: 'login' })
  showSignup = () => this.setState({ screen: 'signup' })

  onLogin = () => this.props.onLogin(this.state)
  onSignup = () => this.props.onSignup(this.state)
  onAnonymousLogin = () => this.props.onAnonymousLogin()

  render() {
    const {
      loading,
      error,
    } = this.props

    const {
      screen,
      username,
      email,
      password,
    } = this.state

    switch (screen) {
      case 'login':
        return (
          <View 
          style={styles.container} 
          behavior="padding" 
          enabled>
            <TextInput 
            style={styles.input}
            value={email}
            keyboardType='email-address'
            textContentType='username'
            placeholder='Email'
            onChangeText={email => this.setState({ email })} />

            <TextInput 
            secureTextEntry
            style={styles.input}
            value={password}
            textContentType='password'
            placeholder='Password'
            onChangeText={password => this.setState({ password })} />

            { error && <Text style={styles.error}>{ error.message }</Text> }

            <Button
            onPress={this.onLogin}
            title='Login' />

            <Button
            onPress={this.showSignup}
            color='grey'
            title='Signup' />

            <Button
            onPress={this.onAnonymousLogin}
            color='grey'
            title='Use anonymously' />

            { loading && <Loading />}
          </View>
        )

      case 'signup':
        return (
          <View 
          style={styles.container} 
          behavior="padding" 
          enabled>
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

            { error && <Text style={styles.error}>{ error.message }</Text> }

            <Button
            onPress={this.onSignup}
            title='Signup' />

            <Button
            onPress={this.showLogin}
            color='grey'
            title='Login' />

            <Button
            onPress={this.onAnonymousLogin}
            color='grey'
            title='Use anonymously' />

            { loading && <Loading />}

          </View>
        )
    }


  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    padding: 10, 
    borderColor: 'gray', 
    borderWidth: 1,
    margin: 10,
    marginHorizontal: 40,
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