// src/firebase.js
import firebase from "firebase/app";
import "firebase/auth";

// Configura tu Firebase aquí (reemplaza con tus credenciales)
const firebaseConfig = {
  apiKey: "AIzaSyCh71ojP3_mxhMXiDPUZq0YGvauyj2ah0g",
  authDomain: "projecto1corpora.firebaseapp.com",
  projectId: "projecto1corpora",
  storageBucket: "projecto1corpora.appspot.com",
  messagingSenderId: "1010018341619",
  appId: "1:1010018341619:web:6647e9ae6e2a797d421d86",
  measurementId: "G-J12DK30906",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
export { auth, firebase };
