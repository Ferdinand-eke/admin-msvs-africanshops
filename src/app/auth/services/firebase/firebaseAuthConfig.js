// import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
	databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,

	/***Dev Oriented Variables */
	// apiKey: 'AIzaSyAr8p5srvGfuBIqqtsUhFQwgFjtSdSuvzg',
	// authDomain: 'africanshopsecommerce.firebaseapp.com',
	// projectId: 'africanshopsecommerce',
	// storageBucket: 'africanshopsecommerce.appspot.com',
	// messagingSenderId: '248778875159',
	// appId: '1:248778875159:web:fca2c9daf5f2e7e7679752',
	// measurementId: 'G-WJH9CH067R'

// 	# VITE_FIREBASE_API_KEY=your_production_api_key
// # VITE_FIREBASE_AUTH_DOMAIN=your-production-app.firebaseapp.com
// # VITE_FIREBASE_DATABASE_URL=https://your-production-app.firebaseio.com
// # VITE_FIREBASE_PROJECT_ID=your-production-app
// # VITE_FIREBASE_STORAGE_BUCKET=your-production-app.appspot.com
// # VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_PRODUCTION_MESSAGING_SENDER_ID
// # VITE_FIREBASE_APP_ID=YOUR_PRODUCTION_APP_ID
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
