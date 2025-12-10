import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBF26X1iWV7QuV40cFlC8Nm6md2yU2ym9M",
  authDomain: "studio-8134566124-7145f.firebaseapp.com",
  projectId: "studio-8134566124-7145f",
  storageBucket: "studio-8134566124-7145f.firebasestorage.app",
  messagingSenderId: "915705526733",
  appId: "1:915705526733:web:ce22ea1fc5fccbfbefec84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// The key provided to be stored in the backend
const BACKUP_KEY = "AIzaSyCsrvm1O35r3luHXt89eZCMfK2usGSYRkQ";

export const fetchGeminiApiKey = async (): Promise<string | null> => {
  try {
    const docRef = doc(db, "secrets", "gemini");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Key exists in backend, return it
      const data = docSnap.data();
      return data.apiKey as string;
    } else {
      // Key is missing in backend, initialize it now
      console.log("Initializing API Key in Firestore...");
      try {
        await setDoc(docRef, { apiKey: BACKUP_KEY });
        return BACKUP_KEY;
      } catch (writeError) {
        console.error("Failed to write API key to Firestore:", writeError);
        // Fallback to returning it directly if write fails (e.g. permissions issue)
        return BACKUP_KEY;
      }
    }
  } catch (error) {
    console.error("Error interacting with Firebase:", error);
    return null;
  }
};