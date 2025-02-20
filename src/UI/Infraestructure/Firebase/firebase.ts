// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBnaq8MUN-1GsyaQBdCxRHAqNYePVu19pA",
    authDomain: "scriblio-kdanova.firebaseapp.com",
    projectId: "scriblio-kdanova",
    storageBucket: "scriblio-kdanova.firebasestorage.app",
    messagingSenderId: "394495850557",
    appId: "1:394495850557:web:967e98b07156d6a5315254"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };