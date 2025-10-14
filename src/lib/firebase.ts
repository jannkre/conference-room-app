import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Replace these values with your actual Firebase project credentials
const firebaseConfig = {
    apiKey: "AIzaSyCs6-EHAGJTsMVqnLpCg5UhIj-JUyO52Y8",
    authDomain: "meeting-room-workshop.firebaseapp.com",
    projectId: "meeting-room-workshop",
    storageBucket: "meeting-room-workshop.firebasestorage.app",
    messagingSenderId: "772169810073",
    appId: "1:772169810073:web:4e707405d72c465bc1f808"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

