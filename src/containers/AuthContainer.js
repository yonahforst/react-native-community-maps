import React from 'react';

import { 
  auth,
  db,
} from '../lib/firebase'

import Login from '../components/Login'

// const AuthContext = React.createContext({
//   currentUser: null,
//   loading: false,
//   error: null,
// });

export default class AuthContainer extends React.Component {
  state = {
    currentUser: null,
    loading: false,
    error: null,
  }

  componentDidMount() {
    this.firebaseUnsubscribe = auth.onAuthStateChanged(currentUser => {
      this.setState({ currentUser })
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

      await user.updateProfile({ displayName: username })
    
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

  onLogin = async ({ username, email, password }) => {
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

    if (!this.state.currentUser)
      return (
        <Login
        {...this.state}
        onSignup={this.onSignup}
        onLogin={this.onLogin}
        onAnonymousLogin={this.onAnonymousLogin}
        />
      )

    return React.cloneElement(this.props.children, {
      auth: this.state,
      onSignOut: this.onSignOut,
    })
  }
}