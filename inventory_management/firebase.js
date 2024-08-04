// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWZ-8DpKD97_Kc9zW-xLyHJv-XQjdGZy0",
  authDomain: "inventory-management-2dfe1.firebaseapp.com",
  projectId: "inventory-management-2dfe1",
  storageBucket: "inventory-management-2dfe1.appspot.com",
  messagingSenderId: "873495228028",
  appId: "1:873495228028:web:483164f09a644d3256e3f9",
  measurementId: "G-BKRGMJ89V6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}