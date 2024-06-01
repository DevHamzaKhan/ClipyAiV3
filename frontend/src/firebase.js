// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOYEim9eZJbisaURybWN3yktpO6ac8NY0",
  authDomain: "clipyai-624a7.firebaseapp.com",
  projectId: "clipyai-624a7",
  storageBucket: "clipyai-624a7.appspot.com",
  messagingSenderId: "123932935762",
  appId: "1:123932935762:web:a35d7fbf77a81733a7018b",
  measurementId: "G-JD5QS3PCX3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);  // Initialize Firestore


export { auth, app, db };  