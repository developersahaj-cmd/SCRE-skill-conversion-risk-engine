npm install -g firebase-tools
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6MhLeWlLq9jh11IjHYWWguANyqEz3XOA",
  authDomain: "scre-skill-conversion-risk-eng.firebaseapp.com",
  projectId: "scre-skill-conversion-risk-eng",
  storageBucket: "scre-skill-conversion-risk-eng.firebasestorage.app",
  messagingSenderId: "98494722322",
  appId: "1:98494722322:web:c5493b05715ef739ad43cb",
  measurementId: "G-QEDNG86F3Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
