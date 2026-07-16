
import { initializeApp } from "firebase/app";
import{getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewpilot-3c625.firebaseapp.com",
  projectId: "interviewpilot-3c625",
  storageBucket: "interviewpilot-3c625.firebasestorage.app",
  messagingSenderId: "380747823425",
  appId: "1:380747823425:web:c408982734dec705fe49c0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export{auth, provider}