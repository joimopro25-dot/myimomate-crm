// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfXtzUsDvYdll_3o06XOUNWslt6PJTkQ8",
  authDomain: "myimomate.firebaseapp.com",
  projectId: "myimomate",
  storageBucket: "myimomate.firebasestorage.app",
  messagingSenderId: "1073765970374",
  appId: "1:1073765970374:web:3ef525ddd9fd93bddf82c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Export the app instance if needed elsewhere
export default app;