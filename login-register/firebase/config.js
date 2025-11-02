import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAsKeIVCy75LoJop2qgSSvJmJod7bfDoLk",
  authDomain: "pruebas-e184c.firebaseapp.com",
  projectId: "pruebas-e184c",
  storageBucket: "pruebas-e184c.appspot.com",
  messagingSenderId: "827733259169",
  appId: "1:827733259169:web:1a4ef92e67c4bef2d7d1e0",
  measurementId: "G-VDZ591QMJF",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
export default firebaseConfig;
