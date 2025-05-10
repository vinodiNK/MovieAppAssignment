// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBGfkPGuMxyRNuq1gUbahxLSwOCX1nv7e8",
  authDomain: "movieapp-b872e.firebaseapp.com",
  projectId: "movieapp-b872e",
  storageBucket: "movieapp-b872e.firebasestorage.app",
  messagingSenderId: "630909233690",
  appId: "1:630909233690:web:dd03ed3dc22ba6d8f4ffa3",
  measurementId: "G-7VTGVP9JYB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
