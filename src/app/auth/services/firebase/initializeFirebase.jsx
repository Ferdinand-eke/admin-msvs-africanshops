import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import firebaseConfig from './firebaseAuthConfig';
import { getAnalytics } from 'firebase/analytics';
/**
 * Initialize Firebase
 */
export const firebaseApp = firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseConfig);
/**
 * Firebase App initialization check
 */
let initialized = false;
try {
	firebase?.auth();
	initialized = true;
} catch (e) {
	console.error(e);
}
export const firebaseInitialized = initialized;
