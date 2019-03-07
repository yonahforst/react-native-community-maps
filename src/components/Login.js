import React from 'react'

import {
  View,
  StyleSheet,
} from 'react-native'

import { 
  TextInput,
  BottomNavigation, 
  ActivityIndicator,
  HelperText,
  Button,
} from 'react-native-paper'

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
    index: 0,
    routes: [
      { key: 'login', title: 'Login' },
      { key: 'signup', title: 'Signup' },
    ],
  }

  onLogin = () => this.props.onLogin(this.state)
  onSignup = () => this.props.onSignup(this.state)
  onAnonymousLogin = () => this.props.onAnonymousLogin()

  renderScene = ({ route }) => {
    const {
      loading,
      error,
    } = this.props

    const {
      username,
      email,
      password,
    } = this.state

    switch (route.key) {
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

  handleIndexChange = index => this.setState({ index })


  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this.handleIndexChange}
        renderScene={this.renderScene}
      />
    )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 40,
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