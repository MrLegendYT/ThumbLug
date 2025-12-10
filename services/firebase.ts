import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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

export const fetchGeminiApiKey = async (): Promise<string | null> => {
  try {
    // Attempt to fetch the API Key from Firestore
    // Collection: secrets, Document: gemini, Field: apiKey
    const docRef = doc(db, "secrets", "gemini");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().apiKey as string;
    } else {
      console.warn("No API key found in Firestore at secrets/gemini");
      return null;
    }
  } catch (error) {
    console.error("Error fetching API key from Firebase:", error);
    return null;
  }
};
