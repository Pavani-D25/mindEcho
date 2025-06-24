import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export const fetchMoodHistory = async (uid) => {
  const q = query(
    collection(db, "users", uid, "moods"),
    orderBy("timestamp", "asc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    date: doc.data().timestamp?.toDate().toLocaleDateString(),
  }));
};
