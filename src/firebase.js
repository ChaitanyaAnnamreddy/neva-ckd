import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Use dummy config if environment variables are not set (for development without Firebase)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "test-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "test-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "test-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "test-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "test-app-id",
};

let app, auth, provider, db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  auth.useDeviceLanguage();

  provider = new GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");
  provider.setCustomParameters({ prompt: "select_account" });

  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization warning (this is OK for development without Firebase):", error.message);
  // Export null values - the app will handle missing Firebase gracefully
  auth = null;
  provider = null;
  db = null;
}

export { auth, provider, db };
