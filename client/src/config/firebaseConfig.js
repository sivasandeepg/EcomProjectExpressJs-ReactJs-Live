// src/firebaseConfig.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyARbbKVRG1nMsiJ7CYq6iv4kQw0mcQ14dE",
    authDomain: "ramyaecomproject.firebaseapp.com",
    projectId: "ramyaecomproject",
    storageBucket: "ramyaecomproject.appspot.com",
    messagingSenderId: "510517871976",
    appId: "1:510517871976:web:f9b59261ba40d9816c42dd",
    measurementId: "G-8T6VRYRQ2P"   
};

const app = initializeApp(firebaseConfig);
export default app;
