import firebase from "firebase/app"
import "firebase/auth"
import "firebase/storage"
import 'firebase/firestore'
firebase.initializeApp(
    
    { 
        apiKey: "AIzaSyDVdet8ILirNzLJ7NWaeIYGrDe1U2Lx6sQ",
        authDomain: "insta--share.firebaseapp.com",
        databaseURL: "https://insta--share-default-rtdb.firebaseio.com",
        projectId: "insta--share",
        storageBucket: "insta--share.appspot.com",
        messagingSenderId: "422168675422",
        appId: "1:422168675422:web:17fd969028a1e83f4b60cf",
        measurementId: "G-54FN9EL1P5"
     }
)
//export auth
export const auth = firebase.auth();
//firestore
const firestore = firebase.firestore();

export const database={
   
 
    users:firestore.collection('users'),
    posts:firestore.collection('posts'),
    comments:firestore.collection('comments'),
    messages:firestore.collection('messages'),
    getCurrentTime:firebase.firestore.FieldValue.serverTimestamp

}
// export default database
export const storage = firebase.storage();
