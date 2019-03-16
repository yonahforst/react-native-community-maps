import * as Firebase from 'firebase';
import 'firebase/firestore'
import firebaseConfig from '../../firebase.json'

const firebase = Firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore()

db.settings({
  timestampsInSnapshots: true
})

export const storage = firebase.storage()
export const auth = firebase.auth()
export const EmailAuthProvider = Firebase.auth.EmailAuthProvider

export default firebase
