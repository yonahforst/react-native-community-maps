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

import wrapInTry from '../lib/wrapInTry'

const AuthContext = React.createContext({
  user: null,
  loading: false,
  error: null,
});

const validateUsername = username => {
  if (!/^\w{6,20}$/.test(username))
    throw new Error('Username must be 6-20 characters. Only letters, numbers, and underscores.')
}

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
          user: null,
          isReady: true
        })
        return
      }

      this.unsubscribeUser = db.collection('users').doc(currentUser.uid)
        .onSnapshot(doc => {
          this.setState({ 
            user: {
              id: doc.id,
              isAnonymous: currentUser.isAnonymous,
              ...doc.data(),
            },
            isReady: true, 
          })
        }, e => console.log('CAUGHT', e))
      })

    const wrapWithState = wrapInTry(state => this.setState(state))

    this.onLogin = wrapWithState(this.onLogin)
    this.onSignup = wrapWithState(this.onSignup)
    this.onSignOut = wrapWithState(this.onSignOut)
    this.onDeleteUser = wrapWithState(this.onDeleteUser)
    this.onSetUsername = wrapWithState(this.onSetUsername)
    this.onAnonymousLogin = wrapWithState(this.onAnonymousLogin)
    this.onConvertAnonymousUser = wrapWithState(this.onConvertAnonymousUser)
  }



  componentWillUnmount() {
    this.unsubscribeUser && this.unsubscribeUser()
    this.unsubscribeAuthState && this.unsubscribeAuthState()
  }
  
  onLogin = ({ email, password }) => auth.signInWithEmailAndPassword(email, password)
  onSignOut = () => auth.signOut()
  onAnonymousLogin = () => auth.signInAnonymously()

  onSignup = async ({ username, email, password }) => {
    validateUsername(username)

    await auth.createUserWithEmailAndPassword(email, password)

    const user = auth.currentUser;

    await db.collection('users').doc(user.uid).set({
      username
    }, {
      merge: true
    })  
  }



  onConvertAnonymousUser = async ({ username, email, password }) => {
    validateUsername(username)      
    var credential = EmailAuthProvider.credential(email, password);
    await auth.currentUser.linkAndRetrieveDataWithCredential(credential)
    const user = auth.currentUser;
  
    await db.collection('users').doc(user.uid).set({
      username
    }, {
      merge: true
    })
  }

  onSetUsername = ({ username }) => {
    validateUsername(username)
    const user = auth.currentUser;
  
    return db.collection('users').doc(user.uid).set({
      username
    }, {
      merge: true
    })
  }


  onDeleteUser = async () => {
    const user = auth.currentUser

    await db.collection('users').doc(user.uid)
    await user.delete()
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
        auth={{
          ...this.state,
          onSignup: this.onSignup,
          onLogin: this.onLogin,
          onAnonymousLogin: this.onAnonymousLogin
        }}
        />

    return (
      <AuthContext.Provider value={{
        auth: {
          ...this.state,
          onSignup: this.onSignup,
          onSignOut: this.onSignOut,
          onDeleteUser: this.onDeleteUser,
          onSetUsername: this.onSetUsername,
          onConvertAnonymousUser: this.onConvertAnonymousUser,
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
