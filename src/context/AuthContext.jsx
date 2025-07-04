// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import { auth, db } from "@/lib/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [currentUserData, setCurrentUserData] = useState(null);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (user) => {
//       setCurrentUser(user);
//       if (user) {
//         const docRef = doc(db, "users", user.uid);
//         const snap = await getDoc(docRef);
//         setCurrentUserData(snap.exists() ? snap.data() : null);
//       } else {
//         setCurrentUserData(null);
//       }
//     });

//     return () => unsub();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ currentUser, currentUserData }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);





"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        setCurrentUserData(snap.exists() ? snap.data() : null);
      } else {
        setCurrentUserData(null);
      }
    });

    return () => unsub();
  }, []);

  const logout = () => signOut(auth); // ✅ logout function

  return (
    <AuthContext.Provider value={{ currentUser, currentUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
