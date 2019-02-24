import * as Firebase from 'firebase';
import 'firebase/firestore'
import firebaseConfig from '../../firebase.json'

const firebase = Firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore()

export const storage = firebase.storage()
export const auth = firebase.auth()

export default firebase
