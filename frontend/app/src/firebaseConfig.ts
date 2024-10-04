// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/auth";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfMpqDUoI_LTzcn64lr3J4fwx_0wEwmRM",
  authDomain: "myjournalapp-d25c7.firebaseapp.com",
  projectId: "myjournalapp-d25c7",
  storageBucket: "myjournalapp-d25c7.appspot.com",
  messagingSenderId: "87249133450",
  appId: "1:87249133450:web:9d0ca5eab0041a880db273",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { app, auth };