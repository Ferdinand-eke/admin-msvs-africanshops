// import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';


const firebaseConfig = {
	databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,

	// VITE_FIREBASE_MEASUREMENT_ID=G-WJH9CH067R
	/***Dev Oriented Variables  
	 * VITE_FIREBASE_API_KEY
	*/
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};


export default firebaseConfig;
