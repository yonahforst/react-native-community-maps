import React from 'react';

import {
  AppLoading
} from 'expo'

import { 
  auth,
  db,
} from '../lib/firebase'

import Login from '../components/Login'

const AuthContext = React.createContext({
  user: null,
  loading: false,
  error: null,
});

export default class AuthContainer extends React.Component {
  state = {
    user: null,
    loading: false,
    error: null,
  }

  componentDidMount = () => {
    this.unsubscribeAuthState = auth.onAuthStateChanged(currentUser => {
      if (!currentUser) {
        this.setState({
          isReady: true
        })
        return
      }

      this.unsubscribeUser = db.collection('users').doc(currentUser.uid)
        .onSnapshot(doc => {
          this.setState({ 
            user: {
              id: doc.id,
              ...doc.data(),
            },
            isReady: true, 
          })
        })
    })
  }



  componentWillUnmount() {
    this.unsubscribeUser && this.unsubscribeUser()
    this.unsubscribeAuthState && this.unsubscribeAuthState()
  }

  onSignup = async ({ username, email, password }) => {
    try {
      this.setState({ 
        loading: true
      })

      if (!/^\w{6,20}$/.test(username))
        throw new Error('Username must be 6-20 characters. Only letters, numbers, and underscores.')

      await auth.createUserWithEmailAndPassword(email, password)

      const user = auth.currentUser;
    
      await db.collection('users').doc(user.uid).set({
        username
      }, {
        merge: true
      })


      this.setState({
        loading: false,
        error: null,
      })
    } catch (error) {
      console.log(error)
      this.setState({
        loading: false,
        error,
      })
    }
  }

  onLogin = async ({ email, password }) => {
    try {
      this.setState({ 
        loading: true
      })

      await auth.signInWithEmailAndPassword(email, password)

      this.setState({
        loading: false,
        error: null,
      })
    } catch (error) {
      console.log(error)
      this.setState({
        loading: false,
        error,
      })
    }
  }

  onSignOut = async () => {
    try {
      this.setState({ 
        loading: true
      })

      await auth.signOut()

      this.setState({
        loading: false,
        error: null,
      })
    } catch (error) {
      console.log(error)
      this.setState({
        loading: false,
        error,
      })
    }
  }

  onAnonymousLogin = async () => {
    try {
      this.setState({ 
        loading: true
      })

      await auth.signInAnonymously()

      this.setState({
        loading: false,
        error: null,
      })
    } catch (error) {
      console.log(error)
      this.setState({
        loading: false,
        error,
      })
    }
  }



  render() {
    const {
      isReady,
      user,
    } = this.state

    if (!isReady)
      return <AppLoading />

    if (!user)
      return <Login
        {...this.state}
        onSignup={this.onSignup}
        onLogin={this.onLogin}
        onAnonymousLogin={this.onAnonymousLogin}
        />

    return (
      <AuthContext.Provider value={{
        auth: {
          ...this.state,
          onSignOut: this.onSignOut,
        }
      }}> 
        { this.props.children }
      </AuthContext.Provider>
    )
  }
}

export const AuthContainerHoc = (Component) => props => (
  <AuthContext.Consumer>
    { context => <Component { ...context }  { ...props } /> }
  </AuthContext.Consumer>
)
