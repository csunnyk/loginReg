import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBBif_p7seFpB-gtflwzvuJz-QG8Jawiq8",
  authDomain: "ecommerce-fec09.firebaseapp.com",
  projectId: "ecommerce-fec09",
  storageBucket: "ecommerce-fec09.appspot.com",
  messagingSenderId: "1026213602424",
  appId: "1:1026213602424:web:e3bfabb293482ddf6db98d",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Exports
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export default firebase;
