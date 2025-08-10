import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDx7YUWQrxstyUdGlmiRcZV4uEEsIcCs9U",
  authDomain: "disasterresponsesystem-22ae2.firebaseapp.com",
  projectId: "disasterresponsesystem-22ae2",
  storageBucket: "disasterresponsesystem-22ae2.firebasestorage.app",
  messagingSenderId: "935872260967",
  appId: "1:935872260967:web:d93eecdc8f8115deb9ddc2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
