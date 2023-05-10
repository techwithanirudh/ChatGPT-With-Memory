import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrvSoRvOImIW1jdQeuf_cUFrjnM0O7icc",
  authDomain: "anichatgpt.firebaseapp.com",
  projectId: "anichatgpt",
  storageBucket: "anichatgpt.appspot.com",
  messagingSenderId: "58926213579",
  appId: "1:58926213579:web:fa150a3d3c233825ceae4e",
  measurementId: "G-BPRVV5YLZD",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };