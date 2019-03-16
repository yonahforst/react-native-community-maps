import React from 'react';

import {
  ImageManipulator
} from 'expo'

import urlToBlob from '../lib/urlToBlob'

import { 
  db,
  auth,
  storage,
} from '../lib/firebase'

import FB from 'firebase'

const { firestore: { GeoPoint, FieldValue } } = FB

const DataContext = React.createContext({
  items: {},
  messages: [],
  loading: false,
  error: null,
});

const geoPointToObj = geopoint => ({
  longitude: geopoint.longitude,
  latitude: geopoint.latitude,
})

export default class DataContainer extends React.Component {
  state = {
    items: {},
    users: {},
    messages: [],
    loading: false,
    error: null,
  }

  componentDidMount() {
    this.firebaseUnsubscribe = db.collection('items')
    .orderBy('createdAt', 'desc')
    .onSnapshot(querySnapshot => {

      var items = {};
      querySnapshot.forEach(async doc => {
        const data = doc.data()

        items[doc.id] = {
          ...data,
          coordinates: geoPointToObj(data.coordinates)
        }
      })

      const ids = Object.values(items).map(m => m.userId)
      this.loadUsers({ ids })
      
      this.setState({
          items: {
          ...this.state.items,
          ...items,
        }
      })
    }, e => console.log('CAUGHT', e))
  }

  componentWillUnmount() {
    this.firebaseUnsubscribe && this.firebaseUnsubscribe()
  }

  loadUsers = async ({ ids }) => {
    const promises = ids.map(id => db.collection('users').doc(id).get())
    const results = await Promise.all(promises)
    const users = {}
    results.forEach(r => {
      users[r.id] = r.data()
    })

    this.setState({
      users: {
        ...this.state.users,
        ...users,
      }
    })
  }

  addNewItem = async ({ emoji, coordinates, picture }) => {    
    this.setState({ 
      loading: true,
    })

    try {
      const {
        uri,
      } = picture

      const {
        longitude,
        latitude,
      } = coordinates

      const filename = uri.substring(uri.lastIndexOf('/') + 1)

      const ref = storage.ref().child(filename)
      const blob = await urlToBlob(uri)

      const uploadTask = await ref.put(blob)
      const pictureUri = await uploadTask.ref.getDownloadURL()
      const { base64 } = await ImageManipulator.manipulateAsync(uri, [{ 
        resize: {
          width: 25,
        }
      }], {
        compress: 0,
        base64: true
      })

      await db.collection('items').add({
        emoji,
        pictureUri,
        createdAt: Date.now(),
        picturePreview: base64,
        coordinates: new GeoPoint(latitude, longitude),
        userId: auth.currentUser.uid,
        likes: 1,
        dislikes: 0,
        viewedBy: [],
      })
  
      this.setState({
        error: null,
        loading: false,
      })
    } catch (error) {
      console.log(error)
      this.setState({
        error,
        loading: false,
      })
    }
  }

  setLikes = (id, likes) => {
    db.collection('items').doc(id).update({
      likes
    })
  }

  setDislikes = (id, dislikes) => {
    db.collection('items').doc(id).update({
      dislikes
    })
  }

  addToViewedBy = (id) => {
    db.collection('items').doc(id).update({
      viewedBy: FieldValue.arrayUnion(auth.currentUser.uid)
    })
  }

  setChatRoom = (id) => {
    if (this.chatUnsubscribe) this.chatUnsubscribe()

    this.setState({
      messages: []
    })

    if (!id) return

    this.chatUnsubscribe = db.collection('rooms')
    .doc(id)
    .collection('messages')
    .orderBy('at', 'asc')
    .onSnapshot(querySnapshot => {

      var messages = [];
      querySnapshot.forEach(doc => {
        messages.push({
          id: doc.id,
          ...doc.data(),
        })
      })

      const ids = messages.map(m => m.userId)
      this.loadUsers({ ids })
      
      this.setState({
        messages
      })
    }, e => console.log('CAUGHT', e))
  }

  sendMessage = async (id, body) => {
    await db.collection('rooms')
    .doc(id)
    .collection('messages')
    .add({
      body,
      userId: auth.currentUser.uid,
      at: Date.now(),
    })
  }


  render() {
    return (
      <DataContext.Provider value={{
        data: {
          ...this.state,
          setLikes: this.setLikes,
          setDislikes: this.setDislikes,
          addNewItem: this.addNewItem,
          setChatRoom: this.setChatRoom,
          sendMessage: this.sendMessage,
          addToViewedBy: this.addToViewedBy,
        }
      }}> 
        { this.props.children }
      </DataContext.Provider>
    );
  }
}

export const DataContainerHoc = (Component) => props => (
  <DataContext.Consumer>
    { context => <Component { ...context }  { ...props } /> }
  </DataContext.Consumer>
)

