import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAiKbljKeu-H_3PesDmbxUSsNqhCZxaqb8",
    authDomain: "insta-clone-website.firebaseapp.com",
    databaseURL: "https://insta-clone-website.firebaseapp.com",
    projectId: "insta-clone-website",
    storageBucket: "insta-clone-website.appspot.com",
    messagingSenderId: "628676869664",
    appId: "1:628676869664:web:e5586816f95a6db8d34645",
    measurementId: "G-5FGHB3BRHN"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();


  export {db, auth, storage};