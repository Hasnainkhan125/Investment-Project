import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 🔹 Add Firestore
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyBAnE8_poZzRYEGzw22Cr0F2U3vRz65wgM",
  authDomain: "mypject-28125.firebaseapp.com",
  projectId: "mypject-28125",
  storageBucket: "mypject-28125.firebasestorage.app",
  messagingSenderId: "67077113068",
  appId: "1:67077113068:web:0552b6cc677e66801051c9",
  measurementId: "G-DGNMS5CWWZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Auth instance
export const auth = getAuth(app);

// Firestore instance 🔹
export const db = getFirestore(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();