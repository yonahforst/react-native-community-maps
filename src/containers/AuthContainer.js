import React from 'react';

import {
  AppLoading
} from 'expo'

import { 
  auth,
  db,
  EmailAuthProvider,
} from '../lib/firebase'

import Login from '../components/Login'

const AuthContext = React.createContext({
  currentUser: null,
  loading: false,
  error: null,
});

export default class AuthContainer extends React.Component {
  state = {
    currentUser: null,
    loading: false,
    error: null,
  }

  componentDidMount() {
    this.firebaseUnsubscribe = auth.onAuthStateChanged(currentUser => {
      this.setState({ 
        currentUser,
        isReady: true, 
      })
    })
  }
  

  componentWillUnmount() {
    this.firebaseUnsubscribe && this.firebaseUnsubscribe()
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

  onConvertAnonymousUser = async ({ username, email, password }) => {
    try {
      this.setState({ 
        loading: true
      })


      if (!/^\w{6,20}$/.test(username))
        throw new Error('Username must be 6-20 characters. Only letters, numbers, and underscores.')
      
      var credential = EmailAuthProvider.credential(email, password);
      await auth.currentUser.linkAndRetrieveDataWithCredential(credential)
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

  onSetUsername = async ({ username }) => {
    try {
      this.setState({ 
        loading: true
      })

      if (!/^\w{6,20}$/.test(username))
        throw new Error('Username must be 6-20 characters. Only letters, numbers, and underscores.')
      
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

  render() {
    const {
      isReady,
      currentUser,
    } = this.state

    if (!isReady)
      return <AppLoading />

    if (!currentUser)
      return <Login
        {...this.state}
        onSignup={this.onSignup}
        onLogin={this.onLogin}
        onAnonymousLogin={this.onAnonymousLogin}
        />

    return (
      <AuthContext.Provider value={{ 
        ...this.state,
        onSetUsername: this.onSetUsername,
        onSignOut: this.onSignOut,
        onConvertAnonymousUser: this.onConvertAnonymousUser,
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
