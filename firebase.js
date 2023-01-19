import {initializeApp} from 'firebase/app';

import {getAuth} from 'firebase/auth';

import {getFirestore, initializeFirestore} from 'firebase/firestore';
import {API_KEY} from '@env';
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: API_KEY,

  authDomain: 'mastersensedata.firebaseapp.com',

  projectId: 'mastersensedata',

  storageBucket: 'mastersensedata.appspot.com',

  messagingSenderId: '706104493777',

  appId: '1:706104493777:web:a0920b94e19cfb1298e7f0',

  measurementId: 'G-DQ2X21B2DT',
  databaseURL: 'https://mastersensedata.firebaseio.com',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('initialized: ', app.name);
export const auth = getAuth();

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
