import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBSPFOBfkNxjt07Z6s_jBCtTJAhFml7ZW4",
  authDomain: "taksh-finsync.firebaseapp.com",
  projectId: "taksh-finsync",
  storageBucket: "taksh-finsync.firebasestorage.app",
  messagingSenderId: "13171864106",
  appId: "1:13171864106:web:06f7a88a480128b9c58953"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
