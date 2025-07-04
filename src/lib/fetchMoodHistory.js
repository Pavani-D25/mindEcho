// import { db } from "@/lib/firebase";
// import { collection, getDocs, orderBy, query } from "firebase/firestore";

// export const fetchMoodHistory = async (uid) => {
//   const q = query(
//     collection(db, "users", uid, "moods"),
//     orderBy("timestamp", "asc")
//   );

//   const snapshot = await getDocs(q);
//   return snapshot.docs.map(doc => ({
//     ...doc.data(),
//     date: doc.data().timestamp?.toDate().toLocaleDateString(),
//   }));
// };

import { rtdb } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { parseISO } from "date-fns";

export const fetchMoodHistory = async (email) => {
  try {
    // Use email to construct the path (since that's how it's stored in RTDB)
    const sanitizedEmail = email.replace(/\./g, '_').replace('@', '_');
    const moodRef = ref(rtdb, `moods/${sanitizedEmail}`);
    
    const snapshot = await get(moodRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    
    // Convert the data to an array and sort by date
    const moodHistory = Object.entries(data).map(([key, entry]) => ({
      id: key,
      ...entry,
      date: entry.date ? parseISO(entry.date).toLocaleDateString() : new Date().toLocaleDateString(),
      timestamp: entry.date ? parseISO(entry.date) : new Date()
    }));

    // Sort by timestamp (ascending - oldest first)
    moodHistory.sort((a, b) => a.timestamp - b.timestamp);
    
    return moodHistory;
  } catch (error) {
    console.error("Error fetching mood history:", error);
    return [];
  }
};