// // import { initializeApp } from "firebase/app";
// // import { getAuth, GoogleAuthProvider } from "firebase/auth";
// // import { getFirestore } from "firebase/firestore";
// // import { getDatabase } from "firebase/database";

// // const firebaseConfig = {
// //   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
// //   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
// //   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
// //   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
// //   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
// //   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// //   databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
// // };

// // const app = initializeApp(firebaseConfig);

// // export const auth = getAuth(app);
// // export const provider = new GoogleAuthProvider();
// // export const db = getFirestore(app);
// // export const rtdb = getDatabase(app);



// // lib/firebase.js
// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
// };

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// export const auth = getAuth(app);
// export const provider = new GoogleAuthProvider();
// export const db = getFirestore(app);
// export const rtdb = getDatabase(app);



// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

// Helper functions
export const saveConversation = async (userId, conversationData) => {
  const conversationsRef = collection(db, "users", userId, "conversations");
  const newConversationRef = doc(conversationsRef);
  await setDoc(newConversationRef, {
    ...conversationData,
    createdAt: new Date().toISOString()
  });
  return newConversationRef.id;
};

export const getUserProfile = async (userId) => {
  const userRef = doc(db, "users", userId);
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateUserPreferences = async (userId, preferences) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    preferences,
    updatedAt: new Date().toISOString()
  });
};