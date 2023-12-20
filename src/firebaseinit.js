// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHREt9ewO5q_IPQW68ceqxEhS-kSiQhWY",
  authDomain: "albums-70686.firebaseapp.com",
  projectId: "albums-70686",
  storageBucket: "albums-70686.appspot.com",
  messagingSenderId: "388140788112",
  appId: "1:388140788112:web:2833c467fb485f37956b15"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);