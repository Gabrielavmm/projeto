// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKGrC-hWe6Uzzgs7MjzcKbFS1R5YdF-xE",
  authDomain: "databake-f49f1.firebaseapp.com",
  projectId: "databake-f49f1",
  storageBucket: "databake-f49f1.firebasestorage.app",
  messagingSenderId: "441330264623",
  appId: "1:441330264623:web:de0fd86c88c78935ce34da",
  measurementId: "G-FW0YCHBYV8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export interface FirebaseError extends Error {
  code: string;
  message: string;
}