import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB5WS_Xqfxg9Od21Ex634yIwr1ukNcsFA0",
    authDomain: "ekadashi-app1.firebaseapp.com",
    projectId: "ekadashi-app1",
    storageBucket: "ekadashi-app1.firebasestorage.app",
    messagingSenderId: "1020531955441",
    appId: "1:1020531955441:web:e35a17f4582b6f0a783b50",
    measurementId: "G-FCY1ZTVZ74"
  };
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
