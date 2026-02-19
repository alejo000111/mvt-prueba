// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAM-hA2v0IviOL_hcQ6pCn4DfxiVKs8dwA",
  authDomain: "mvt-prueba-31418.firebaseapp.com",
  projectId: "mvt-prueba-31418",
  storageBucket: "mvt-prueba-31418.firebasestorage.app",
  messagingSenderId: "945547612433",
  appId: "1:945547612433:web:3608a0a4cea8ed212dbcb0",
  measurementId: "G-5LSYVF0N62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);