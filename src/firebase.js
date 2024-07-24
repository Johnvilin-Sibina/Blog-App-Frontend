// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blogger-hunt-67388.firebaseapp.com",
  projectId: "blogger-hunt-67388",
  storageBucket: "blogger-hunt-67388.appspot.com",
  messagingSenderId: "233600837049",
  appId: "1:233600837049:web:ee91672842d1e26b3e4268"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);